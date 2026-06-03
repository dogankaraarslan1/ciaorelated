declare namespace NodeJS {
  interface ProcessEnv {
    EXPO_PUBLIC_API_URL?: string;
    EXPO_PUBLIC_WEBSITE_URL?: string;
    EXPO_PUBLIC_ONELINK_URL?: string;
    EXPO_PUBLIC_APP_SCHEME?: string;
  }
}

declare var process: {
  env: NodeJS.ProcessEnv;
};
