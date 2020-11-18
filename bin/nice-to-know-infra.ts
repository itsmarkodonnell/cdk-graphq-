#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { NiceToKnowInfraStack } from '../lib/nice-to-know-infra-stack';

const app = new cdk.App();
new NiceToKnowInfraStack(app, 'NiceToKnowInfraStack');
