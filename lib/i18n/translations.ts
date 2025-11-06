export type Language = 'zh' | 'en' | 'ja' | 'ko' | 'th';

export interface Translations {
  // Navigation
  nav: {
    temple: string;
    activities: string;
    dashboard: string;
    collection: string;
    buddha: string;
    profile: string;
    burnIncense: string;
    drawFortune: string;
    makeWish: string;
    donate: string;
  };
  // Landing page
  landing: {
    title: string;
    subtitle: string;
    description: string;
    enterTemple: string;
    features: {
      incense: {
        title: string;
        description: string;
      };
      fortune: {
        title: string;
        description: string;
      };
      wishes: {
        title: string;
        description: string;
      };
      donate: {
        title: string;
        description: string;
      };
    };
    roadmap: {
      title: string;
      phase1: string;
      phase2: string;
      phase3: string;
      phase4: string;
      phase5: string;
    };
  };
  // Common
  common: {
    connectWallet: string;
    disconnect: string;
    merit: string;
    rank: string;
    loading: string;
    confirm: string;
    cancel: string;
    share: string;
    close: string;
  };
  // Temple
  temple: {
    welcome: string;
    stats: {
      totalIncense: string;
      totalDonations: string;
      believers: string;
      fortunes: string;
      wishes: string;
    };
    evolution: {
      title: string;
      level: string;
      progress: string;
    };
    activities: {
      title: string;
      recent: string;
    };
    leaderboard: {
      title: string;
      topContributors: string;
    };
  };
  // Incense
  incense: {
    title: string;
    description: string;
    price: string;
    dailyLimit: string;
    burned: string;
    burnButton: string;
    burning: string;
    success: string;
    meritEarned: string;
  };
  // Fortune
  fortune: {
    title: string;
    description: string;
    drawButton: string;
    drawing: string;
    freeDraws: string;
    costMerit: string;
    interpretation: string;
    shareToX: string;
    history: string;
  };
  // Wishes
  wishes: {
    title: string;
    description: string;
    placeholder: string;
    public: string;
    private: string;
    makeWish: string;
    making: string;
    success: string;
    publicWall: string;
    freeWishes: string;
  };
  // Donate
  donate: {
    title: string;
    description: string;
    tiers: {
      bronze: string;
      silver: string;
      gold: string;
      supreme: string;
    };
    benefits: string;
    donateButton: string;
    honorWall: string;
  };
  // Profile
  profile: {
    title: string;
    stats: string;
    activity: string;
    achievements: string;
    totalBurns: string;
    totalFortunes: string;
    totalWishes: string;
    totalDonations: string;
  };
  // Dashboard
  dashboard: {
    title: string;
    subtitle: string;
    templeEvolution: string;
    nextEvolution: string;
    level: string;
    incenseValue: string;
    believers: string;
    dailyActiveUsers: string;
    totalInteractions: string;
    weeklyGrowth: string;
    last24Hours: string;
    allActivities: string;
    communityContributions: string;
    leaderboards: string;
    daily: string;
    weekly: string;
    monthly: string;
    meritPoints: string;
    badge: string;
  };
  // Collection
  collection: {
    title: string;
    subtitle: string;
    incenseNFTs: string;
    amulets: string;
    badges: string;
    wishNFTs: string;
    noItems: string;
    noItemsDescription: string;
    rarity: string;
    common: string;
    uncommon: string;
    rare: string;
    epic: string;
    legendary: string;
    mythic: string;
  };
  // Buddha
  buddha: {
    title: string;
    subtitle: string;
    selectBuddha: string;
    description: string;
    mintButton: string;
    minting: string;
    soulbound: string;
    limited: string;
    remaining: string;
  };
  // Components
  components: {
    amuletDrop: {
      title: string;
      congratulations: string;
      received: string;
      addedToCollection: string;
    };
    burnDialog: {
      title: string;
      burning: string;
      success: string;
      nftMinted: string;
      meritEarned: string;
    };
    mobileNav: {
      menu: string;
      close: string;
    };
  };
}

