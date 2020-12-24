import { Construct } from '@aws-cdk/core';
import { CfnResolver, CfnDataSource } from '@aws-cdk/aws-appsync';
import * as fs from 'fs';
import { join } from 'path';
import { ResolversProps } from '../..';

interface UnlikeProps extends ResolversProps {
    likesTableDS: CfnDataSource;
}
export class Unlike extends CfnResolver {
    constructor(scope: Construct, id: string, props: UnlikeProps) {
        super(scope, id, {
            apiId: props.api.attrApiId,
            typeName: 'Mutation',
            fieldName: 'unlike',
            dataSourceName: props.likesTableDS.name,
            requestMappingTemplate: fs
                .readFileSync(join(__dirname, '../../mapping-templates/Mutation.unlike.request.vtl'))
                .toString()
                .replace('${TweetsTable}', props.tweetsTable.tableName)
                .replace('${LikesTable}', props.likesTable.tableName)
                .replace('${UsersTable}', props.usersTable.tableName),
            responseMappingTemplate: fs.readFileSync(join(__dirname, '../../mapping-templates/Mutation.unlike.response.vtl')).toString(),
        });
    }
}