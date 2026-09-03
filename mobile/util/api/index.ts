import { Platform } from 'react-native'

const DEFAULT_API_URL =
  'https://ncsuguessr-api-staging.ncsuappdevelopmentclub.workers.dev'

export const API_URL =
  process.env.EXPO_PUBLIC_API_URL ||
  (Platform.OS === 'web' ? '' : DEFAULT_API_URL)
