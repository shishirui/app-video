# 🎉 App 宣传视频生成器 - 项目完成！

## 成功！✅

项目已成功配置并生成了第一个视频！三个视频文件都已正确生成：

```
outputs/Tube PiP/
├── Tube PiP_9x16.mp4   (405 KB) - 竖屏版本 (9x16)
├── Tube PiP_1x1.mp4    (401 KB) - 方形版本 (1x1)
└── Tube PiP_16x9.mp4   (410 KB) - 横屏版本 (16x9)
```

**所有视频都是有效的 ISO Media MP4 文件，可以直接播放！**

## 快速开始

### 1. 生成你自己的视频

```bash
npm run generate configs/example.json
```

### 2. 配置文件示例

创建 `configs/my-app.json`:

```json
{
  "appName": "我的应用",
  "tagline": "改变世界的应用",
  "features": ["功能1", "功能2", "功能3"],
  "screens": [
    "https://example.com/screen1.png",
    "https://example.com/screen2.png",
    "https://example.com/screen3.png"
  ],
  "qr": "https://example.com/qr.png",
  "theme": {
    "brandColor": "#3B82F6",
    "backgroundColor": "#FFFFFF"
  },
  "locale": "zh-CN",
  "output": ["9x16", "1x1", "16x9"],
  "voiceover": false,
  "duration": 8,
  "fps": 30
}
```

### 3. 生成视频

```bash
npm run generate configs/my-app.json
```

输出将保存到：
```
outputs/{应用名称}/{应用名称}_9x16.mp4
outputs/{应用名称}/{应用名称}_1x1.mp4
outputs/{应用名称}/{应用名称}_16x9.mp4
```

## 技术架构

### 工作流程

```
配置文件 (JSON)
    ↓
加载配置 → 验证配置 (Zod Schema)
    ↓
下载图片 → 缓存到 .cache/images/
    ↓
初始化 Remotion
    ↓
生成 3 个宽高比的视频 (并发)
    ↓
输出 MP4 文件 (H.264 编码)
```

### 核心技术

| 技术 | 版本 | 用途 |
|------|------|------|
| Remotion | 4.0 | 视频渲染框架 |
| React | 18.2 | UI 组件框架 |
| TypeScript | 5.2 | 类型安全 |
| Zod | 3.22 | 配置验证 |
| Sharp | 0.32 | 图片处理 |
| H.264 | - | 视频编码 |

## 项目结构

```
src/
├── cli.ts                     # 命令行入口
├── Root.tsx                   # Remotion 根组件
├── index-entry.tsx            # Remotion 入口点
├── render-api.ts              # 渲染 API
├── compositions/
│   ├── AppPromotion.tsx       # 视频组件 (核心)
│   └── Root.tsx               # 组件容器
├── config/
│   ├── loader.ts              # 配置加载
│   └── schema.ts              # 配置 Schema
└── utils/
    └── download.ts            # 图片下载

dist/                          # 编译输出
outputs/                       # 视频输出
.cache/images/                 # 图片缓存
```

## 视频内容

每个生成的视频包含：

1. **标题部分** (0-2 秒)
   - 应用名称 (淡入动画)
   - 应用标语

2. **截图部分** (2.5-5 秒)
   - 3 张应用截图
   - 浮动效果
   - 盒形阴影

3. **特性部分** (2.5-5 秒)
   - 应用特性列表
   - 项目符号点

4. **二维码部分** (5.5-8 秒)
   - 二维码显示 (淡入动画)
   - "立即下载" 文字

## 配置选项详解

