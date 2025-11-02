import React from "react";
import { Composition, getInputProps, staticFile } from "remotion";
import { getCompositionDimensions } from "./compositions/AppPromotion.js";
import { AppVideoConfig } from "./config/schema.js";
import { getTemplate } from "./templates/index.js";
import exampleConfig from "../configs/example.json";

// 从 example.json 读取默认配置
const DEFAULT_CONFIG: AppVideoConfig = exampleConfig as AppVideoConfig;

interface RootProps {
  config?: AppVideoConfig;
  aspectRatio?: "9x16" | "1x1" | "16x9";
}

export const Root: React.FC<RootProps> = () => {
  // 从 Remotion 的 inputProps 中获取配置
  // 支持两种格式：直接的配置对象，或包装在 config 属性中的对象
  const inputProps = getInputProps() as (AppVideoConfig | { config?: AppVideoConfig }) | null;
  
  let config: AppVideoConfig;
  if (inputProps && 'config' in inputProps && inputProps.config) {
    // 格式: { config: {...} }
    config = inputProps.config;
  } else if (inputProps && 'appName' in inputProps) {
    // 格式: {...} (直接的配置对象)
    config = inputProps as AppVideoConfig;
  } else {
    config = DEFAULT_CONFIG;
  }
  
  // 根据配置获取对应的模板组件
  const TemplateComponent = getTemplate(config.template || "default");
  
  const aspects: Array<"9x16" | "1x1" | "16x9"> = ["9x16", "1x1", "16x9"];

  return (
    <>
      {aspects.map((aspect) => {
        const dims = getCompositionDimensions(aspect);
        const compositionId = `AppPromotionVideo-${aspect}`;
        return (
          <Composition
            key={aspect}
            id={compositionId}
            component={TemplateComponent as any}
            durationInFrames={config.duration * config.fps}
            fps={config.fps}
            width={dims.width}
            height={dims.height}
            defaultProps={{
              config,
              aspectRatio: aspect,
            }}
          />
        );
      })}
    </>
  );
};
