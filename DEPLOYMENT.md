# 🎯 初始化和部署指南

## 第一次使用

### 1. 克隆或下载项目

```bash
cd /Users/rexshi/Downloads/app-video
```

### 2. 安装依赖

```bash
npm install
```

### 3. 编译项目

```bash
npm run build
```

### 4. 运行示例

```bash
npm run generate configs/example.json
```

输出将保存到 `outputs/Tube PiP/` 目录。

---

## 创建你的第一个视频

### 步骤 1: 准备资源

收集以下内容:
- ✅ App 名称
- ✅ App 标语 (1-2 句话)
- ✅ 应用特性 (3-5 个)
- ✅ 应用截图 URL (3 张)
- ✅ 二维码 URL

### 步骤 2: 创建配置文件

创建 `configs/my-app.json`:

```json
{
  "appName": "我的应用",
  "tagline": "最好的应用",
  "features": [
    "功能1 - 描述",
    "功能2 - 描述",
    "功能3 - 描述"
  ],
  "screens": [
    "https://your-cdn.com/app/screenshot1.png",
    "https://your-cdn.com/app/screenshot2.png",
    "https://your-cdn.com/app/screenshot3.png"
  ],
  "qr": "https://your-cdn.com/app/qr-code.png",
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

### 步骤 3: 生成视频

```bash
npm run generate configs/my-app.json
```

### 步骤 4: 查看输出

```bash
ls -la outputs/我的应用/
```

你会看到三个视频文件:
- `我的应用_9x16.mp4` (竖屏)
- `我的应用_1x1.mp4` (方形)
- `我的应用_16x9.mp4` (横屏)

---

## 批量生成

### 方法 1: 使用 Shell 脚本

创建 `batch-generate.sh`:

```bash
#!/bin/bash
for file in configs/*.json; do
    echo "处理: $file"
    npm run generate "$file"
done
```

运行:

```bash
chmod +x batch-generate.sh
./batch-generate.sh
```

### 方法 2: 使用 Node.js

创建 `batch.js`:

```javascript
import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";

const configDir = "./configs";
const files = fs.readdirSync(configDir).filter((f) => f.endsWith(".json"));

for (const file of files) {
  console.log(`\n▶️ 处理: ${file}`);
  const result = spawnSync("npm", ["run", "generate", path.join(configDir, file)], {
    stdio: "inherit",
  });

  if (result.status !== 0) {
    console.error(`❌ 失败: ${file}`);
  }
}

console.log("\n✅ 批量生成完成!");
```

运行:

```bash
node batch.js
```

---

## 集成到你的系统

### 作为 NPM 包

在你的项目中:

```bash
npm install ../app-video-generator
```

使用:

```typescript
import { generateAppPromotionVideos } from "app-video-generator";

const results = await generateAppPromotionVideos(
  "./config.json",
  "./outputs"
);
```

### 作为 Docker 容器

创建 `Dockerfile`:

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY dist ./dist
COPY configs ./configs

ENTRYPOINT ["npm", "run", "generate"]
CMD ["configs/example.json"]
```

构建和运行:

```bash
docker build -t app-video .
docker run -v $(pwd)/outputs:/app/outputs app-video configs/my-app.json
```

### 作为 API 服务

创建 `server.ts`:

```typescript
import express from "express";
import { generateAppPromotionVideos } from "./dist/api.js";

const app = express();
app.use(express.json());

app.post("/api/generate", async (req, res) => {
  try {
    const { config } = req.body;
    
    // 临时保存配置
    const fs = await import("fs");
    const configPath = `/tmp/config_${Date.now()}.json`;
    fs.writeFileSync(configPath, JSON.stringify(config));

    const results = await generateAppPromotionVideos(
      configPath,
      "./outputs"
    );

    res.json({
      success: true,
      videos: results.map((r) => ({
        aspectRatio: r.aspectRatio,
        path: r.videoPath,
        size: r.size,
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
  console.log("🚀 API 服务运行在 http://localhost:3000");
});
```

运行:

```bash
npm run build
node dist/server.js
```

测试:

```bash
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d @configs/example.json
```

---

## 环境变量配置

创建 `.env`:

```env
# 渲染配置
RENDER_QUALITY=high
RENDER_CONCURRENCY=4
RENDER_CODEC=h264

# FFmpeg
FFMPEG_PRESET=medium
FFMPEG_BITRATE=2M
OPTIMIZE=false

# 开发
DEBUG=false
NODE_ENV=production
```

加载方式:

```typescript
import dotenv from "dotenv";
dotenv.config();

const quality = process.env.RENDER_QUALITY || "high";
```

---

## 性能调优

### 内存优化

```json
{
  "duration": 6,
  "fps": 24,
  "screens": 3
}
```

这样会:
- 减少帧数 (30 → 24 = 20% 减少)
- 减少总帧数 (8s → 6s = 25% 减少)
- 总体内存使用减少 ~40%

### 渲染加速

```bash
# 增加并发数 (需要充足 RAM)
export RENDER_CONCURRENCY=8

# 或编辑 src/render.ts
concurrency: 8,  // 增加从 4
```

### 磁盘优化

```bash
# 清理缓存
rm -rf .cache/

# 清理旧输出
rm -rf outputs/old_apps/

# 压缩输出
tar -czf outputs_backup.tar.gz outputs/
```

---

## 监控和日志

### 启用详细日志

```bash
DEBUG=* npm run generate configs/my-app.json
```

### 收集渲染统计

编辑 `src/cli.ts`:

```typescript
const startTime = Date.now();

const results = await renderAppVideo(config, { ... });

const duration = (Date.now() - startTime) / 1000;
const totalSize = results.reduce((s, r) => s + r.size, 0);

console.log(`\n📊 统计信息:`);
console.log(`  耗时: ${duration.toFixed(2)}s`);
console.log(`  总大小: ${formatBytes(totalSize)}`);
console.log(`  平均速度: ${(totalSize / duration / 1024 / 1024).toFixed(2)} MB/s`);
```

---

## 常见部署场景

### 场景 1: 本地开发

```bash
npm run dev           # 监视文件变化
npm run generate      # 测试生成
```

### 场景 2: 单体服务器

```bash
npm run build
npm install -g pm2
pm2 start dist/cli.js --name "app-video"
```

### 场景 3: Serverless (AWS Lambda)

1. 打包项目为 zip
2. 上传到 Lambda
3. 设置内存: 3008 MB
4. 设置超时: 900 秒

### 场景 4: 容器编排 (Kubernetes)

```yaml
apiVersion: batch/v1
kind: CronJob
metadata:
  name: app-video-generator
spec:
  schedule: "0 2 * * *"  # 每天凌晨 2 点
  jobTemplate:
    spec:
      template:
        spec:
          containers:
          - name: generator
            image: app-video:latest
            command: ["npm", "run", "generate"]
            args: ["configs/my-app.json"]
            resources:
              requests:
                memory: "2Gi"
                cpu: "1"
              limits:
                memory: "4Gi"
                cpu: "2"
```

---

## 故障恢复

### 如果渲染失败

1. 检查配置文件有效性
   ```bash
   npm run type-check
   ```

2. 检查网络连接
   ```bash
   curl -I https://your-cdn.com/app/s1.png
   ```

3. 清理缓存并重试
   ```bash
   rm -rf .cache/
   npm run generate configs/my-app.json
   ```

4. 查看详细日志
   ```bash
   DEBUG=* npm run generate configs/my-app.json
   ```

### 如果输出质量不佳

1. 增加质量等级 (在配置中)
2. 增加帧率
3. 使用本地高质量图片而不是压缩 URL
4. 禁用 FFmpeg 优化以保留最大质量

---

## 升级和维护

### 检查更新

```bash
npm outdated
npm update
```

### 更新 Remotion

```bash
npm install remotion@latest @remotion/cli@latest
npm run build
```

### 备份

```bash
# 备份输出
tar -czf outputs_$(date +%Y%m%d).tar.gz outputs/

# 备份配置
tar -czf configs_$(date +%Y%m%d).tar.gz configs/
```

---

## 获取帮助

- 📖 查看 [README.md](./README.md)
- 📚 查看 [ADVANCED.md](./ADVANCED.md)
- ⚡查看 [QUICKSTART.md](./QUICKSTART.md)
- 🐛 检查 [issues](https://github.com/yourusername/app-video-generator/issues)

---

Made with ❤️ for App Promotion Videos
