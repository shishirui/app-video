import { Config } from "@remotion/cli/config";

Config.setCodec("h264");
Config.setPixelFormat("yuv420p");
Config.setConcurrency(4);

export const videoConfig = {
  fps: 30,
  codec: "h264" as const,
  pixelFormat: "yuv420p" as const,
  concurrency: 4,
};
