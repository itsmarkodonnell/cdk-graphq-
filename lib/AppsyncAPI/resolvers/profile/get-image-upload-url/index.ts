import { Construct } from "@aws-cdk/core";
import { CfnResolver, CfnDataSource } from "@aws-cdk/aws-appsync";
import { ResolversProps } from "../..";

interface GetImageUploadUrlProps extends ResolversProps {
  getImageUploadUrlLambdaDS: CfnDataSource;
}
export class GetImageUploadUrl extends CfnResolver {
  constructor(scope: Construct, id: string, props: GetImageUploadUrlProps) {
    super(scope, id, {
      apiId: props.api.attrApiId,
      typeName: "Query",
      fieldName: "getImageUploadUrl",
      dataSourceName: props.getImageUploadUrlLambdaDS.name,
    });
  }
}
