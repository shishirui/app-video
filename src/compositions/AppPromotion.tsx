import React from "react";
import { AbsoluteFill, Img, useCurrentFrame, interpolate, Easing, useVideoConfig } from "remotion";
import { AppVideoConfig, AspectRatio } from "../config/schema.js";

interface AppPromotionVideoProps {
  config: AppVideoConfig;
  aspectRatio: AspectRatio;
}

export const AppPromotionVideo: React.FC<AppPromotionVideoProps> = ({
  config,
  aspectRatio,
}) => {
  const frame = useCurrentFrame();
  const videoConfig = useVideoConfig();
  const { width, height } = videoConfig;
  const fps = config.fps;
  const duration = config.duration * fps;

  // 动画时间点
  const iconStartFrame = fps * 0.3;
  const titleStartFrame = fps * 1.0;
  const qrStartFrame = fps * 1.8;

  // 图标动画 - 3D 弹跳效果（更慢）
  const iconOpacity = interpolate(
    frame,
    [iconStartFrame - fps * 0.8, iconStartFrame],
    [0, 1],
    {
      easing: Easing.out(Easing.cubic),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const iconScale = interpolate(
    frame,
    [iconStartFrame - fps * 0.8, iconStartFrame, iconStartFrame + fps * 0.3],
    [0.3, 1.1, 1],
    {
      easing: Easing.out(Easing.back(1.8)),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  // 图标入场旋转 - 只播放一次（更慢）
  const iconRotate = interpolate(
    frame,
    [iconStartFrame - fps * 0.8, iconStartFrame],
    [-10, 0],
    {
      easing: Easing.out(Easing.ease),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  // 标题动画 - 滑入效果
  const titleOpacity = interpolate(
    frame,
    [titleStartFrame - fps * 0.3, titleStartFrame],
    [0, 1],
    {
      easing: Easing.out(Easing.cubic),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const titleY = interpolate(
    frame,
    [titleStartFrame - fps * 0.3, titleStartFrame],
    [50, 0],
    {
      easing: Easing.out(Easing.cubic),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  // 二维码动画 - 缩放淡入
  const qrOpacity = interpolate(
    frame,
    [qrStartFrame - fps * 0.3, qrStartFrame],
    [0, 1],
    {
      easing: Easing.out(Easing.ease),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const qrScale = interpolate(
    frame,
    [qrStartFrame - fps * 0.3, qrStartFrame],
    [0.8, 1],
    {
      easing: Easing.out(Easing.back(1.2)),
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  // 固定颜色方案
  const brandColor = "#3B82F6";

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#0F0F1E",
        fontFamily: "'Inter', 'SF Pro Display', 'PingFang SC', 'Microsoft YaHei', sans-serif",
      }}
    >
      {/* 静态渐变背景 */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 20% 30%, ${brandColor}40 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, #8B5CF640 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, #EC489940 0%, transparent 70%),
            linear-gradient(135deg, #0F0F1E 0%, #1a1a2e 100%)
          `,
        }}
      />

      {/* 网格背景 */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            linear-gradient(${brandColor}10 1px, transparent 1px),
            linear-gradient(90deg, ${brandColor}10 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
          opacity: 0.3,
        }}
      />

      {/* 应用图标 - Glassmorphism & 3D 效果 */}
      <div
        style={{
          opacity: iconOpacity,
          transform: `scale(${iconScale}) rotate(${iconRotate}deg)`,
          position: "absolute",
          top: `${height * 0.18}px`,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          zIndex: 10,
          perspective: "1000px",
        }}
      >
        {/* 发光外环 */}
        <div
          style={{
            position: "absolute",
            width: `${width * 0.5}px`,
            height: `${width * 0.5}px`,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${brandColor}60 0%, transparent 70%)`,
            filter: "blur(30px)",
            animation: "pulse 2s infinite",
          }}
        />
        
        {/* 玻璃态图标容器 */}
        <div
          style={{
            position: "relative",
            width: `${width * 0.45}px`,
            height: `${width * 0.45}px`,
            borderRadius: `${width * 0.1}px`,
            overflow: "hidden",
            background: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(10px)",
            border: "2px solid rgba(255, 255, 255, 0.2)",
            boxShadow: `
              0 8px 32px 0 rgba(31, 38, 135, 0.37),
              0 0 0 1px rgba(255, 255, 255, 0.1),
              inset 0 0 20px rgba(255, 255, 255, 0.05),
              0 30px 80px ${brandColor}40
            `,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* 高光效果 */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "50%",
              background: "linear-gradient(180deg, rgba(255,255,255,0.2) 0%, transparent 100%)",
              borderRadius: `${width * 0.1}px ${width * 0.1}px 0 0`,
            }}
          />
          
          {config.icon && config.icon.length > 0 ? (
            <Img
              src={config.icon}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                filter: "brightness(1.1) contrast(1.05)",
              }}
            />
          ) : (
            <div
              style={{
                textAlign: "center",
                color: "#fff",
                fontSize: "32px",
                fontWeight: "bold",
              }}
            >
              App
            </div>
          )}
        </div>
      </div>

      {/* 应用名称 - 简洁白色字体 */}
      <div
        style={{
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
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
            fontWeight: "700",
            color: "#FFFFFF",
            margin: 0,
            lineHeight: 1.2,
            letterSpacing: "-0.02em",
          }}
        >
          {config.appName}
        </h1>
      </div>

      {/* 二维码 - 简洁设计 */}
      <div
        style={{
          opacity: qrOpacity,
          transform: `scale(${qrScale})`,
          position: "absolute",
          bottom: `${height * 0.12}px`,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: `${height * 0.02}px`,
          zIndex: 5,
        }}
      >
        {/* QR 容器 - 无外框 */}
        <div
          style={{
            width: `${width * 0.3}px`,
            aspectRatio: "1",
            padding: `${width * 0.02}px`,
            backgroundColor: "white",
            borderRadius: `${width * 0.03}px`,
            boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
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
                fontSize: "18px",
                fontWeight: "600",
              }}
            >
              QR Code
            </div>
          )}
        </div>

        {/* 下载提示 - 现代按钮样式 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "12px 32px",
            background: `linear-gradient(135deg, ${brandColor} 0%, #8B5CF6 100%)`,
            borderRadius: "50px",
            boxShadow: `
              0 10px 30px ${brandColor}60,
              0 0 0 1px rgba(255, 255, 255, 0.2),
              inset 0 1px 0 rgba(255, 255, 255, 0.3)
            `,
          }}
        >
          {/* 下载图标 */}
          <svg
            width={Math.min(width * 0.06, 28)}
            height={Math.min(width * 0.06, 28)}
            viewBox="0 0 24 24"
            fill="none"
            style={{
              filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))",
            }}
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
              fontSize: Math.min(width * 0.06, 30),
              color: "white",
              fontWeight: "800",
              margin: 0,
              textShadow: "0 2px 8px rgba(0,0,0,0.2)",
              letterSpacing: "0.05em",
            }}
          >
            扫码下载
          </p>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const getCompositionDimensions = (aspectRatio: AspectRatio) => {
  switch (aspectRatio) {
    case "9x16":
      return { width: 1080, height: 1920 };
    case "1x1":
      return { width: 1080, height: 1080 };
    case "16x9":
      return { width: 1920, height: 1080 };
  }
};
