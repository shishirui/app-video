import React from "react";
import { Composition } from "remotion";
import { AppPromotionVideo, getCompositionDimensions } from "./AppPromotion.js";
import { AppVideoConfig } from "../config/schema.js";

interface RootProps {
  config: AppVideoConfig;
}

export const Root: React.FC<RootProps> = ({ config }) => {
  return (
    <>
      {config.output.map((aspectRatio) => {
        const dimensions = getCompositionDimensions(
          aspectRatio as "9x16" | "1x1" | "16x9"
        );

        return (
          <Composition
            key={aspectRatio}
            id={`AppPromotionVideo_${aspectRatio}`}
            component={AppPromotionVideo as any}
            durationInFrames={config.duration * config.fps}
            fps={config.fps}
            width={dimensions.width}
            height={dimensions.height}
            defaultProps={{
              config,
              aspectRatio: aspectRatio as "9x16" | "1x1" | "16x9",
            }}
          />
        );
      })}
    </>
  );
};
