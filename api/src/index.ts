import { Hono } from "hono";
import { imagesRouter } from "./routes/images";
import { gamesRouter } from "./routes/games";
import { Bindings } from "./config";

// TODO: logging

const app = new Hono<{ Bindings: Bindings }>();

app.route("/images", imagesRouter);
app.route("/games", gamesRouter);

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

export default app;
