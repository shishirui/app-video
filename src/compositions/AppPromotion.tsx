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
  const iconStartFrame = fps * 0.3;
  const titleStartFrame = fps * 0.8;
  const qrStartFrame = fps * 1.5;

  // 淡入淡出动画
  const iconOpacity = interpolate(
    frame,
    [iconStartFrame - fps * 0.3, iconStartFrame],
    [0, 1],
    {
      easing: Easing.inOut(Easing.ease),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const iconScale = interpolate(
    frame,
    [iconStartFrame - fps * 0.3, iconStartFrame],
    [0.8, 1],
    {
      easing: Easing.out(Easing.back(1.5)),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const titleOpacity = interpolate(
    frame,
    [titleStartFrame - fps * 0.3, titleStartFrame],
    [0, 1],
    {
      easing: Easing.inOut(Easing.ease),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const qrOpacity = interpolate(
    frame,
    [qrStartFrame - fps * 0.3, qrStartFrame],
    [0, 1],
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

      {/* 应用图标 */}
      <div
        style={{
          opacity: iconOpacity,
          transform: `scale(${iconScale})`,
          position: "absolute",
          top: `${height * 0.2}px`,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          zIndex: 10,
        }}
      >
        <div
          style={{
            width: `${width * 0.35}px`,
            height: `${width * 0.35}px`,
            borderRadius: `${width * 0.08}px`,
            overflow: "hidden",
            boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
            backgroundColor: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {config.icon && config.icon.length > 0 ? (
            <Img
              src={config.icon}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          ) : (
            <div
              style={{
                textAlign: "center",
                color: "#999",
                fontSize: "24px",
              }}
            >
              Icon
            </div>
          )}
        </div>
      </div>

      {/* 应用名称 */}
      <div
        style={{
          opacity: titleOpacity,
          position: "absolute",
          top: `${height * 0.5}px`,
          left: 0,
          right: 0,
          textAlign: "center",
          zIndex: 10,
        }}
      >
        <h1
          style={{
            fontSize: Math.min(width * 0.14, 80),
            fontWeight: "bold",
            color: theme.brandColor,
            margin: 0,
            lineHeight: 1.2,
            textShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          {config.appName}
        </h1>
      </div>

      {/* 二维码 */}
      <div
        style={{
          opacity: qrOpacity,
          position: "absolute",
          bottom: `${height * 0.15}px`,
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
            width: `${width * 0.3}px`,
            aspectRatio: "1",
            padding: `${width * 0.02}px`,
            backgroundColor: "white",
            borderRadius: `${width * 0.03}px`,
            boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {config.qr && config.qr.length > 0 ? (
            <Img
              src={config.qr}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
              }}
            />
          ) : (
            <div
              style={{
                textAlign: "center",
                color: "#999",
                fontSize: "14px",
              }}
            >
              QR Code
            </div>
          )}
        </div>
        <p
          style={{
            fontSize: Math.min(width * 0.055, 32),
            color: theme.brandColor,
            fontWeight: "bold",
            margin: 0,
            textShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          扫码下载
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
