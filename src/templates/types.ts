import React from "react";
import { AppVideoConfig, AspectRatio } from "../config/schema.js";

export interface TemplateProps {
  config: AppVideoConfig;
  aspectRatio: AspectRatio;
}

export type TemplateComponent = React.FC<TemplateProps>;