export const translations: Record<Language, Translations> = {
  zh: {
    nav: {
      temple: '寺庙',
      activities: '活动',
      dashboard: '仪表盘',
      collection: '收藏',
      buddha: '佛像',
      profile: '个人资料',
      burnIncense: '烧香',
      drawFortune: '抽签',
      makeWish: '许愿',
      donate: '捐助'
    },
    landing: {
      title: 'Solji Temple',
      subtitle: 'Web3 灵性寺庙',
      description:
        '在 Solana&BSC 区块链上的互动寺庙。烧香、抽签、许愿，赚取功德 NFT。',
      enterTemple: '进入寺庙',
      features: {
        incense: {
          title: '烧香祈福',
          description: '购买并燃烧不同类型的香，赚取功德点数和功德香 NFT。'
        },
        fortune: {
          title: '抽签问卜',
          description: '每日免费抽签，获得 AI 解读的运势指引。'
        },
        wishes: {
          title: '许愿祈福',
          description: '在数字绘马上写下心愿，铸造成 NFT 永久保存。'
        },
        donate: {
          title: '功德捐助',
          description: '捐助 SOL 升级寺庙，获得特殊徽章 NFT 和特权。'
        }
      },
      roadmap: {
        title: '发展路线图',
        phase1: '第一阶段：MVP - 烧香、抽签、UI 演化',
        phase2: '第二阶段：许愿系统、排行榜、佛像 NFT，上线 Solana 主网',
        phase3: '第三阶段：运势编辑器、表情包提交、二级市场',
        phase4: '第四阶段：跨链部署、多寺庙网络',
        phase5: '第五阶段：启动合作伙伴开放 API'
      }
    },
    common: {
      connectWallet: '连接钱包',
      disconnect: '断开连接',
      merit: '功德',
      rank: '等级',
      loading: '加载中...',
      confirm: '确认',
      cancel: '取消',
      share: '分享',
      close: '关闭'
    },
    temple: {
      welcome: '欢迎来到 Solji',
      stats: {
        totalIncense: '总香火值',
        totalDonations: '总捐助',
        believers: '信众',
        fortunes: '抽签次数',
        wishes: '许愿次数'
      },
      evolution: {
        title: '寺庙进化',
        level: '等级',
        progress: '进度'
      },
      activities: {
        title: '活动',
        recent: '最近活动'
      },
      leaderboard: {
        title: '排行榜',
        topContributors: '顶级贡献者'
      }
    },
    incense: {
      title: '烧香祈福',
      description: '选择您的香，燃烧以赚取功德点数和功德香 NFT',
      price: '价格',
      dailyLimit: '每日限额',
      burned: '已燃烧',
      burnButton: '燃烧',
      burning: '燃烧中...',
      success: '燃烧成功！',
      meritEarned: '获得功德'
    },
    fortune: {
      title: '抽签问卜',
      description: '抽取您的运势签，获得 AI 解读的指引',
      drawButton: '抽签',
      drawing: '抽签中...',
      freeDraws: '免费抽签',
      costMerit: '消耗功德',
      interpretation: '解读',
      shareToX: '分享到 X',
      history: '历史记录'
    },
    wishes: {
      title: '许愿祈福',
      description: '在数字绘马上写下您的心愿',
      placeholder: '写下您的心愿...',
      public: '公开',
      private: '私密',
      makeWish: '许愿',
      making: '许愿中...',
      success: '许愿成功！',
      publicWall: '公开许愿墙',
      freeWishes: '免费许愿'
    },
    donate: {
      title: '功德捐助',
      description: '捐助 SOL 升级寺庙，获得特殊徽章和特权',
      tiers: {
        bronze: '青铜功德',
        silver: '白银精进',
        gold: '黄金护法',
        supreme: '至尊龙神'
      },
      benefits: '权益',
      donateButton: '捐助',
      honorWall: '功德墙'
    },
    profile: {
      title: '个人资料',
      stats: '统计',
      activity: '活动',
      achievements: '成就',
      totalBurns: '总烧香次数',
      totalFortunes: '总抽签次数',
      totalWishes: '总许愿次数',
      totalDonations: '总捐助金额'
    },
    dashboard: {
      title: '寺庙仪表盘',
      subtitle: '综合指标和社区排行榜',
      templeEvolution: '寺庙进化',
      nextEvolution: '下一进化',
      level: '等级',
      incenseValue: '香火值',
      believers: '信众',
      dailyActiveUsers: '日活跃用户',
      totalInteractions: '总互动次数',
      weeklyGrowth: '本周增长',
      last24Hours: '过去24小时',
      allActivities: '所有活动总和',
      communityContributions: '社区贡献',
      leaderboards: '社区排行榜',
      daily: '每日',
      weekly: '每周',
      monthly: '每月',
      meritPoints: '功德点数',
      badge: '徽章'
    },
    collection: {
      title: '我的收藏',
      subtitle: '查看您的 NFT 收藏',
      incenseNFTs: '香火 NFT',
      amulets: '护身符',
      badges: '徽章',
      wishNFTs: '许愿 NFT',
      noItems: '暂无物品',
      noItemsDescription: '参与寺庙活动以开始收集 NFT',
      rarity: '稀有度',
      common: '普通',
      uncommon: '罕见',
      rare: '稀有',
      epic: '史诗',
      legendary: '传说',
      mythic: '神话'
    },
    buddha: {
      title: '佛像殿',
      subtitle: '选择您的灵性身份',
      selectBuddha: '选择佛像',
      description:
        '选择一尊佛像作为您的灵性身份。这是一个灵魂绑定代币（SBT），将永久与您的钱包绑定。',
      mintButton: '铸造佛像',
      minting: '铸造中...',
      soulbound: '灵魂绑定',
      limited: '限量',
      remaining: '剩余'
    },
    components: {
      amuletDrop: {
        title: '护身符掉落！',
        congratulations: '恭喜！',
        received: '您获得了',
        addedToCollection: '已添加到您的收藏'
      },
      burnDialog: {
        title: '燃烧香火',
        burning: '燃烧中...',
        success: '燃烧成功！',
        nftMinted: 'NFT 已铸造',
        meritEarned: '获得功德'
      },
      mobileNav: {
        menu: '菜单',
        close: '关闭'
      }
    }
  },
  en: {
    nav: {
      temple: 'Temple',
      activities: 'Activities',
      dashboard: 'Dashboard',
      collection: 'Collection',
      buddha: 'Buddha',
      profile: 'Profile',
      burnIncense: 'Burn Incense',
      drawFortune: 'Draw Fortune',
      makeWish: 'Make Wish',
      donate: 'Donate'
    },
    landing: {
      title: 'Solji Temple',
      subtitle: 'Web3 Spiritual Temple',
      description:
        'An interactive temple on Solana blockchain. Burn incense, draw fortunes, make wishes, and earn merit NFTs.',
      enterTemple: 'Enter Temple',
      features: {
        incense: {
          title: 'Burn Incense',
          description:
            'Purchase and burn different types of incense to earn merit points and Merit Incense NFTs.'
        },
        fortune: {
          title: 'Draw Fortune',
          description:
            'Draw your daily fortune and receive AI-powered interpretations.'
        },
        wishes: {
          title: 'Make Wishes',
          description:
            'Write your wishes on digital Ema plaques and mint them as NFTs.'
        },
        donate: {
          title: 'Donate',
          description:
            'Donate SOL to upgrade the temple and earn special badge NFTs and privileges.'
        }
      },
      roadmap: {
        title: 'Roadmap',
        phase1: 'Phase 1: MVP - Incense, Fortune, UI Evolution',
        phase2:
          'Phase 2: Incense, Fortune, Wish modules live on Solana Mainnet',
        phase3: 'Phase 3: Fortune Editor, Meme Submission, Secondary Market',
        phase4: 'Phase 4: Cross-chain, Multi-temple Network',
        phase5: 'Phase 5: Launch open API for partner temples'
      }
    },
    common: {
      connectWallet: 'Connect Wallet',
      disconnect: 'Disconnect',
      merit: 'Merit',
      rank: 'Rank',
      loading: 'Loading...',
      confirm: 'Confirm',
      cancel: 'Cancel',
      share: 'Share',
      close: 'Close'
    },
    temple: {
      welcome: 'Welcome to Solji',
      stats: {
        totalIncense: 'Total Incense',
        totalDonations: 'Total Donations',
        believers: 'Believers',
        fortunes: 'Fortunes',
        wishes: 'Wishes'
      },
      evolution: {
        title: 'Temple Evolution',
        level: 'Level',
        progress: 'Progress'
      },
      activities: {
        title: 'Activities',
        recent: 'Recent Activities'
      },
      leaderboard: {
        title: 'Leaderboard',
        topContributors: 'Top Contributors'
      }
    },
    incense: {
      title: 'Burn Incense',
      description:
        'Choose your incense and burn to earn merit points and Merit Incense NFTs',
      price: 'Price',
      dailyLimit: 'Daily Limit',
      burned: 'Burned',
      burnButton: 'Burn',
      burning: 'Burning...',
      success: 'Burn Successful!',
      meritEarned: 'Merit Earned'
    },
    fortune: {
      title: 'Draw Fortune',
      description: 'Draw your fortune and receive AI-powered guidance',
      drawButton: 'Draw Fortune',
      drawing: 'Drawing...',
      freeDraws: 'Free Draws',
      costMerit: 'Cost Merit',
      interpretation: 'Interpretation',
      shareToX: 'Share to X',
      history: 'History'
    },
    wishes: {
      title: 'Make a Wish',
      description: 'Write your wish on a digital Ema plaque',
      placeholder: 'Write your wish...',
      public: 'Public',
      private: 'Private',
      makeWish: 'Make Wish',
      making: 'Making...',
      success: 'Wish Made!',
      publicWall: 'Public Wishes Wall',
      freeWishes: 'Free Wishes'
    },
    donate: {
      title: 'Donate',
      description:
        'Donate SOL to upgrade the temple and earn special badges and privileges',
      tiers: {
        bronze: 'Bronze Merit',
        silver: 'Silver Progress',
        gold: 'Gold Guardian',
        supreme: 'Supreme Dragon'
      },
      benefits: 'Benefits',
      donateButton: 'Donate',
      honorWall: 'Honor Wall'
    },
    profile: {
      title: 'Profile',
      stats: 'Stats',
      activity: 'Activity',
      achievements: 'Achievements',
      totalBurns: 'Total Burns',
      totalFortunes: 'Total Fortunes',
      totalWishes: 'Total Wishes',
      totalDonations: 'Total Donations'
    },
    dashboard: {
      title: 'Temple Dashboard',
      subtitle: 'Comprehensive metrics and community leaderboards',
      templeEvolution: 'Temple Evolution',
      nextEvolution: 'Next Evolution',
      level: 'Level',
      incenseValue: 'Incense Value',
      believers: 'Believers',
      dailyActiveUsers: 'Daily Active Users',
      totalInteractions: 'Total Interactions',
      weeklyGrowth: 'this week',
      last24Hours: 'Last 24 hours',
      allActivities: 'All activities combined',
      communityContributions: 'Community contributions',
      leaderboards: 'Community Leaderboards',
      daily: 'Daily',
      weekly: 'Weekly',
      monthly: 'Monthly',
      meritPoints: 'merit points',
      badge: 'Badge'
    },
    collection: {
      title: 'My Collection',
      subtitle: 'View your NFT collection',
      incenseNFTs: 'Incense NFTs',
      amulets: 'Amulets',
      badges: 'Badges',
      wishNFTs: 'Wish NFTs',
      noItems: 'No Items Yet',
      noItemsDescription:
        'Participate in temple activities to start collecting NFTs',
      rarity: 'Rarity',
      common: 'Common',
      uncommon: 'Uncommon',
      rare: 'Rare',
      epic: 'Epic',
      legendary: 'Legendary',
      mythic: 'Mythic'
    },
    buddha: {
      title: 'Buddha Hall',
      subtitle: 'Choose your spiritual identity',
      selectBuddha: 'Select Buddha',
      description:
        'Choose a Buddha statue as your spiritual identity. This is a Soulbound Token (SBT) that will be permanently bound to your wallet.',
      mintButton: 'Mint Buddha',
      minting: 'Minting...',
      soulbound: 'Soulbound',
      limited: 'Limited',
      remaining: 'remaining'
    },
    components: {
      amuletDrop: {
        title: 'Amulet Drop!',
        congratulations: 'Congratulations!',
        received: 'You received',
        addedToCollection: 'Added to your collection'
      },
      burnDialog: {
        title: 'Burn Incense',
        burning: 'Burning...',
        success: 'Burn Successful!',
        nftMinted: 'NFT Minted',
        meritEarned: 'Merit Earned'
      },
      mobileNav: {
        menu: 'Menu',
        close: 'Close'
      }
    }
  },
  ja: {
    nav: {
      temple: '寺院',
      activities: 'アクティビティ',
      dashboard: 'ダッシュボード',
      collection: 'コレクション',
      buddha: '仏像',
      profile: 'プロフィール',
      burnIncense: 'お香を焚く',
      drawFortune: 'おみくじ',
      makeWish: '願掛け',
      donate: '寄付'
    },
    landing: {
      title: 'Solji',
      subtitle: 'Web3スピリチュアル寺院',
      description:
        'Solana&BSCブロックチェーン上のインタラクティブな寺院。お香を焚き、おみくじを引き、願掛けをして、功徳NFTを獲得しましょう。',
      enterTemple: '寺院に入る',
      features: {
        incense: {
          title: 'お香を焚く',
          description:
            '様々な種類のお香を購入して焚き、功徳ポイントと功徳香NFTを獲得しましょう。'
        },
        fortune: {
          title: 'おみくじ',
          description:
            '毎日無料でおみくじを引き、AIによる解釈を受け取りましょう。'
        },
        wishes: {
          title: '願掛け',
          description: 'デジタル絵馬に願いを書き、NFTとして鋳造しましょう。'
        },
        donate: {
          title: '寄付',
          description:
            'SOLを寄付して寺院をアップグレードし、特別なバッジNFTと特権を獲得しましょう。'
        }
      },
      roadmap: {
        title: 'ロードマップ',
        phase1: 'フェーズ1：MVP - お香、おみくじ、UI進化',
        phase2:
          'フェーズ2:『フェーズ2: お香、占い、願いモジュールがSolanaメインネットに公開』',
        phase3: 'フェーズ3: 運勢エディター、ミーム投稿、セカンダリーマーケット',
        phase4: 'フェーズ4: クロスチェーン、複数寺院ネットワーク',
        phase5: 'フェーズ5: 提携寺院向けオープンAPIの公開'
      }
    },
    common: {
      connectWallet: 'ウォレット接続',
      disconnect: '切断',
      merit: '功徳',
      rank: 'ランク',
      loading: '読み込み中...',
      confirm: '確認',
      cancel: 'キャンセル',
      share: '共有',
      close: '閉じる'
    },
    temple: {
      welcome: 'Soljiへようこそ',
      stats: {
        totalIncense: '総お香値',
        totalDonations: '総寄付額',
        believers: '信者',
        fortunes: 'おみくじ回数',
        wishes: '願掛け回数'
      },
      evolution: {
        title: '寺院の進化',
        level: 'レベル',
        progress: '進捗'
      },
      activities: {
        title: 'アクティビティ',
        recent: '最近のアクティビティ'
      },
      leaderboard: {
        title: 'リーダーボード',
        topContributors: 'トップ貢献者'
      }
    },
    incense: {
      title: 'お香を焚く',
      description: 'お香を選んで焚き、功徳ポイントと功徳香NFTを獲得しましょう',
      price: '価格',
      dailyLimit: '1日の上限',
      burned: '焚いた数',
      burnButton: '焚く',
      burning: '焚いています...',
      success: '焚き上げ成功！',
      meritEarned: '功徳獲得'
    },
    fortune: {
      title: 'おみくじ',
      description: 'おみくじを引いてAIによる解釈を受け取りましょう',
      drawButton: 'おみくじを引く',
      drawing: '引いています...',
      freeDraws: '無料回数',
      costMerit: '功徳消費',
      interpretation: '解釈',
      shareToX: 'Xで共有',
      history: '履歴'
    },
    wishes: {
      title: '願掛け',
      description: 'デジタル絵馬に願いを書きましょう',
      placeholder: '願いを書いてください...',
      public: '公開',
      private: '非公開',
      makeWish: '願掛け',
      making: '願掛け中...',
      success: '願掛け成功！',
      publicWall: '公開願掛け壁',
      freeWishes: '無料願掛け'
    },
    donate: {
      title: '寄付',
      description:
        'SOLを寄付して寺院をアップグレードし、特別なバッジと特権を獲得しましょう',
      tiers: {
        bronze: 'ブロンズ功徳',
        silver: 'シルバー精進',
        gold: 'ゴールド護法',
        supreme: '至高の龍神'
      },
      benefits: '特典',
      donateButton: '寄付する',
      honorWall: '功徳の壁'
    },
    profile: {
      title: 'プロフィール',
      stats: '統計',
      activity: 'アクティビティ',
      achievements: '実績',
      totalBurns: '総焚き上げ回数',
      totalFortunes: '総おみくじ回数',
      totalWishes: '総願掛け回数',
      totalDonations: '総寄付額'
    },
    dashboard: {
      title: '寺院ダッシュボード',
      subtitle: '総合指標とコミュニティリーダーボード',
      templeEvolution: '寺院の進化',
      nextEvolution: '次の進化',
      level: 'レベル',
      incenseValue: 'お香値',
      believers: '信者',
      dailyActiveUsers: '日次アクティブユーザー',
      totalInteractions: '総インタラクション',
      weeklyGrowth: '今週',
      last24Hours: '過去24時間',
      allActivities: 'すべてのアクティビティ合計',
      communityContributions: 'コミュニティ貢献',
      leaderboards: 'コミュニティリーダーボード',
      daily: '毎日',
      weekly: '毎週',
      monthly: '毎月',
      meritPoints: '功徳ポイント',
      badge: 'バッジ'
    },
    collection: {
      title: 'マイコレクション',
      subtitle: 'NFTコレクションを表示',
      incenseNFTs: 'お香NFT',
      amulets: 'お守り',
      badges: 'バッジ',
      wishNFTs: '願掛けNFT',
      noItems: 'アイテムなし',
      noItemsDescription: '寺院のアクティビティに参加してNFTを集めましょう',
      rarity: 'レア度',
      common: 'コモン',
      uncommon: 'アンコモン',
      rare: 'レア',
      epic: 'エピック',
      legendary: 'レジェンダリー',
      mythic: 'ミシック'
    },
    buddha: {
      title: '仏殿',
      subtitle: 'あなたの霊的アイデンティティを選択',
      selectBuddha: '仏像を選択',
      description:
        '仏像をあなたの霊的アイデンティティとして選択してください。これはソウルバウンドトークン（SBT）で、あなたのウォレットに永久にバインドされます。',
      mintButton: '仏像を鋳造',
      minting: '鋳造中...',
      soulbound: 'ソウルバウンド',
      limited: '限定',
      remaining: '残り'
    },
    components: {
      amuletDrop: {
        title: 'お守りドロップ！',
        congratulations: 'おめでとうございます！',
        received: '獲得しました',
        addedToCollection: 'コレクションに追加されました'
      },
      burnDialog: {
        title: 'お香を焚く',
        burning: '焚いています...',
        success: '焚き上げ成功！',
        nftMinted: 'NFT鋳造完了',
        meritEarned: '功徳獲得'
      },
      mobileNav: {
        menu: 'メニュー',
        close: '閉じる'
      }
    }
  },
  ko: {
    nav: {
      temple: '사원',
      activities: '활동',
      dashboard: '대시보드',
      collection: '컬렉션',
      buddha: '불상',
      profile: '프로필',
      burnIncense: '향 피우기',
      drawFortune: '운세 뽑기',
      makeWish: '소원 빌기',
      donate: '기부'
    },
    landing: {
      title: 'Solji',
      subtitle: 'Web3 영적 사원',
      description:
        'Solana&BSC 블록체인의 인터랙티브 사원. 향을 피우고, 운세를 뽑고, 소원을 빌고, 공덕 NFT를 획득하세요.',
      enterTemple: '사원 입장',
      features: {
        incense: {
          title: '향 피우기',
          description:
            '다양한 종류의 향을 구매하고 피워서 공덕 포인트와 공덕향 NFT를 획득하세요.'
        },
        fortune: {
          title: '운세 뽑기',
          description: '매일 무료로 운세를 뽑고 AI 해석을 받으세요.'
        },
        wishes: {
          title: '소원 빌기',
          description: '디지털 에마에 소원을 적고 NFT로 발행하세요.'
        },
        donate: {
          title: '기부',
          description:
            'SOL을 기부하여 사원을 업그레이드하고 특별한 배지 NFT와 특권을 획득하세요.'
        }
      },
      roadmap: {
        title: '로드맵',
        phase1: '1단계: MVP - 향, 운세, UI 진화',
        phase2: '2단계: 향, 운세, 소원 모듈 솔라나 메인넷 출시',
        phase3: '3단계: 운세 편집기, 밈 제출, 2차 시장',
        phase4: '4단계: 크로스체인, 다중 사원 네트워크',
        phase5: '5단계: 파트너 사원을 위한 오픈 API 출시'
      }
    },
    common: {
      connectWallet: '지갑 연결',
      disconnect: '연결 해제',
      merit: '공덕',
      rank: '등급',
      loading: '로딩 중...',
      confirm: '확인',
      cancel: '취소',
      share: '공유',
      close: '닫기'
    },
    temple: {
      welcome: 'Solji에 오신 것을 환영합니다',
      stats: {
        totalIncense: '총 향 가치',
        totalDonations: '총 기부액',
        believers: '신도',
        fortunes: '운세 횟수',
        wishes: '소원 횟수'
      },
      evolution: {
        title: '사원 진화',
        level: '레벨',
        progress: '진행률'
      },
      activities: {
        title: '활동',
        recent: '최근 활동'
      },
      leaderboard: {
        title: '리더보드',
        topContributors: '상위 기여자'
      }
    },
    incense: {
      title: '향 피우기',
      description: '향을 선택하고 피워서 공덕 포인트와 공덕향 NFT를 획득하세요',
      price: '가격',
      dailyLimit: '일일 한도',
      burned: '피운 횟수',
      burnButton: '피우기',
      burning: '피우는 중...',
      success: '피우기 성공!',
      meritEarned: '공덕 획득'
    },
    fortune: {
      title: '운세 뽑기',
      description: '운세를 뽑고 AI 해석을 받으세요',
      drawButton: '운세 뽑기',
      drawing: '뽑는 중...',
      freeDraws: '무료 횟수',
      costMerit: '공덕 소비',
      interpretation: '해석',
      shareToX: 'X에 공유',
      history: '기록'
    },
    wishes: {
      title: '소원 빌기',
      description: '디지털 에마에 소원을 적으세요',
      placeholder: '소원을 적어주세요...',
      public: '공개',
      private: '비공개',
      makeWish: '소원 빌기',
      making: '빌는 중...',
      success: '소원 빌기 성공!',
      publicWall: '공개 소원 벽',
      freeWishes: '무료 소원'
    },
    donate: {
      title: '기부',
      description:
        'SOL을 기부하여 사원을 업그레이드하고 특별한 배지와 특권을 획득하세요',
      tiers: {
        bronze: '청동 공덕',
        silver: '은 정진',
        gold: '금 호법',
        supreme: '지존 용신'
      },
      benefits: '혜택',
      donateButton: '기부하기',
      honorWall: '공덕 벽'
    },
    profile: {
      title: '프로필',
      stats: '통계',
      activity: '활동',
      achievements: '업적',
      totalBurns: '총 향 피우기',
      totalFortunes: '총 운세 뽑기',
      totalWishes: '총 소원 빌기',
      totalDonations: '총 기부액'
    },
    dashboard: {
      title: '사원 대시보드',
      subtitle: '종합 지표 및 커뮤니티 리더보드',
      templeEvolution: '사원 진화',
      nextEvolution: '다음 진화',
      level: '레벨',
      incenseValue: '향 가치',
      believers: '신도',
      dailyActiveUsers: '일일 활성 사용자',
      totalInteractions: '총 상호작용',
      weeklyGrowth: '이번 주',
      last24Hours: '지난 24시간',
      allActivities: '모든 활동 합계',
      communityContributions: '커뮤니티 기여',
      leaderboards: '커뮤니티 리더보드',
      daily: '일일',
      weekly: '주간',
      monthly: '월간',
      meritPoints: '공덕 포인트',
      badge: '배지'
    },
    collection: {
      title: '내 컬렉션',
      subtitle: 'NFT 컬렉션 보기',
      incenseNFTs: '향 NFT',
      amulets: '부적',
      badges: '배지',
      wishNFTs: '소원 NFT',
      noItems: '아직 아이템 없음',
      noItemsDescription: '사원 활동에 참여하여 NFT 수집을 시작하세요',
      rarity: '희귀도',
      common: '일반',
      uncommon: '언커먼',
      rare: '레어',
      epic: '에픽',
      legendary: '레전더리',
      mythic: '미식'
    },
    buddha: {
      title: '불전',
      subtitle: '영적 정체성 선택',
      selectBuddha: '불상 선택',
      description:
        '불상을 영적 정체성으로 선택하세요. 이것은 소울바운드 토큰(SBT)으로 지갑에 영구적으로 바인딩됩니다.',
      mintButton: '불상 발행',
      minting: '발행 중...',
      soulbound: '소울바운드',
      limited: '한정',
      remaining: '남음'
    },
    components: {
      amuletDrop: {
        title: '부적 드롭!',
        congratulations: '축하합니다!',
        received: '획득했습니다',
        addedToCollection: '컬렉션에 추가됨'
      },
      burnDialog: {
        title: '향 피우기',
        burning: '피우는 중...',
        success: '피우기 성공!',
        nftMinted: 'NFT 발행 완료',
        meritEarned: '공덕 획득'
      },
      mobileNav: {
        menu: '메뉴',
        close: '닫기'
      }
    }
  },
  th: {
    nav: {
      temple: 'วัด',
      activities: 'กิจกรรม',
      dashboard: 'แดชบอร์ด',
      collection: 'คอลเลกชัน',
      buddha: 'พระพุทธรูป',
      profile: 'โปรไฟล์',
      burnIncense: 'จุดธูป',
      drawFortune: 'เสี่ยงเซียมซี',
      makeWish: 'ขอพร',
      donate: 'บริจาค'
    },
    landing: {
      title: 'Solji',
      subtitle: 'วัด Web3 แห่งจิตวิญญาณ',
      description:
        'วัดแบบอินเทอร์แอคทีฟบนบล็อกเชน Solana&BSC จุดธูป เสี่ยงเซียมซี ขอพร และรับ NFT บุญ',
      enterTemple: 'เข้าวัด',
      features: {
        incense: {
          title: 'จุดธูป',
          description: 'ซื้อและจุดธูปประเภทต่างๆ เพื่อรับคะแนนบุญและ NFT ธูปบุญ'
        },
        fortune: {
          title: 'เสี่ยงเซียมซี',
          description: 'เสี่ยงเซียมซีฟรีทุกวันและรับคำทำนายจาก AI'
        },
        wishes: {
          title: 'ขอพร',
          description: 'เขียนคำอธิษฐานบนแผ่นไม้ดิจิทัลและสร้างเป็น NFT'
        },
        donate: {
          title: 'บริจาค',
          description:
            'บริจาค SOL เพื่ออัพเกรดวัดและรับตราสัญลักษณ์พิเศษและสิทธิพิเศษ'
        }
      },
      roadmap: {
        title: 'แผนงาน',
        phase1: 'เฟส 1: MVP - ธูป, เซียมซี, วิวัฒนาการ UI',
        phase2:
          'เฟส 2: โมดูลธูป, โชคลาภ, ความปรารถนา เปิดใช้งานบน Solana Mainnet',
        phase3: 'เฟส 3: ตัวแก้ไขโชคลาภ, การส่งมีม, ตลาดรอง',
        phase4: 'เฟส 4: ข้ามเครือข่าย, เครือข่ายหลายวัด',
        phase5: 'เฟส 5: เปิดตัว API แบบเปิดสำหรับวัดพันธมิตร'
      }
    },
    common: {
      connectWallet: 'เชื่อมต่อกระเป๋า',
      disconnect: 'ตัดการเชื่อมต่อ',
      merit: 'บุญ',
      rank: 'ระดับ',
      loading: 'กำลังโหลด...',
      confirm: 'ยืนยัน',
      cancel: 'ยกเลิก',
      share: 'แชร์',
      close: 'ปิด'
    },
    temple: {
      welcome: 'ยินดีต้อนรับสู่ Solji',
      stats: {
        totalIncense: 'มูลค่าธูปทั้งหมด',
        totalDonations: 'บริจาคทั้งหมด',
        believers: 'ศรัทธา',
        fortunes: 'เสี่ยงเซียมซี',
        wishes: 'ขอพร'
      },
      evolution: {
        title: 'วิวัฒนาการวัด',
        level: 'ระดับ',
        progress: 'ความคืบหน้า'
      },
      activities: {
        title: 'กิจกรรม',
        recent: 'กิจกรรมล่าสุด'
      },
      leaderboard: {
        title: 'ลีดเดอร์บอร์ด',
        topContributors: 'ผู้บริจาคอันดับต้น'
      }
    },
    incense: {
      title: 'จุดธูป',
      description: 'เลือกธูปของคุณและจุดเพื่อรับคะแนนบุญและ NFT ธูปบุญ',
      price: 'ราคา',
      dailyLimit: 'จำกัดต่อวัน',
      burned: 'จุดแล้ว',
      burnButton: 'จุด',
      burning: 'กำลังจุด...',
      success: 'จุดสำเร็จ!',
      meritEarned: 'ได้รับบุญ'
    },
    fortune: {
      title: 'เสี่ยงเซียมซี',
      description: 'เสี่ยงเซียมซีและรับคำแนะนำจาก AI',
      drawButton: 'เสี่ยงเซียมซี',
      drawing: 'กำลังเสี่ยง...',
      freeDraws: 'ครั้งฟรี',
      costMerit: 'ใช้บุญ',
      interpretation: 'คำทำนาย',
      shareToX: 'แชร์ไปยัง X',
      history: 'ประวัติ'
    },
    wishes: {
      title: 'ขอพร',
      description: 'เขียนคำอธิษฐานของคุณบนแผ่นไม้ดิจิทัล',
      placeholder: 'เขียนคำอธิษฐานของคุณ...',
      public: 'สาธารณะ',
      private: 'ส่วนตัว',
      makeWish: 'ขอพร',
      making: 'กำลังขอพร...',
      success: 'ขอพรสำเร็จ!',
      publicWall: 'กำแพงขอพรสาธารณะ',
      freeWishes: 'ขอพรฟรี'
    },
    donate: {
      title: 'บริจาค',
      description:
        'บริจาค SOL เพื่ออัพเกรดวัดและรับตราสัญลักษณ์พิเศษและสิทธิพิเศษ',
      tiers: {
        bronze: 'บุญทองแดง',
        silver: 'ความก้าวหน้าเงิน',
        gold: 'ผู้พิทักษ์ทอง',
        supreme: 'มังกรสูงสุด'
      },
      benefits: 'ผลประโยชน์',
      donateButton: 'บริจาค',
      honorWall: 'กำแพงเกียรติยศ'
    },
    profile: {
      title: 'โปรไฟล์',
      stats: 'สถิติ',
      activity: 'กิจกรรม',
      achievements: 'ความสำเร็จ',
      totalBurns: 'จุดธูปทั้งหมด',
      totalFortunes: 'เสี่ยงเซียมซีทั้งหมด',
      totalWishes: 'ขอพรทั้งหมด',
      totalDonations: 'บริจาคทั้งหมด'
    },
    dashboard: {
      title: 'แดชบอร์ดวัด',
      subtitle: 'เมตริกซ์ที่ครอบคลุมและลีดเดอร์บอร์ดชุมชน',
      templeEvolution: 'วิวัฒนาการวัด',
      nextEvolution: 'วิวัฒนาการถัดไป',
      level: 'ระดับ',
      incenseValue: 'มูลค่าธูป',
      believers: 'ศรัทธา',
      dailyActiveUsers: 'ผู้ใช้งานรายวัน',
      totalInteractions: 'การโต้ตอบทั้งหมด',
      weeklyGrowth: 'สัปดาห์นี้',
      last24Hours: '24 ชั่วโมงที่ผ่านมา',
      allActivities: 'กิจกรรมทั้งหมดรวมกัน',
      communityContributions: 'การมีส่วนร่วมของชุมชน',
      leaderboards: 'ลีดเดอร์บอร์ดชุมชน',
      daily: 'รายวัน',
      weekly: 'รายสัปดาห์',
      monthly: 'รายเดือน',
      meritPoints: 'คะแนนบุญ',
      badge: 'ตรา'
    },
    collection: {
      title: 'คอลเลกชันของฉัน',
      subtitle: 'ดูคอลเลกชัน NFT ของคุณ',
      incenseNFTs: 'NFT ธูป',
      amulets: 'เครื่องรางของขลัง',
      badges: 'ตราสัญลักษณ์',
      wishNFTs: 'NFT ขอพร',
      noItems: 'ยังไม่มีไอเทม',
      noItemsDescription: 'เข้าร่วมกิจกรรมวัดเพื่อเริ่มสะสม NFT',
      rarity: 'ความหายาก',
      common: 'ธรรมดา',
      uncommon: 'ไม่ธรรมดา',
      rare: 'หายาก',
      epic: 'มหากาพย์',
      legendary: 'ตำนาน',
      mythic: 'เทพนิยาย'
    },
    buddha: {
      title: 'พระอุโบสถ',
      subtitle: 'เลือกอัตลักษณ์ทางจิตวิญญาณของคุณ',
      selectBuddha: 'เลือกพระพุทธรูป',
      description:
        'เลือกพระพุทธรูปเป็นอัตลักษณ์ทางจิตวิญญาณของคุณ นี่คือโทเค็นผูกพันวิญญาณ (SBT) ที่จะผูกกับกระเป๋าของคุณอย่างถาวร',
      mintButton: 'สร้างพระพุทธรูป',
      minting: 'กำลังสร้าง...',
      soulbound: 'ผูกพันวิญญาณ',
      limited: 'จำกัด',
      remaining: 'เหลือ'
    },
    components: {
      amuletDrop: {
        title: 'ได้รับเครื่องราง!',
        congratulations: 'ยินดีด้วย!',
        received: 'คุณได้รับ',
        addedToCollection: 'เพิ่มในคอลเลกชันของคุณแล้ว'
      },
      burnDialog: {
        title: 'จุดธูป',
        burning: 'กำลังจุด...',
        success: 'จุดสำเร็จ!',
        nftMinted: 'สร้าง NFT แล้ว',
        meritEarned: 'ได้รับบุญ'
      },
      mobileNav: {
        menu: 'เมนู',
        close: 'ปิด'
      }
    }
  }
};

export const languageNames: Record<Language, string> = {
  zh: '中文',
  en: 'English',
  ja: '日本語',
  ko: '한국어',
  th: 'ไทย'
};
