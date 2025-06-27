import arcjet, {
  fixedWindow,
  detectBot,
  shield,
  slidingWindow,
  sensitiveInfo,
} from "@arcjet/next";
import { env } from "./env";

export { fixedWindow, detectBot, shield, slidingWindow, sensitiveInfo };

export default arcjet({
  key: env.ARCJET_KEY!,
  characteristics: ["fingerprint"],
  rules: [
    // This rule is live
    shield({
      mode: "LIVE",
    }),
  ],
});
