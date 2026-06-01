declare namespace NodeJS {
  interface ProcessEnv {
    EXPO_PUBLIC_API_URL?: string;
  }
}

declare var process: {
  env: NodeJS.ProcessEnv;
};
