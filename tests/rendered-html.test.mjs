import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("homepage exposes all principal user paths", async () => {
  const [source,controls]=await Promise.all([readFile(new URL("../app/ui/HomePage.tsx",import.meta.url),"utf8"),readFile(new URL("../app/ui/GlobalControls.tsx",import.meta.url),"utf8")]);
  for(const text of ["JdemNaTo!","Hledám práci","Hledám dodavatele","Nabízím práci nebo služby","Přihlásit se","Registrace"]) assert.match(source,new RegExp(text));
  assert.match(controls,/Přijmout vše/);
  assert.match(controls,/Odmítnout volitelné/);
  assert.match(controls,/jdemnato-consent/);
});

test("JobPosting markup exists only on job detail", async () => {
  const [detail,home,list]=await Promise.all([
    readFile(new URL("../app/prace/[slug]/page.tsx",import.meta.url),"utf8"),
    readFile(new URL("../app/ui/HomePage.tsx",import.meta.url),"utf8"),
    readFile(new URL("../app/prace/page.tsx",import.meta.url),"utf8"),
  ]);
  assert.match(detail,/JobPosting/);
  assert.match(detail,/validThrough/);
  assert.doesNotMatch(home,/JobPosting/);
  assert.doesNotMatch(list,/JobPosting/);
});