| 选项 | 类型 | 必需 | 说明 |
|------|------|------|------|
| `appName` | string | ✅ | 应用名称 |
| `tagline` | string | ✅ | 应用标语 |
| `features` | string[] | ✅ | 应用特性列表 |
| `screens` | string[] | ✅ | 截图 URL 列表 |
| `qr` | string | ✅ | 二维码 URL |
| `theme` | object | ❌ | 主题配置 |
| `theme.brandColor` | string | ❌ | 品牌颜色 (#RGB) |
| `theme.backgroundColor` | string | ❌ | 背景颜色 (#RGB) |
| `locale` | string | ✅ | 语言 (zh-CN/en-US) |
| `output` | string[] | ✅ | 输出宽高比 |
| `duration` | number | ✅ | 视频时长 (秒) |
| `fps` | number | ✅ | 帧率 (默认 30) |
| `voiceover` | boolean | ❌ | 是否有配音 |

## 自定义视频

### 修改动画时间

编辑 `src/compositions/AppPromotion.tsx`:

```typescript
// 调整这些值来改变每个元素出现的时间
const titleStartFrame = fps * 0.5;      // 标题开始
const titleEndFrame = fps * 2;          // 标题结束
const featuresStartFrame = fps * 2.5;   // 特性开始
const qrStartFrame = fps * 5.5;         // 二维码开始
```

### 修改样式

```typescript
// 修改颜色、字体大小、位置等
<h1 style={{
  fontSize: Math.min(width * 0.12, 72),  // 字体大小
  fontWeight: "bold",
  color: theme.brandColor,               // 颜色
  margin: 0,
  lineHeight: 1.2,
}}>
```

### 添加自定义效果

使用 Remotion 的 `interpolate` 函数：

```typescript
const scale = interpolate(
  frame,
  [startFrame, endFrame],
  [0.5, 1],
  { easing: Easing.out(Easing.cubic) }
);
```

## 故障排除

### 问题：视频无法生成

**检查清单：**
- ✅ 确保配置文件存在
- ✅ 验证 URL 可访问
- ✅ 检查 Node.js 版本 (>=14)
- ✅ 运行 `npm install`

### 问题：图片无法加载

**解决方案：**
1. 检查图片 URL 是否可访问
2. 确认网络连接
3. 检查 `.cache/images/` 中的缓存

### 问题：渲染很慢

**优化建议：**
1. 减少 `--concurrency`: 修改 `src/render-api.ts`
2. 降低视频质量: 改变 CRF 值 (更高 = 更快但质量差)
3. 缩短视频时长: 修改配置中的 `duration`

## 常见任务

### 为多个应用生成视频

```bash
npm run generate configs/app1.json
npm run generate configs/app2.json
npm run generate configs/app3.json
```

### 修改视频质量

编辑 `src/render-api.ts`:

```typescript
const qualitySettings = {
  low: "28",      // 快速，质量一般
  medium: "23",   // 平衡
  high: "18",     // 最高质量
};
```

### 更改输出格式

编辑 `src/render-api.ts`:

```typescript
`--codec=${options.codec || "h264"}`,  // 改为 h265 或 prores
```

## API 参考

### CLI 命令

```bash
# 生成视频
npm run generate <config.json>

# 编译项目
npm run build

# 开发模式
npm run dev

# 类型检查
npm run type-check
```

### 配置加载器

```typescript
import { loadConfig } from "./config/loader.js";

const config = await loadConfig("configs/my-app.json");
```

### 渲染 API

```typescript
import { renderAppVideoWithCLI } from "./render-api.js";

const results = await renderAppVideoWithCLI(config, {
  configPath: "configs/my-app.json",
  outputDir: "outputs/MyApp",
  qualities: "high",
  codec: "h264",
});
```

## 下一步

### 立即可做的事

1. ✅ **生成视频** - 运行 `npm run generate configs/example.json`
2. ✅ **在播放器中打开** - 播放生成的 MP4 文件
3. ✅ **自定义配置** - 创建自己的 JSON 配置
4. ✅ **修改样式** - 编辑 `AppPromotion.tsx`

### 长期改进

- [ ] 添加背景音乐
- [ ] 实现更复杂的动画
- [ ] 支持自定义字体
- [ ] 添加文本外轮廓
- [ ] 支持渐变背景
- [ ] 实现视频预览
- [ ] 添加字幕支持

## 支持和资源

- **Remotion 文档**: https://www.remotion.dev/docs
- **React 文档**: https://react.dev
- **TypeScript 文档**: https://www.typescriptlang.org
- **MP4 规范**: https://en.wikipedia.org/wiki/MPEG-4_Part_14

## 项目文件

- `README.md` - 项目说明
- `REMOTION_GUIDE.md` - 详细使用指南
- `PROJECT_SETUP_COMPLETE.md` - 设置完成文档
- `package.json` - 项目依赖
- `tsconfig.json` - TypeScript 配置

## 许可证

该项目使用开源组件。详见 `package.json` 中的依赖项。

---

**祝贺！** 🎬 你现在拥有一个完整的 App 宣传视频生成系统！
