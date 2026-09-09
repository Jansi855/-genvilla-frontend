import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const [dockerfile, workflow, apiTestPage, loginPage] = await Promise.all([
  readFile(new URL("../Dockerfile", import.meta.url), "utf8"),
  readFile(
    new URL("../.github/workflows/deploy-prod.yml", import.meta.url),
    "utf8",
  ),
  readFile(new URL("../app/api-test/page.js", import.meta.url), "utf8"),
  readFile(new URL("../app/login/page.jsx", import.meta.url), "utf8"),
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
  /--build-arg "NEXT_PUBLIC_LOGIN_VIDEO_URL=\$ASSETS_URL\/media\/login-video-v1\.mp4"/,
  "The production workflow should serve the login video through the asset CDN",
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
  apiTestPage,
  /await connection\(\)/,
  "The live API test page should only fetch data at request time",
);

console.log("Production build configuration is complete.");
