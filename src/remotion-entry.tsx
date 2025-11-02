import React from "react";
import { Root } from "./compositions/Root.js";
import { AppVideoConfig } from "./config/schema.js";

// 这个文件用于 Remotion CLI
// 当 remotion render 被调用时，会使用这里的配置

let globalConfig: AppVideoConfig | null = null;

export const setAppConfig = (config: AppVideoConfig) => {
  globalConfig = config;
};

export const getAppConfig = (): AppVideoConfig => {
  if (!globalConfig) {
    throw new Error("App config not initialized");
  }
  return globalConfig;
};

export const RemotionRoot: React.FC = () => {
  const config = getAppConfig();
  return <Root config={config} />;
};
