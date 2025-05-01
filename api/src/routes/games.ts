import { Hono } from "hono";
import { Bindings } from "../config";

export const gamesRouter = new Hono<{ Bindings: Bindings }>();

gamesRouter.get("/", async (ctx) => {
  console.log("hi");
  return ctx.text("hi");
});
