import { existsSync } from "node:fs";
import dotenv from "dotenv";

export function loadEnv() {
  dotenv.config({ path: existsSync(".env") ? ".env" : ".env.local" });
}
