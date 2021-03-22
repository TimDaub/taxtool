// @format
import test from "ava";

import { parseInput, route } from "../src/index.mjs";
import { toList } from "../src/file.mjs";

test("if parsing a file path works", async t => {
  const l = await toList("./test/fixtures/testfile.csv");
  const out = parseInput(l, "parseISO");
  t.truthy(out);
  t.is(out.length, 2);
  t.truthy(out[0]);
});

test("if parsing a file path with an unknown currency throws an error", async t => {
  const l = await toList("./test/fixtures/testfile3.csv");
  t.throws(() => parseInput(l, "parseISO"));
});
