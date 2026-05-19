/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly RESEND_API_KEY: string;
  readonly INQUIRY_TO?: string;
  readonly RESEND_FROM?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
