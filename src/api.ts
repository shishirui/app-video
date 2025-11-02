/**
 * App 视频生成器 - TypeScript API 参考
 * 用于在你的项目中集成视频生成功能
 */

import { loadConfig, saveConfig, createDefaultConfig } from "./config/loader.js";
import {
  AppVideoConfig,
  AspectRatio,
  validateConfig,
  AppVideoConfigSchema,
} from "./config/schema.js";
import { renderAppVideo, optimizeWithFFmpeg, RenderResult } from "./render.js";
import {
  downloadImage,
  downloadImages,
  optimizeImage,
  formatBytes,
  getOutputFilename,
} from "./utils/download.js";
import { AppPromotionVideo, getCompositionDimensions } from "./compositions/AppPromotion.js";

/**
 * 完整工作流示例
 */
export async function generateAppPromotionVideos(
  configPath: string,
  outputDir: string
): Promise<RenderResult[]> {
  // 1. 加载配置
  const config = await loadConfig(configPath);

  console.log(`📱 生成视频: ${config.appName}`);
  console.log(`  📝 标语: ${config.tagline}`);
  console.log(`  📸 截图: ${config.screens.length} 张`);
  console.log(`  🎬 宽高比: ${config.output.join(", ")}`);

  // 2. 下载远程资源
  console.log("\n📥 下载资源...");
  const urls = [...config.screens, config.qr];
  const imageMap = await downloadImages(urls);

  // 更新配置为本地路径
  config.screens = config.screens.map((url) => imageMap.get(url) || url);
  config.qr = imageMap.get(config.qr) || config.qr;

  // 3. 渲染视频
  console.log("\n🎨 渲染视频...");
  const results = await renderAppVideo(config, {
    configPath,
    outputDir,
    qualities: "high",
    codec: "h264",
  });

  // 4. 可选: FFmpeg 优化
  console.log("\n⚙️  优化视频...");
  for (const result of results) {
    const optimizedPath = result.videoPath.replace(".mp4", "_opt.mp4");
    try {
      await optimizeWithFFmpeg(result.videoPath, optimizedPath, {
        bitrate: "1.5M",
        preset: "medium",
      });
      console.log(`  ✅ ${result.aspectRatio}: ${formatBytes(result.size)}`);
    } catch (error) {
      console.warn(`  ⚠️  ${result.aspectRatio}: 优化失败`);
    }
  }

  return results;
}

/**
 * 使用 API 而不是 CLI
 */
export async function customVideoGeneration(): Promise<void> {
  // 创建配置
  const config = createDefaultConfig();
  config.appName = "My Awesome App";
  config.tagline = "Amazing experience";
  config.screens = [
    "./local/screenshot1.png",
    "./local/screenshot2.png",
    "./local/screenshot3.png",
  ];
  config.qr = "./local/qr.png";

  // 验证配置
  const validConfig = validateConfig(config);

  // 保存配置
  await saveConfig(validConfig, "./configs/my-app.json");

  // 生成视频
  const results = await generateAppPromotionVideos(
    "./configs/my-app.json",
    "./outputs"
  );

  // 处理结果
  results.forEach((result) => {
    console.log(`生成的视频: ${result.videoPath}`);
    console.log(`  分辨率: ${result.aspectRatio}`);
    console.log(`  大小: ${formatBytes(result.size)}`);
  });
}

/**
 * 获取组合信息
 */
export function getVideoSpecifications(aspectRatio: AspectRatio) {
  const dimensions = getCompositionDimensions(aspectRatio);
  return {
    aspectRatio,
    ...dimensions,
    pixelCount: dimensions.width * dimensions.height,
    useCase: {
      "9x16": "竖屏视频 (Instagram Reel, TikTok, 小红书)",
      "1x1": "方形视频 (Instagram Feed, Facebook)",
      "16x9": "横屏视频 (YouTube, 电视, 网页播放器)",
    }[aspectRatio],
  };
}

/**
 * 批量处理多个应用
 */
export async function generateMultipleApps(
  configPaths: string[],
  baseOutputDir: string
): Promise<Map<string, RenderResult[]>> {
  const results = new Map<string, RenderResult[]>();

  for (const configPath of configPaths) {
    try {
      const config = await loadConfig(configPath);
      const appResults = await generateAppPromotionVideos(
        configPath,
        baseOutputDir
      );
      results.set(config.appName, appResults);
    } catch (error) {
      console.error(`❌ 处理 ${configPath} 失败:`, error);
    }
  }

  return results;
}

/**
 * 获取生成统计信息
 */
export function getGenerationStats(results: RenderResult[]): {
  totalSize: number;
  videoCount: number;
  averageSize: number;
  aspectRatios: AspectRatio[];
} {
  return {
    totalSize: results.reduce((sum, r) => sum + r.size, 0),
    videoCount: results.length,
    averageSize:
      results.length > 0
        ? Math.round(
            results.reduce((sum, r) => sum + r.size, 0) / results.length
          )
        : 0,
    aspectRatios: results.map((r) => r.aspectRatio),
  };
}

// 导出所有公共 API
export * from "./config/schema.js";
export * from "./config/loader.js";
export * from "./render.js";
export * from "./utils/download.js";
export * from "./compositions/AppPromotion.js";
