import { D1Database, R2Bucket } from '@cloudflare/workers-types'

export type Bindings = {
  // resource bindings:
  R2: R2Bucket
  D1: D1Database
  // vars:
  ENVIRONMENT: 'staging' | 'prod'
  R2_BUCKET_NAME: string
  // secrets:
  NCSUGUESSR_R2_ACCESS_KEY_ID: string
  NCSUGUESSR_R2_SECRET_ACCESS_KEY: string
  ACCOUNT_ID: string
  ADMIN_TOKEN: string
}
