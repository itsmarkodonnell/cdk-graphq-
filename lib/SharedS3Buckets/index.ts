import { Stack, Construct } from "@aws-cdk/core";
import { CfnBucket, HttpMethods, IBucket, Bucket } from "@aws-cdk/aws-s3";
import { CustomStackProps } from "../../bin/nice-to-know-infra";

interface SharedS3BucketsProps extends CustomStackProps {}

export class SharedS3BucketsStack extends Stack {
  public userBucket: IBucket;

  constructor(scope: Construct, id: string, props: SharedS3BucketsProps) {
    super(scope, id, props);
    const env = props.environment;

    /**
     * Shared images bucket
     */
    const userProfileBucket: CfnBucket = new CfnBucket(this, `${env}-shared-bucket`, {
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

    this.userBucket = Bucket.fromBucketArn(this,`shared-bucket-cast`,userProfileBucket.attrArn)
  }
}