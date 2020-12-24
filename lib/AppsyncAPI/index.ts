import { Stack, Construct } from "@aws-cdk/core";
import {
  CfnApiKey,
  CfnDataSource,
  CfnGraphQLSchema,
  UserPoolDefaultAction,
  CfnGraphQLApi,
  FieldLogLevel,
  AuthorizationType,
} from "@aws-cdk/aws-appsync";
import { ManagedPolicy } from "@aws-cdk/aws-iam";
import * as fs from "fs";
import { CfnUserPool } from "@aws-cdk/aws-cognito";
import { Table } from "@aws-cdk/aws-dynamodb";
import { Role, ServicePrincipal, PolicyStatement } from "@aws-cdk/aws-iam";
import { IBucket } from "@aws-cdk/aws-s3";
import { join } from "path";
import { Resolvers } from "./resolvers";
import { AppsyncDataSources } from "./AppsyncDataSources";
import { CustomStackProps } from "../../bin/nice-to-know-infra";

export interface AppsyncAPIProps extends CustomStackProps {
  applicationUsers: CfnUserPool;
  usersTable: Table;
  tweetsTable: Table;
  timelinesTable: Table;
  likesTable: Table;
  userBucket: IBucket;
}

export class AppsyncAPIStack extends Stack {
  public api: CfnGraphQLApi;
  public apiKey: CfnApiKey;
  public schema: CfnGraphQLSchema;

  constructor(scope: Construct, id: string, props: AppsyncAPIProps) {
    super(scope, id, props);
    const env = props.environment;

    const logsServiceRole = new Role(
      this,
      `${env}-appsync-api-logs-service-role`,
      {
        assumedBy: new ServicePrincipal("appsync.amazonaws.com"),
      }
    );

    logsServiceRole.addToPolicy(
      new PolicyStatement({
        actions: [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents",
        ],
        resources: ["*"],
      })
    );
    /**
     * Create a new AppSync GraphQL API
     */
    this.api = new CfnGraphQLApi(this, `${env}-app-sync-api`, {
      name: `${env}-app-sync-api`,
      logConfig: {
        cloudWatchLogsRoleArn: logsServiceRole.roleArn,
        fieldLogLevel: FieldLogLevel.ALL,
      },
      authenticationType: AuthorizationType.USER_POOL,
      userPoolConfig: {
        defaultAction: UserPoolDefaultAction.ALLOW,
        userPoolId: props.applicationUsers.ref,
        awsRegion: "eu-west-1",
      },
    });

    const definition = fs
      .readFileSync(join(__dirname, "schema/schema.api.graphql"))
      .toString();
    this.schema = new CfnGraphQLSchema(this, `${env}-schema`, {
      apiId: this.api.attrApiId,
      definition: definition,
    });

    const resolvers = new Resolvers(this, `${env}-api-resolvers`, {
      ...props,
      api: this.api
    });
  }
}
