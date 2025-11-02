import { TemplateName } from "../config/schema.js";
import { TemplateComponent } from "./types.js";
import { DefaultTemplate } from "./DefaultTemplate.js";
import { MinimalTemplate } from "./MinimalTemplate.js";
import { ModernTemplate } from "./ModernTemplate.js";

// 模板注册表
const TEMPLATE_REGISTRY: Record<TemplateName, TemplateComponent> = {
  default: DefaultTemplate,
  minimal: MinimalTemplate,
  modern: ModernTemplate,
};

/**
 * 根据模板名称获取对应的模板组件
 */
export function getTemplate(templateName: TemplateName): TemplateComponent {
  const template = TEMPLATE_REGISTRY[templateName];
  if (!template) {
    console.warn(`Template "${templateName}" not found, using default template`);
    return TEMPLATE_REGISTRY.default;
  }
  return template;
}

/**
 * 获取所有可用的模板名称
 */
export function getAvailableTemplates(): TemplateName[] {
  return Object.keys(TEMPLATE_REGISTRY) as TemplateName[];
}

// 导出所有模板
export { DefaultTemplate } from "./DefaultTemplate.js";
export { MinimalTemplate } from "./MinimalTemplate.js";
export { ModernTemplate } from "./ModernTemplate.js";
export type { TemplateProps, TemplateComponent } from "./types.js";
