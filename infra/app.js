const cdk = require("aws-cdk-lib");
const {
  aws_s3: s3,
  aws_cloudfront: cf,
  aws_cloudfront_origins: origins,
  aws_ecr: ecr,
  aws_iam: iam,
  aws_ec2: ec2,
  aws_ecs: ecs,
  aws_elasticloadbalancingv2: elb,
  aws_logs: logs,
} = cdk;
const app = new cdk.App();
const env = { account: "013565030464", region: "ap-south-1" };
const foundation = new cdk.Stack(app, "GenvillaFrontendFoundation", {
  env,
  terminationProtection: true,
});
const repo = new ecr.Repository(foundation, "Repository", {
  repositoryName: "genvilla-frontend",
  imageScanOnPush: true,
  imageTagMutability: ecr.TagMutability.IMMUTABLE,
  removalPolicy: cdk.RemovalPolicy.RETAIN,
});
repo.addLifecycleRule({ maxImageCount: 25 });
const bucket = new s3.Bucket(foundation, "Assets", {
  blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
  encryption: s3.BucketEncryption.S3_MANAGED,
  enforceSSL: true,
  versioned: true,
  removalPolicy: cdk.RemovalPolicy.RETAIN,
});
const cdn = new cf.Distribution(foundation, "AssetCdn", {
  defaultBehavior: {
    origin: origins.S3BucketOrigin.withOriginAccessControl(bucket),
    viewerProtocolPolicy: cf.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
    compress: true,
    cachePolicy: cf.CachePolicy.CACHING_OPTIMIZED,
    responseHeadersPolicy: cf.ResponseHeadersPolicy.SECURITY_HEADERS,
  },
});
const role = new iam.Role(foundation, "DeployRole", {
  roleName: "genvilla-frontend-github-prod-deploy",
  assumedBy: new iam.WebIdentityPrincipal(
    `arn:aws:iam::${env.account}:oidc-provider/token.actions.githubusercontent.com`,
    {
      StringEquals: {
        "token.actions.githubusercontent.com:aud": "sts.amazonaws.com",
        "token.actions.githubusercontent.com:sub":
          "repo:genvilla-in@322783281/frontend@1352718693:ref:refs/heads/prod",
      },
    },
  ),
});
repo.grantPullPush(role);
bucket.grantReadWrite(role);
role.addToPolicy(
  new iam.PolicyStatement({
    actions: ["ecr:DescribeImages"],
    resources: [repo.repositoryArn],
  }),
);
role.addToPolicy(
  new iam.PolicyStatement({
    actions: ["sts:AssumeRole"],
    resources: [
      `arn:aws:iam::${env.account}:role/cdk-hnb659fds-*-${env.account}-${env.region}`,
    ],
  }),
);
role.addToPolicy(
  new iam.PolicyStatement({
    actions: [
      "cloudformation:DescribeStacks",
      "cloudformation:DescribeStackEvents",
      "cloudformation:GetTemplate",
      "ssm:GetParameter",
    ],
    resources: ["*"],
  }),
);
for (const [key, value] of Object.entries({
  RepositoryUri: repo.repositoryUri,
  AssetsBucket: bucket.bucketName,
  AssetsUrl: `https://${cdn.distributionDomainName}`,
  DistributionId: cdn.distributionId,
  DeployRoleArn: role.roleArn,
}))
  new cdk.CfnOutput(foundation, key, { value });
