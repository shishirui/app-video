import React from "react";
import { Composition, Still } from "remotion";
import { AppPromotionVideo, getCompositionDimensions } from "../src/compositions/AppPromotion.js";

export const RemotionRoot: React.FC<{ config?: any; aspectRatio?: string }> = ({
  config = {},
  aspectRatio = "9x16",
}) => {
  const aspects = ["9x16", "1x1", "16x9"] as const;

  return (
    <>
      {aspects.map((aspect) => {
        const dims = getCompositionDimensions(aspect);
        return (
          <Composition
            key={aspect}
            id={`AppPromotionVideo_${aspect}`}
            component={AppPromotionVideo as any}
            durationInFrames={240}
            fps={30}
            width={dims.width}
            height={dims.height}
            defaultProps={{
              config: config || {
                appName: "Test App",
                icon: "",
                qr: "",
                fps: 30,
                duration: 8,
                locale: "zh-CN",
                output: ["9x16", "1x1", "16x9"],
                voiceover: false,
              },
              aspectRatio: aspect,
            }}
          />
        );
      })}
    </>
  );
};
