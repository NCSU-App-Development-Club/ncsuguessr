import 'dotenv/config'

export default () => ({
  expo: {
    owner: 'appdevncsu',
    scheme: 'ncsuguessr',
    name: 'NCSUGuessr',
    slug: 'ncsuguessr',
    version: '0.0.1',
    orientation: 'portrait',
    icon: './assets/ncsuguessr-icon.png',
    userInterfaceStyle: 'light',
    newArchEnabled: true,
    splash: {
      image: './assets/mrwuf-icon.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'org.appdevncsu.ncsuguessr',
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
      package: 'org.appdevncsu.ncsuguessr',
      permissions: ['INTERNET'],
      config: {
        googleMaps: {
          apiKey: process.env.GOOGLE_MAPS_API_KEY,
        },
      },
    },
    web: {
      favicon: './assets/favicon.png',
      bundler: 'metro',
    },
    plugins: ['expo-router'],
    extra: {
      router: {
        origin: false,
      },
      eas: {
        projectId: 'ee047854-2920-4bfe-a221-9827962e63c8',
      },
    },
  },
})
