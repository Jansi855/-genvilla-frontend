# Production frontend

Production runs on ECS Fargate in account `013565030464`, region `ap-south-1`.
Pushes to `prod` deploy through `.github/workflows/deploy-prod.yml` with GitHub OIDC (no stored AWS keys).

## Architecture

- `genvilla.in` and `www.genvilla.in`: Cloudflare proxy → existing backend HTTPS ALB → separate `genvilla-frontend-prod` ECS service.
- Next.js standalone Node server supports dynamic routes and future server-side login/session handling. Authentication and backend API integration are not implemented by this deployment; current property services still use demo data.
- Public images: private, versioned S3 bucket → CloudFront with origin access control. Deployments upload to immutable `releases/<git-sha>-<run-number>-<attempt>/` prefixes and compile that CDN prefix into the app.
- Existing Unsplash property images and OpenStreetMap tiles continue using their existing external providers.
- ECS starts with 0.25 vCPU / 1 GiB, one task, scaling up to four on CPU demand. Rolling updates keep the previous task healthy and enable automatic rollback.
- Shares the existing backend ALB and cluster. The frontend stack owns only its added certificate attachment, host rule (priority 20), target group, and frontend resources.
- Fargate uses public subnets for outbound access, with inbound port 3000 restricted to the ALB security group. Next.js runs as the unprivileged `node` user.

## Infrastructure

```sh
npm ci --prefix infra
npm run synth --prefix infra
npm run diff --prefix infra -- GenvillaFrontendFoundation
npm run deploy:foundation --prefix infra
```

The production pipeline uploads images, builds an immutable ECR image tagged with the Git commit and workflow run/attempt, and runs CDK synth, diff, and deploy for `GenvillaFrontendProd`. Foundation changes are deployed separately after review.

The ACM certificate in `infra/app.js` is DNS validated in Cloudflare. Keep its validation CNAMEs for renewal. Both site DNS records must remain proxied, since the existing ALB accepts web traffic only from Cloudflare.

## Missing videos

The repository excludes MP4 files. These source files were absent at deployment:

- `public/hero/property-video.mp4`
- `public/hero/home-video.mp4`

Existing lifestyle images act as video posters. No missing video URL is requested until configured.

Upload supplied videos using unique versioned filenames (replace the example local path):

```sh
ASSETS_BUCKET=$(aws cloudformation describe-stacks --stack-name GenvillaFrontendFoundation --query 'Stacks[0].Outputs[?OutputKey==`AssetsBucket`].OutputValue' --output text)
ASSETS_URL=$(aws cloudformation describe-stacks --stack-name GenvillaFrontendFoundation --query 'Stacks[0].Outputs[?OutputKey==`AssetsUrl`].OutputValue' --output text)
aws s3 cp /path/to/property-video.mp4 "s3://$ASSETS_BUCKET/media/property-video-v1.mp4" --content-type video/mp4 --cache-control 'public,max-age=31536000,immutable'
gh variable set PROPERTY_VIDEO_URL --repo genvilla-in/frontend --body "$ASSETS_URL/media/property-video-v1.mp4"
# Repeat for home-video-v1.mp4 and HOME_VIDEO_URL.
gh workflow run deploy-prod.yml --repo genvilla-in/frontend --ref prod
```

Video URLs and asset prefix are public build-time configuration. Never put secrets in `NEXT_PUBLIC_*`. Future session/authentication secrets belong in Secrets Manager and ECS secret injection. Personalized/authentication responses must not be cached by Cloudflare.

## Validation and rollback

```sh
npm ci
node --test tests/*.mjs
npm run build
curl --fail https://genvilla.in/ -o /dev/null
curl --fail https://www.genvilla.in/ -o /dev/null
```

Re-run a previous successful GitHub workflow to rebuild its code with current video configuration, or deploy CDK with `--context imageTag=<previous-release-id>`. ECR retains 25 images; S3 retains asset versions. Do not delete old release assets while their images are retained.

Before the AWS cutover, the root DNS record was proxied A `2.57.91.91`, and `www` was a proxied CNAME to `genvilla.in`.
