import React from "react";
import { Composition } from "remotion";
import { getCompositionDimensions } from "../utils/dimensions.js";
import { AppVideoConfig, AspectRatio } from "../config/schema.js";
import { getTemplate } from "../templates/index.js";

interface RootProps {
  config: AppVideoConfig;
}

export const Root: React.FC<RootProps> = ({ config }) => {
  // 根据配置获取对应的模板组件
  const TemplateComponent = getTemplate(config.template || "default");

  return (
    <>
      {config.output.map((aspectRatio) => {
        const dimensions = getCompositionDimensions(aspectRatio);

        return (
          <Composition
            key={aspectRatio}
            id={`AppPromotionVideo-${aspectRatio}`}
            component={TemplateComponent as any}
            durationInFrames={config.duration * config.fps}
            fps={config.fps}
            width={dimensions.width}
            height={dimensions.height}
            defaultProps={{
              config,
              aspectRatio,
            }}
          />
        );
      })}
    </>
  );
};
