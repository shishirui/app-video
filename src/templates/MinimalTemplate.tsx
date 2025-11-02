import React from "react";
import { AbsoluteFill, Img, useCurrentFrame, interpolate, Easing, useVideoConfig } from "remotion";
import { TemplateProps } from "./types.js";

export const MinimalTemplate: React.FC<TemplateProps> = ({
  config,
  aspectRatio,
}) => {
  const frame = useCurrentFrame();
  const videoConfig = useVideoConfig();
  const { width, height } = videoConfig;
  const fps = config.fps;

  // 简洁的动画时间点
  const iconStartFrame = fps * 0.5;
  const titleStartFrame = fps * 1.2;
  const qrStartFrame = fps * 2.0;

  // 图标淡入
  const iconOpacity = interpolate(
    frame,
    [iconStartFrame - fps * 0.5, iconStartFrame],
    [0, 1],
    {
      easing: Easing.ease,
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const iconScale = interpolate(
    frame,
    [iconStartFrame - fps * 0.5, iconStartFrame],
    [0.8, 1],
    {
      easing: Easing.out(Easing.cubic),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  // 标题淡入
  const titleOpacity = interpolate(
    frame,
    [titleStartFrame - fps * 0.4, titleStartFrame],
    [0, 1],
    {
      easing: Easing.ease,
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  // 二维码淡入
  const qrOpacity = interpolate(
    frame,
    [qrStartFrame - fps * 0.4, qrStartFrame],
    [0, 1],
    {
      easing: Easing.ease,
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  // 简约模板的固定颜色方案
  const brandColor = "#3B82F6";
  const backgroundColor = "#FFFFFF";

  return (
    <AbsoluteFill
      style={{
        backgroundColor: backgroundColor,
        fontFamily: "'SF Pro Display', 'PingFang SC', 'Microsoft YaHei', sans-serif",
      }}
    >
      {/* 简洁的背景 */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `linear-gradient(180deg, ${backgroundColor} 0%, ${brandColor}10 100%)`,
        }}
      />

      {/* 应用图标 - 简洁圆角 */}
      <div
        style={{
          opacity: iconOpacity,
          transform: `scale(${iconScale})`,
          position: "absolute",
          top: `${height * 0.25}px`,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 10,
        }}
      >
        <div
          style={{
            width: `${width * 0.35}px`,
            height: `${width * 0.35}px`,
            borderRadius: `${width * 0.08}px`,
            overflow: "hidden",
            boxShadow: `0 20px 60px rgba(0, 0, 0, 0.15)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#f5f5f5",
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
                color: brandColor,
                fontSize: "48px",
                fontWeight: "bold",
              }}
            >
              App
            </div>
          )}
        </div>
      </div>

      {/* 应用名称 - 简洁字体 */}
      <div
        style={{
          opacity: titleOpacity,
          position: "absolute",
          top: `${height * 0.52}px`,
          left: 0,
          right: 0,
          textAlign: "center",
          zIndex: 10,
          padding: "0 40px",
        }}
      >
        <h1
          style={{
            fontSize: Math.min(width * 0.12, 72),
            fontWeight: "600",
            color: "#1a1a1a",
            margin: 0,
            lineHeight: 1.2,
          }}
        >
          {config.appName}
        </h1>
      </div>

      {/* 二维码 - 纯净设计 */}
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
          gap: `${height * 0.025}px`,
          zIndex: 5,
        }}
      >
        {/* QR 容器 */}
        <div
          style={{
            width: `${width * 0.28}px`,
            aspectRatio: "1",
            padding: `${width * 0.025}px`,
            backgroundColor: "white",
            borderRadius: `${width * 0.025}px`,
            boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
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
                color: "#ccc",
                fontSize: "16px",
                fontWeight: "500",
              }}
            >
              QR Code
            </div>
          )}
        </div>

        {/* 下载提示 - 简约文字 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <p
            style={{
              fontSize: Math.min(width * 0.055, 28),
              color: brandColor,
              fontWeight: "600",
              margin: 0,
            }}
          >
            扫码下载
          </p>
        </div>
      </div>
    </AbsoluteFill>
  );
};
