import { AwsClient } from 'aws4fetch'
import { Bindings } from '../config'
import { R2Bucket } from '@cloudflare/workers-types'

// TODO: could do this if ImageKey has a special format
// type ImageKey = string & {
//   __brand: "ImageKey"
// }

export class ImageBucketClient {
  private r2: R2Bucket
  private awsClient: AwsClient
  private bucketName: string
  private accountId: string

  constructor(env: Bindings) {
    this.r2 = env.R2
    this.awsClient = new AwsClient({
      accessKeyId: env.NCSUGUESSR_R2_ACCESS_KEY_ID,
      secretAccessKey: env.NCSUGUESSR_R2_SECRET_ACCESS_KEY,
    })
    this.bucketName = env.R2_BUCKET_NAME
    this.accountId = env.ACCOUNT_ID
  }

  async generateGetPresignedUrl(
    imageKey: string,
    expiresInSeconds: number = 3600
  ): Promise<string> {
    const url = new URL(
      `https://${this.bucketName}.${this.accountId}.r2.cloudflarestorage.com/${imageKey}`
    )

    url.searchParams.set('X-Amz-Expires', expiresInSeconds.toString())

    const signed = await this.awsClient.sign(
      new Request(url, { method: 'GET' }),
      {
        aws: { signQuery: true },
      }
    )

    return signed.url
  }

  async putImage(imageKey: string, image: File): Promise<void> {
    const imageContent = await image.arrayBuffer()

    await this.r2.put(imageKey, imageContent, {
      httpMetadata: { contentType: image.type },
    })
  }

  async deleteImage(imageKey: string): Promise<void> {
    await this.r2.delete(imageKey)
  }
}
