import React from "react";
import { AbsoluteFill, Img, useCurrentFrame, interpolate, Easing } from "remotion";
import { AppVideoConfig } from "../config/schema.js";

interface AppPromotionVideoProps {
  config: AppVideoConfig;
  aspectRatio: "9x16" | "1x1" | "16x9";
}

export const AppPromotionVideo: React.FC<AppPromotionVideoProps> = ({
  config,
  aspectRatio,
}) => {
  const frame = useCurrentFrame();
  const fps = config.fps;
  const duration = config.duration * fps;

  // 动画时间点
  const titleStartFrame = fps * 0.5;
  const titleEndFrame = fps * 2;
  const featuresStartFrame = fps * 2.5;
  const featuresEndFrame = fps * 5;
  const qrStartFrame = fps * 5.5;
  const qrEndFrame = fps * 8;

  // 淡入淡出动画
  const titleOpacity = interpolate(
    frame,
    [titleStartFrame - fps * 0.5, titleStartFrame, titleEndFrame],
    [0, 1, 1],
    {
      easing: Easing.inOut(Easing.ease),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const featuresOpacity = interpolate(
    frame,
    [featuresStartFrame - fps * 0.3, featuresStartFrame, featuresEndFrame],
    [0, 1, 1],
    {
      easing: Easing.inOut(Easing.ease),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const qrOpacity = interpolate(
    frame,
    [qrStartFrame - fps * 0.3, qrStartFrame, qrEndFrame],
    [0, 1, 1],
    {
      easing: Easing.inOut(Easing.ease),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  // 根据宽高比计算尺寸
  const getDimensions = () => {
    switch (aspectRatio) {
      case "9x16":
        return { width: 1080, height: 1920 };
      case "1x1":
        return { width: 1080, height: 1080 };
      case "16x9":
        return { width: 1920, height: 1080 };
    }
  };

  const { width, height } = getDimensions();
  const theme = config.theme || {
    brandColor: "#3B82F6",
    backgroundColor: "#FFFFFF",
  };

  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme.backgroundColor,
        fontFamily: "'Segoe UI', 'Microsoft YaHei', sans-serif",
      }}
    >
      {/* 背景渐变 */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `linear-gradient(135deg, ${theme.brandColor}15 0%, ${theme.brandColor}05 100%)`,
        }}
      />

      {/* 标题部分 */}
      <div
        style={{
          opacity: titleOpacity,
          position: "absolute",
          top: `${height * 0.1}px`,
          left: 0,
          right: 0,
          textAlign: "center",
          zIndex: 10,
        }}
      >
        <h1
          style={{
            fontSize: Math.min(width * 0.12, 72),
            fontWeight: "bold",
            color: theme.brandColor,
            margin: 0,
            lineHeight: 1.2,
          }}
        >
          {config.appName}
        </h1>
        <p
          style={{
            fontSize: Math.min(width * 0.06, 40),
            color: "#666666",
            margin: `${height * 0.02}px 0 0 0`,
            fontWeight: 500,
          }}
        >
          {config.tagline}
        </p>
      </div>

      {/* 应用截图走廊 */}
      <div
        style={{
          opacity: featuresOpacity,
          position: "absolute",
          top: `${height * 0.28}px`,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          gap: `${width * 0.05}px`,
          paddingLeft: `${width * 0.05}px`,
          paddingRight: `${width * 0.05}px`,
          zIndex: 5,
        }}
      >
        {config.screens.slice(0, 3).map((screen, idx) => (
          <div
            key={idx}
            style={{
              width: `${width * 0.25}px`,
              aspectRatio: "9/16",
              borderRadius: `${width * 0.03}px`,
              overflow: "hidden",
              boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
              transform: `translateY(${Math.sin(frame * 0.02 + idx) * 10}px)`,
            }}
          >
            <Img src={screen} style={{ width: "100%", height: "100%" }} />
          </div>
        ))}
      </div>

      {/* 特性列表 */}
      <div
        style={{
          opacity: featuresOpacity,
          position: "absolute",
          top: `${height * 0.65}px`,
          left: `${width * 0.1}px`,
          right: `${width * 0.1}px`,
          zIndex: 5,
        }}
      >
        {config.features.slice(0, 3).map((feature, idx) => (
          <div
            key={idx}
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: `${height * 0.04}px`,
            }}
          >
            <div
              style={{
                width: `${width * 0.04}px`,
                height: `${width * 0.04}px`,
                borderRadius: "50%",
                backgroundColor: theme.brandColor,
                marginRight: `${width * 0.03}px`,
              }}
            />
            <span
              style={{
                fontSize: Math.min(width * 0.05, 32),
                color: "#333333",
                fontWeight: 500,
              }}
            >
              {feature}
            </span>
          </div>
        ))}
      </div>

      {/* 二维码和下载提示 */}
      <div
        style={{
          opacity: qrOpacity,
          position: "absolute",
          bottom: `${height * 0.1}px`,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: `${height * 0.02}px`,
          zIndex: 5,
        }}
      >
        <div
          style={{
            width: `${width * 0.25}px`,
            aspectRatio: "1",
            padding: `${width * 0.01}px`,
            backgroundColor: "white",
            borderRadius: `${width * 0.02}px`,
            boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
          }}
        >
          <Img
            src={config.qr}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
            }}
          />
        </div>
        <p
          style={{
            fontSize: Math.min(width * 0.05, 28),
            color: theme.brandColor,
            fontWeight: "bold",
            margin: 0,
          }}
        >
          立即下载
        </p>
      </div>
    </AbsoluteFill>
  );
};

export const getCompositionDimensions = (aspectRatio: "9x16" | "1x1" | "16x9") => {
  switch (aspectRatio) {
    case "9x16":
      return { width: 1080, height: 1920 };
    case "1x1":
      return { width: 1080, height: 1080 };
    case "16x9":
      return { width: 1920, height: 1080 };
  }
};
