/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** AI 分析用サーバーエンドポイント（未設定ならキーワード分析のみ） */
  readonly VITE_AI_ENDPOINT?: string;
}
