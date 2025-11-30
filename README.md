# Playwright and Chromium AWS Lambda Layer

An AWS Lambda Layer containing [Playwright](https://www.npmjs.com/package/playwright) and Chromium, optimized for AWS Lambda with Node.js 22.x runtime, and deployed using the Serverless Framework v4.

## Requirements

- Node.js 20.x or later
- NPM or Yarn
- AWS CLI installed and configured with credentials
- A centralised Serverless Framework deployment S3 bucket using the format <aws-account-id>--serverless-deploys

## Installation

Install NPM dependencies:

```bash
npm install
```

This will install the Serverless Framework used for deploying the layer to AWS.

## Building the Layer

Build the layer with all required dependencies:

```bash
npm run build
```

This will install the Playwright (playwright-core) library and an file size optimised version of Chromium ([@sparticuz/chromium](https://www.npmjs.com/package/@sparticuz/chromium)) which fits within the AWS Lambda layer size limit of 250MB.

## Deployment

Deploy the layer to AWS:

```bash
npx serverless deploy
```

Once deployed, the console will output a layer ARN like below:

```bash
layers:
  playwright: arn:aws:lambda:us-east-1:272354801446:layer:playwright-chromium-layer-dev:1
```

### Deploying to production and staging environments

Deploy infrastructure with a specific stage name appended to the layer name. In the example below the layer will have **-production** appended to the name.

```bash
npx serverless deploy --stage production
```

## Usage

### Adding the layer to your Lambda Function (using Serverless Framework)

Reference the layer in your Lambda functions in the `serverless.yml` file, like this:

```yaml
functions:
  myFunction:
    handler: handler.handler
    layers:
      - arn:aws:lambda:${aws:region}:${aws:accountId}:layer:playwright-chromium-layer-${self:provider.stage}:1
    runtime: nodejs22.x
```

### Example Lambda Function

Once the Layer is attached to your Lambda, Playwright and Chromium can be imported (required) and used in your Lambda function. You do not need to install them via NPM or Yarn as part of you application and they can be excluded from any deployments.

Here's how to use Playwright with Chromium in your Lambda function:

```javascript
const playwright = require('playwright-core');
const chromium = require('@sparticuz/chromium');

exports.handler = async (event) => {
  let browser = null;
  
  try {
    browser = await playwright.chromium.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });

    const page = await browser.newPage();
    await page.goto(event.url || 'https://example.com');
    
    const screenshot = await page.screenshot({ type: 'png' });
    
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'image/png' },
      body: screenshot.toString('base64'),
      isBase64Encoded: true
    };
    
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  } finally {
    if (browser) await browser.close();
  }
};
```

The example above will take a screenshot of the URL provided in the event object and return it as a base64 encoded image.

Note: The layer is currently only compatible with Node.js 20.x and 22.x due to dependency issues with Node.js 24.x. Make sure your Lambda is running on the Node.js 20.x or 22.x runtime.
