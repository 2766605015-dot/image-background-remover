# 🎨 Image Background Remover

在线图片背景移除工具，基于 **Next.js 14** + **Tailwind CSS** + **remove.bg API** 构建。

## ✨ 特性

- 🚀 **快速**：5 秒内完成处理
- 🎯 **简单**：上传即得，无需注册
- 🔒 **隐私**：图片不存储，处理完即删除
- 📱 **响应式**：支持手机/平板/桌面
- 🎨 **现代化 UI**：Tailwind CSS 精美设计

## 🛠️ 技术栈

- **前端框架**：Next.js 14 (App Router)
- **样式**：Tailwind CSS
- **语言**：TypeScript
- **背景移除**：remove.bg API
- **部署**：Vercel / 任意 Node.js 服务器

## 📦 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

```bash
# 复制环境变量示例文件
cp .env.example .env.local

# 编辑 .env.local，填入你的 remove.bg API Key
REMOVE_BG_API_KEY=your_api_key_here
```

### 3. 获取 remove.bg API Key

1. 访问 https://www.remove.bg/api
2. 注册/登录账号
3. 获取 API Key（免费额度：50 张/月）

### 4. 运行开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

### 5. 构建生产版本

```bash
npm run build
npm run start
```

## 🚀 部署到 Vercel

### 方式一：一键部署

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/2766605015-dot/image-background-remover)

### 方式二：手动部署

1. 安装 Vercel CLI
```bash
npm install -g vercel
```

2. 部署
```bash
vercel
```

3. 设置环境变量
- 在 Vercel Dashboard 中添加 `REMOVE_BG_API_KEY`

## 💰 成本估算

| 项目 | 免费额度 | 超出后 |
|------|----------|--------|
| Vercel Hobby | 无限 | - |
| remove.bg | 50 张/月 | $0.2/张 |

**假设每月 1000 张图**：
- 免费 50 张
- 950 张 × $0.2 = **$190/月**

## 📝 使用说明

1. 打开网站
2. 拖拽或点击上传图片（JPG/PNG，最大 25MB）
3. 等待处理完成（约 3-5 秒）
4. 预览效果并下载透明背景 PNG

## 📁 项目结构

```
image-background-remover/
├── app/
│   ├── api/
│   │   └── remove/
│   │       └── route.ts      # API 路由
│   ├── globals.css           # 全局样式
│   ├── layout.tsx            # 根布局
│   └── page.tsx              # 主页面
├── .env.example              # 环境变量示例
├── next.config.js            # Next.js 配置
├── tailwind.config.js        # Tailwind 配置
├── tsconfig.json             # TypeScript 配置
└── package.json
```

## 📄 许可证

MIT License

## 🙏 致谢

- [remove.bg](https://www.remove.bg/) - 提供背景移除 API
- [Next.js](https://nextjs.org/) - React 框架
- [Tailwind CSS](https://tailwindcss.com/) - 实用优先 CSS 框架
