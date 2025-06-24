interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_LT_URL: string;
  readonly VITE_WS_URL: string;
  readonly VITE_ALLOWED_HOSTS: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
