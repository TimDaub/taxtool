# cryptotaxtools

ctt is a tool that can help you file your crypto currency taxes. It's NOT an
all-encompassing tool that will accompany throught your annual tax life cycle.
Instead, its aim is to provide tools that do a single job well.

## Data Format

ctt works with `.csv` files. It mandates a canonical header structure 

```csv
type,location,asset,price_in_EUR,fee_in_EUR,amount,exchanged_amount,exchanged_asset,time
```

- `type` is either `{"sell", "buy"}`.
- `location` is an arbitrary string referring to the exchange of the trade.
- `asset` is the ticker value of the asset, e.g. Ethereum is "ETH".
- `amount` is the amount of `asset`.
- `exchanged_amount` is the amount of `exchanged_asset`.
- `exchanged_asset` is the counter asset ticket of `asset`, e.g. Euro is "EUR".
- `time` is the ISO 8601 time the action executed.
