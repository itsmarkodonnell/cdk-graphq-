import { Construct } from "@aws-cdk/core";
import { CfnUserPool, CfnUserPoolProps } from "@aws-cdk/aws-cognito";

export default class UserPool extends CfnUserPool {
    constructor(scope: Construct, id: string, props: CfnUserPoolProps) {
        super(scope, id, {
            ...props,
            userPoolName: `${id}`,
            usernameAttributes: ["email"],
            autoVerifiedAttributes: ["email"],
            policies: {
                passwordPolicy: {
                    minimumLength: 8,
                    requireLowercase: false,
                    requireNumbers: false,
                    requireSymbols: false,
                    requireUppercase: false
                }
            },
            schema: [
                {
                    name: "name",
                    mutable: true,
                    required: false
                }
            ]
        });
    }
}
