# taxtool

taxtool is a tool that can help you file your crypto currency taxes. It's NOT
an all-encompassing tool that will accompany throught your annual tax life
cycle. Instead, its aim is to provide tools that do a single job well to help
you and your accountant to file your taxes in time.

## Data Acquisition

taxtool won't help you collect your data from exchanges. I had to go through
that pain myself and I don't think I'm in a position to automate that yet.
However, most exchanges allow you to download some sort of CSV file. Take that
CSV file and try to map it onto the data format specified in the next section
and your tax accountant will thank you.

## Why Use taxtool?

There's many "better" tools on the internet. They allow you to create
connections to exchanges and they do "all the hard work" to make filling taxes
for crypto less complex. However, they all had problem that lead me to create
this small set of tools. Some problems I encountered in other tools:

- They did not respect my privacy by e.g. uploading my tax data into a cloud.
- They did impose an opinionated approach towards calculating my tax return.
- They were so huge/complex/properietary that it was impossible for me or my
  tax accountant to verify that their calculations are correct.

That's why I ended building `taxtool` myself. My goal is to build a tool that
supports an offline-first workflow. It doesn't impose opinion or
juristicional-specific logic on the data. Finally, it's small and well tested.

## Data Format

`taxtool` works with `.csv` files. It mandates a canonical header structure:

```csv
type,location,asset,amount,exchanged_amount,exchanged_asset,datetime
buy,coinbase,ETH,1.5,1.5,EUR,2021-03-17T11:32:48.468Z
buy,coinbase,ETH,1.5,1.5,EUR,2021-03-17T11:32:48.468Z
```

### Properties

- `type` is either `{"sell", "buy"}`.
- `location` is an arbitrary string referring to the exchange of the trade.
- `asset` is the ticker value of the asset, e.g. Ethereum is "ETH".
- `amount` is the amount of `asset`.
- `exchanged_amount` is the amount of `exchanged_asset`.
- `exchanged_asset` is the counter asset ticket of `asset`, e.g. Euro is "EUR".
- `datetime` is the ISO 8601 time the action executed.

### Notes

- taxtool uses [moneysafe](https://www.npmjs.com/package/moneysafe) to ensure
  precision for financial calculations.

## Usage

```bash
$ npm i -g taxtool
$ taxtool trades.csv --parse > parsed.csv
$ cat parsed.csv
> type,location,asset,amount,exchanged_amount,exchanged_asset,datetime
> buy,coinbase,ETH,1.5,1.5,EUR,2021-03-17T11:32:48.468Z
> ...
```

## License

See [LICENSE](./LICENSE)
