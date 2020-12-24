import { Stack, Construct } from "@aws-cdk/core";
import {
  CfnResolver,
  CfnGraphQLApi,
  CfnDataSource,
} from "@aws-cdk/aws-appsync";
import * as fs from "fs";
import { join } from "path";
import { ResolversProps } from "../../";

interface EditMyProfileProps extends ResolversProps {
    usersTableDS: CfnDataSource;
}
export class EditMyProfile extends CfnResolver {
  constructor(scope: Construct, id: string, props: EditMyProfileProps) {
    super(scope, id, {
      apiId: props.api.attrApiId,
      typeName: "Mutation",
      fieldName: "editMyProfile",
      dataSourceName: props.usersTableDS.name,
      requestMappingTemplate: fs
        .readFileSync(
          join(
            __dirname,
            "../../mapping-templates/Mutation.editMyProfile.request.vtl"
          )
        )
        .toString(),
      responseMappingTemplate: fs
        .readFileSync(
          join(
            __dirname,
            "../../mapping-templates/Mutation.editMyProfile.response.vtl"
          )
        )
        .toString(),
    });
  }
}
