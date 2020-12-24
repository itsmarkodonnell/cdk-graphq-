import { Construct } from "@aws-cdk/core";
import {
  CfnResolver,
  CfnDataSource,
} from "@aws-cdk/aws-appsync";
import { ResolversProps } from "../..";

interface TweetProps extends ResolversProps {
    tweetLambdaDS: CfnDataSource;
}
export class Tweet extends CfnResolver {
  constructor(scope: Construct, id: string, props: TweetProps) {
    super(scope, id, {
      apiId: props.api.attrApiId,
      typeName: "Mutation",
      fieldName: "tweet",
      dataSourceName: props.tweetLambdaDS.name
    });
  }
}
