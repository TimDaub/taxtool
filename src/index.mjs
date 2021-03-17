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
  --formatdatetime, -f
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
  let l;
  if (flags.parse) {
    l = await parseInput(input[0], flags.formatdatetime);
  }
  output(l);
}

function output(l) {
  console.info(header.join(","));
  l.shift();
  l.forEach(elem => console.info(toLine(elem)));
}

export async function parseInput(input, fDateTime) {
  let l = await toList(input);

  const testString = elem =>
    typeof elem === "string" && elem.length > 0 ? elem : null;

  l = l.map(elem =>
    parse(elem, {
      type: t => (t === "buy" || t === "sell" ? t : null),
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
