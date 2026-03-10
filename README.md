# RebutAI 🔥

> **永远不再哑口无言 | Never Be Speechless Again**

AI-powered comeback generator with 4 response styles. Web3 native with wallet auth & USDC payments on Base.

AI驱动的回怼生成器，提供4种风格的精准反击方案。原生Web3，支持钱包登录和Base链上USDC支付。

---

## ✨ Features | 功能特点

| Feature | 功能 | Description | 描述 |
|---------|------|-------------|------|
| 🎯 4 Comeback Styles | 4种回怼风格 | Rational, Emotional, Subtle, Nuclear | 理性辩证、情绪价值、绵里藏针、核弹打击 |
| 🌐 i18n Support | 国际化支持 | Chinese & English with auto-detection | 中英双语，自动检测浏览器语言 |
| 🤖 Multi-AI Provider | 多AI提供商 | Claude, GPT-4, DeepSeek configurable | 可配置Claude、GPT-4、DeepSeek |
| 🔐 Web3 Auth | Web3认证 | Wallet-only login via RainbowKit | 仅钱包登录，通过RainbowKit |
| 💳 On-chain Payment | 链上支付 | USDC on Base network | Base网络USDC支付 |
| 🎨 Editorial Design | 编辑式设计 | Dark theme with grain texture | 深色主题配颗粒纹理 |

---

## 🛠 Tech Stack | 技术栈

- **Frontend:** Next.js 15, TypeScript, Tailwind CSS, shadcn/ui
- **Web3:** Wagmi v2, Viem, RainbowKit, SIWE
- **Database:** Drizzle ORM + PlanetScale (MySQL)
- **AI:** Anthropic Claude / OpenAI / DeepSeek
- **Auth:** JWT with httpOnly cookies
- **Payment:** USDC on Base (Chain ID: 8453)

---

## 📦 Installation | 安装

```bash
# Clone the repository | 克隆仓库
git clone https://github.com/wangyuanchen/sovereign-rebut.git
cd sovereign-rebut

# Install dependencies | 安装依赖
pnpm install

# Set up environment variables | 配置环境变量
cp .env.example .env

# Push database schema | 推送数据库结构
pnpm db:push

# Start development server | 启动开发服务器
pnpm dev
```

---

## ⚙️ Environment Variables | 环境变量

Create a `.env` file based on `.env.example`:

根据 `.env.example` 创建 `.env` 文件：

```bash
# AI Provider Configuration | AI提供商配置
# Options: anthropic | openai | deepseek
AI_PROVIDER=anthropic

# Anthropic (Claude)
ANTHROPIC_API_KEY=your_api_key
ANTHROPIC_MODEL=claude-sonnet-4-20250514

# OpenAI (if using)
OPENAI_API_KEY=your_api_key
OPENAI_MODEL=gpt-4o

# DeepSeek (if using)
DEEPSEEK_API_KEY=your_api_key
DEEPSEEK_MODEL=deepseek-chat

# Database | 数据库
DATABASE_URL=mysql://user:password@host/database

# Auth | 认证
JWT_SECRET=your_super_secret_key

# Web3
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
NEXT_PUBLIC_BASE_RPC_URL=https://mainnet.base.org

# Payment | 支付
NEXT_PUBLIC_MERCHANT_WALLET=0xYourWalletAddress
```

---

## 💰 Pricing Plans | 定价方案

| Plan | 方案 | Price | 价格 | Credits | 额度 |
|------|------|-------|------|---------|------|
| Single | 单次 | $5 USDC | $5 USDC | 1 | 1次 |
| Pack 10 | 10次包 | $19 USDC | $19 USDC | 10 | 10次 |
| Unlimited | 终身无限 | $49 USDC | $49 USDC | ∞ | 无限 |

New users get **3 free credits** | 新用户获得 **3次免费额度**

---

## 🗄 Database Schema | 数据库结构

```sql
-- Users | 用户表
CREATE TABLE users (
  wallet_address VARCHAR(42) PRIMARY KEY,
  credits INT DEFAULT 3,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Generations | 生成记录表
CREATE TABLE generations (
  id VARCHAR(25) PRIMARY KEY,
  wallet_address VARCHAR(42) REFERENCES users,
  scenario TEXT,
  scene_type ENUM('workplace','family','relationship','daily'),
  intensity INT,
  output JSON,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Payments | 支付记录表
CREATE TABLE payments (
  tx_hash VARCHAR(66) PRIMARY KEY,
  wallet_address VARCHAR(42) REFERENCES users,
  plan ENUM('single','pack10','unlimited'),
  amount_usdc DECIMAL(10,2),
  verified_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🚀 Deployment | 部署

### Vercel (Recommended | 推荐)

1. Import project to Vercel | 导入项目到Vercel
2. Set environment variables | 设置环境变量
3. Deploy | 部署

### Manual | 手动部署

```bash
pnpm build
pnpm start
```

---

## 📁 Project Structure | 项目结构

```
sovereign-rebut/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   │   ├── auth/          # Auth endpoints
│   │   ├── generate/      # AI generation
│   │   └── verify-payment/ # Payment verification
│   ├── dashboard/         # User dashboard
│   └── pricing/           # Pricing page
├── components/            # React components
├── lib/
│   ├── ai/               # AI provider abstraction
│   ├── db/               # Database schema & client
│   ├── i18n/             # Internationalization
│   └── contracts/        # USDC contract config
├── providers/            # Context providers
└── hooks/                # Custom React hooks
```

---

## 🔥 4 Comeback Styles | 4种回怼风格

| Style | 风格 | Description | 描述 | Damage | 杀伤力 |
|-------|------|-------------|------|--------|--------|
| 🧠 Rational | 理性辩证 | Logic and facts | 用逻辑和事实碾压 | ⭐⭐ |
| 💛 Emotional | 情绪价值 | Moral high ground | 情感层面的道德高地 | ⭐⭐⭐ |
| 🗡 Subtle | 绵里藏针 | Polite but sharp | 表面温和，内含锋芒 | ⭐⭐⭐⭐ |
| ☢️ Nuclear | 核弹打击 | Maximum impact | 一针见血直击要害 | ⭐⭐⭐⭐⭐ |

---

## 📄 License | 许可证

This project is licensed under the **GPL-3.0 License** - see the [LICENSE](LICENSE) file for details.

本项目采用 **GPL-3.0 许可证** - 详见 [LICENSE](LICENSE) 文件。

---

## 🤝 Contributing | 贡献

Contributions are welcome! Please feel free to submit a Pull Request.

欢迎贡献！请随时提交 Pull Request。

---

<p align="center">
  <b>Built with ❤️ by the RebutAI Team</b><br>
  <sub>永远不再哑口无言 | Never Be Speechless Again</sub>
</p>
