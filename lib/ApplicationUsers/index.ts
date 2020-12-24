import { Stack, Construct } from "@aws-cdk/core";
import { CfnUserPoolClient } from "@aws-cdk/aws-cognito";
import { Function, IFunction } from "@aws-cdk/aws-lambda";
import { Bucket } from "@aws-cdk/aws-s3";
import { CfnUserPool } from "@aws-cdk/aws-cognito";
import { Table } from "@aws-cdk/aws-dynamodb";
import UserPool from "./UserPool";
import { CustomStackProps } from "../../bin/nice-to-know-infra";
import { ServicePrincipal } from "@aws-cdk/aws-iam";
import { ConfirmUserSignupTriggerFunction } from "./triggers"

interface ApplicationUsersProps extends CustomStackProps {
    usersTable: Table;
}

export class ApplicationUsersStack extends Stack {
  public userPool: CfnUserPool;
  public userPoolClient: CfnUserPoolClient;
  public confirmUserSignupTrigger: Function;

  constructor(scope: Construct, id: string, props: ApplicationUsersProps) {
    super(scope, id, props);
    const env = props.environment;

    this.confirmUserSignupTrigger = new ConfirmUserSignupTriggerFunction(this, `${env}-app-users-confirm-user-signup-trigger-lambda`, props.usersTable)

    this.userPool = new UserPool(this, `${env}-app-users`, {
        lambdaConfig: {
            postConfirmation: this.confirmUserSignupTrigger.functionArn
    }
});

    this.userPoolClient = new CfnUserPoolClient(
      this,
      `${env}-app-users-client`,
      {
        userPoolId: this.userPool.ref,
        clientName: `${env}_app_users_client`,
        explicitAuthFlows: ["ALLOW_USER_SRP_AUTH","ALLOW_USER_PASSWORD_AUTH","ALLOW_REFRESH_TOKEN_AUTH"],
        preventUserExistenceErrors: "ENABLED"
      }
    );

    // add execute permissions to lambda from the user pool
    this.addLambdaPermission(this.confirmUserSignupTrigger, "PostConfirmation_ConfirmSignUp");
  }
   /**
     * Helper function to add cognito service principle to a given lambda
     * To be re-used across all triggers
     * @param fn 
     * @param name 
     */
    private addLambdaPermission(fn: IFunction, name: string): void {
        const normalize = name.charAt(0).toUpperCase() + name.slice(1);
        fn.addPermission(`${normalize}Cognito`, {
            principal: new ServicePrincipal("cognito-idp.amazonaws.com"),
            sourceArn: this.userPool.attrArn
        });
    }
}
