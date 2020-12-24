import { Construct, Stack } from '@aws-cdk/core';
import { CfnDataSource, CfnGraphQLApi } from '@aws-cdk/aws-appsync';
import { Role, ServicePrincipal, PolicyStatement, Effect, ManagedPolicy } from '@aws-cdk/aws-iam';
import { ApiFunctions } from './api-functions';
import { AppsyncAPIProps } from './';

export interface AppsyncDataSourcesProps extends AppsyncAPIProps {
    api: CfnGraphQLApi;
}
export class AppsyncDataSources extends Construct {
    public usersTableDS: CfnDataSource;
    public tweetsTableDS: CfnDataSource;
    public likeTableDS: CfnDataSource;
    public timelinesTableDS: CfnDataSource;
    public getImageUploadUrlLambdaDS: CfnDataSource;
    public tweetLambdaDS: CfnDataSource;

    constructor(scope: Construct, id: string, props: AppsyncDataSourcesProps) {
        super(scope, id);
        const env = props.environment;

        const lambdaFunctions = new ApiFunctions(this, `${env}-graphql-lambda-functions`, { ...props });

        const appsyncServiceRole = new Role(this, `${env}-users-table-dynamo-role`, {
            assumedBy: new ServicePrincipal('appsync.amazonaws.com'),
        });

        appsyncServiceRole.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName('AmazonDynamoDBFullAccess'));

        // lambda function ARN's
        const getImageUploadUrlLambdaARN = lambdaFunctions.getImageUploadUrl.functionArn;
        const tweetLambaARN = lambdaFunctions.tweetFunction.functionArn;

        appsyncServiceRole.addToPolicy(
            new PolicyStatement({
                actions: ['lambda:InvokeFunction'],
                resources: [getImageUploadUrlLambdaARN, tweetLambaARN],
                effect: Effect.ALLOW,
            }),
        );

        this.usersTableDS = new CfnDataSource(this, `${env}-users-table-data-source`, {
            apiId: props.api.attrApiId,
            name: 'UsersTableDynamoDataSource',
            type: 'AMAZON_DYNAMODB',
            dynamoDbConfig: {
                tableName: props.usersTable.tableName,
                awsRegion: Stack.of(this).region,
            },
            serviceRoleArn: appsyncServiceRole.roleArn,
        });

        this.tweetsTableDS = new CfnDataSource(this, `${env}-tweets-table-data-source`, {
            apiId: props.api.attrApiId,
            name: 'TweetsTableDynamoDataSource',
            type: 'AMAZON_DYNAMODB',
            dynamoDbConfig: {
                tableName: props.tweetsTable.tableName,
                awsRegion: Stack.of(this).region,
            },
            serviceRoleArn: appsyncServiceRole.roleArn,
        });

        this.timelinesTableDS = new CfnDataSource(this, `${env}-timelines-table-data-source`, {
            apiId: props.api.attrApiId,
            name: 'TimelinesTableDynamoDataSource',
            type: 'AMAZON_DYNAMODB',
            dynamoDbConfig: {
                tableName: props.timelinesTable.tableName,
                awsRegion: Stack.of(this).region,
            },
            serviceRoleArn: appsyncServiceRole.roleArn,
        });

        this.likeTableDS = new CfnDataSource(this, `${env}-like-table-data-source`, {
            apiId: props.api.attrApiId,
            name: 'LikesTableDataSource',
            type: 'AMAZON_DYNAMODB',
            dynamoDbConfig: {
                tableName: props.likesTable.tableName,
                awsRegion: Stack.of(this).region,
            },
            serviceRoleArn: appsyncServiceRole.roleArn,
        });

        this.getImageUploadUrlLambdaDS = new CfnDataSource(this, `${env}-get-image-upload-url-data-source`, {
            apiId: props.api.attrApiId,
            name: 'GetImageUploadUrlDataSource',
            type: 'AWS_LAMBDA',
            lambdaConfig: {
                lambdaFunctionArn: lambdaFunctions.getImageUploadUrl.functionArn,
            },
            serviceRoleArn: appsyncServiceRole.roleArn,
        });

        this.tweetLambdaDS = new CfnDataSource(this, `${env}-tweet-lambda-data-source`, {
            apiId: props.api.attrApiId,
            name: 'TweetLambdalDataSource',
            type: 'AWS_LAMBDA',
            lambdaConfig: {
                lambdaFunctionArn: lambdaFunctions.tweetFunction.functionArn,
            },
            serviceRoleArn: appsyncServiceRole.roleArn,
        });
    }
}
