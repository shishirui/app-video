import path from "path";
import { execSync } from "child_process";
import fs from "fs";
import { AppVideoConfig, AspectRatio } from "./config/schema.js";
import { getCompositionDimensions } from "./compositions/AppPromotion.js";

interface RenderOptions {
  configPath: string;
  outputDir: string;
  qualities?: "low" | "medium" | "high";
  codec?: "h264" | "h265" | "prores";
  overwrite?: boolean;
}

export interface RenderResult {
  aspectRatio: AspectRatio;
  videoPath: string;
  duration: number;
  size: number;
}

export async function renderAppVideo(
  config: AppVideoConfig,
  options: RenderOptions
): Promise<RenderResult[]> {
  const results: RenderResult[] = [];

  // 处理每个宽高比
  for (const aspectRatio of config.output) {
    const dimensions = getCompositionDimensions(aspectRatio);
    const outputFilename = `${config.appName}_${aspectRatio}.mp4`;
    const outputPath = path.join(options.outputDir, outputFilename);

    console.log(
      `📹 渲染 ${aspectRatio} (${dimensions.width}x${dimensions.height})...`
    );

    try {
      // 使用 Remotion CLI 进行渲染
      const qualitySettings = {
        low: "28",
        medium: "23",
        high: "18",
      };

      const crf = qualitySettings[options.qualities || "high"];

      // 构建 Remotion render 命令
      const command = [
        "npx remotion render",
        `--composition=AppPromotionVideo_${aspectRatio}`,
        `--codec=${options.codec || "h264"}`,
        `--crf=${crf}`,
        `--pixel-format=yuv420p`,
        `--concurrency=4`,
        `--fps=${config.fps}`,
        `--width=${dimensions.width}`,
        `--height=${dimensions.height}`,
        `--duration=${config.duration}`,
        `"${outputPath}"`,
      ].join(" ");

      console.log(`运行: ${command.substring(0, 80)}...`);

      // 注意: 实际使用时需要设置 Remotion 项目
      // 这里我们创建一个模拟渲染过程
      await simulateRender(outputPath, config.duration);

      const stats = fs.statSync(outputPath);

      results.push({
        aspectRatio,
        videoPath: outputPath,
        duration: config.duration,
        size: stats.size,
      });

      console.log(
        `✅ 完成: ${outputFilename} (${Math.round(stats.size / 1024 / 1024)}MB)`
      );
    } catch (error) {
      console.warn(`⚠️  渲染 ${aspectRatio} 时出错`);
      throw error;
    }
  }

  return results;
}

// 模拟渲染函数 (实际使用时应该使用真实的 Remotion API)
async function simulateRender(
  outputPath: string,
  duration: number
): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      // 创建一个虚拟视频文件用于演示
      const mockData = Buffer.alloc(1024 * 1024 * 5); // 5MB mock video
      fs.writeFileSync(outputPath, mockData);
      resolve();
    }, 1000);
  });
}

export async function optimizeWithFFmpeg(
  videoPath: string,
  outputPath: string,
  options?: {
    bitrate?: string;
    preset?: "fast" | "medium" | "slow";
  }
): Promise<void> {
  const { execSync } = await import("child_process");

  const preset = options?.preset || "medium";
  const bitrate = options?.bitrate || "2M";

  const command = [
    "ffmpeg",
    "-i",
    `"${videoPath}"`,
    "-c:v",
    "libx264",
    "-preset",
    preset,
    "-b:v",
    bitrate,
    "-c:a",
    "aac",
    "-b:a",
    "128k",
    "-y", // 覆盖输出文件
    `"${outputPath}"`,
  ].join(" ");

  console.log(`🎬 使用 FFmpeg 优化: ${path.basename(videoPath)}`);

  try {
    execSync(command, { stdio: "inherit" });
    console.log(`✅ 优化完成: ${path.basename(outputPath)}`);
  } catch (error) {
    console.error(`❌ FFmpeg 优化失败:`, error);
    throw error;
  }
}
