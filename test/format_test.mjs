// @format
import test from "ava";
import { parseISO, isValid } from "date-fns";

import {
  parse,
  header,
  toLine,
  testNum,
  testDateTime,
  testType,
  currencies,
  parseCalcBalance
} from "../src/format.mjs";
import { toList } from "../src/file.mjs";

test("if parse calc balance can handle different formats", t => {
  t.deepEqual(["ETH", "BTC"], parseCalcBalance("ETH,   BTC"));
  t.deepEqual(["ETH", "BTC"], parseCalcBalance("ETH,BTC"));
  t.deepEqual(["ETH", "BTC"], parseCalcBalance(" ETH , BTC"));
  t.deepEqual(["ETH"], parseCalcBalance("ETH"));
  t.deepEqual(["ETH"], parseCalcBalance("ETH,"));
});

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
  t.is(head.amount, currencies.ETH("1.5").toString());
  t.is(head.exchanged_asset, "EUR");
  t.is(head.exchanged_amount, currencies.EUR("1.5").toString());
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
  t.is(head.amount, currencies.ETH("1.5").toString());
  t.is(head.exchanged_asset, "EUR");
  t.is(head.exchanged_amount, currencies.EUR("1.5").toString());
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

  const line = toLine(obj, header, ",");
  t.is(
    line,
    `${obj.type},${obj.location},${obj.asset},${obj.amount},${
      obj.exchanged_amount
    },${obj.exchanged_asset},${obj.datetime}`
  );
});

test("if numbers are correctly tested during parsing", t => {
  t.is(testNum("1.5", "EUR"), "1.50");
  t.is(testNum("0.12", "BTC"), "0.12000000");
  t.is(testNum("0.12", "ETH"), "0.120000000000000000");
  t.throws(() => testNum("0.12", "BSCOIN"));
});

// TODO: These tests are likely to fail for any location but Germany in winter
// as they implicitly assume time zones.
test("if dates can be parsed with ISO or custom", t => {
  t.is(
    testDateTime("parseISO")("2021-03-17T16:53:12.587Z"),
    "2021-03-17T16:53:12.587Z"
  );
  t.is(
    testDateTime("dd/MM/yyyy HH:mm:ss X")("28/05/2017 13:18:12 Z"),
    "2017-05-28T13:18:12.000Z"
  );

  t.throws(() =>
    testDateTime("mm", "2021-03-17T16:53:12.587Z")("28/05/2017 13:18:12")
  );
});

test("if lower and upper case types are matched equally", t => {
  t.is(testType("Sell"), "sell");
  t.is(testType("SelL"), "sell");
  t.is(testType("Buy"), "buy");
  t.is(testType("buy"), "buy");
});
