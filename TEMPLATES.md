# 视频模板系统

## 概述

现在系统支持多套视频模板！您可以在配置文件中指定使用哪一套模板来生成视频。

## 可用模板

### 1. default (默认模板)
现代化的玻璃态设计，带有：
- 3D 弹跳动画效果
- 渐变背景和网格装饰
- 玻璃态图标容器
- 霓虹发光效果
- 现代化的下载按钮

适合：需要炫酷效果的现代应用

### 2. minimal (简约模板)
简洁清爽的设计风格，带有：
- 简单的淡入动画
- 纯色渐变背景
- 简约的圆角图标
- 纯净的设计元素

适合：追求简洁美观的应用

### 3. modern (现代霓虹模板)
科技感十足的霓虹风格，带有：
- 滑入式动画效果
- 深色背景配合霓虹边框
- 渐变色文字
- 装饰性线条元素
- 霓虹发光效果

适合：科技类、游戏类应用

## 如何使用

在配置文件（如 `configs/app1.json`）中添加 `template` 字段：

\`\`\`json
{
  "appName": "My App",
  "icon": "https://example.com/icon.png",
  "qr": "https://example.com/qr.png",
  "theme": {
    "brandColor": "#3B82F6",
    "backgroundColor": "#FFFFFF"
  },
  "template": "minimal",
  "locale": "zh-CN",
  "output": ["9x16", "1x1", "16x9"],
  "voiceover": false,
  "duration": 8,
  "fps": 30
}
\`\`\`

## template 字段说明

- **类型**: string
- **可选值**: `"default"` | `"minimal"` | `"modern"`
- **默认值**: `"default"`
- **说明**: 指定要使用的视频模板

## 生成视频

\`\`\`bash
npm run build
npm run generate configs/your-config.json
\`\`\`

## 自定义模板

如果您想创建自己的模板：

1. 在 `src/templates/` 目录下创建新的模板文件，如 `YourTemplate.tsx`
2. 实现 `TemplateComponent` 接口
3. 在 `src/templates/index.ts` 中注册新模板
4. 在 `src/config/schema.ts` 中的 `TemplateNameSchema` 添加新模板名称

### 模板示例

\`\`\`typescript
import React from "react";
import { AbsoluteFill, Img, useCurrentFrame, interpolate, Easing, useVideoConfig } from "remotion";
import { TemplateProps } from "./types.js";

export const YourTemplate: React.FC<TemplateProps> = ({
  config,
  aspectRatio,
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const fps = config.fps;
  
  // 实现您的动画逻辑
  
  return (
    <AbsoluteFill>
      {/* 您的模板内容 */}
    </AbsoluteFill>
  );
};
\`\`\`

## 配置示例

### 使用默认模板
\`\`\`json
{
  "appName": "Hyper AI",
  "template": "default",
  "output": ["9x16"]
}
\`\`\`

### 使用简约模板
\`\`\`json
{
  "appName": "Simple App",
  "template": "minimal",
  "output": ["9x16", "1x1"]
}
\`\`\`

### 使用现代模板
\`\`\`json
{
  "appName": "Tech App",
  "template": "modern",
  "theme": {
    "brandColor": "#FF6B6B"
  },
  "output": ["16x9"]
}
\`\`\`

## 模板预览

生成后的视频将保存在 `outputs/<应用名称>/` 目录下。您可以对比不同模板的效果来选择最适合您应用的风格。
