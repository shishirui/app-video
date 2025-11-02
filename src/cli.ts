#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { loadConfig } from "./config/loader.js";
import { downloadImages } from "./utils/download.js";
import { renderAppVideo, optimizeWithFFmpeg } from "./render.js";

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args[0] === "--help" || args[0] === "-h") {
    printHelp();
    process.exit(0);
  }

  const configPath = args[0];

  if (!configPath) {
    console.error("❌ 错误: 需要提供配置文件路径");
    console.error("使用: app-video generate <config.json>");
    process.exit(1);
  }

  if (!fs.existsSync(configPath)) {
    console.error(`❌ 错误: 配置文件不存在: ${configPath}`);
    process.exit(1);
  }

  try {
    console.log("📋 加载配置...");
    const config = await loadConfig(configPath);

    console.log(`📱 应用名称: ${config.appName}`);
    console.log(`📝 标语: ${config.tagline}`);
    console.log(`📸 截图数: ${config.screens.length}`);
    console.log(`🎬 宽高比: ${config.output.join(", ")}`);
    console.log(`⏱️  视频时长: ${config.duration}秒`);

    // 创建输出目录
    const outputDir = path.join(process.cwd(), "outputs", config.appName);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // 如果需要，下载远程资源
    if (config.screens.length > 0 || config.qr) {
      console.log("\n📥 下载资源...");
      const allUrls = [...config.screens, config.qr];
      const imageMapping = await downloadImages(allUrls);

      // 更新配置中的本地路径
      config.screens = config.screens.map((url) => imageMapping.get(url) || url);
      config.qr = imageMapping.get(config.qr) || config.qr;
    }

    // 执行渲染
    console.log("\n🎨 开始渲染视频...");
    const renderResults = await renderAppVideo(config, {
      configPath,
      outputDir,
      qualities: "high",
      codec: "h264",
    });

    // 可选: FFmpeg 优化
    if (process.env.OPTIMIZE === "true") {
      console.log("\n⚙️  执行 FFmpeg 优化...");
      for (const result of renderResults) {
        const optimizedPath = result.videoPath.replace(".mp4", "_optimized.mp4");
        await optimizeWithFFmpeg(result.videoPath, optimizedPath, {
          bitrate: "1.5M",
          preset: "medium",
        });
      }
    }

    // 输出摘要
    console.log("\n✅ 完成!\n");
    console.log("📊 渲染结果摘要:");
    console.log("─".repeat(60));
    renderResults.forEach((result) => {
      const fileName = path.basename(result.videoPath);
      const sizeStr = formatBytes(result.size);
      console.log(
        `  ${result.aspectRatio.padEnd(6)} | ${fileName.padEnd(30)} | ${sizeStr}`
      );
    });
    console.log("─".repeat(60));
    console.log(`\n📂 输出目录: ${outputDir}`);
  } catch (error) {
    console.error("\n❌ 错误:", error);
    process.exit(1);
  }
}

function printHelp() {
  console.log(`
📹 蒲公英 App 宣传视频生成器

用法:
  app-video generate <config.json>

选项:
  --help, -h              显示帮助信息
  --optimize              启用 FFmpeg 优化 (设置环境变量 OPTIMIZE=true)

示例:
  app-video generate ./configs/my-app.json
  OPTIMIZE=true app-video generate ./configs/my-app.json

配置文件格式 (JSON):
  {
    "appName": "应用名称",
    "tagline": "应用标语",
    "features": ["特性1", "特性2", "特性3"],
    "screens": ["截图URL1", "截图URL2", "截图URL3"],
    "qr": "二维码URL",
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

更多信息: https://github.com/yourusername/app-video-generator
  `);
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return (
    Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
  );
}

main().catch((error) => {
  console.error("❌ 未捕获的错误:", error);
  process.exit(1);
});
