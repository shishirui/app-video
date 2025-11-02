import { AspectRatio } from "../config/schema.js";

/**
 * 根据宽高比获取视频的尺寸
 */
export function getCompositionDimensions(aspectRatio: AspectRatio) {
  switch (aspectRatio) {
    case "9x16":
      return { width: 1080, height: 1920 };
    case "1x1":
      return { width: 1080, height: 1080 };
    case "16x9":
      return { width: 1920, height: 1080 };
  }
}
