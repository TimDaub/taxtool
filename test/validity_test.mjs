// @format
import test from "ava";

import { checkDuplicates } from "../src/validity.mjs";
import { toList } from "../src/file.mjs";

test("if error is thrown when no path argument is passed", async t => {
  t.throws(() => checkDuplicates([]), { instanceOf: Error });
});

test("if duplicates can be found", async t => {
  const path = "./test/fixtures/testfile_duplicates.csv";
  let l = await toList(path);
  try {
    checkDuplicates(l, path);
  } catch (err) {
    t.is(
      err.toString(),
      `Error: Found duplicate in file "./test/fixtures/testfile_duplicates.csv" at L4.

L2: buy,coinbase,unkown,1.5,1.5,shitcoin,2021-03-17T11:32:48.468Z

L4: buy,coinbase,unkown,1.5,1.5,shitcoin,2021-03-17T11:32:48.468Z

`
    );
    t.pass();
  }
});

test("if checking for duplicates is silent when none a present", async t => {
  const path = "./test/fixtures/testfile_unique.csv";
  let l = await toList(path);
  checkDuplicates(l, path);
  t.pass();
});
