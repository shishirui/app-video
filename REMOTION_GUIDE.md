# 使用 Remotion 生成 App 宣传视频

## 项目设置

这个项目现在配置为使用 **Remotion** 来生成专业的 App 宣传视频。

### 什么是 Remotion？

Remotion 是一个用 React 和 TypeScript 创建视频的框架。它允许你用熟悉的 Web 技术来编写视频，包括：
- React 组件用于 UI
- TypeScript 进行类型安全
- 动画和过渡效果
- 自定义媒体处理

## 项目结构

```
app-video/
├── src/
│   ├── cli.ts                          # 命令行入口
│   ├── render-api.ts                   # Remotion 渲染 API
│   ├── compositions/
│   │   ├── AppPromotion.tsx            # 视频组件
│   │   └── Root.tsx                    # Remotion Root 配置
│   ├── config/                         # 配置管理
│   └── utils/                          # 工具函数
├── remotion/
│   └── Root.tsx                        # Remotion 项目根组件
├── remotion.config.ts                  # Remotion 配置
├── package.json                        # 依赖
└── tsconfig.json                       # TypeScript 配置
```

## 功能特性

### 视频内容

生成的视频包含以下内容：

1. **应用名称和标语** - 在视频开始时淡入
2. **应用截图** - 带有浮动动画效果
3. **应用特性** - 列出主要功能
4. **二维码和下载提示** - 在视频结尾显示

### 支持的宽高比

- **9x16** (竖屏，1080x1920) - 适合 TikTok、抖音、Instagram Reels
- **1x1** (方形，1080x1080) - 适合 Instagram Feed
- **16x9** (横屏，1920x1080) - 适合 YouTube、网页

## 使用方法

### 1. 准备配置文件

创建一个 JSON 配置文件 (例如 `configs/my-app.json`):

```json
{
  "appName": "我的应用",
  "tagline": "改变生活的应用",
  "features": ["功能1", "功能2", "功能3"],
  "screens": [
    "https://example.com/screenshot1.png",
    "https://example.com/screenshot2.png",
    "https://example.com/screenshot3.png"
  ],
  "qr": "https://example.com/qr-code.png",
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

### 2. 生成视频

```bash
npm run generate configs/my-app.json
```

### 3. 视频输出

生成的视频将保存到：
```
outputs/{应用名称}/{应用名称}_9x16.mp4
outputs/{应用名称}/{应用名称}_1x1.mp4
outputs/{应用名称}/{应用名称}_16x9.mp4
```

## 视频自定义

### 修改视频内容

编辑 `src/compositions/AppPromotion.tsx` 来自定义视频的布局和动画。

### 关键部分：

1. **动画时间点** - 控制每个元素出现的时间
2. **样式** - 调整字体、颜色、大小等
3. **布局** - 修改元素的位置和大小

### 示例：修改标题样式

```tsx
<h1
  style={{
    fontSize: Math.min(width * 0.12, 72),  // 调整字体大小
    fontWeight: "bold",
    color: theme.brandColor,
    margin: 0,
    lineHeight: 1.2,
  }}
>
  {config.appName}
</h1>
```

## 动画效果

当前支持的动画：

1. **淡入淡出** - 所有元素都使用淡入淡出过渡
2. **浮动效果** - 截图有轻微的上下浮动效果
3. **时序控制** - 使用 `interpolate` 函数实现精确的动画时间

### 添加自定义动画

使用 Remotion 的 `interpolate` 函数：

```tsx
const scale = interpolate(
  frame,
  [startFrame, endFrame],
  [0.5, 1],
  { easing: Easing.out(Easing.cubic) }
);
```

## 高级功能

### 1. 图片缓存

下载的图片自动缓存在 `.cache/images/` 目录中，加快后续渲染。

### 2. 质量设置

支持三种质量等级：
- `low` (CRF=28) - 文件较小，质量一般
- `medium` (CRF=23) - 平衡质量和文件大小
- `high` (CRF=18) - 最高质量，文件较大

### 3. 编解码器选择

支持多种编解码器：
- `h264` (H.264/AVC) - 最通用
- `h265` (HEVC) - 更高的压缩率
- `prores` - 专业级编解码器

## 故障排除

### 问题：视频无法播放

**原因**：可能是编解码器问题
**解决**：使用 `--codec=h264` 确保最大兼容性

### 问题：渲染很慢

**解决方案**：
1. 减少并发数：`--concurrency=2`
2. 使用较低的质量设置
3. 减少视频时长

### 问题：图片未显示

**检查**：
1. 确认图片 URL 可访问
2. 检查 `.cache/images/` 中的缓存文件
3. 确保配置文件中的路径正确

## 配置选项详解

| 选项 | 类型 | 说明 |
|------|------|------|
| `appName` | string | 应用名称 |
| `tagline` | string | 应用标语/副标题 |
| `features` | string[] | 应用特性列表 |
| `screens` | string[] | 应用截图 URL 列表 |
| `qr` | string | 二维码 URL |
| `theme.brandColor` | string | 品牌颜色 (hex) |
| `theme.backgroundColor` | string | 背景颜色 (hex) |
| `output` | string[] | 输出宽高比 |
| `duration` | number | 视频时长 (秒) |
| `fps` | number | 帧率 (默认 30) |

## 下一步

1. **添加音频** - 将 `voiceover` 设为 true 并提供音频文件
2. **自定义动画** - 修改 `AppPromotion.tsx` 中的动画
3. **添加字幕** - 在视频中添加字幕轨道
4. **批量生成** - 为多个应用批量生成视频

## 相关资源

- [Remotion 官方文档](https://www.remotion.dev/)
- [React 文档](https://react.dev/)
- [TypeScript 文档](https://www.typescriptlang.org/)
