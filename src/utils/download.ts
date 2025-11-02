import axios from "axios";
import path from "path";
import fs from "fs";
import sharp from "sharp";

export async function downloadImage(
  url: string,
  outputPath: string
): Promise<void> {
  try {
    const response = await axios.get(url, {
      responseType: "arraybuffer",
      timeout: 30000,
    });

    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(outputPath, response.data);
    console.log(`✅ 下载完成: ${path.basename(outputPath)}`);
  } catch (error) {
    console.error(`❌ 下载失败 ${url}:`, error);
    throw error;
  }
}

export async function downloadImages(urls: string[]): Promise<Map<string, string>> {
  const cacheDir = path.join(process.cwd(), ".cache/images");
  if (!fs.existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir, { recursive: true });
  }

  const mapping = new Map<string, string>();

  for (const url of urls) {
    const hash = Buffer.from(url).toString("base64").substring(0, 16);
    const ext = path.extname(new URL(url).pathname) || ".png";
    const localPath = path.join(cacheDir, `${hash}${ext}`);

    if (!fs.existsSync(localPath)) {
      await downloadImage(url, localPath);
    }

    mapping.set(url, localPath);
  }

  return mapping;
}

export async function optimizeImage(
  inputPath: string,
  outputPath: string,
  options?: {
    width?: number;
    height?: number;
    quality?: number;
  }
): Promise<void> {
  const { width = 1080, height = 1920, quality = 80 } = options || {};

  await sharp(inputPath)
    .resize(width, height, {
      fit: "cover",
      position: "center",
    })
    .toFormat("png", { quality })
    .toFile(outputPath);

  console.log(`✅ 图片优化: ${path.basename(outputPath)}`);
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}

export function getOutputFilename(
  appName: string,
  aspectRatio: string,
  extension: string = "mp4"
): string {
  const sanitized = appName
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_]/g, "");

  return `${sanitized}_${aspectRatio}.${extension}`;
}
