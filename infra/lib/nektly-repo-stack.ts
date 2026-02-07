import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as targets from 'aws-cdk-lib/aws-route53-targets';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as lambdaNode from 'aws-cdk-lib/aws-lambda-nodejs';
import * as apigw from 'aws-cdk-lib/aws-apigateway';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';  

export class NektlyRepoStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    //const zone = route53.HostedZone.fromLookup(this, 'Zone', {
      //domainName: 'yourdomain.com'
    //});

    //const cert = new acm.DnsValidatedCertificate(this, 'Cert', {
      //domainName: 'yourdomain.com',
      //hostedZone: zone,
      //region: 'us-east-1'
    //});

    const oai = new cloudfront.OriginAccessIdentity(this, 'OAI');

    const websiteBucket = new s3.Bucket(this, 'FrontendBucket', {
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: cdk.RemovalPolicy.DESTROY
    });

    websiteBucket.grantRead(oai);

    const backendFn = new lambdaNode.NodejsFunction(this, 'BackendFn', {
      entry: '../backend/index.ts',
      handler: 'handler',
      runtime: cdk.aws_lambda.Runtime.NODEJS_18_X,
      environment: {
        AIRTABLE_TOKEN: 'patIjnkQmg6MfPffu.13bc89ba78fdbd33f661283cb68cdca674ce277f11d39eac528ef3dd47db07f3',
        AIRTABLE_BASE_ID: 'appRQsm8WfEQBg4Xs'
      }
    });

    const api = new apigw.RestApi(this, 'Api',{
      deployOptions: {
        stageName: '', 
      },
    });
    api.root.addProxy({ defaultIntegration: new apigw.LambdaIntegration(backendFn) });

    const distribution = new cloudfront.Distribution(this, 'Distribution', {
      defaultBehavior: { 
        origin: new origins.S3Origin(websiteBucket, { originAccessIdentity: oai }),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
      defaultRootObject: 'index.html',
      additionalBehaviors: {
        'api/*': {
          origin: new origins.RestApiOrigin(api),
          allowedMethods: cloudfront.AllowedMethods.ALLOW_ALL,
          cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
          originRequestPolicy: cloudfront.OriginRequestPolicy.ALL_VIEWER,
        }
      },
      errorResponses: [
        {
          httpStatus: 403,  // Access Denied from S3
          responseHttpStatus: 200,  // Serve index.html
          responsePagePath: '/index.html',
          ttl: cdk.Duration.minutes(5),
        },
        {
          httpStatus: 404,  // Not Found
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
          ttl: cdk.Duration.minutes(5),
        }
      ]
    });
  

    new s3deploy.BucketDeployment(this, 'DeployFrontend', {
      sources: [
        s3deploy.Source.asset('../frontend', {
          bundling: {
            image: cdk.DockerImage.fromRegistry('node:18'),
            command: ['bash', '-c', 'npm ci --cache /tmp/.npm && npm run build && cp -r dist/* /asset-output/']
          }
        })
      ],
      destinationBucket: websiteBucket,
      distribution,
      distributionPaths: ['/*']
    });

    new cdk.CfnOutput(this, 'FrontendURL', {
      value: distribution.distributionDomainName,
    });

    
  }
}
