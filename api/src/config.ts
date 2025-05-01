import { D1Database, R2Bucket } from "@cloudflare/workers-types";

export type Bindings = { STAGING_R2: R2Bucket; STAGING_D1: D1Database };
