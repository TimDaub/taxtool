//@format

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

export function toLine(obj) {
  let line = "";
  for (let prop of header) {
    line += obj[prop] + ",";
  }

  // NOTE: We remove the last letter as we've deliberately added an extra `,`
  // at the end.
  line = line.slice(0, -1);

  return line;
}
