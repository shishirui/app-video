import React from "react";
import { Composition, getInputProps } from "remotion";
import { AppPromotionVideo, getCompositionDimensions } from "./compositions/AppPromotion.js";
import { AppVideoConfig } from "./config/schema.js";

// 默认配置 
const DEFAULT_CONFIG: AppVideoConfig = {
  appName: "示例应用",
  icon: "",
  tagline: "示例应用标语",
  screens: [],
  qr: "",
  features: ["功能1", "功能2", "功能3"],
  fps: 30,
  duration: 8,
  output: ["9x16", "1x1", "16x9"],
  locale: "zh-CN",
  voiceover: false,
};

interface RootProps {
  config?: AppVideoConfig;
  aspectRatio?: "9x16" | "1x1" | "16x9";
}

export const Root: React.FC<RootProps> = () => {
  // 从 Remotion 的 inputProps 中获取配置
  const inputProps = getInputProps() as { config?: AppVideoConfig } | null;
  const config = inputProps?.config || DEFAULT_CONFIG;
  
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
            component={AppPromotionVideo as any}
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
