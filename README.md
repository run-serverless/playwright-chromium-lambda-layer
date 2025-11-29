# Playwright AWS Lambda Layer

This project creates an AWS Lambda Layer containing Playwright for use in AWS Lambda functions.

## Prerequisites

- Node.js 20.x or later
- npm or yarn
- AWS CLI configured with appropriate credentials
- Serverless Framework installed globally (`npm install -g serverless`)

## Installation

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```

## Building the Layer

To build the Playwright layer with all required dependencies:

```bash
npm run build
```

This command will:
1. Clean up any existing layer directory
2. Create a new layer structure
3. Install production dependencies
4. Install Playwright's browser binaries

## Configuration

1. Update the `serverless.yml` file with your preferred AWS region and deployment bucket name.
2. The layer is configured to use Node.js 20.x or later. The layer is compatible with Node.js 20.x, 22.x, and 24.x runtimes.

## Deployment

To deploy the Playwright layer to AWS:

```bash
# Install dependencies and build the layer
npm run deploy -- --stage dev  # or prod, staging, etc.

# Deploy to a specific region (optional)
npm run deploy -- --stage dev --region us-east-1
```

> Note: The deploy script will automatically build the layer before deploying if it doesn't exist.

## Usage in Lambda Functions

After deployment, you can reference this layer in your Lambda functions. The layer will be available in the AWS Lambda console under "Layers".

Example Lambda function configuration:

```yaml
functions:
  myFunction:
    handler: handler.handler
    layers:
      - arn:aws:lambda:REGION:ACCOUNT_ID:layer:playwright-layer-dev:1
    runtime: nodejs20.x
```

## Important Notes

- The layer includes only the Playwright core and Chromium browser to keep the size manageable.
- The layer size is optimized by excluding unnecessary files and dependencies.
- Browser binaries are installed during the `postinstall` script.
- The layer is configured to be compatible with Node.js 18.x runtime.

## Cleanup

To remove the deployed layer and associated resources:

```bash
serverless remove --stage dev  # or whatever stage you used
```

## License

MIT
