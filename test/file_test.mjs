// @format
import test from "ava";

import { toList } from "../src/file.mjs";

test("if converting lines to a JS list works", async t => {
  const l = await toList("./test/fixtures/testfile.csv");
  t.truthy(l);

  const head = l[0];
  t.is(head["price_in_EUR"], "1,5");
});
