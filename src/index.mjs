// @format
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const pkg = require("../package.json");
const meow = require("meow");

import { parse, header, toLine, testNum, testDateTime } from "./format.mjs";
import { toList } from "./file.mjs";

export const cli = meow(
  `
Usage:
  $ ${pkg.name} <input>

Options:
  --parse, -p
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
      }
    }
  }
);

export async function route(input, flags) {
  if (flags.parse) {
    await parseInput(input[0], flags.formatdatetime);
  } else {
    throw new Error("Not implemented");
  }
}

export async function parseInput(input, fDateTime) {
  let l = await toList(input);

  const testString = elem =>
    typeof elem === "string" && elem.length > 0 ? elem : null;

  console.info(header.join(","));
  l = l.map(elem => {
    elem = parse(elem, {
      type: t => (t === "buy" || t === "sell" ? t : null),
      location: testString,
      asset: testString,
      amount: testNum,
      exchanged_asset: testString,
      exchanged_amount: testNum,
      datetime: testDateTime(fDateTime)
    });

    console.info(toLine(elem));

    return elem;
  });

  return l;
}
