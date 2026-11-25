// Completion rider for the pump.fun replay (agent-fun/replay/v2).
// The grader runs `node /bot/main.ts`; the strategy lives in strategy.ts and the SDK shim is
// the kit's sdk/ts/makefun-bot.ts, vendored byte for byte.

import { runBot } from './vendor/makefun-bot.ts';
import { createStrategy, DEFAULT_PARAMS } from './strategy.ts';

const bot = createStrategy(DEFAULT_PARAMS);

// Startup line goes to stderr: stdout carries protocol replies only, so this cannot
// disturb the action log. It names the ride the bot is configured to take.
console.error(
  `completion-rider: ride ${DEFAULT_PARAMS.rideRqSol} SOL, ` +
    `filters ${DEFAULT_PARAMS.filterMinBuyers} buyers / ${DEFAULT_PARAMS.filterMinNetSol} SOL net / ` +
    `${DEFAULT_PARAMS.maxAgeAtCross} slots, stake ${DEFAULT_PARAMS.stakeSol} SOL, ` +
    `stop ${Math.round(DEFAULT_PARAMS.stopLoss * 100)}%`,
);

await runBot({
  ...bot,
  onDone(s, d) {
    // Diagnostics go to stderr: stdout carries replies only.
    console.error(`done: reason=${d.reason} seq=${s.seq} cash=${s.cash} positions=${s.positions.size}`);
  },
});
