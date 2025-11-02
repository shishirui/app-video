import React from "react";
import { AbsoluteFill, Img, useCurrentFrame, interpolate, Easing, useVideoConfig } from "remotion";
import { TemplateProps } from "./types.js";

export const ModernTemplate: React.FC<TemplateProps> = ({
  config,
  aspectRatio,
}) => {
  const frame = useCurrentFrame();
  const videoConfig = useVideoConfig();
  const { width, height } = videoConfig;
  const fps = config.fps;

  // 现代风格动画时间点
  const iconStartFrame = fps * 0.4;
  const titleStartFrame = fps * 1.0;
  const qrStartFrame = fps * 1.6;

  // 图标动画 - 从左侧滑入
  const iconOpacity = interpolate(
    frame,
    [iconStartFrame - fps * 0.6, iconStartFrame],
    [0, 1],
    {
      easing: Easing.out(Easing.cubic),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const iconX = interpolate(
    frame,
    [iconStartFrame - fps * 0.6, iconStartFrame],
    [-width * 0.3, 0],
    {
      easing: Easing.out(Easing.cubic),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  // 标题动画 - 从右侧滑入
  const titleOpacity = interpolate(
    frame,
    [titleStartFrame - fps * 0.5, titleStartFrame],
    [0, 1],
    {
      easing: Easing.out(Easing.cubic),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const titleX = interpolate(
    frame,
    [titleStartFrame - fps * 0.5, titleStartFrame],
    [width * 0.2, 0],
    {
      easing: Easing.out(Easing.cubic),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  // 二维码动画 - 向上滑入
  const qrOpacity = interpolate(
    frame,
    [qrStartFrame - fps * 0.5, qrStartFrame],
    [0, 1],
    {
      easing: Easing.out(Easing.cubic),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const qrY = interpolate(
    frame,
    [qrStartFrame - fps * 0.5, qrStartFrame],
    [height * 0.15, 0],
    {
      easing: Easing.out(Easing.cubic),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  // 现代模板的固定颜色方案 - 使用红色系霓虹风格
  const brandColor = "#FF6B6B";

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#1a1a1a",
        fontFamily: "'Inter', 'SF Pro Display', 'PingFang SC', 'Microsoft YaHei', sans-serif",
      }}
    >
      {/* 现代渐变背景 */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%),
            radial-gradient(circle at 30% 40%, ${brandColor}20 0%, transparent 60%)
          `,
        }}
      />

      {/* 装饰性线条 */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      >
        {/* 顶部线条 */}
        <div
          style={{
            position: "absolute",
            top: `${height * 0.1}px`,
            left: `${width * 0.1}px`,
            width: `${width * 0.3}px`,
            height: "3px",
            background: brandColor,
            borderRadius: "2px",
          }}
        />
        {/* 底部线条 */}
        <div
          style={{
            position: "absolute",
            bottom: `${height * 0.08}px`,
            right: `${width * 0.1}px`,
            width: `${width * 0.25}px`,
            height: "3px",
            background: brandColor,
            borderRadius: "2px",
          }}
        />
      </div>

      {/* 应用图标 - 带霓虹边框 */}
      <div
        style={{
          opacity: iconOpacity,
          transform: `translateX(${iconX}px)`,
          position: "absolute",
          top: `${height * 0.22}px`,
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
            position: "relative",
            width: `${width * 0.4}px`,
            height: `${width * 0.4}px`,
            borderRadius: `${width * 0.09}px`,
            overflow: "hidden",
            border: `3px solid ${brandColor}`,
            boxShadow: `
              0 0 30px ${brandColor}60,
              0 0 60px ${brandColor}30,
              0 20px 40px rgba(0, 0, 0, 0.5)
            `,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#2a2a2a",
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
                fontSize: "52px",
                fontWeight: "bold",
              }}
            >
              App
            </div>
          )}
        </div>
      </div>

      {/* 应用名称 - 现代渐变字体 */}
      <div
        style={{
          opacity: titleOpacity,
          transform: `translateX(${titleX}px)`,
          position: "absolute",
          top: `${height * 0.54}px`,
          left: 0,
          right: 0,
          textAlign: "center",
          zIndex: 10,
          padding: "0 40px",
        }}
      >
        <h1
          style={{
            fontSize: Math.min(width * 0.13, 76),
            fontWeight: "800",
            background: `linear-gradient(135deg, ${brandColor} 0%, #ffffff 100%)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            margin: 0,
            lineHeight: 1.2,
            letterSpacing: "-0.03em",
            textShadow: `0 0 40px ${brandColor}40`,
          }}
        >
          {config.appName}
        </h1>
      </div>

      {/* 二维码 - 现代卡片 */}
      <div
        style={{
          opacity: qrOpacity,
          transform: `translateY(${qrY}px)`,
          position: "absolute",
          bottom: `${height * 0.12}px`,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: `${height * 0.025}px`,
          zIndex: 5,
        }}
      >
        {/* QR 容器 - 霓虹边框 */}
        <div
          style={{
            width: `${width * 0.32}px`,
            aspectRatio: "1",
            padding: `${width * 0.03}px`,
            backgroundColor: "#2a2a2a",
            borderRadius: `${width * 0.04}px`,
            border: `2px solid ${brandColor}`,
            boxShadow: `
              0 0 20px ${brandColor}50,
              0 10px 30px rgba(0,0,0,0.5)
            `,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: "white",
              borderRadius: `${width * 0.02}px`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {config.qr && config.qr.length > 0 ? (
              <Img
                src={config.qr}
                style={{
                  width: "92%",
                  height: "92%",
                  objectFit: "contain",
                }}
              />
            ) : (
              <div
                style={{
                  textAlign: "center",
                  color: "#999",
                  fontSize: "18px",
                  fontWeight: "600",
                }}
              >
                QR Code
              </div>
            )}
          </div>
        </div>

        {/* 下载提示 - 霓虹效果 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "10px 28px",
            background: `linear-gradient(135deg, ${brandColor} 0%, ${brandColor}CC 100%)`,
            borderRadius: "8px",
            border: `1px solid ${brandColor}`,
            boxShadow: `
              0 0 20px ${brandColor}60,
              0 5px 15px rgba(0,0,0,0.4)
            `,
          }}
        >
          <svg
            width={Math.min(width * 0.055, 26)}
            height={Math.min(width * 0.055, 26)}
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M12 3v12m0 0l-4-4m4 4l4-4M3 16v3a2 2 0 002 2h14a2 2 0 002-2v-3"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          
          <p
            style={{
              fontSize: Math.min(width * 0.058, 28),
              color: "white",
              fontWeight: "700",
              margin: 0,
              letterSpacing: "0.03em",
            }}
          >
            扫码下载
          </p>
        </div>
      </div>
    </AbsoluteFill>
  );
};
