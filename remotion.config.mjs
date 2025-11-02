import { getCompositions } from "remotion";
import { AppPromotionVideo, getCompositionDimensions } from "./dist/compositions/AppPromotion.js";

export const getCompositions = async () => {
  return [
    {
      id: "AppPromotionVideo_9x16",
      component: AppPromotionVideo,
      durationInFrames: 240,
      fps: 30,
      width: 1080,
      height: 1920,
      defaultProps: {
        config: {},
        aspectRatio: "9x16",
      },
    },
    {
      id: "AppPromotionVideo_1x1",
      component: AppPromotionVideo,
      durationInFrames: 240,
      fps: 30,
      width: 1080,
      height: 1080,
      defaultProps: {
        config: {},
        aspectRatio: "1x1",
      },
    },
    {
      id: "AppPromotionVideo_16x9",
      component: AppPromotionVideo,
      durationInFrames: 240,
      fps: 30,
      width: 1920,
      height: 1080,
      defaultProps: {
        config: {},
        aspectRatio: "16x9",
      },
    },
  ];
};
