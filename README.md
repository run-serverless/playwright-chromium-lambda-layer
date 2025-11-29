# Playwright AWS Lambda Layer

This project creates an AWS Lambda Layer containing Playwright and its dependencies, optimized for AWS Lambda with Node.js 22.x.

## Features

- 🚀 Optimized for AWS Lambda with Node.js 22.x
- ⚡ Lightweight layer with only necessary dependencies
- 🔄 Uses `@sparticuz/chromium` for Chromium compatibility with AWS Lambda
- 📦 Easy deployment with Serverless Framework

## Prerequisites

- Node.js 20.x or later
- npm or yarn
- AWS CLI configured with appropriate credentials

## Project Structure

```
.
├── layer/              # Generated directory containing the layer content
├── package.json        # Project dependencies and build scripts
└── serverless.yml      # Serverless Framework configuration
```

## Getting Started

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```

## Building the Layer

To build the layer with all required dependencies:

```bash
npm run build
```

This will:
1. Clean any existing layer directory
2. Create a new layer directory
3. Install the necessary dependencies with AWS Lambda compatible binaries
4. Clean up temporary files

## Deploying the Layer

To deploy the layer to AWS:

```bash
npm run deploy
```

Or using the Serverless Framework directly:

```bash
npx serverless deploy
```

## Using the Layer in Your Lambda Function

After deployment, you can reference this layer in your Lambda functions. The layer will be available in the AWS Lambda console under "Layers".

In your Lambda function's `serverless.yml`, reference the layer using its ARN.

Example Lambda function configuration:

```yaml
functions:
  myFunction:
    handler: handler.handler
    layers:
      - arn:aws:lambda:${aws:region}:${aws:accountId}:layer:playwright-layer-${self:provider.stage}:1
    runtime: nodejs22.x
```

## Important Notes

- The layer includes only the Playwright core and Chromium browser to keep the size manageable.

## Cleanup

To remove the deployed layer and associated resources:

```bash
serverless remove --stage dev  # or whatever stage you used
```
