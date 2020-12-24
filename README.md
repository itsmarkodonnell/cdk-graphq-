# Welcome to your CDK TypeScript project!

This is a blank project for TypeScript development with CDK.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

 * `npm run build`   compile typescript to js
 * `npm run watch`   watch for changes and compile
 * `npm run test`    perform the jest unit tests
 * `cdk deploy`      deploy this stack to your default AWS account/region
 * `cdk diff`        compare deployed stack with current state
 * `cdk synth`       emits the synthesized CloudFormation template


## Cognito Commands 
 * new user     ```aws cognito-idp --region eu-west-1 sign-up --client-id 5d48lq3m4pthbj4a36rfdmakic --username mark@dropdin.com --password password --user-attributes Name=name,Value=Mark```