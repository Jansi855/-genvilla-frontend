import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const [
  dockerfile,
  workflow,
  apiTestPage,
  loginPage,
  signupPage,
  heroSection,
  footer,
  cdkApp,
] =
  await Promise.all([
    readFile(new URL("../Dockerfile", import.meta.url), "utf8"),
    readFile(
      new URL("../.github/workflows/deploy-prod.yml", import.meta.url),
      "utf8",
    ),
    readFile(new URL("../app/api-test/page.js", import.meta.url), "utf8"),
    readFile(new URL("../app/login/page.jsx", import.meta.url), "utf8"),
    readFile(new URL("../app/signup/page.jsx", import.meta.url), "utf8"),
    readFile(new URL("../components/HeroSection.jsx", import.meta.url), "utf8"),
    readFile(new URL("../components/Footer.jsx", import.meta.url), "utf8"),
    readFile(new URL("../infra/app.js", import.meta.url), "utf8"),
  ]);

assert.match(
  dockerfile,
  /ARG NEXT_PUBLIC_API_URL=https:\/\/api\.genvilla\.in/,
  "Docker builds should have the production API URL available by default",
);
assert.match(
  dockerfile,
  /ENV NEXT_PUBLIC_API_URL=\$NEXT_PUBLIC_API_URL/,
  "The API URL build argument should be exposed to the Next.js build",
);
assert.match(
  workflow,
  /--build-arg "NEXT_PUBLIC_API_URL=\$NEXT_PUBLIC_API_URL"/,
  "The production workflow should pass the API URL into the image build",
);
assert.match(
  dockerfile,
  /ARG NEXT_PUBLIC_LOGIN_VIDEO_URL/,
  "Docker builds should accept the login video URL",
);
assert.match(
  workflow,
  /--build-arg "NEXT_PUBLIC_LOGIN_VIDEO_URL=\$LOGIN_VIDEO_URL"/,
  "The production workflow should pass the CDK-managed login video URL into the image build",
);
assert.match(
  cdkApp,
  /LoginVideoUrl: `https:\/\/\$\{cdn\.distributionDomainName\}\/\$\{loginVideoKey\}`/,
  "The foundation stack should own the login video CDN URL",
);
assert.match(
  loginPage,
  /process\.env\.NEXT_PUBLIC_LOGIN_VIDEO_URL/,
  "The login page should use the configured CDN video URL",
);
assert.doesNotMatch(
  loginPage,
  /front-end video\.mp4/,
  "The login page should not request the missing local video",
);
assert.match(
  signupPage,
  /process\.env\.NEXT_PUBLIC_LOGIN_VIDEO_URL/,
  "The signup page should use the configured login video URL",
);
assert.doesNotMatch(
  signupPage,
  /front-end video\.mp4/,
  "The signup page should not request the missing local video",
);
assert.match(
  heroSection,
  /process\.env\.NEXT_PUBLIC_PROPERTY_VIDEO_URL/,
  "The property hero should use the configured property video URL",
);
assert.doesNotMatch(
  heroSection,
  /src="\/hero\/property-video\.mp4"/,
  "The property hero should not hardcode a missing local video",
);
assert.match(
  footer,
  /process\.env\.NEXT_PUBLIC_HOME_VIDEO_URL/,
  "The footer should use the configured home video URL",
);
assert.doesNotMatch(
  footer,
  /src="\/hero\/home-video\.mp4"/,
  "The footer should not hardcode a missing local video",
);
assert.match(
  apiTestPage,
  /await connection\(\)/,
  "The live API test page should only fetch data at request time",
);

console.log("Production build configuration is complete.");
