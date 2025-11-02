# 📹 App 宣传视频生成器

基于 **Remotion** 和 **React** 的 App 宣传视频生成工具，支持多种宽高比输出和灵活的配置驱动工作流程。

## ✨ 主要特性

- **React 驱动视频**: 使用 Remotion 框架创建动态、可复用的视频组件
- **多宽高比支持**: 一次生成 9:16 (竖屏)、1:1 (方形)、16:9 (横屏) 三种比例的视频
- **配置驱动**: 通过 JSON 配置文件控制所有视频内容和样式
- **自动资源下载**: 自动从 URL 下载应用截图和二维码
- **高质量渲染**: 支持 H.264/H.265 编码，可配置渲染质量
- **命令行工具**: 简单易用的 CLI 接口
- **多语言支持**: 支持中文 (zh-CN) 和英文 (en-US)

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

## 📂 项目结构

```
.
├── src/
│   ├── cli.ts              # 命令行入口
│   ├── render.ts           # 视频渲染逻辑
│   ├── render-api.ts       # 渲染 API
│   ├── compositions/       # Remotion 视频组件
│   │   └── AppPromotion.tsx
│   ├── config/
│   │   ├── schema.ts       # 配置验证 Schema (Zod)
│   │   └── loader.ts       # 配置加载器
│   └── utils/
│       └── download.ts     # 资源下载工具
├── configs/                # 配置文件示例
│   ├── example.json
│   ├── kuaishou.json
│   └── weibo.json
├── outputs/                # 生成的视频输出目录
└── package.json
```

## 🐛 调试方式

Remotion Studio 提供了可视化的预览和调试界面，可以实时查看视频效果：

```bash
npm run preview
```
或者使用别名命令：

```bash
npm run studio
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
