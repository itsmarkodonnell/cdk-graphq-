import { Construct } from "@aws-cdk/core";
import {
  CfnResolver,
  CfnDataSource,
} from "@aws-cdk/aws-appsync";
import * as fs from "fs";
import { join } from "path";
import { ResolversProps } from "../..";

interface GetMyTimelineProps extends ResolversProps {
    timelinesTableDS: CfnDataSource;
}
export class GetMyTimeline extends CfnResolver {
  constructor(scope: Construct, id: string, props: GetMyTimelineProps) {
    super(scope, id, {
      apiId: props.api.attrApiId,
      typeName: "Query",
      fieldName: "getMyTimeline",
      dataSourceName: props.timelinesTableDS.name,
      requestMappingTemplate: fs
        .readFileSync(
          join(
            __dirname,
            "../../mapping-templates/Query.getMyTimeline.request.vtl"
          )
        )
        .toString(),
      responseMappingTemplate: fs
        .readFileSync(
          join(
            __dirname,
            "../../mapping-templates/Query.getMyTimeline.response.vtl"
          )
        )
        .toString(),
    });
  }
}
