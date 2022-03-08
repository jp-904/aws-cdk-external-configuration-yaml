#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { Tags } from '@aws-cdk/core';
import { Mainstack } from '../stacks/main';
import { BuildConfig } from '../stacks/lib/build-config';
import * as fs from 'fs';
import * as path from 'path';
const yaml = require('js-yaml');
import { mainModule } from 'process';

 

const app = new cdk.App();

function ensureString(object: { [name: string ]: any }, propName: string ): string {
    if(!object[propName] || object[propName].trim().length === 0) {
        throw new Error(propName + ' does not exist or is empty');
    }
    return object[propName]
}

function getConfig(){
    let env = app.node.tryGetContext('config');
    if(!env){
        throw new Error('Context variable missing from CDK command. Pass it as `-c config=xxx`');
    }

    let unparsedEnv = yaml.load(fs.readFileSync(path.join(__dirname,'../config/'+env+'.yaml'),'utf8'));

    let buildConfig: BuildConfig = {
        AWSAccountID: ensureString(unparsedEnv, 'AWSAccountID'),
        AWSProfileRegion: ensureString(unparsedEnv, 'AWSProfileRegion'),

        App: ensureString(unparsedEnv, 'App'),
        Version: ensureString(unparsedEnv, 'Version'),
        Environment: ensureString(unparsedEnv, 'Environment'),
        Build: ensureString(unparsedEnv, 'Build'),

        Parameters: {
            LambdaInsightsLayer:  ensureString(unparsedEnv['Parameters'], 'LambdaInsightsLayer'),
            SomeExternalApiUrl: ensureString(unparsedEnv['Parameters'], 'SomeExternalApiUrl'),
        }        
    };
    return buildConfig;
}

async function Main(){
    let buildConfig: BuildConfig = getConfig();

    Tags.of(app).add('App', buildConfig.App);
    Tags.of(app).add('Environment', buildConfig.Environment);

    let mainStackName = buildConfig.App + '-' +buildConfig.Environment+ '-main';

    const mainStack = new Mainstack(app, mainStackName, {
        env:{
            region: buildConfig.AWSProfileRegion,
            account: buildConfig.AWSAccountID
        }
    }, buildConfig);
}

Main();
