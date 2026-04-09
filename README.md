# 🎨 Image Background Remover

在线图片背景移除工具，基于 Cloudflare Workers 和 remove.bg API 构建。

## ✨ 特性

- 🚀 **快速**：5 秒内完成处理
- 🎯 **简单**：上传即得，无需注册
- 🔒 **隐私**：图片不存储，处理完即删除
- 📱 **响应式**：支持手机/平板/桌面

## 🛠️ 技术栈

- **前端托管**：Cloudflare Pages
- **后端 API**：Cloudflare Workers
- **背景移除**：remove.bg API
- **无存储**：图片只在内存中流转

## 📦 部署步骤

### 1. 克隆项目

```bash
git clone https://github.com/2766605015-dot/image-background-remover.git
cd image-background-remover
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置 Cloudflare

```bash
# 登录 Cloudflare
npx wrangler login

# 设置 remove.bg API Key
npx wrangler secret put REMOVE_BG_API_KEY
```

### 4. 部署

```bash
npm run deploy
```

## 🔑 获取 remove.bg API Key

1. 访问 https://www.remove.bg/api
2. 注册/登录账号
3. 获取 API Key（免费额度：50 张/月）
4. 在 Cloudflare Workers 中配置为环境变量

## 💰 成本估算

| 项目 | 免费额度 | 超出后 |
|------|----------|--------|
| Cloudflare Workers | 10 万次/天 | $0.3/百万次 |
| Cloudflare Pages | 无限 | - |
| remove.bg | 50 张/月 | $0.2/张 |

## 📝 使用说明

1. 打开网站
2. 拖拽或点击上传图片（JPG/PNG，最大 25MB）
3. 等待处理完成（约 3-5 秒）
4. 预览效果并下载透明背景 PNG

## 📄 许可证

MIT License
