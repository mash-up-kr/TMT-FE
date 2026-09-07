import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { registerHooks } from "node:module";
import { extname } from "node:path";
import test from "node:test";

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier.startsWith("@/") && extname(specifier) === "") {
      const resolved = new URL(`../../${specifier.slice(2)}.ts`, import.meta.url);

      if (existsSync(resolved)) {
        return nextResolve(resolved.href, context);
      }
    }

    return nextResolve(specifier, context);
  },
});

const policy = await import("./bottomNavigationPolicy.ts");

test("탭의 대표 경로와 활성 경로를 일관되게 해석한다", () => {
  assert.equal(policy.getBottomNavHref("home"), "/");
  assert.equal(policy.getBottomNavHref("feed"), "/nearby");
  assert.equal(policy.getBottomNavHref("group"), "/groups");
  assert.equal(policy.getBottomNavHref("my"), "/profile/me/reviews");

  assert.equal(policy.getActiveBottomNav("/"), "home");
  assert.equal(policy.getActiveBottomNav("/nearby"), "feed");
  assert.equal(policy.getActiveBottomNav("/groups"), "group");
  assert.equal(policy.getActiveBottomNav("/profile/me/reviews"), "my");
  assert.equal(policy.getActiveBottomNav("/profile/me/groups"), "my");
  assert.equal(policy.getActiveBottomNav("/profile/me/favorites"), "my");
  assert.equal(policy.getActiveBottomNav("/groups/new"), null);
  assert.equal(policy.getActiveBottomNav("/profile/me/tickets"), null);
});
