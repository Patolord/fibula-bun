// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  players: defineTable({
    position: v.object({
      x: v.number(),
      y: v.number(),
    }),
    lastUpdate: v.number(),
    name: v.string(),
  }),
  gameState: defineTable({
    status: v.string(),
    lastUpdate: v.number(),
    activePlayers: v.number(),
  }),
});