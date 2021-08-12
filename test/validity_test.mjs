// @format
import test from "ava";

import { checkDuplicates, calcBalance, orderAsc } from "../src/validity.mjs";
import { toList } from "../src/file.mjs";
import { header } from "../src/format.mjs";

test("if error is thrown when no path argument is passed", async t => {
  t.throws(() => checkDuplicates([]), { instanceOf: Error });
});

test("if duplicates can be found", async t => {
  const path = "./test/fixtures/testfile_duplicates.csv";
  let l = await toList(path);
  try {
    checkDuplicates(l, path, header, ",");
  } catch (err) {
    t.is(
      err.toString(),
      `Error: Found duplicate in file "./test/fixtures/testfile_duplicates.csv" at L4.

L2: buy,coinbase,ETH,1.5,1.5,EUR,2021-03-17T11:32:48.468Z

L4: buy,coinbase,ETH,1.5,1.5,EUR,2021-03-17T11:32:48.468Z

`
    );
    t.pass();
  }
});

test("if checking for duplicates is silent when none a present", async t => {
  const path = "./test/fixtures/testfile_unique.csv";
  let l = await toList(path);
  checkDuplicates(l, path, header, ",");
  t.pass();
});

test("if calculating the balance of an asset works", async t => {
  const path = "./test/fixtures/testfile_balance.csv";
  let l = await toList(path);
  l = calcBalance("ETH", l);

  const lastElem = l[l.length - 1];
  t.is(lastElem.ETH_BOUGHT, "2.000000000000000000");
  t.is(lastElem.ETH_SOLD, "2.000000000000000000");
});

test("if calculating balances is valid", async t => {
  const path = "./test/fixtures/testfile_balance2.csv";
  let l = await toList(path);
  l = calcBalance("ETH", l);

  const elem = l[0];
  t.is(elem.ETH_BOUGHT, "0.840195430000000000");
  t.is(elem.ETH_SOLD, "0.000000000000000000");
});

test("if calculating send and receive operations are valid", async t => {
  const path = "./test/fixtures/testfile_balance3.csv";
  let l = await toList(path);
  l = calcBalance("ETH", l);

  const elem = l[l.length-1];
  t.is(elem.ETH_BOUGHT, "0.840195430000000000");
  t.is(elem.ETH_SOLD, "0.000000000000000000");
  t.is(elem.ETH_RECEIVED, "1.000000000000000000");
  t.is(elem.ETH_SENT, "0.500000000000000000");
});

test("if buy is calculated correctly for asset balance", t => {
  let l = [
    {
      type: "buy",
      location: "coinbase",
      asset: "ETH",
      amount: "1.0",
      exchanged_amount: "100.0",
      exchanged_asset: "EUR",
      datetime: "2015-05-26T10:21:15.000Z"
    }
  ];
  l = calcBalance("ETH", l);

  const elem = l[0];
  t.is(elem.ETH_BOUGHT, "1.000000000000000000");
  t.is(elem.ETH_SOLD, "0.000000000000000000");
});

test("if sell is calculated correctly for asset balance", t => {
  let l = [
    {
      type: "sell",
      location: "coinbase",
      asset: "ETH",
      amount: "1.0",
      exchanged_amount: "100.0",
      exchanged_asset: "EUR",
      datetime: "2015-05-26T10:21:15.000Z"
    }
  ];
  l = calcBalance("ETH", l);

  const elem = l[0];
  t.is(elem.ETH_BOUGHT, "0.000000000000000000");
  t.is(elem.ETH_SOLD, "1.000000000000000000");
});

test("if reverse buy is calculated correctly for counter asset balance", t => {
  let l = [
    {
      type: "buy",
      location: "coinbase",
      asset: "BTC",
      amount: "0.1",
      exchanged_amount: "1.0",
      exchanged_asset: "ETH",
      datetime: "2015-05-26T10:21:15.000Z"
    }
  ];
  l = calcBalance("ETH", l);

  const elem = l[0];
  t.is(elem.ETH_BOUGHT, "0.000000000000000000");
  t.is(elem.ETH_SOLD, "1.000000000000000000");
});

test("if reverse sell is calculated correctly for counter asset balance", t => {
  let l = [
    {
      type: "sell",
      location: "coinbase",
      asset: "BTC",
      amount: "0.1",
      exchanged_amount: "1.0",
      exchanged_asset: "ETH",
      datetime: "2015-05-26T10:21:15.000Z"
    }
  ];
  l = calcBalance("ETH", l);

  const elem = l[0];
  t.is(elem.ETH_BOUGHT, "1.000000000000000000");
  t.is(elem.ETH_SOLD, "0.000000000000000000");
});

test("if ordering by datetime works", t => {
  const l = [
    {
      datetime: "2016-01-01T00:00:00.000Z"
    },
    {
      datetime: "2015-01-01T00:00:00.000Z"
    },
    {
      datetime: "2014-12-12T00:00:00.000Z"
    }
  ];

  const actual = orderAsc(l);
  const expected = [
    {
      datetime: "2014-12-12T00:00:00.000Z"
    },
    {
      datetime: "2015-01-01T00:00:00.000Z"
    },
    {
      datetime: "2016-01-01T00:00:00.000Z"
    }
  ];

  t.notDeepEqual(l, expected);
  t.deepEqual(actual, expected);
});
