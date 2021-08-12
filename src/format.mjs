//@format
import { $, createCurrency, ethereum as ETH } from "moneysafe";
import { parse as parseDate, parseISO, isValid } from "date-fns";

export function parseCalcBalance(s) {
  s = s.replace(/\s+/g, "");
  return s.split(",").filter(Boolean);
}

export function parse(obj, options) {
  const clone = { ...obj };
  const keys = Object.keys(options);

  for (let key of keys) {
    let val;
    if (key === "amount") {
      val = options[key](clone[key], clone.asset);
    } else if (key === "exchanged_amount") {
      val = options[key](clone[key], clone.exchanged_asset);
    } else {
      val = options[key](clone[key]);
    }
    clone[key] = val;
  }

  return clone;
}

export const header = [
  "type",
  "location",
  "asset",
  "amount",
  "exchanged_amount",
  "exchanged_asset",
  "datetime"
];

export function toLine(obj, header, delimiter) {
  let line = "";

  for (let prop of header) {
    line += obj[prop] + delimiter;
  }

  // NOTE: We remove the last letter as we've deliberately added an extra `,`
  // at the end.
  line = line.slice(0, -1);

  return line;
}
//
// NOTE: If there's no `SOURCE` field attached to the definition, then it means
// nobody has checked these definitions for validity.
const BTC = createCurrency({ decimals: 8 });
const EUR = $;
export const currencies = {
  BTC,
  BCH: BTC,
  ETH,
  OCEAN: ETH,
  ETC: ETH,
  // SOURCE: https://xrpl.org/currency-formats.html
  XRP: createCurrency({ decimals: 15 }),
  GNO: ETH,
  DNT: ETH,
  EOS: ETH,
  NMR: ETH,
  ANT: ETH,
  ZRX: ETH,
  ENG: ETH,
  RDN: ETH,
  SNT: ETH,
  // NOTE: I looked around but there was no clear source for how many decimals
  // ZCASH has.
  ZEC: ETH,
  XMR: ETH,
  DAI: ETH,
  USDC: ETH,
  SAI: ETH,
  MKR: ETH,
  cSAI: ETH,
  cDAI: ETH,
  XBT7D_D95: BTC,
  ETHM19: ETH,
  XBTUSD: $,
  UNI: ETH,
  LEAP: ETH,
  cDAIUSDC: ETH,
  "cDAI+cUSDC": ETH,
  USD: $,
  EUR
};

export function testNum(elem, unit) {
  if (!currencies[unit]) {
    throw new Error(`The currency "${unit}" is unkown and needs to be defined`);
  } else {
    return currencies[unit](elem.replace(/,/, ".")).toString();
  }
}

export function testDateTime(formatString) {
  return elem => {
    let parsed;
    if (formatString === "parseISO") {
      parsed = parseISO(elem);
    } else {
      parsed = parseDate(elem, formatString, new Date());
    }

    if (isValid(parsed)) {
      return parsed.toISOString();
    } else {
      throw new Error(
        `Couldn't parse date string "${elem}" with format string "${formatString}"`
      );
    }
  };
}

export function testType(type) {
  return type.toLowerCase() === "buy" || type.toLowerCase() === "sell"
    ? type.toLowerCase()
    : null;
}
