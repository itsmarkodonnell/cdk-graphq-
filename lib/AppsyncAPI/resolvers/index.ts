import { Construct } from '@aws-cdk/core';
import { CfnResolver, CfnGraphQLApi, CfnDataSource } from '@aws-cdk/aws-appsync';
import { AppsyncAPIProps } from '../';
import { AppsyncDataSources } from '../AppsyncDataSources';
import { EditMyProfile, GetImageUploadUrl, GetMyProfile } from './profile';
import { Tweet, GetMyTimeline, GetTweets, GetTweetProfile, HydrateTimelineTweetsNestedResolver, Like, LikedNestedResolver, Unlike } from './tweets';

export interface ResolversProps extends AppsyncAPIProps {
    api: CfnGraphQLApi;
}

export class Resolvers extends Construct {
    public resolver: CfnResolver;
    constructor(scope: Construct, id: string, props: ResolversProps) {
        super(scope, id);
        const env = props.environment;

        const dataSources = new AppsyncDataSources(this, `${env}-appsync-datasources`, {
            ...props,
            api: props.api,
        });

        // Data sources
        const usersTableDS: CfnDataSource = dataSources.usersTableDS;
        const timelinesTableDS: CfnDataSource = dataSources.timelinesTableDS;
        const tweetsTableDS: CfnDataSource = dataSources.tweetsTableDS;
        const likesTableDS: CfnDataSource = dataSources.likeTableDS;
        const getImageUploadUrlLambdaDS: CfnDataSource = dataSources.getImageUploadUrlLambdaDS;
        const tweetLambdaDS: CfnDataSource = dataSources.tweetLambdaDS;

        // profile resolverrs
        const getMyProfile: CfnResolver = new GetMyProfile(this, `${env}-get-my-profile-resolver`, { ...props, usersTableDS });
        const editMyProfile: CfnResolver = new EditMyProfile(this, `${env}-edit-my-profile-resolver`, { ...props, usersTableDS });
        const getImageUploadUrl: CfnResolver = new GetImageUploadUrl(this, `${env}-get-image-upload-url-resolver`, { ...props, getImageUploadUrlLambdaDS });

        // tweet related resolvers
        const tweet: CfnResolver = new Tweet(this, `${env}-tweet-resolver`, { ...props, tweetLambdaDS });
        const getTweets: CfnResolver = new GetTweets(this, `${env}-get-tweets`, { ...props, tweetsTableDS });
        // nested resolver for getTweets - gets profile information for each tweet
        const getTweetProfile: CfnResolver = new GetTweetProfile(this, `${env}-get-tweet-profile`, { ...props, usersTableDS})

        const getMyTimeline: CfnResolver = new GetMyTimeline(this, `${env}-get-my-timeline-resolver`, { ...props, timelinesTableDS });
        // nested resolver for getMyTimeline for hydrate tweet information
        const hydrateTimelineTweets: CfnResolver = new HydrateTimelineTweetsNestedResolver(this, `${env}-hydrate-tweets-in-timeline-resolver`, { ...props, tweetsTableDS });

        const like: CfnResolver = new Like(this, `${env}-like-resolver`, { ...props, likesTableDS })
        const likedNestedResolver: CfnResolver = new LikedNestedResolver(this, `${env}-liked-nested-resolver`, { ...props, likesTableDS })
        
        const unlike: CfnResolver = new Unlike(this, `${env}-unlike-resolver`, { ...props, likesTableDS })
    }
}
