import { Construct } from "@aws-cdk/core";
import { CfnResolver, CfnDataSource } from "@aws-cdk/aws-appsync";
import * as fs from "fs";
import { join } from "path";
import { ResolversProps } from "../../";

interface GetTweetProfileProps extends ResolversProps {
    usersTableDS: CfnDataSource;
}
export class GetTweetProfile extends CfnResolver {
  constructor(scope: Construct, id: string, props: GetTweetProfileProps) {
    super(scope, id, {
        apiId: props.api.attrApiId,
        typeName: "Tweet",
        fieldName: "profile",
        dataSourceName: props.usersTableDS.name,
        requestMappingTemplate: fs
          .readFileSync(
            join(__dirname, "../../mapping-templates/Tweet.profile.request.vtl")
          )
          .toString(),
        responseMappingTemplate: fs
        .readFileSync(
          join(__dirname, "../../mapping-templates/Tweet.profile.response.vtl")
        )
        .toString(),
    });
  }
}
