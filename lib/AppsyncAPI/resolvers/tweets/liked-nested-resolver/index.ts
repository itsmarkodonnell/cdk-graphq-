import { Construct } from "@aws-cdk/core";
import { CfnResolver, CfnDataSource } from "@aws-cdk/aws-appsync";
import * as fs from "fs";
import { join } from "path";
import { ResolversProps } from "../../";

interface LikedNestedResolverProps extends ResolversProps {
    likesTableDS: CfnDataSource;
}
export class LikedNestedResolver extends CfnResolver {
  constructor(scope: Construct, id: string, props: LikedNestedResolverProps) {
    super(scope, id, {
        apiId: props.api.attrApiId,
        typeName: "Tweet",
        fieldName: "liked",
        dataSourceName: props.likesTableDS.name,
        requestMappingTemplate: fs
          .readFileSync(
            join(__dirname, "../../mapping-templates/Tweet.liked.request.vtl")
          )
          .toString(),
        responseMappingTemplate: fs
        .readFileSync(
          join(__dirname, "../../mapping-templates/Tweet.liked.response.vtl")
        )
        .toString(),
    });
  }
}
