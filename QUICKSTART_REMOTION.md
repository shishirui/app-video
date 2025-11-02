# 快速开始 - Remotion 视频生成

## 5分钟上手

### 步骤 1：准备环境

确保已安装依赖：
```bash
npm install
```

### 步骤 2：编译项目

```bash
npm run build
```

### 步骤 3：使用示例配置生成视频

```bash
npm run generate configs/example.json
```

### 步骤 4：查看生成的视频

生成的视频保存在：
```
outputs/Tube PiP/
  ├── Tube PiP_9x16.mp4      (竖屏版本)
  ├── Tube PiP_1x1.mp4       (方形版本)
  └── Tube PiP_16x9.mp4      (横屏版本)
```

## 创建自己的视频

### 1. 创建配置文件

创建 `configs/my-app.json`：

```json
{
  "appName": "我的应用名称",
  "tagline": "应用的描述或标语",
  "features": [
    "特性一",
    "特性二", 
    "特性三"
  ],
  "screens": [
    "https://your-image-url/screenshot1.jpg",
    "https://your-image-url/screenshot2.jpg",
    "https://your-image-url/screenshot3.jpg"
  ],
  "qr": "https://your-image-url/qr-code.png",
  "theme": {
    "brandColor": "#3B82F6",
    "backgroundColor": "#FFFFFF"
  },
  "output": ["9x16", "1x1", "16x9"],
  "duration": 8,
  "fps": 30
}
```

### 2. 生成视频

```bash
npm run generate configs/my-app.json
```

## 常用命令

| 命令 | 说明 |
|------|------|
| `npm run build` | 编译 TypeScript |
| `npm run dev` | 监视模式编译 |
| `npm run generate <config>` | 生成视频 |
| `npm run type-check` | 类型检查 |

## 调试技巧

### 查看编译错误

```bash
npm run type-check
```

### 查看缓存的下载文件

```bash
ls -la .cache/images/
```

### 使用更详细的输出

在命令前添加调试标志：
```bash
DEBUG=* npm run generate configs/example.json
```

## 常见问题

**Q: 视频文件很大怎么办？**
A: 使用不同的质量设置：
```bash
# 生成较小文件的版本
QUALITY=low npm run generate configs/example.json
```

**Q: 如何自定义视频样式？**
A: 编辑 `src/compositions/AppPromotion.tsx` 文件中的样式。

**Q: 支持本地图片吗？**
A: 是的，将本地文件路径放在配置中：
```json
{
  "screens": [
    "file:///absolute/path/to/image.jpg"
  ]
}
```

## 下一步

- 查看 [REMOTION_GUIDE.md](./REMOTION_GUIDE.md) 了解详细文档
- 修改 `src/compositions/AppPromotion.tsx` 自定义视频
- 探索 [Remotion 官方示例](https://www.remotion.dev/docs)

## 需要帮助？

- 查看错误信息中的文件路径
- 确认所有 URL 都可访问
- 检查 JSON 配置文件格式是否正确
