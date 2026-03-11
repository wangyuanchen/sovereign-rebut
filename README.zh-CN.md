# RebutAI 🔥

> **永远不再哑口无言**

[English](./README.md) | 🇨🇳 中文版

AI驱动的回怼生成器，提供4种风格的精准反击方案。原生Web3，支持钱包登录和主流 EVM 链 USDT 支付。

---

## ✨ 功能特点

- 🎯 **4种回怼风格** - 理性辩证、情绪价值、绵里藏针、核弹打击
- 🌐 **国际化支持** - 中英双语，自动检测浏览器语言
- 🤖 **统一OpenRouter** - 单一网关管理模型配置
- 🔐 **Web3认证** - 仅钱包登录，通过RainbowKit
- 💳 **链上支付** - 主流 EVM 网络 USDT 支付
- 🎨 **编辑式设计** - 深色主题配颗粒纹理

---

## 🛠 技术栈

- **前端:** Next.js 15, TypeScript, Tailwind CSS, shadcn/ui
- **Web3:** Wagmi v2, Viem, RainbowKit, SIWE
- **数据库:** Drizzle ORM + PostgreSQL
- **AI:** OpenRouter（统一管理模型）
- **认证:** JWT with httpOnly cookies
- **支付:** Ethereum/Base/Arbitrum/Optimism/BSC 链上 USDT

---

## 📦 安装

```bash
# 克隆仓库
git clone https://github.com/wangyuanchen/sovereign-rebut.git
cd sovereign-rebut

# 安装依赖
pnpm install

# 配置环境变量
cp .env.example .env

# 推送数据库结构
pnpm db:push

# 启动开发服务器
pnpm dev
```

---

## ⚙️ 环境变量

根据 `.env.example` 创建 `.env` 文件：

```bash
# OpenRouter 配置
OPENROUTER_API_KEY=your_api_key
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
OPENROUTER_MODEL=google/gemini-2.5-flash-lite

# 数据库
DATABASE_URL=postgresql://user:password@host:5432/database

# 认证
JWT_SECRET=your_super_secret_key

# Web3
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
NEXT_PUBLIC_ETHEREUM_RPC_URL=https://ethereum-rpc.publicnode.com
NEXT_PUBLIC_BASE_RPC_URL=https://mainnet.base.org
NEXT_PUBLIC_ARBITRUM_RPC_URL=https://arb1.arbitrum.io/rpc
NEXT_PUBLIC_OPTIMISM_RPC_URL=https://mainnet.optimism.io
NEXT_PUBLIC_BSC_RPC_URL=https://bsc-dataseed.binance.org

# 支付
NEXT_PUBLIC_MERCHANT_WALLET=0xYourWalletAddress
```

---

## 💰 定价方案

| 方案 | 价格 | 额度 |
|------|------|------|
| 单次 | $5 USDT | 1次 |
| 10次包 | $19 USDT | 10次 |
| 终身无限 | $49 USDT | 无限 |

新用户获得 **3次免费额度**！

---

## 🗄 数据库结构

```sql
-- 用户表
CREATE TABLE users (
  wallet_address VARCHAR(42) PRIMARY KEY,
  credits INT DEFAULT 3,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 生成记录表
CREATE TABLE generations (
  id VARCHAR(25) PRIMARY KEY,
  wallet_address VARCHAR(42) REFERENCES users,
  scenario TEXT,
  scene_type scene_type,
  intensity INT,
  output JSON,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 支付记录表
CREATE TABLE payments (
  tx_hash VARCHAR(66) PRIMARY KEY,
  wallet_address VARCHAR(42) REFERENCES users,
  plan plan,
  amount_usdt DECIMAL(10,2),
  verified_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🚀 部署

### Vercel（推荐）

1. 导入项目到Vercel
2. 设置环境变量
3. 部署

### 手动部署

```bash
pnpm build
pnpm start
```

---

## 📁 项目结构

```
sovereign-rebut/
├── app/                    # Next.js App Router
│   ├── api/               # API路由
│   │   ├── auth/          # 认证接口
│   │   ├── generate/      # AI生成
│   │   └── verify-payment/ # 支付验证
│   ├── dashboard/         # 用户仪表盘
│   └── pricing/           # 定价页面
├── components/            # React组件
├── lib/
│   ├── ai/               # AI提供商抽象层
│   ├── db/               # 数据库结构和客户端
│   ├── i18n/             # 国际化
│   └── contracts/        # 支付合约配置
├── providers/            # Context providers
└── hooks/                # 自定义React hooks
```

---

## 🔥 4种回怼风格

| 风格 | 描述 | 杀伤力 |
|------|------|--------|
| 🧠 理性辩证 | 用逻辑和事实碾压对方 | ⭐⭐ |
| 💛 情绪价值 | 从情感层面建立道德高地 | ⭐⭐⭐ |
| 🗡 绵里藏针 | 表面温和礼貌，内含锋芒 | ⭐⭐⭐⭐ |
| ☢️ 核弹打击 | 一针见血直击要害 | ⭐⭐⭐⭐⭐ |

---

## 📄 许可证

本项目采用 **GPL-3.0 许可证** - 详见 [LICENSE](LICENSE) 文件。

---

## 🤝 贡献

欢迎贡献！请随时提交 Pull Request。

---

<p align="center">
  <b>由 RebutAI 团队用 ❤️ 构建</b><br>
  <sub>永远不再哑口无言</sub>
</p>
