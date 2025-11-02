import { Config } from "@remotion/cli/config";
import path from "path";

Config.setCodec("h264");
Config.setPixelFormat("yuv420p");
Config.setConcurrency(4);

// Set the public directory to serve static files (like cached images)
Config.setPublicDir(path.join(process.cwd(), ".cache"));

// Configure webpack to resolve .js extensions for TypeScript imports
Config.overrideWebpackConfig((currentConfiguration) => {
  return {
    ...currentConfiguration,
    resolve: {
      ...currentConfiguration.resolve,
      extensionAlias: {
        ".js": [".js", ".ts", ".tsx"],
      },
    },
  };
});

export const videoConfig = {
  fps: 30,
  codec: "h264" as const,
  pixelFormat: "yuv420p" as const,
  concurrency: 4,
};
