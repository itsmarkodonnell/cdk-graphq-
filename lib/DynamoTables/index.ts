import { Stack, Construct } from "@aws-cdk/core";
import {
  AttributeType,
  BillingMode,
  Table,
  ProjectionType,
} from "@aws-cdk/aws-dynamodb";
import { CustomStackProps } from "../../bin/nice-to-know-infra";

interface DynamoTablesProps extends CustomStackProps {}

export class DynamoTablesStack extends Stack {
  public usersTable: Table;
  public tweetsTable: Table;
  public timelinesTable: Table;
  public likesTable: Table;

  constructor(scope: Construct, id: string, props: DynamoTablesProps) {
    super(scope, id, props);
    const env = props.environment;

    /**
     * Create new DynamoDB Table for user profile information 
     */
    this.usersTable = new Table(this, `${env}-users-table`, {
      billingMode: BillingMode.PAY_PER_REQUEST,
      partitionKey: {
        name: "id",
        type: AttributeType.STRING,
      },
    });

    /**
     * Create new DynamoDB Table to store tweets
     */
    this.tweetsTable = new Table(this, `${env}-tweets-table`, {
      billingMode: BillingMode.PAY_PER_REQUEST,
      partitionKey: {
        name: "id",
        type: AttributeType.STRING,
      }
    });

    /**
     * Create new DynamoDB index to get tweets created by user
     */
    this.tweetsTable.addGlobalSecondaryIndex({
      indexName: "byCreator",
      partitionKey: {
        name: "creator",
        type: AttributeType.STRING,
      },
      sortKey: {
        name: "id",
        type: AttributeType.STRING,
      },
      projectionType: ProjectionType.ALL,
    });

    /**
     * Create new DynamoDB Table to store all tweets that can be storted by user
     */
    this.timelinesTable = new Table(this, `${env}-timelines-table`, {
      billingMode: BillingMode.PAY_PER_REQUEST,
      partitionKey: {
        name: "userId",
        type: AttributeType.STRING,
      },
      sortKey: {
        name: "tweetId",
        type: AttributeType.STRING,
      },
    });
    /**
     * Create new DynamoDB Table to keep record or likes per user
     */
    this.likesTable = new Table(this, `${env}-likes-table`, {
      billingMode: BillingMode.PAY_PER_REQUEST,
      partitionKey: {
        name: "userId",
        type: AttributeType.STRING,
      },
      sortKey: {
        name: "tweetId",
        type: AttributeType.STRING,
      },
    });
  }
}
