import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = path => readFile(new URL(path, import.meta.url), "utf8");

test("protected writes require server-side identity", async () => {
  const files=await Promise.all([read("../app/api/suppliers/register/route.ts"),read("../app/api/employers/register/route.ts"),read("../app/api/employers/jobs/route.ts"),read("../app/api/employers/jobs/[id]/route.ts"),read("../app/api/requests/[id]/contact/route.ts"),read("../app/api/candidates/profile/route.ts")]);
  for(const source of files){assert.match(source,/getSessionUser/);assert.match(source,/status:\s*401/)}
});

test("employer mutations enforce record ownership", async () => {
  const source=await read("../app/api/employers/jobs/[id]/route.ts");
  assert.match(source,/employer_id = \?/);
  assert.match(source,/status = 'deleted'/);
  assert.match(source,/expires_at<=Date\.now\(\)/);
});

test("customer contacts require an entitled supplier and an active request", async () => {
  const source=await read("../app/api/requests/[id]/contact/route.ts");
  assert.match(source,/subscription_status/);
  assert.match(source,/status = 'active'/);
  assert.match(source,/expires_at > \?/);
  assert.match(source,/contact_access_log/);
});

test("authentication return paths are restricted to this site", async () => {
  const source=await read("../app/auth.ts");
  assert.match(source,/value\.startsWith\("\/\/"\)/);
  assert.match(source,/url\.origin !== "https:\/\/app\.local"/);
  assert.match(source,/safeRelativePath/);
});

test("customer request management stores only a token hash and requires the secret", async () => {
  const create=await read("../app/api/requests/route.ts"); const manage=await read("../app/api/requests/[id]/manage/route.ts");
  assert.match(create,/crypto\.getRandomValues/); assert.match(create,/crypto\.subtle\.digest\("SHA-256"/); assert.match(create,/management_token_hash/);
  assert.match(manage,/x-management-token/); assert.match(manage,/management_token_hash = \?/); assert.match(manage,/status = 'closed'/);
});

test("candidate contacts require an employer, explicit visibility and an access log", async () => {
  const source=await read("../app/api/candidates/[id]/contact/route.ts");
  assert.match(source,/getSessionUser/); assert.match(source,/employer_profiles/);
  assert.match(source,/visibility='employers'/); assert.match(source,/candidate_contact_access_log/);
  assert.match(source,/status:403/);
});
