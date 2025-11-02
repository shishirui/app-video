# 🎬 App 视频生成器 - 高级指南

## 📚 目录

1. [架构设计](#架构设计)
2. [项目结构](#项目结构)
3. [自定义开发](#自定义开发)
4. [性能优化](#性能优化)
5. [批量处理](#批量处理)
6. [集成示例](#集成示例)

---

## 架构设计

### 核心组件

```
┌─────────────────────────────────────────┐
│         CLI Entry Point (cli.ts)        │
└────────────────┬────────────────────────┘
                 │
     ┌───────────┼───────────┐
     │           │           │
┌────▼──┐  ┌────▼──┐  ┌────▼──┐
│Config │  │Render │  │Download
│Loader │  │Engine │  │Images
└────┬──┘  └────┬──┘  └────┬──┘
     │          │          │
     └──────┬───┴──────┬───┘
            │          │
      ┌─────▼──┐  ┌───▼────┐
      │Remotion│  │ FFmpeg │
      │Render  │  │Process │
      └────────┘  └────────┘
           │          │
           └─────┬────┘
                 │
           ┌─────▼─────┐
           │Output MP4 │
           └───────────┘
```

### 数据流

```
JSON Config
    ↓
Validate Config (Zod Schema)
    ↓
Download Remote Assets
    ↓
Prepare Local Assets
    ↓
Render Each Aspect Ratio
    ├─ 9x16 (1080x1920)
    ├─ 1x1  (1080x1080)
    └─ 16x9 (1920x1080)
    ↓
[Optional] FFmpeg Optimization
    ↓
Output Videos
```

---

## 项目结构

```
app-video-generator/
├── src/
│   ├── compositions/
│   │   └── AppPromotion.tsx       # React 视频组件
│   ├── config/
│   │   ├── schema.ts              # Zod 配置 schema
│   │   └── loader.ts              # 配置加载器
│   ├── utils/
│   │   └── download.ts            # 图片下载和优化
│   ├── cli.ts                     # CLI 入口
│   ├── render.ts                  # 渲染引擎
│   └── index.ts                   # 库导出
├── configs/
│   └── example.json               # 示例配置
├── outputs/                       # 输出目录 (生成的视频)
├── package.json
├── tsconfig.json
├── README.md
└── ADVANCED.md                    # 本文件
```

---

## 自定义开发

### 创建自定义模板

创建 `src/compositions/CustomTemplate.tsx`:

```typescript
import React from "react";
import { AbsoluteFill, Sequence, Img } from "remotion";
import { AppVideoConfig } from "../config/schema.js";

interface CustomTemplateProps {
  config: AppVideoConfig;
  aspectRatio: "9x16" | "1x1" | "16x9";
}

export const CustomTemplate: React.FC<CustomTemplateProps> = ({
  config,
  aspectRatio,
}) => {
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
  const fps = 30;

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {/* 您的自定义内容 */}
      <div
        style={{
          width,
          height,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 40,
          color: "white",
        }}
      >
        {config.appName}
      </div>
    </AbsoluteFill>
  );
};
```

### 添加特殊效果

```typescript
import { interpolate, Easing, spring, useCurrentFrame } from "remotion";

const frame = useCurrentFrame();
const fps = 30;

// 弹簧动画
const scale = spring({
  fps,
  frame,
  from: 0.5,
  to: 1,
  config: { damping: 5 },
});

// 曲线动画
const opacity = interpolate(frame, [0, 30, 60], [0, 1, 0], {
  easing: Easing.inOut(Easing.cubic),
});

// 路径动画
const yPosition = interpolate(
  frame,
  [0, 30],
  [100, 0],
  { easing: Easing.out(Easing.quad) }
);

return (
  <div
    style={{
      transform: `scale(${scale}) translateY(${yPosition}px)`,
      opacity,
    }}
  >
    Content
  </div>
);
```

---

## 性能优化

### 1. 降低质量以加快渲染

编辑配置文件:

```json
{
  "fps": 24,
  "duration": 6
}
```

### 2. 优化图片

编辑 `src/utils/download.ts`:

```typescript
export async function optimizeImage(
  inputPath: string,
  outputPath: string,
  options?: {
    width?: number;
    height?: number;
    quality?: number;
  }
): Promise<void> {
  const { width = 1080, height = 1920, quality = 60 } = options || {};
  // quality 越低文件越小，但质量也越低
}
```

### 3. 并发配置

编辑 `src/render.ts`:

```typescript
const concurrency = 2; // 增加可能导致内存溢出
// 根据 RAM 调整: 4GB RAM -> 2, 8GB+ -> 4
```

### 4. 使用 FFmpeg 压缩

```bash
OPTIMIZE=true npm run generate configs/my-app.json
```

---

## 批量处理

### 创建批量生成脚本

`scripts/batch-generate.ts`:

```typescript
import fs from "fs";
import path from "path";
import { loadConfig } from "../src/config/loader.js";
import { renderAppVideo } from "../src/render.js";

async function batchGenerate() {
  const configDir = "./configs";
  const files = fs.readdirSync(configDir).filter((f) => f.endsWith(".json"));

  console.log(`📋 找到 ${files.length} 个配置文件`);

  for (const file of files) {
    try {
      console.log(`\n▶️  处理: ${file}`);
      const configPath = path.join(configDir, file);
      const config = await loadConfig(configPath);

      const outputDir = path.join(
        process.cwd(),
        "outputs",
        config.appName
      );

      await renderAppVideo(config, {
        configPath,
        outputDir,
        qualities: "high",
      });
    } catch (error) {
      console.error(`❌ 失败: ${file}`, error);
    }
  }

  console.log("\n✅ 批量生成完成!");
}

batchGenerate();
```

运行:

```bash
npm run build
node dist/scripts/batch-generate.js
```

---

## 集成示例

### 与 Express 集成

`server.ts`:

```typescript
import express from "express";
import { renderAppVideo } from "./src/render.js";
import { validateConfig } from "./src/config/schema.js";

const app = express();
app.use(express.json());

app.post("/api/generate-video", async (req, res) => {
  try {
    const config = validateConfig(req.body);

    const results = await renderAppVideo(config, {
      configPath: "memory",
      outputDir: "./outputs",
    });

    res.json({
      success: true,
      videos: results.map((r) => ({
        aspectRatio: r.aspectRatio,
        size: r.size,
        path: r.videoPath,
      })),
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

app.listen(3000, () => {
  console.log("🚀 Server running on http://localhost:3000");
});
```

### 与 Queue 系统集成 (Bull)

```typescript
import Queue from "bull";
import redis from "redis";
import { renderAppVideo } from "./src/render.js";

const videoQueue = new Queue("video-generation", {
  redis: { host: "127.0.0.1", port: 6379 },
});

videoQueue.process(async (job) => {
  console.log(`🎬 处理任务: ${job.id}`);

  const { config } = job.data;
  const results = await renderAppVideo(config, {
    configPath: "memory",
    outputDir: "./outputs",
  });

  job.progress(100);
  return results;
});

videoQueue.on("completed", (job, result) => {
  console.log(`✅ 任务完成: ${job.id}`);
  // 发送通知、上传到 CDN 等
});

// 添加任务到队列
videoQueue.add({ config: myConfig }, { delay: 1000 });
```

---

## 环境变量

创建 `.env` 文件:

```
# 渲染配置
RENDER_QUALITY=high        # low, medium, high
RENDER_CONCURRENCY=4       # 1-8
RENDER_CODEC=h264         # h264, h265, prores

# FFmpeg 配置
FFMPEG_PRESET=medium      # fast, medium, slow
FFMPEG_BITRATE=2M         # 比特率

# 开发配置
DEBUG=true
LOG_LEVEL=debug
```

使用:

```typescript
const quality = process.env.RENDER_QUALITY || "high";
const concurrency = parseInt(process.env.RENDER_CONCURRENCY || "4");
```

---

## 故障排查

### 常见问题和解决方案

| 问题 | 原因 | 解决方案 |
|------|------|---------|
| 内存溢出 | 并发太高或分辨率太大 | 降低 concurrency 或分辨率 |
| GPU 内存不足 | 组件复杂度高 | 减少动画或简化组件 |
| 下载超时 | 网络问题或 CDN 缓慢 | 增加超时时间或使用本地资源 |
| 渲染缓慢 | CPU 不足或磁盘 I/O 限制 | 使用 SSD 或增加 RAM |

---

## 最佳实践

1. **配置管理**: 使用版本控制管理配置文件
2. **资源缓存**: 利用 `.cache/images` 目录缓存下载的资源
3. **错误处理**: 始终检查返回的 RenderResult 结构
4. **日志记录**: 使用结构化日志便于调试
5. **性能监控**: 记录渲染时间和文件大小

---

## 参考资源

- [Remotion 文档](https://www.remotion.dev/docs)
- [React 性能优化](https://react.dev/reference/react/useMemo)
- [FFmpeg 参数详解](https://ffmpeg.org/ffmpeg-all.html)
- [视频编码基础](https://en.wikipedia.org/wiki/Video_codec)

---

Made with ❤️ for App Promotion Videos