const prod = new cdk.Stack(app, "GenvillaFrontendProd", {
  env,
  terminationProtection: true,
});
const vpc = ec2.Vpc.fromLookup(prod, "Vpc", { isDefault: true });
const cluster = ecs.Cluster.fromClusterAttributes(prod, "Cluster", {
  clusterName: "genvilla-prod",
  vpc,
  securityGroups: [],
});
const albSg = ec2.SecurityGroup.fromSecurityGroupId(
  prod,
  "AlbSg",
  "sg-0d05c52f28736068b",
  { mutable: false },
);
const sg = new ec2.SecurityGroup(prod, "ServiceSg", {
  vpc,
  description: "Frontend accepts traffic only from the shared ALB",
});
sg.addIngressRule(albSg, ec2.Port.tcp(3000));
const task = new ecs.FargateTaskDefinition(prod, "Task", {
  family: "genvilla-frontend-prod",
  cpu: 256,
  memoryLimitMiB: 1024,
  runtimePlatform: {
    cpuArchitecture: ecs.CpuArchitecture.X86_64,
    operatingSystemFamily: ecs.OperatingSystemFamily.LINUX,
  },
});
const logGroup = new logs.LogGroup(prod, "Logs", {
  logGroupName: "/ecs/genvilla-prod/frontend",
  retention: logs.RetentionDays.ONE_MONTH,
  removalPolicy: cdk.RemovalPolicy.RETAIN,
});
const imageTag = app.node.tryGetContext("imageTag") || "initial";
const container = task.addContainer("Web", {
  image: ecs.ContainerImage.fromEcrRepository(
    ecr.Repository.fromRepositoryName(prod, "Repository", "genvilla-frontend"),
    imageTag,
  ),
  environment: {
    NODE_ENV: "production",
    PORT: "3000",
    HOSTNAME: "0.0.0.0",
    RELEASE_ID: imageTag,
  },
  logging: ecs.LogDrivers.awsLogs({
    logGroup,
    streamPrefix: "web",
    mode: ecs.AwsLogDriverMode.BLOCKING,
  }),
  healthCheck: {
    command: [
      "CMD-SHELL",
      `node -e "fetch('http://127.0.0.1:3000/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"`,
    ],
    startPeriod: cdk.Duration.seconds(30),
  },
  stopTimeout: cdk.Duration.seconds(30),
});
container.addPortMappings({ containerPort: 3000 });
const service = new ecs.FargateService(prod, "Service", {
  cluster,
  serviceName: "genvilla-frontend-prod",
  taskDefinition: task,
  desiredCount: 1,
  assignPublicIp: true,
  vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
  securityGroups: [sg],
  minHealthyPercent: 100,
  maxHealthyPercent: 200,
  circuitBreaker: { rollback: true },
  healthCheckGracePeriod: cdk.Duration.seconds(60),
  platformVersion: ecs.FargatePlatformVersion.LATEST,
});
const listenerArn =
  "arn:aws:elasticloadbalancing:ap-south-1:013565030464:listener/app/Genvil-LoadB-SCbdKsRbpVWZ/679ea3703adea11e/279e2cae73ffb0ab";
new elb.CfnListenerCertificate(prod, "Certificate", {
  listenerArn,
  certificates: [
    {
      certificateArn:
        "arn:aws:acm:ap-south-1:013565030464:certificate/20a1328e-826f-4404-8f4e-5cfab2442d12",
    },
  ],
});
const target = new elb.ApplicationTargetGroup(prod, "Target", {
  vpc,
  port: 3000,
  protocol: elb.ApplicationProtocol.HTTP,
  targetType: elb.TargetType.IP,
  targets: [service],
  deregistrationDelay: cdk.Duration.seconds(30),
  healthCheck: { path: "/api/health", healthyHttpCodes: "200" },
});
const hostRule = new elb.CfnListenerRule(prod, "HostRule", {
  listenerArn,
  priority: 20,
  conditions: [
    {
      field: "host-header",
      hostHeaderConfig: { values: ["genvilla.in", "www.genvilla.in"] },
    },
  ],
  actions: [{ type: "forward", targetGroupArn: target.targetGroupArn }],
});
service.node.addDependency(hostRule);
service
  .autoScaleTaskCount({ minCapacity: 1, maxCapacity: 4 })
  .scaleOnCpuUtilization("Cpu", { targetUtilizationPercent: 70 });
new cdk.CfnOutput(prod, "SiteUrl", { value: "https://genvilla.in" });
app.synth();
