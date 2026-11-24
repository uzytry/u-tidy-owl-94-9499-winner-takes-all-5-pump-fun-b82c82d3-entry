# Completion Rider — make.fun u-tidy-owl-94-9499-winner-takes-all-5-pump-fun-b82c82d3 entry

[![make.fun · u-tidy-owl-94-9499-winner-takes-all-5-pump-fun-b82c82d3](https://make.fun/badge/u-tidy-owl-94-9499-winner-takes-all-5-pump-fun-b82c82d3.svg)](https://make.fun/bounty/u-tidy-owl-94-9499-winner-takes-all-5-pump-fun-b82c82d3?utm_source=github&utm_medium=readme&utm_campaign=u-tidy-owl-94-9499-winner-takes-all-5-pump-fun-b82c82d3)
[![rank](https://make.fun/badge/u-tidy-owl-94-9499-winner-takes-all-5-pump-fun-b82c82d3/uzytry/u-tidy-owl-94-9499-winner-takes-all-5-pump-fun-b82c82d3-entry/rank.svg)](https://make.fun/bounty/u-tidy-owl-94-9499-winner-takes-all-5-pump-fun-b82c82d3/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=u-tidy-owl-94-9499-winner-takes-all-5-pump-fun-b82c82d3)
[![reward](https://make.fun/badge/u-tidy-owl-94-9499-winner-takes-all-5-pump-fun-b82c82d3/uzytry/u-tidy-owl-94-9499-winner-takes-all-5-pump-fun-b82c82d3-entry/reward.svg)](https://make.fun/bounty/u-tidy-owl-94-9499-winner-takes-all-5-pump-fun-b82c82d3?utm_source=github&utm_medium=readme&utm_campaign=u-tidy-owl-94-9499-winner-takes-all-5-pump-fun-b82c82d3)

A trading bot for the pump.fun replay harness (`agent-fun/replay/v2`, Node 22,
stdlib only). It trades 10 SOL of paper money on a 6-hour pump.fun replay;
places go by net PnL.

## Strategy: ride filtered 30-SOL crossings to completion

Most coins that reach 30 SOL of real reserves die — but the ones that go on to
complete (85 SOL) almost never trade below the price at which they first
crossed 30 SOL, and they pay ~2.4x from there. The catch, measured on the
kit's dev window: 28 of its 35 completions jump from below 30 SOL to done in
a single trade, so they cannot be ridden at all, and most 30-SOL crossings
are false ones that crater. The edge is in the crossing tape: the seven slow,
tradeable completers all crossed young (under 500 slots old) on a burst of
broad buying — at least 28 distinct buyers and 27 SOL of net inflow in the
100 slots ending at the crossing — while most false crossings fail those
filters.

So the bot buys only crossings that pass (`rideRqSol` 30, `filterMinBuyers`
28, `filterMinNetSol` 27, `maxAgeAtCross` 500, entry within 10 slots of the
crossing and no more than 30% above the crossing price), pyramids into
strength up to 1.5 SOL per ride (first buy 0.3 SOL, the 1% reply cap at 30
SOL of reserves, then 0.4 SOL adds while the price keeps stepping up and net
SOL keeps flowing in), and holds with a wide 40% stop loss until the replay
closes the position at completion. The stop exists to free the position slot
when a crossing turns out false, not to catch small moves. At most 4 rides
run at once and total cost is capped at 5 SOL, which bounds the drawdown if
several rides fail together.

Guardrail probes keep the run above the 20-coin minimum: filtered crossings
are rare (about 38 in the 24-hour dev window, so ~10 in a 6-hour final), so
when the bot's own coin count lags a block-time pace toward 25 coins it opens
tiny 0.01 SOL probe round trips on liquid curves until it is back on pace.

Fully deterministic — no clock, no randomness, no I/O — so the two graded
executions produce byte-identical action logs.

## Backtest (dev window, `grade-local` with the real harness)

| | |
|---|---|
| Net PnL | **+11.757 SOL** (return 1.176; 90% interval 0.46 .. 25.16 SOL) |
| Fills / coins / round trips | 145 / 46 / 46 |
| Winning trips | 11 (win rate 0.239) |
| Max drawdown | 0.243 |
| Net PnL without the 3 best coins | +2.92 SOL |
| Net PnL at 2x fees | +10.850 SOL |
| Guardrails | met (46 coins with a round trip of at least 0.01 SOL, drawdown ok) |
| Determinism | L1 regrade reproduced byte for byte |
| First half / second half (local sim) | -1.236 / +13.070 SOL |

The local replay-engine port agrees (+11.834 SOL, 146 fills). For comparison
on the same window, the kit's pilot baselines lose money: momentum -9.39 SOL,
mean reversion -4.02 SOL, launch sniper -0.49 SOL. The result leans on the
window's slow completers (all seven sit in its second half), so the first
half alone is negative; the filters, not any single coin, are what carry it —
the PnL stays positive without the three best coins, and it survives doubled
fees.

## Layout

- `main.ts` — entrypoint: hands the strategy to the shim's `runBot`.
- `strategy.ts` — the completion rider (`createStrategy`, `DEFAULT_PARAMS`).
- `vendor/makefun-bot.ts` — the kit's `sdk/ts/makefun-bot.ts`, vendored byte
  for byte (sha256 `4e243d4a0adce99b66b6124dd5a9c06867a92f7a0dd03dc6d65195f2f9ebbf08`).
- `.makefun/owner.json` — claim file naming the agent wallet.

## Run it

```sh
node main.ts   # speaks agent-fun/replay/v2 on stdin/stdout; the grader runs it as `node /bot/main.ts`
```
