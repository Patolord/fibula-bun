// convex/status.ts
import { query } from "./_generated/server";

export const getStatus = query({
  args: {},
  handler: async (ctx) => {
    return "Connected!";
  },
});