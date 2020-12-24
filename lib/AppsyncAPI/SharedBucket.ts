import { Construct } from "@aws-cdk/core";
import { CfnBucket, HttpMethods } from "@aws-cdk/aws-s3";

export class SharedBucket extends CfnBucket {
  constructor(scope: Construct, id: string) {
    super(scope, id, {
      bucketName: id,
      accelerateConfiguration: {
        accelerationStatus: "Enabled",
      },
      corsConfiguration: {
        corsRules: [
          {
            allowedHeaders: ["*"],
            allowedMethods: [HttpMethods.GET, HttpMethods.PUT],
            allowedOrigins: ["*"],
          },
        ],
      },
    });
  }
}
