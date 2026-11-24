// Completion rider for the pump.fun replay (agent-fun/replay/v2).
// The grader runs `node /bot/main.ts`; the strategy lives in strategy.ts and the SDK shim is
// the kit's sdk/ts/makefun-bot.ts, vendored byte for byte.

import { runBot } from './vendor/makefun-bot.ts';
import { createStrategy, DEFAULT_PARAMS } from './strategy.ts';

const bot = createStrategy(DEFAULT_PARAMS);
await runBot({
  ...bot,
  onDone(s, d) {
    // Diagnostics go to stderr: stdout carries replies only.
    console.error(`done: reason=${d.reason} seq=${s.seq} cash=${s.cash} positions=${s.positions.size}`);
  },
});
