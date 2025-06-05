declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV?: string;
    PORT?: string;
    CORS_ORIGIN?: string;
    // Add other environment variables here
  }
}
