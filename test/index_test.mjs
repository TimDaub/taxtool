// @format
import test from "ava";

import { parseInput, route } from "../src/index.mjs";

test("if parsing a file path works", async t => {
  const out = await parseInput("./test/fixtures/testfile.csv");
  t.truthy(out);
  t.is(out.length, 2);
  t.truthy(out[0]);
});

test("if parsing a file path with an unknown currency throws an error", async t => {
  await t.throwsAsync(
    async () => await parseInput("./test/fixtures/testfile3.csv")
  );
});
