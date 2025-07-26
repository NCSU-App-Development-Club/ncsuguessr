import AsyncStorage from '@react-native-async-storage/async-storage'
import z, { ZodType } from 'zod'

export class LocalStore<T extends ZodType> {
  constructor(
    private readonly schema: T,
    private readonly key: string
  ) {}

  async getItem(): Promise<z.infer<T> | null> {
    const stringData = await AsyncStorage.getItem(this.key)

    if (stringData === null) {
      return null
    }

    const jsonData = JSON.parse(stringData)

    return this.schema.parse(jsonData)
  }

  async setItem(item: z.infer<T>): Promise<void> {
    const stringData = JSON.stringify(item)
    await AsyncStorage.setItem(this.key, stringData)
  }

  async removeItem(): Promise<void> {
    await AsyncStorage.removeItem(this.key)
  }
}
