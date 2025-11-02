import { bundle } from "@remotion/bundler";
import path from "path";
import fs from "fs";
import { execSync } from "child_process";
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

export async function renderAppVideoWithCLI(
  config: AppVideoConfig,
  options: RenderOptions
): Promise<RenderResult[]> {
  const results: RenderResult[] = [];

  try {
    // 为每个宽高比渲染视频
    for (const aspectRatio of config.output) {
      const dimensions = getCompositionDimensions(
        aspectRatio as "9x16" | "1x1" | "16x9"
      );
      const outputFilename = `${config.appName}_${aspectRatio}.mp4`;
      const outputPath = path.join(options.outputDir, outputFilename);

      console.log(
        `📹 渲染 ${aspectRatio} (${dimensions.width}x${dimensions.height})...`
      );

      const qualitySettings = {
        low: "28",
        medium: "23",
        high: "18",
      };

      const crf = qualitySettings[options.qualities || "high"];

      // 使用 npx remotion render 命令
      const entryFile = path.join(process.cwd(), "dist", "index-entry.js");
      const compositionId = `AppPromotionVideo-${aspectRatio}`;
      
      // 将配置保存到临时文件
      const tempConfigFile = path.join(process.cwd(), ".temp-config.json");
      const tempConfig = { config, aspectRatio };
      fs.writeFileSync(tempConfigFile, JSON.stringify(tempConfig));
      
      const command = [
        "npx remotion render",
        entryFile,
        compositionId,
        `--codec=${options.codec || "h264"}`,
        `--crf=${crf}`,
        `--pixel-format=yuv420p`,
        `--concurrency=4`,
        `--fps=${config.fps}`,
        `--width=${dimensions.width}`,
        `--height=${dimensions.height}`,
        `"${outputPath}"`,
      ].join(" ");

      console.log(
        `运行: npx remotion render --composition=${compositionId} ...`
      );

      try {
        execSync(command, { stdio: "inherit" });

        const stats = fs.statSync(outputPath);
        results.push({
          aspectRatio: aspectRatio as AspectRatio,
          videoPath: outputPath,
          duration: config.duration,
          size: stats.size,
        });

        console.log(
          `✅ 完成: ${outputFilename} (${Math.round(stats.size / 1024 / 1024)}MB)`
        );
      } catch (error) {
        console.warn(`⚠️  渲染 ${aspectRatio} 时出错:`, error);
        throw error;
      }
    }
  } catch (error) {
    console.error("❌ 渲染过程中出错:", error);
    throw error;
  }

  return results;
}

export async function optimizeWithFFmpeg(
  videoPath: string,
  outputPath: string,
  options?: {
    bitrate?: string;
    preset?: "fast" | "medium" | "slow";
  }
): Promise<void> {
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
    "-y",
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
