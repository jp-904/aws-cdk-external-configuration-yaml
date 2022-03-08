#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { CdkConfigStack } from '../lib/cdk-config-stack';

const app = new cdk.App();
new CdkConfigStack(app, 'CdkConfigStack');
