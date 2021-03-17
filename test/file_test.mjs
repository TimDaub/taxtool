// @format
import test from "ava";
import { isValid, parseISO } from "date-fns";

import { toList } from "../src/file.mjs";

test("if converting lines to a JS list works", async t => {
  const l = await toList("./test/fixtures/testfile.csv");
  t.truthy(l);

  const head = l[0];
  t.is(head.type, "buy");
  t.is(head.location, "coinbase");
  t.is(head.asset, "ETH");
  t.is(head.amount, "1,5");
  t.is(head.exchanged_amount, "1,5");
  t.is(head.exchanged_asset, "EUR");
  t.is(head.exchanged_asset, "EUR");
  t.true(isValid(parseISO(head.datetime)));
});
