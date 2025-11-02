import React from "react";
import { Composition } from "remotion";
import { AppPromotionVideo, getCompositionDimensions } from "../src/compositions/AppPromotion";

// 示例配置
const exampleConfig = {
  appName: "Tube PiP",
  icon: "https://tubepip.com/static/images/logo.webp",
  qr: "https://www.pgyer.com/app/qrcode/oooplay",
  theme: {
    brandColor: "#3B82F6",
    backgroundColor: "#FFFFFF"
  },
  fps: 30,
  duration: 8,
  locale: "zh-CN",
  output: ["9x16", "1x1", "16x9"],
  voiceover: false,
};

export const RemotionRoot: React.FC = () => {
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
              config: exampleConfig,
              aspectRatio: aspect,
            }}
          />
        );
      })}
    </>
  );
};

// 必须使用默认导出
export default RemotionRoot;
