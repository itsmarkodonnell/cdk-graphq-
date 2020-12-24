import { Construct } from "@aws-cdk/core";
import { Code, Function, Runtime } from "@aws-cdk/aws-lambda";
import { PolicyStatement } from "@aws-cdk/aws-iam";
import * as path from "path";
import { AppsyncDataSourcesProps } from "../AppsyncDataSources";

/**
 * API endpoint functions to manage batchs
 */
export class ApiFunctions extends Construct {
  public getImageUploadUrl: Function;
  public tweetFunction: Function;
  public likeFunction: Function;

  constructor(scope: Construct, id: string, props: AppsyncDataSourcesProps) {
    super(scope, id);

    const env = props.environment;
    // The code that defines your stack goes here

    this.getImageUploadUrl = new Function(this, `${env}-get-image-upload-url`, {
      code: Code.fromAsset(path.join(__dirname, "get-image-upload-url")),
      functionName: `${env}-api-gql--get-image-upload-url`,
      handler: "index.handler",
      runtime: Runtime.NODEJS_12_X,
      environment: {
        BUCKET_NAME: `${props.userBucket.bucketName}`,
      },
      initialPolicy: [
        new PolicyStatement({
          actions: ["s3:PutObject", "s3:PutObjectAcl"],
          resources: [`${props.userBucket.bucketArn}/*`],
        }),
      ],
    });

    this.tweetFunction = new Function(this, `${env}-tweet-function`, {
      code: Code.fromAsset(path.join(__dirname, "tweet")),
      functionName: `${env}-api-gql--tweet-function`,
      handler: "index.handler",
      runtime: Runtime.NODEJS_12_X,
      environment: {
        USERS_TABLE: props.usersTable.tableName,
        TWEETS_TABLE: props.tweetsTable.tableName,
        TIMELINES_TABLE: props.timelinesTable.tableName,
      },
      initialPolicy: [
        new PolicyStatement({
          actions: ["dynamodb:PutItem"],
          resources: [`${props.tweetsTable.tableArn}`],
        }),
        new PolicyStatement({
          actions: ["dynamodb:PutItem"],
          resources: [`${props.timelinesTable.tableArn}`],
        }),
        new PolicyStatement({
          actions: ["dynamodb:UpdateItem"],
          resources: [`${props.usersTable.tableArn}`],
        }),
      ],
    });

    this.likeFunction = new Function(this, `${env}-like-function`, {
      code: Code.fromAsset(path.join(__dirname, "like")),
      functionName: `${env}-api-gql--like-function`,
      handler: "index.handler",
      runtime: Runtime.NODEJS_12_X,
      environment: {
        USERS_TABLE: props.usersTable.tableName,
        TWEETS_TABLE: props.tweetsTable.tableName,
        LIKES_TABLE: props.likesTable.tableName
      },
      initialPolicy: [
        new PolicyStatement({
          actions: ["dynamodb:PutItem"],
          resources: [`${props.likesTable.tableArn}`],
        }),
        new PolicyStatement({
          actions: ["dynamodb:UpdateItem"],
          resources: [`${props.tweetsTable.tableArn}`],
        }),
        new PolicyStatement({
          actions: ["dynamodb:UpdateItem"],
          resources: [`${props.usersTable.tableArn}`],
        }),
      ],
    });
  }
}
