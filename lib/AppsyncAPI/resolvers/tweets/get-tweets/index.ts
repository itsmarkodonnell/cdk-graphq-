import { Construct } from "@aws-cdk/core";
import { CfnResolver, CfnDataSource } from "@aws-cdk/aws-appsync";
import * as fs from "fs";
import { join } from "path";
import { ResolversProps } from "../../";

interface GetTweetsProps extends ResolversProps {
  tweetsTableDS: CfnDataSource;
}
export class GetTweets extends CfnResolver {
  constructor(scope: Construct, id: string, props: GetTweetsProps) {
    super(scope, id, {
      apiId: props.api.attrApiId,
      typeName: "Query",
      fieldName: "getTweets",
      dataSourceName: props.tweetsTableDS.name,
      requestMappingTemplate: fs
        .readFileSync(
          join(__dirname, "../../mapping-templates/Query.getTweets.request.vtl")
        )
        .toString(),
      responseMappingTemplate: fs
        .readFileSync(
          join(
            __dirname,
            "../../mapping-templates/Query.getTweets.response.vtl"
          )
        )
        .toString(),
    });
  }
}
