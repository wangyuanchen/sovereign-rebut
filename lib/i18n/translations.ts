export const locales = ["zh", "en"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "zh";

export const translations = {
  zh: {
    // Navbar
    nav: {
      credits: "次",
      unlimited: "无限",
      connectWallet: "连接钱包",
      wrongNetwork: "网络错误",
    },
    // Hero
    hero: {
      eyebrow: "AI驱动的回怼生成器",
      title1: "永远不再",
      title2: "哑口无言",
      subtitle: "输入任何让你憋屈的场景，获得4种风格的精准反击方案——从理性辩证到核弹级打击。",
    },
    // Form
    form: {
      scenarioLabel: "描述场景",
      scenarioPlaceholder: "描述让你憋屈的场景...",
      scenarioHint: "至少10个字符",
      sceneTypeLabel: "场景类型",
      intensityLabel: "核弹强度",
      intensityMild: "温和",
      intensityBalanced: "平衡",
      intensityNuclear: "核弹",
      generateBtn: "生成回怼方案",
      generating: "生成中...",
      connectFirst: "请先连接钱包以使用生成功能",
    },
    // Scene types
    scenes: {
      workplace: "职场",
      family: "家庭",
      relationship: "感情",
      daily: "日常",
    },
    // Results
    results: {
      title: "回怼方案",
      resultsCount: "4 个结果",
      damage: "杀伤力",
      copy: "复制",
      copied: "已复制",
      locked: "额度不足",
      unlock: "解锁查看",
    },
    // Style tags
    styles: {
      rational: "理性辩证",
      emotion: "情绪价值",
      political: "绵里藏针",
      nuclear: "核弹打击",
    },
    // Payment
    payment: {
      title: "购买额度",
      subtitle: "使用 USDC 在 Base 网络上支付",
      network: "Base 主网",
      single: "单次",
      singleCredits: "1次",
      singleDesc: "尝鲜体验",
      pack10: "10次套餐",
      pack10Credits: "10次",
      pack10Desc: "性价比之选",
      unlimited: "终身无限",
      unlimitedCredits: "无限次",
      unlimitedDesc: "一次付费，永久使用",
      popular: "推荐",
      payBtn: "支付",
      confirming: "确认交易中...",
      waiting: "等待链上确认...",
      verifying: "验证支付中...",
      success: "支付成功",
      terms: "支付即表示同意我们的服务条款",
    },
    // Toast messages
    toast: {
      connectWallet: "请先连接钱包",
      connectWalletDesc: "需要连接钱包才能使用生成功能",
      insufficientCredits: "额度不足",
      insufficientCreditsDesc: "请购买额度后继续使用",
      generateSuccess: "生成成功",
      generateSuccessDesc: "你的回怼方案已准备就绪",
      generateFailed: "生成失败",
      tryAgain: "请稍后再试",
      copySuccess: "已复制",
      copySuccessDesc: "回怼内容已复制到剪贴板",
      copyFailed: "复制失败",
      copyFailedDesc: "请手动复制内容",
      paymentSuccess: "支付成功",
      paymentSuccessDesc: "额度已添加",
    },
    // Dashboard
    dashboard: {
      title: "生成历史",
      empty: "暂无记录",
      emptyDesc: "你还没有生成过任何回怼方案",
      intensity: "强度",
      viewDetail: "生成详情",
    },
    // Pricing
    pricing: {
      title: "选择你的",
      titleHighlight: "武器",
      subtitle: "使用 USDC 在 Base 网络上支付，即时到账，无需等待",
      features: {
        credits1: "1次生成额度",
        credits10: "10次生成额度",
        creditsUnlimited: "无限生成额度",
        styles: "4种回怼风格",
        copyShare: "复制和分享功能",
        history: "历史记录查看",
        support: "优先客服支持",
      },
      buyNow: "立即购买",
      connectToBuy: "连接钱包购买",
      faq: {
        title: "常见问题",
        q1: "什么是 USDC？",
        a1: "USDC 是一种稳定币，价值与美元 1:1 挂钩。你可以在交易所购买 USDC 并转入 Base 网络使用。",
        q2: "什么是 Base 网络？",
        a2: "Base 是由 Coinbase 推出的 Layer 2 网络，交易费用低廉，确认速度快。",
        q3: "购买后多久生效？",
        a3: "链上交易确认后立即生效，通常只需要几秒钟。",
        q4: "可以退款吗？",
        a4: "由于链上交易的不可逆性，已完成的支付无法退款。请在购买前确认你的需求。",
      },
    },
  },
  en: {
    // Navbar
    nav: {
      credits: "credits",
      unlimited: "UNLIMITED",
      connectWallet: "CONNECT WALLET",
      wrongNetwork: "WRONG NETWORK",
    },
    // Hero
    hero: {
      eyebrow: "AI-POWERED COMEBACK GENERATOR",
      title1: "Never Be",
      title2: "Speechless",
      subtitle: "Enter any frustrating scenario and get 4 styles of precise comeback responses — from rational debate to nuclear strike.",
    },
    // Form
    form: {
      scenarioLabel: "DESCRIBE SCENARIO",
      scenarioPlaceholder: "Describe the frustrating scenario...",
      scenarioHint: "At least 10 characters",
      sceneTypeLabel: "SCENE TYPE",
      intensityLabel: "INTENSITY",
      intensityMild: "Mild",
      intensityBalanced: "Balanced",
      intensityNuclear: "Nuclear",
      generateBtn: "Generate Comeback",
      generating: "Generating...",
      connectFirst: "Please connect wallet to use this feature",
    },
    // Scene types
    scenes: {
      workplace: "Work",
      family: "Family",
      relationship: "Love",
      daily: "Daily",
    },
    // Results
    results: {
      title: "Comeback Plans",
      resultsCount: "4 RESULTS",
      damage: "DAMAGE",
      copy: "COPY",
      copied: "COPIED",
      locked: "Insufficient Credits",
      unlock: "Unlock",
    },
    // Style tags
    styles: {
      rational: "RATIONAL",
      emotion: "EMOTIONAL",
      political: "SUBTLE",
      nuclear: "NUCLEAR",
    },
    // Payment
    payment: {
      title: "Purchase Credits",
      subtitle: "Pay with USDC on Base network",
      network: "Base Mainnet",
      single: "Single",
      singleCredits: "1 credit",
      singleDesc: "Try it out",
      pack10: "Pack of 10",
      pack10Credits: "10 credits",
      pack10Desc: "Best value",
      unlimited: "Lifetime",
      unlimitedCredits: "Unlimited",
      unlimitedDesc: "Pay once, use forever",
      popular: "Popular",
      payBtn: "Pay",
      confirming: "Confirming transaction...",
      waiting: "Waiting for confirmation...",
      verifying: "Verifying payment...",
      success: "Payment successful",
      terms: "By paying, you agree to our terms of service",
    },
    // Toast messages
    toast: {
      connectWallet: "Please connect wallet",
      connectWalletDesc: "Wallet connection required",
      insufficientCredits: "Insufficient credits",
      insufficientCreditsDesc: "Please purchase credits to continue",
      generateSuccess: "Generated successfully",
      generateSuccessDesc: "Your comeback is ready",
      generateFailed: "Generation failed",
      tryAgain: "Please try again later",
      copySuccess: "Copied",
      copySuccessDesc: "Content copied to clipboard",
      copyFailed: "Copy failed",
      copyFailedDesc: "Please copy manually",
      paymentSuccess: "Payment successful",
      paymentSuccessDesc: "Credits added",
    },
    // Dashboard
    dashboard: {
      title: "Generation History",
      empty: "No Records",
      emptyDesc: "You haven't generated any comebacks yet",
      intensity: "Intensity",
      viewDetail: "View Details",
    },
    // Pricing
    pricing: {
      title: "Choose Your",
      titleHighlight: "Weapon",
      subtitle: "Pay with USDC on Base network. Instant confirmation.",
      features: {
        credits1: "1 generation credit",
        credits10: "10 generation credits",
        creditsUnlimited: "Unlimited generations",
        styles: "4 comeback styles",
        copyShare: "Copy and share",
        history: "View history",
        support: "Priority support",
      },
      buyNow: "Buy Now",
      connectToBuy: "Connect to Buy",
      faq: {
        title: "FAQ",
        q1: "What is USDC?",
        a1: "USDC is a stablecoin pegged 1:1 to USD. You can buy USDC on exchanges and transfer to Base network.",
        q2: "What is Base network?",
        a2: "Base is a Layer 2 network by Coinbase with low fees and fast confirmations.",
        q3: "How fast does it activate?",
        a3: "Instantly after blockchain confirmation, usually just a few seconds.",
        q4: "Can I get a refund?",
        a4: "Due to blockchain immutability, completed payments cannot be refunded. Please confirm before purchasing.",
      },
    },
  },
} as const;

export type TranslationKey = keyof typeof translations.zh;
