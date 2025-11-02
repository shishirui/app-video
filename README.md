# 📹 App 宣传视频生成器

一个基于 **Remotion**、**React** 和 **FFmpeg** 的蒲公英平台专用 App 宣传视频生成工具。支持多种宽高比输出、配置驱动的工作流程和高质量视频渲染。

## 🎯 核心特性

- ✨ **React 驱动**: 使用 Remotion 和 React 编写动态视频
- 📐 **多宽高比支持**: 9×16 (竖屏)、1×1 (方形)、16×9 (横屏)
- 🎨 **主题定制**: 灵活的品牌色和背景色配置
- 📥 **自动资源下载**: 自动从 CDN 下载截图和二维码
- ⚡ **高性能渲染**: GPU 加速支持，CPU 回退机制
- 🎬 **FFmpeg 优化**: 内置视频压缩和格式转换
- 🛠️ **CLI 工具**: 简单易用的命令行界面
- 🌐 **多语言支持**: 中文和英文本地化

## 📦 安装

### 系统要求

- Node.js >= 18.0.0
- FFmpeg (可选，用于高级优化)
- 8GB+ RAM (推荐用于高质量渲染)

### 从源代码安装

```bash
git clone https://github.com/yourusername/app-video-generator.git
cd app-video-generator
npm install
npm run build
```

### 全局安装

```bash
npm install -g app-video-generator
```

## 🚀 快速开始

### 1. 创建配置文件

创建 `my-app.json`:

```json
{
  "appName": "Tube PiP",
  "tagline": "无广告·后台播放·画中画",
  "features": [
    "一键浮窗",
    "支持第三方视频",
    "省电不卡顿"
  ],
  "screens": [
    "https://cdn.example.com/app/s1.png",
    "https://cdn.example.com/app/s2.png",
    "https://cdn.example.com/app/s3.png"
  ],
  "qr": "https://cdn.example.com/app/qr.png",
  "theme": {
    "brandColor": "#3B82F6",
    "backgroundColor": "#FFFFFF"
  },
  "locale": "zh-CN",
  "output": ["9x16", "1x1", "16x9"],
  "voiceover": false,
  "duration": 8,
  "fps": 30
}
```

### 2. 生成视频

```bash
npm run generate configs/my-app.json
```

### 3. 查看输出

视频文件将生成到 `outputs/{appName}/` 目录:

```
outputs/
└── Tube PiP/
    ├── tube_pip_9x16.mp4
    ├── tube_pip_1x1.mp4
    └── tube_pip_16x9.mp4
```

## ⚙️ 配置参考

### 必需字段

| 字段 | 类型 | 说明 |
|------|------|------|
| `appName` | string | 应用名称 |
| `tagline` | string | 应用标语/副标题 |
| `features` | string[] | 应用特性列表 (3-5 个) |
| `screens` | string[] | 应用截图 URL 列表 |
| `qr` | string | 二维码图片 URL |

### 可选字段

| 字段 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `theme` | object | - | 主题配置 |
| `theme.brandColor` | string | `#3B82F6` | 品牌颜色 (HEX) |
| `theme.backgroundColor` | string | `#FFFFFF` | 背景颜色 |
| `locale` | string | `zh-CN` | 本地化语言 |
| `output` | string[] | `["9x16", "1x1", "16x9"]` | 输出宽高比 |
| `duration` | number | 8 | 视频时长 (秒) |
| `fps` | number | 30 | 帧率 |
| `voiceover` | boolean | false | 是否包含语音叙述 |

## 📸 视频模板

默认模板布局:

```
┌─────────────────────┐
│   App Name          │  (0.5s - 2s: 淡入)
│   标语              │
├─────────────────────┤
│  [截图1] [截图2] [截图3]│  (2.5s - 5s: 淡入)
├─────────────────────┤
│  • 特性1            │  (2.5s - 5s: 淡入)
│  • 特性2            │
│  • 特性3            │
├─────────────────────┤
│      [二维码]       │  (5.5s - 8s: 淡入)
│      立即下载       │
└─────────────────────┘
```

## 🎨 定制模板

### 修改模板组件

编辑 `src/compositions/AppPromotion.tsx` 来自定义:

