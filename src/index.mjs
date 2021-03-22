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
  testType
} from "./format.mjs";
import { toList } from "./file.mjs";
import { checkDuplicates } from "./validity.mjs";

export const cli = meow(
  `
Usage:
  $ ${pkg.name} <input>

Options:
  --parse, -p
  --formatdatetime, -f
  --silence, -s
  --checkduplicates, -d
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
    checkDuplicates(l, fPath);
  }
  if (!flags.silence) {
    output(l);
  }
}

function output(l) {
  console.info(header.join(","));
  l.shift();
  l.forEach(elem => console.info(toLine(elem)));
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
