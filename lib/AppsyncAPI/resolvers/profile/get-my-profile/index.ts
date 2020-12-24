import { Stack, Construct } from "@aws-cdk/core";
import {
  CfnResolver,
  CfnGraphQLApi,
  CfnDataSource,
} from "@aws-cdk/aws-appsync";
import * as fs from "fs";
import { join } from "path";
import { ResolversProps } from "../..";

interface GetMyProfileProps extends ResolversProps {
  usersTableDS: CfnDataSource;
}
export class GetMyProfile extends CfnResolver {
  constructor(scope: Construct, id: string, props: GetMyProfileProps) {
    super(scope, id, {
      apiId: props.api.attrApiId,
      typeName: "Query",
      fieldName: "getMyProfile",
      dataSourceName: props.usersTableDS.name,
      requestMappingTemplate: fs
        .readFileSync(
          join(__dirname, "../../mapping-templates/Query.getMyProfile.request.vtl")
        )
        .toString(),
      responseMappingTemplate: fs
      .readFileSync(
        join(__dirname, "../../mapping-templates/Query.getMyProfile.response.vtl")
      )
      .toString(),
    });
  }
}
