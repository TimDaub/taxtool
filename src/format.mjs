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
