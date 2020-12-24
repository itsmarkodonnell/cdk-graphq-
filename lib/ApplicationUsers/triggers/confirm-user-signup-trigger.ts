import path = require("path");
import { Construct } from "@aws-cdk/core";
import { Function, Code, Runtime } from "@aws-cdk/aws-lambda";
import { Table } from '@aws-cdk/aws-dynamodb';
import { PolicyStatement } from "@aws-cdk/aws-iam"

export class ConfirmUserSignupTriggerFunction extends Function {
  constructor(
    scope: Construct,
    id: string,
    userTable: Table
  ) {
    super(scope, id, {
      functionName: `${id}`,
      handler: "index.handler",
      code: Code.fromAsset(path.join(__dirname, "confirm-user-signup/lambda")),
      runtime: Runtime.NODEJS_12_X,
      environment: {
        USERS_TABLE: userTable.tableName,
      },
      initialPolicy: [
        new PolicyStatement({
          actions: ["dynamodb:PutItem"],
          resources: [`${userTable.tableArn}`],
        }),
      ],
    });
  }
}
