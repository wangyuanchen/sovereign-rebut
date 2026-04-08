# RebutAI 🔥

> **Never Be Speechless Again**

[🇨🇳 中文版](./README.zh-CN.md) | English

AI-powered comeback generator with 4 response styles. Web3 native with wallet auth & USDT payments across major EVM chains.

<a href="https://www.producthunt.com/products/rebutai?embed=true&amp;utm_source=badge-featured&amp;utm_medium=badge&amp;utm_campaign=badge-rebutai" target="_blank" rel="noopener noreferrer"><img alt="RebutAI - AI-powered rebuttals. Wallet login. No subscriptions. | Product Hunt" width="250" height="54" src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1118538&amp;theme=light&amp;t=1775631750896"></a>

<a href="https://peerpush.net/p/rebutai" target="_blank" rel="noopener" style="width: 230px;"><img src="https://peerpush.net/p/rebutai/badge.png" alt="RebutAI badge" style="width: 230px;" /></a>

---

## ✨ Features

- 🎯 **4 Comeback Styles** - Rational, Emotional, Subtle, Nuclear
- 🌐 **i18n Support** - Chinese & English with auto-detection
- 🤖 **Unified OpenRouter** - Single gateway for model configuration
- 🔐 **Web3 Auth** - Wallet-only login via RainbowKit
- 💳 **On-chain Payment** - USDT on major EVM chains
- 🎨 **Editorial Design** - Dark theme with grain texture

---

## 🛠 Tech Stack

- **Frontend:** Next.js 15, TypeScript, Tailwind CSS, shadcn/ui
- **Web3:** Wagmi v2, Viem, RainbowKit, SIWE
- **Database:** Drizzle ORM + PostgreSQL
- **AI:** OpenRouter (single model gateway)
- **Auth:** JWT with httpOnly cookies
- **Payment:** USDT on Ethereum/Base/Arbitrum/Optimism/BSC

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
# OpenRouter Configuration
OPENROUTER_API_KEY=your_api_key
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
OPENROUTER_MODEL=google/gemini-2.5-flash-lite

# Database
DATABASE_URL=postgresql://user:password@host:5432/database

# Auth
JWT_SECRET=your_super_secret_key

# Web3
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
NEXT_PUBLIC_ETHEREUM_RPC_URL=https://ethereum-rpc.publicnode.com
NEXT_PUBLIC_BASE_RPC_URL=https://mainnet.base.org
NEXT_PUBLIC_ARBITRUM_RPC_URL=https://arb1.arbitrum.io/rpc
NEXT_PUBLIC_OPTIMISM_RPC_URL=https://mainnet.optimism.io
NEXT_PUBLIC_BSC_RPC_URL=https://bsc-dataseed.binance.org

# Payment
NEXT_PUBLIC_MERCHANT_WALLET=0xYourWalletAddress
```

---

## 💰 Pricing Plans

| Plan | Price | Credits |
|------|-------|---------|
| Single | $5 USDT | 1 |
| Pack 10 | $19 USDT | 10 |
| Unlimited | $49 USDT | ∞ |

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
  scene_type scene_type,
  intensity INT,
  output JSON,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Payments
CREATE TABLE payments (
  tx_hash VARCHAR(66) PRIMARY KEY,
  wallet_address VARCHAR(42) REFERENCES users,
  plan plan,
  amount_usdt DECIMAL(10,2),
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
│   └── contracts/        # Payment contract config
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
