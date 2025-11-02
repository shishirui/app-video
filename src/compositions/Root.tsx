import React from "react";
import { Composition } from "remotion";
import { AppPromotionVideo, getCompositionDimensions } from "./AppPromotion.js";
import { AppVideoConfig, AspectRatio } from "../config/schema.js";

interface RootProps {
  config: AppVideoConfig;
}

export const Root: React.FC<RootProps> = ({ config }) => {
  return (
    <>
      {config.output.map((aspectRatio) => {
        const dimensions = getCompositionDimensions(aspectRatio);

        return (
          <Composition
            key={aspectRatio}
            id={`AppPromotionVideo-${aspectRatio}`}
            component={AppPromotionVideo as any}
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