```tsx
// 修改动画时间
const titleStartFrame = fps * 0.5;
const titleEndFrame = fps * 2;

// 修改布局尺寸
const { width, height } = getDimensions();

// 自定义颜色和样式
const theme = config.theme || { ... };
```

### 创建新的模板

```tsx
// src/compositions/CustomTemplate.tsx
export const CustomTemplate: React.FC<AppPromotionVideoProps> = ({
  config,
  aspectRatio,
}) => {
  // 您的自定义视频组件
  return <AbsoluteFill>...</AbsoluteFill>;
};
```

## 🔧 高级用法

### 启用 FFmpeg 优化

```bash
OPTIMIZE=true npm run generate configs/my-app.json
```

这会生成额外的 `_optimized.mp4` 文件，文件更小但仍保持高质量。

### 自定义输出质量

编辑 `src/render.ts` 中的 `qualitySettings`:

```typescript
const qualitySettings = {
  low: 28,      // 较小文件 (~500MB)
  medium: 23,   // 中等质量 (~2GB)
  high: 18,     // 高质量 (~5GB)
};
```

### 使用本地资源

将 URL 替换为本地文件路径:

```json
{
  "screens": [
    "/path/to/local/screenshot1.png",
    "/path/to/local/screenshot2.png"
  ],
  "qr": "/path/to/local/qr.png"
}
```

## 📊 输出规格

| 宽高比 | 分辨率 | 用途 |
|--------|--------|------|
| 9×16 | 1080×1920 | 竖屏 (Instagram Reel, TikTok) |
| 1×1 | 1080×1080 | 方形 (Instagram Feed) |
| 16×9 | 1920×1080 | 横屏 (YouTube, 电视播放) |

### 视频编码参数

- **编码**: H.264 (libx264)
- **像素格式**: YUV 4:2:0
- **帧率**: 30 FPS (可配置)
- **比特率**: 可根据质量调整

## 🐛 故障排查

### 问题: "FFmpeg 未找到"

**解决方案**: 安装 FFmpeg

```bash
# macOS
brew install ffmpeg

# Ubuntu/Debian
sudo apt-get install ffmpeg

# Windows (使用 Chocolatey)
choco install ffmpeg
```

### 问题: "图片下载失败"

**解决方案**: 检查 URL 是否可访问

```bash
# 测试 URL
curl -I https://cdn.example.com/app/s1.png

# 或使用本地路径
{
  "screens": ["./local/s1.png"]
}
```

### 问题: "GPU 内存不足"

**解决方案**: 降低质量或渲染设置

```bash
# 减少并发
# 编辑 src/render.ts
concurrency: 2,  // 从 4 改为 2
```

### 问题: "渲染速度很慢"

**解决方案**: 
- 确保 GPU 可用
- 增加并发数 (如果 RAM 充足)
- 减少帧率或分辨率

## 📝 API 参考

### loadConfig(configPath: string)

加载和验证配置文件。

```typescript
import { loadConfig } from "./config/loader.js";

const config = await loadConfig("./config.json");
```

### renderAppVideo(config, options)

渲染应用宣传视频。

```typescript
import { renderAppVideo } from "./render.js";

const results = await renderAppVideo(config, {
  outputDir: "./outputs",
  qualities: "high",
  codec: "h264",
});
```

### optimizeWithFFmpeg(videoPath, outputPath, options?)

使用 FFmpeg 优化视频。

```typescript
import { optimizeWithFFmpeg } from "./render.js";

await optimizeWithFFmpeg("input.mp4", "output.mp4", {
  bitrate: "2M",
  preset: "medium",
});
```

## 🤝 贡献

欢迎提交 Issue 和 Pull Request!

```bash
git clone https://github.com/yourusername/app-video-generator.git
cd app-video-generator
npm install
npm run dev
```

## 📄 许可证

MIT License - 详见 [LICENSE](./LICENSE) 文件

## 🔗 相关链接

- [Remotion 文档](https://www.remotion.dev/)
- [FFmpeg 文档](https://ffmpeg.org/documentation.html)
- [蒲公英平台](https://www.pgyer.com/)

## 📞 支持

- 📧 Email: support@example.com
- 💬 GitHub Issues: [提交问题](https://github.com/yourusername/app-video-generator/issues)
- 📚 文档: [完整指南](https://docs.example.com)

---

Made with ❤️ for App Promotion Videos
