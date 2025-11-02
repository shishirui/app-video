import fs from "fs";
import path from "path";
import { AppVideoConfig, validateConfig } from "./schema.js";

export async function loadConfig(configPath: string): Promise<AppVideoConfig> {
  const absolutePath = path.resolve(configPath);

  if (!fs.existsSync(absolutePath)) {
    throw new Error(`配置文件不存在: ${absolutePath}`);
  }

  const content = fs.readFileSync(absolutePath, "utf-8");

  try {
    const configData = JSON.parse(content);
    return validateConfig(configData);
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error(`JSON 解析失败: ${error.message}`);
    }
    throw error;
  }
}

export function saveConfig(config: AppVideoConfig, outputPath: string): void {
  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(outputPath, JSON.stringify(config, null, 2));
}

export function createDefaultConfig(): AppVideoConfig {
  return {
    appName: "My App",
    icon: "",
    qr: "",
    template: "default",
    locale: "zh-CN",
    output: ["9x16", "1x1", "16x9"],
    voiceover: false,
    duration: 8,
    fps: 30,
  };
}
