# 📹 App 宣传视频生成器

自动化的 App 宣传视频生成工具，支持多种宽高比输出和灵活的配置驱动工作流程。

## ✨ 主要特性

- **多模板支持**: 内置 3 套精美视频模板 (default, minimal, modern)，可轻松扩展
- **多宽高比支持**: 一次生成 9:16 (竖屏)、1:1 (方形)、16:9 (横屏) 三种比例的视频
- **配置驱动**: 通过 JSON 配置文件控制所有视频内容和样式
- **自动资源下载**: 自动从 URL 下载应用截图和二维码
- **高质量渲染**: 支持 H.264/H.265 编码，可配置渲染质量
- **命令行工具**: 简单易用的 CLI 接口
- **多语言支持**: 支持中文 (zh-CN) 和英文 (en-US)等

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
npm run build
```

### 2. 生成视频

```bash
npm run generate configs/example.json
```

输出文件保存在 `outputs/{appName}/` 目录下。

## 🎨 视频模板

现在支持 3 套内置模板，可以在配置文件中指定：

- **default** - 现代玻璃态设计，带有 3D 动画和霓虹效果
- **minimal** - 简约清爽设计，简洁的淡入动画
- **modern** - 科技霓虹风格，深色背景配合发光效果

在配置文件中添加 `template` 字段来选择模板：

```json
{
  "appName": "My App",
  "template": "minimal",
  ...
}
```

## 📂 项目结构

```
.
├── src/
│   ├── cli.ts              # 命令行入口
│   ├── render.ts           # 视频渲染逻辑
│   ├── render-api.ts       # 渲染 API
│   ├── compositions/       # Remotion 视频组件
│   │   └── AppPromotion.tsx
│   ├── templates/          # 视频模板
│   │   ├── types.ts        # 模板类型定义
│   │   ├── index.ts        # 模板注册中心
│   │   ├── DefaultTemplate.tsx   # 默认模板
│   │   ├── MinimalTemplate.tsx   # 简约模板
│   │   └── ModernTemplate.tsx    # 现代模板
│   ├── config/
│   │   ├── schema.ts       # 配置验证 Schema (Zod)
│   │   └── loader.ts       # 配置加载器
│   └── utils/
│       └── download.ts     # 资源下载工具
├── configs/                # 配置文件示例
│   ├── example.json
│   ├── app1.json
│   └── modern-test.json
├── outputs/                # 生成的视频输出目录
├── TEMPLATES.md            # 模板系统文档
└── package.json
```

## 🐛 调试方式

本项目提供了可视化的预览和调试界面，可以实时查看视频效果：

```bash
npm run preview
```

在 Studio 中你可以：
- 📹 实时预览视频效果
- ⏯️ 控制播放进度和速度
- 🎨 调试组件和动画
- 📊 查看时间轴和帧信息
- 🔄 热重载修改后的代码

**提示**: 修改源代码后，Studio 会自动重新加载，无需重启。

## 📝 技术栈

- **Remotion** - 视频合成框架
- **React** - UI 组件库
- **TypeScript** - 类型安全的编程语言
- **Zod** - 运行时数据验证
- **Sharp** - 图像处理
- **Axios** - HTTP 客户端

## 📜 License

MIT
