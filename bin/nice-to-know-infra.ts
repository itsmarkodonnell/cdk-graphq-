#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "@aws-cdk/core";
import { ApplicationUsersStack } from "../lib/ApplicationUsers";
import { AppsyncAPIStack } from "../lib/AppsyncAPI";
import { DynamoTablesStack } from "../lib/DynamoTables";
import { SharedS3BucketsStack } from "../lib/SharedS3Buckets";

const app = new cdk.App();
export interface CustomStackProps extends cdk.StackProps {
  environment: string;
}
const envEU = { account: "099173695511", region: "eu-west-1" };

const props: CustomStackProps = {
  env: envEU,
  environment: "prod",
};

const sharedBuckets = new SharedS3BucketsStack(app, "ProdS3Buckets", props)
const dynamoTables = new DynamoTablesStack(app, "ProdDynamoTables", props);
const appUsers = new ApplicationUsersStack(app, "ProdApplicationUsersStack", {
  ...props,
  usersTable: dynamoTables.usersTable,
});
const appSyncAPI = new AppsyncAPIStack(app, "ProdAppsyncApiStack", {
  ...props,
  applicationUsers: appUsers.userPool,
  userBucket: sharedBuckets.userBucket,
  usersTable: dynamoTables.usersTable,
  tweetsTable: dynamoTables.tweetsTable,
  timelinesTable: dynamoTables.timelinesTable,
  likesTable: dynamoTables.likesTable
});
