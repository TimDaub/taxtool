// @format
import test from "ava";
import { $ as EUR, createCurrency, ethereum as ETH } from "moneysafe";
import { parseISO, isValid } from "date-fns";

import { parse, toLine } from "../src/format.mjs";
import { toList } from "../src/file.mjs";

const currencies = {
  BTC: createCurrency({ decimals: 8 }),
  ETH,
  EUR
};

test("if parsing objects according to options works", async t => {
  let l = await toList("./test/fixtures/testfile.csv");

  const testString = elem =>
    typeof elem === "string" && elem.length > 0 ? elem : null;
  const testNum = (elem, unit) =>
    currencies[unit](elem.replace(/,/, ".")).toString();
  const testDate = elem => (isValid(parseISO(elem)) ? elem : null);

  l = l.map(elem =>
    parse(elem, {
      type: t => (t === "buy" || t === "sell" ? t : null),
      location: testString,
      asset: testString,
      amount: testNum,
      exchanged_asset: testString,
      exchanged_amount: testNum,
      datetime: testDate
    })
  );

  const head = l[0];
  t.is(head.type, "buy");
  t.is(head.location, "coinbase");
  t.is(head.asset, "ETH");
  t.is(head.amount, ETH("1.5").toString());
  t.is(head.exchanged_asset, "EUR");
  t.is(head.exchanged_amount, EUR("1.5").toString());
});

test("if file with different float notation can be parsed too", async t => {
  let l = await toList("./test/fixtures/testfile2.csv");

  const testString = elem =>
    typeof elem === "string" && elem.length > 0 ? elem : null;
  const testNum = (elem, unit) =>
    currencies[unit](elem.replace(/,/, ".")).toString();
  const testDate = elem => (isValid(parseISO(elem)) ? elem : null);

  l = l.map(elem =>
    parse(elem, {
      type: t => (t === "buy" || t === "sell" ? t : null),
      location: testString,
      asset: testString,
      amount: testNum,
      exchanged_asset: testString,
      exchanged_amount: testNum,
      datetime: testDate
    })
  );

  const head = l[0];
  t.is(head.type, "buy");
  t.is(head.location, "coinbase");
  t.is(head.asset, "ETH");
  t.is(head.amount, ETH("1.5").toString());
  t.is(head.exchanged_asset, "EUR");
  t.is(head.exchanged_amount, EUR("1.5").toString());
});

test("if turning object into a csv line works", async t => {
  const obj = {
    type: "buy",
    location: "coinbase",
    asset: "ETH",
    amount: "1.500000000000000000",
    exchanged_amount: "1.50",
    exchanged_asset: "EUR",
    datetime: "2021-03-17T11:32:48.468Z"
  };

  const line = toLine(obj);
  t.is(
    line,
    `${obj.type},${obj.location},${obj.asset},${obj.amount},${
      obj.exchanged_amount
    },${obj.exchanged_asset},${obj.datetime}`
  );
});
