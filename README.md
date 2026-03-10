# RebutAI 🔥

> **Never Be Speechless Again**

[🇨🇳 中文版](./README.zh-CN.md) | English

AI-powered comeback generator with 4 response styles. Web3 native with wallet auth & USDC payments on Base.

---

## ✨ Features

- 🎯 **4 Comeback Styles** - Rational, Emotional, Subtle, Nuclear
- 🌐 **i18n Support** - Chinese & English with auto-detection
- 🤖 **Multi-AI Provider** - Claude, GPT-4, DeepSeek configurable
- 🔐 **Web3 Auth** - Wallet-only login via RainbowKit
- 💳 **On-chain Payment** - USDC on Base network
- 🎨 **Editorial Design** - Dark theme with grain texture

---

## 🛠 Tech Stack

- **Frontend:** Next.js 15, TypeScript, Tailwind CSS, shadcn/ui
- **Web3:** Wagmi v2, Viem, RainbowKit, SIWE
- **Database:** Drizzle ORM + PlanetScale (MySQL)
- **AI:** Anthropic Claude / OpenAI / DeepSeek
- **Auth:** JWT with httpOnly cookies
- **Payment:** USDC on Base (Chain ID: 8453)

---

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/wangyuanchen/sovereign-rebut.git
cd sovereign-rebut

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env

# Push database schema
pnpm db:push

# Start development server
pnpm dev
```

---

## ⚙️ Environment Variables

Create a `.env` file based on `.env.example`:

```bash
# AI Provider Configuration
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

# Database
DATABASE_URL=mysql://user:password@host/database

# Auth
JWT_SECRET=your_super_secret_key

# Web3
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
NEXT_PUBLIC_BASE_RPC_URL=https://mainnet.base.org

# Payment
NEXT_PUBLIC_MERCHANT_WALLET=0xYourWalletAddress
```

---

## 💰 Pricing Plans

| Plan | Price | Credits |
|------|-------|---------|
| Single | $5 USDC | 1 |
| Pack 10 | $19 USDC | 10 |
| Unlimited | $49 USDC | ∞ |

New users get **3 free credits**!

---

## 🗄 Database Schema

```sql
-- Users
CREATE TABLE users (
  wallet_address VARCHAR(42) PRIMARY KEY,
  credits INT DEFAULT 3,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Generations
CREATE TABLE generations (
  id VARCHAR(25) PRIMARY KEY,
  wallet_address VARCHAR(42) REFERENCES users,
  scenario TEXT,
  scene_type ENUM('workplace','family','relationship','daily'),
  intensity INT,
  output JSON,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Payments
CREATE TABLE payments (
  tx_hash VARCHAR(66) PRIMARY KEY,
  wallet_address VARCHAR(42) REFERENCES users,
  plan ENUM('single','pack10','unlimited'),
  amount_usdc DECIMAL(10,2),
  verified_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🚀 Deployment

### Vercel (Recommended)

1. Import project to Vercel
2. Set environment variables
3. Deploy

### Manual

```bash
pnpm build
pnpm start
```

---

## 📁 Project Structure

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

## 🔥 4 Comeback Styles

| Style | Description | Damage |
|-------|-------------|--------|
| 🧠 Rational | Crush with logic and facts | ⭐⭐ |
| 💛 Emotional | Establish moral high ground | ⭐⭐⭐ |
| 🗡 Subtle | Polite surface, sharp edge | ⭐⭐⭐⭐ |
| ☢️ Nuclear | Maximum psychological impact | ⭐⭐⭐⭐⭐ |

---

## 📄 License

This project is licensed under the **GPL-3.0 License** - see the [LICENSE](LICENSE) file for details.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

<p align="center">
  <b>Built with ❤️ by the RebutAI Team</b><br>
  <sub>Never Be Speechless Again</sub>
</p>
