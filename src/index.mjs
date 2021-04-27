// @format
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const pkg = require("../package.json");
const meow = require("meow");

import {
  parse,
  header,
  toLine,
  testNum,
  testDateTime,
  testType,
  parseCalcBalance
} from "./format.mjs";
import { toList } from "./file.mjs";
import { checkDuplicates, calcBalance, orderAsc } from "./validity.mjs";

export const cli = meow(
  `
Usage:
  $ ${pkg.name} <input>

Options:
  --parse, -p
  --formatdatetime, -f
  --order, -o
  --silence, -s
  --checkduplicates, -d
  --calcbalance, -b
  --delimiter, -l
`,
  {
    flags: {
      parse: {
        type: "boolean",
        alias: "p",
        isRequired: true
      },
      formatdatetime: {
        type: "string",
        alias: "f",
        default: "parseISO",
        isRequired: false
      },
      silence: {
        type: "boolean",
        alias: "s",
        default: false,
        isRequired: false
      },
      checkduplicates: {
        type: "boolean",
        alias: "d",
        default: false,
        isRequired: false
      },
      calcbalance: {
        type: "string",
        alias: "b",
        default: "",
        isRequired: false
      },
      delimiter: {
        type: "string",
        alias: "l",
        default: ",",
        isRequired: true
      },
      order: {
        type: "boolean",
        alias: "o",
        default: true,
        isRequired: false
      }
    }
  }
);

export async function route(input, flags) {
  const fPath = input[0];
  let l = await toList(fPath);

  if (flags.parse) {
    l = parseInput(l, flags.formatdatetime);
  }
  if (flags.checkduplicates) {
    checkDuplicates(l, fPath, header, flags.delimiter);
  }
  if (flags.order) {
    l = orderAsc(l);
  }

  if (
    flags.calcbalance &&
    typeof flags.calcbalance === "string" &&
    flags.calcbalance.length > 0
  ) {
    if (!flags.order) {
      l = orderAsc(l);
    }

    const assetNames = parseCalcBalance(flags.calcbalance);
    for (let name of assetNames) {
      calcBalance(name, l);
      header.push(`${name}_BOUGHT`);
      header.push(`${name}_SOLD`);
    }
  }
  if (!flags.silence) {
    output(l, header, flags.delimiter);
  }
}

function output(l, header, delimiter) {
  console.info(header.join(delimiter));
  l.forEach(elem => console.info(toLine(elem, header, delimiter)));
}

export function parseInput(l, fDateTime) {
  const testString = elem =>
    typeof elem === "string" && elem.length > 0 ? elem : null;

  l = l.map(elem =>
    parse(elem, {
      type: testType,
      location: testString,
      asset: testString,
      amount: testNum,
      exchanged_asset: testString,
      exchanged_amount: testNum,
      datetime: testDateTime(fDateTime)
    })
  );

  return l;
}
