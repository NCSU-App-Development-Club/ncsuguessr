import { AwsClient } from "aws4fetch";
import { Bindings } from "../config";

export const getReadPresignedUrl = async (env: Bindings, imageKey: string) => {
  const client = new AwsClient(
    env.ENVIRONMENT === "staging"
      ? {
          accessKeyId: env.NCSUGUESSR_STAGING_R2_ACCESS_KEY_ID,
          secretAccessKey: env.NCSUGUESSR_STAGING_R2_SECRET_ACCESS_KEY,
        }
      : {
          // TODO
          accessKeyId: "",
          secretAccessKey: "",
        }
  );

  const url = new URL(
    `https://${env.R2_BUCKET_NAME}.${env.ACCOUNT_ID}.r2.cloudflarestorage.com/${imageKey}`
  );

  url.searchParams.set("X-Amz-Expires", "3600");

  const signed = await client.sign(new Request(url, { method: "GET" }), {
    aws: { signQuery: true },
  });

  return signed.url;
};
