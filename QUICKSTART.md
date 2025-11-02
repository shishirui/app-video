# 🚀 快速参考

## 常用命令

```bash
# 编译
npm run build

# 生成视频
npm run generate configs/example.json

# 查看类型
npm run type-check

# 开发模式 (监视文件变化)
npm run dev
```

## 配置最小化示例

```json
{
  "appName": "我的应用",
  "tagline": "一句标语",
  "features": ["特性1", "特性2"],
  "screens": ["https://example.com/s1.png"],
  "qr": "https://example.com/qr.png"
}
```

## 完整配置示例

```json
{
  "appName": "Tube PiP",
  "tagline": "无广告·后台播放·画中画",
  "features": ["一键浮窗", "支持第三方视频", "省电不卡顿"],
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

## API 导入

```typescript
import {
  loadConfig,
  validateConfig,
  renderAppVideo,
  downloadImages,
  AppVideoConfig,
} from "./dist/index.js";
```

## 高级用法示例

### 程序化生成

```typescript
import { generateAppPromotionVideos } from "./dist/api.js";

const results = await generateAppPromotionVideos(
  "./configs/my-app.json",
  "./outputs"
);

results.forEach((r) => {
  console.log(`✅ ${r.aspectRatio}: ${r.videoPath}`);
});
```

### 自定义配置

```typescript
import { createDefaultConfig } from "./dist/config/loader.js";

const config = createDefaultConfig();
config.appName = "Custom App";
config.brandColor = "#FF5733";

await generateAppPromotionVideos(config, "./outputs");
```

### 获取视频规格

```typescript
import { getVideoSpecifications } from "./dist/api.js";

const spec9x16 = getVideoSpecifications("9x16");
console.log(`${spec9x16.width}x${spec9x16.height}`);
// 输出: 1080x1920
```

## 宽高比速查表

| 比例 | 分辨率 | 平台 |
|------|--------|------|
| **9:16** | 1080×1920 | TikTok, Instagram Reel, 小红书 |
| **1:1** | 1080×1080 | Instagram Feed, Facebook |
| **16:9** | 1920×1080 | YouTube, 电视, 网页 |

## 色彩代码建议

```json
{
  "theme": {
    "brandColor": "#3B82F6",     // 蓝色 (默认)
    "brandColor": "#EC4899",     // 粉色
    "brandColor": "#F97316",     // 橙色
    "brandColor": "#06B6D4",     // 青色
    "brandColor": "#10B981",     // 绿色
    "backgroundColor": "#FFFFFF" // 白色 (默认)
  }
}
```

## 文件大小预期

| 质量 | 时长 | 单个视频大小 |
|------|------|------------|
| low | 8s | ~2-3 MB |
| medium | 8s | ~8-15 MB |
| high | 8s | ~30-50 MB |

## 常用环境变量

```bash
# 渲染质量
export RENDER_QUALITY=high

# 并发渲染数
export RENDER_CONCURRENCY=4

# FFmpeg 优化
export OPTIMIZE=true
export FFMPEG_PRESET=medium

# 启用详细日志
export DEBUG=true
```

## 整合示例 - Express.js

```typescript
import express from "express";
import { generateAppPromotionVideos } from "./dist/api.js";

const app = express();

app.post("/api/generate", async (req, res) => {
  try {
    const results = await generateAppPromotionVideos(
      req.body.configPath,
      "./outputs"
    );
    res.json({ success: true, videos: results });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

app.listen(3000);
```

## 整合示例 - Vue.js/React

```typescript
import { renderAppVideo, loadConfig } from "@/api/video-generator";

async function generateVideo(appName: string) {
  try {
    const config = await loadConfig(`./configs/${appName}.json`);
    const results = await renderAppVideo(config, {
      outputDir: "./outputs",
      configPath: `./configs/${appName}.json`,
    });
    console.log("视频生成完成!", results);
  } catch (error) {
    console.error("生成失败:", error);
  }
}
```

## 故障排查清单

- [ ] Node.js 版本 >= 18
- [ ] npm 依赖已安装 (`npm install`)
- [ ] 项目已编译 (`npm run build`)
- [ ] 配置文件有效 JSON
- [ ] 图片 URL 可访问
- [ ] 输出目录有写入权限
- [ ] 磁盘空间充足 (建议 50GB+)
- [ ] FFmpeg 已安装 (可选，用于优化)

## 输出目录结构

```
outputs/
└── {appName}/
    ├── {appName}_9x16.mp4       # 竖屏
    ├── {appName}_1x1.mp4        # 方形
    └── {appName}_16x9.mp4       # 横屏
```

## 性能优化建议

1. **降低 FPS**: `"fps": 24` (从 30)
2. **缩短时长**: `"duration": 6` (从 8)
3. **减少截图**: 3-4 张最佳
4. **本地资源**: 避免从远程下载
5. **批量处理**: 使用 `generateMultipleApps()` API

## 支持和反馈

- 📖 [完整文档](./README.md)
- 📚 [高级指南](./ADVANCED.md)
- 🐛 [提交 Issue](https://github.com/yourusername/app-video-generator/issues)
- 💬 [讨论区](https://github.com/yourusername/app-video-generator/discussions)

---

Made with ❤️ for App Promotion Videos
