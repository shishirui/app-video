#!/bin/bash

# App 视频生成器 - 完整演示脚本
# 使用示例配置生成宣传视频

set -e

echo "🎬 蒲公英 App 宣传视频生成器 - 完整演示"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# 步骤 1: 检查环境
echo ""
echo "✓ 检查环境..."
if ! command -v node &> /dev/null; then
    echo "❌ 错误: Node.js 未安装"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "❌ 错误: npm 未安装"
    exit 1
fi

echo "  ✓ Node.js 版本: $(node --version)"
echo "  ✓ npm 版本: $(npm --version)"

# 步骤 2: 检查依赖
echo ""
echo "✓ 检查项目依赖..."
if [ ! -d "node_modules" ]; then
    echo "  → 安装依赖..."
    npm install
fi

# 步骤 3: 构建项目
echo ""
echo "✓ 编译 TypeScript..."
npm run build

# 步骤 4: 创建示例配置
echo ""
echo "✓ 准备示例配置..."
EXAMPLE_CONFIG="configs/example.json"

if [ -f "$EXAMPLE_CONFIG" ]; then
    echo "  → 使用现有配置: $EXAMPLE_CONFIG"
else
    echo "  → 创建示例配置..."
    mkdir -p configs
fi

# 步骤 5: 生成视频
echo ""
echo "✓ 开始生成视频..."
echo ""
npm run generate "$EXAMPLE_CONFIG" || {
    echo ""
    echo "❌ 视频生成失败"
    exit 1
}

# 步骤 6: 完成
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ 演示完成!"
echo ""
echo "📂 输出位置: outputs/"
echo ""
echo "后续步骤:"
echo "  1. 查看生成的视频文件"
echo "  2. 编辑 configs/example.json 修改配置"
echo "  3. 运行 'npm run generate configs/your-app.json' 生成自定义视频"
echo ""
