import { Construct } from "@aws-cdk/core";
import { CfnResolver, CfnDataSource } from "@aws-cdk/aws-appsync";
import * as fs from "fs";
import { join } from "path";
import { ResolversProps } from "../..";

interface HydrateTimelineTweetsNestedResolverProps extends ResolversProps {
  tweetsTableDS: CfnDataSource;
}
export class HydrateTimelineTweetsNestedResolver extends CfnResolver {
  constructor(scope: Construct, id: string, props: HydrateTimelineTweetsNestedResolverProps) {
    super(scope, id, {
      apiId: props.api.attrApiId,
      typeName: "TimelinesPage",
      fieldName: "tweets",
      dataSourceName: props.tweetsTableDS.name,
      requestMappingTemplate: fs
        .readFileSync(
          join(__dirname, "../../mapping-templates/TimelinePage.tweets.request.vtl")
        )
        .toString().replace("${TweetsTable}", props.tweetsTable.tableName),
      responseMappingTemplate: fs
        .readFileSync(
          join(
            __dirname,
            "../../mapping-templates/TimelinePage.tweets.response.vtl"
          )
        )
        .toString().replace("${TweetsTable}", props.tweetsTable.tableName),
    });
  }
}
