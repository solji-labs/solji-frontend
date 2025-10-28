import {
    Connection,
    PublicKey,
    SystemProgram
} from '@solana/web3.js';
import { Program, Wallet } from '@coral-xyz/anchor';
import {
    createConnection,
    createProgram,
    CURRENT_NETWORK,
    NETWORK_CONFIG
} from '../solana';
import { Temple } from '../../types/temple';

// 抽签参数接口（简化版不需要参数）
export interface DrawFortuneParams {
    // 预留扩展字段
}

// 抽签结果接口
export interface DrawFortuneResult {
    transactionSignature: string;
    fortune: FortuneType;           // 运势类型
    fortuneText: string;            // 运势文本
    fortuneDescription: string;     // 运势描述
    reduceKarmaPoints: number;      // 消耗的功德值
    rewardKarmaPoints: number;      // 奖励的功德值
    currentTimestamp: number;       // 当前时间戳
    isFreeDraw: boolean;            // 是否免费抽签
}

// 运势类型枚举
export enum FortuneType {
    GreatLuck = 'GreatLuck',  // 大吉 5%
    Lucky = 'Lucky',          // 吉 10%
    Good = 'Good',            // 小吉 20%
    Normal = 'Normal',        // 正常 30%
    Nobad = 'Nobad',          // 小凶 20%
    Bad = 'Bad',              // 凶 10%
    VeryBad = 'VeryBad',      // 大凶 5%
}

// 运势文本映射
const FORTUNE_TEXT_MAP: Record<FortuneType, string> = {
    [FortuneType.GreatLuck]: '大吉',
    [FortuneType.Lucky]: '吉',
    [FortuneType.Good]: '小吉',
    [FortuneType.Normal]: '正常',
    [FortuneType.Nobad]: '小凶',
    [FortuneType.Bad]: '凶',
    [FortuneType.VeryBad]: '大凶',
};

// 运势描述映射
const FORTUNE_DESCRIPTION_MAP: Record<FortuneType, string> = {
    [FortuneType.GreatLuck]: '万事顺意，心想事成',
    [FortuneType.Lucky]: '诸事顺利，渐入佳境',
    [FortuneType.Good]: '平平淡淡，稳中求进',
    [FortuneType.Normal]: '平平淡淡，顺其自然',
    [FortuneType.Nobad]: '小心谨慎，化险为夷',
    [FortuneType.Bad]: '诸事不利，谨慎为上',
    [FortuneType.VeryBad]: '凶险重重，静待时机',
};

// 抽签错误类型
export class DrawFortuneError extends Error {
    constructor(message: string, public code?: string) {
        super(message);
        this.name = 'DrawFortuneError';
    }
}

// 抽签合约调用类
export class DrawFortuneContract {
    private program: Program<Temple>;
    private connection: Connection;
    private programId: PublicKey;

    constructor(wallet: Wallet) {
        this.program = createProgram(wallet);
        this.connection = createConnection();
        this.programId = new PublicKey(NETWORK_CONFIG[CURRENT_NETWORK as keyof typeof NETWORK_CONFIG].programId);
    }

    /**
     * 抽签主函数
     * 基于测试文件 draw-fortune.test.ts 和 draw_fortune.rs 实现
     */
    async drawFortune(
        userPubkey: PublicKey,
        params?: DrawFortuneParams
    ): Promise<DrawFortuneResult> {
        try {
            console.log('🔮 开始抽签流程...');

            // 获取必要的 PDA 地址
            const templeConfigPda = this.getTempleConfigPda();
            const userStatePda = this.getUserStatePda(userPubkey);

            // 检查用户状态是否存在
            let userStateBefore: any;
            try {
                userStateBefore = await this.program.account.userState.fetch(userStatePda);
                console.log('📊 抽签前用户状态:', {
                    karmaPoints: userStateBefore.karmaPoints.toString(),
                    dailyDrawCount: userStateBefore.dailyDrawCount,
                    totalDrawCount: userStateBefore.totalDrawCount,
                });
            } catch (error) {
                throw new DrawFortuneError('用户状态不存在，请先进行烧香操作', 'USER_NOT_INITIALIZED');
            }

            console.log('📍 账户地址:', {
                templeConfig: templeConfigPda.toString(),
                userState: userStatePda.toString(),
                user: userPubkey.toString(),
            });

            // 调用抽签指令 - 完全按照测试文件的方式
            console.log('📤 发送抽签交易...');
            const tx = await (this.program.methods as any)
                .drawFortune()
                .accounts({
                    user: userPubkey,
                })
                .rpc();

            console.log('✅ 抽签交易提交成功:', tx);

            // 等待交易确认
            await this.connection.confirmTransaction(tx, 'confirmed');
            console.log('✅ 交易确认成功');

            // 等待状态更新
            await new Promise(resolve => setTimeout(resolve, 2000));

            // 获取抽签后的用户状态
            const userStateAfter = await this.program.account.userState.fetch(userStatePda);
            console.log('📊 抽签后用户状态:', {
                karmaPoints: userStateAfter.karmaPoints.toString(),
                dailyDrawCount: userStateAfter.dailyDrawCount,
                totalDrawCount: userStateAfter.totalDrawCount,
            });

            // 计算实际变化
            const karmaPointsBefore = userStateBefore.karmaPoints.toNumber();
            const karmaPointsAfter = userStateAfter.karmaPoints.toNumber();
            const karmaPointsChange = karmaPointsAfter - karmaPointsBefore;

            // 判断是否为免费抽签（首次抽签）
            const isFreeDraw = userStateBefore.dailyDrawCount === 0;
            const reduceKarmaPoints = isFreeDraw ? 0 : 5;
            const rewardKarmaPoints = 2;

            console.log('📈 功德值变化:', {
                before: karmaPointsBefore,
                after: karmaPointsAfter,
                change: karmaPointsChange,
                expected: rewardKarmaPoints - reduceKarmaPoints,
                isFreeDraw,
            });

            // 从交易日志中解析运势结果
            let fortune = FortuneType.Normal; // 默认值
            try {
                const txInfo = await this.connection.getTransaction(tx, {
                    commitment: 'confirmed',
                    maxSupportedTransactionVersion: 0
                });

                if (txInfo && txInfo.meta && txInfo.meta.logMessages) {
                    console.log('📜 交易日志:', txInfo.meta.logMessages);
                    
                    // 查找包含 draw_fortune_result 的日志
                    for (const log of txInfo.meta.logMessages) {
                        if (log.includes('draw_fortune_result')) {
                            console.log('🎯 找到抽签结果日志:', log);
                            // 尝试解析运势类型
                            for (const fortuneType of Object.values(FortuneType)) {
                                if (log.includes(fortuneType)) {
                                    fortune = fortuneType;
                                    break;
                                }
                            }
                        }
                    }
                }
            } catch (error) {
                console.warn('⚠️ 无法解析交易日志，使用默认运势');
            }

            const fortuneText = FORTUNE_TEXT_MAP[fortune];
            const fortuneDescription = FORTUNE_DESCRIPTION_MAP[fortune];

            console.log('🎊 抽签结果:', {
                fortune,
                fortuneText,
                fortuneDescription,
                isFreeDraw,
            });

            return {
                transactionSignature: tx,
                fortune,
                fortuneText,
                fortuneDescription,
                reduceKarmaPoints,
                rewardKarmaPoints,
                currentTimestamp: Date.now() / 1000,
                isFreeDraw,
            };
        } catch (error: any) {
            console.error('❌ 抽签失败:', error);

            // 根据错误类型提供更具体的错误信息
            if (error.message.includes('NotEnoughKarmaPoints')) {
                throw new DrawFortuneError('功德值不足，无法抽签', 'NOT_ENOUGH_KARMA_POINTS');
            } else if (error.message.includes('USER_NOT_INITIALIZED')) {
                throw new DrawFortuneError('用户未初始化，请先进行烧香操作', 'USER_NOT_INITIALIZED');
            } else if (error.message.includes('DailyDrawLimitExceeded')) {
                throw new DrawFortuneError('今日抽签次数已达上限', 'DAILY_DRAW_LIMIT_EXCEEDED');
            } else {
                throw new DrawFortuneError(`抽签失败: ${error.message}`, 'DRAW_FORTUNE_FAILED');
            }
        }
    }

    /**
     * 获取用户状态
     */
    async getUserState(userPubkey: PublicKey) {
        try {
            const userStatePda = this.getUserStatePda(userPubkey);
            return await this.program.account.userState.fetch(userStatePda);
        } catch (error: any) {
            throw new DrawFortuneError(`获取用户状态失败: ${error.message}`, 'FETCH_USER_STATE_FAILED');
        }
    }

    /**
     * 获取寺庙配置
     */
    async getTempleConfig() {
        try {
            const templeConfigPda = this.getTempleConfigPda();
            return await this.program.account.templeConfig.fetch(templeConfigPda);
        } catch (error: any) {
            throw new DrawFortuneError(`获取寺庙配置失败: ${error.message}`, 'FETCH_TEMPLE_CONFIG_FAILED');
        }
    }

    // ========== PDA 计算函数 - 基于测试文件 setup.ts ==========

    private getTempleConfigPda(): PublicKey {
        const [pda] = PublicKey.findProgramAddressSync(
            [Buffer.from("temple_config_v1")],
            this.programId
        );
        return pda;
    }

    private getUserStatePda(userPubkey: PublicKey): PublicKey {
        const [pda] = PublicKey.findProgramAddressSync(
            [
                Buffer.from("user_state_v1"),
                userPubkey.toBuffer(),
            ],
            this.programId
        );
        return pda;
    }
}

/**
 * 辅助函数：解析运势对象
 */
export function parseFortuneFromObject(fortuneObj: any): FortuneType {
    if (typeof fortuneObj === 'object' && fortuneObj !== null) {
        const key = Object.keys(fortuneObj)[0];
        // 将 key 转换为 FortuneType
        const fortuneType = key.charAt(0).toUpperCase() + key.slice(1);
        if (Object.values(FortuneType).includes(fortuneType as FortuneType)) {
            return fortuneType as FortuneType;
        }
    }
    return FortuneType.Normal;
}

/**
 * 辅助函数：获取运势文本
 */
export function getFortuneText(fortune: FortuneType | any): string {
    if (typeof fortune === 'string' && fortune in FORTUNE_TEXT_MAP) {
        return FORTUNE_TEXT_MAP[fortune as FortuneType];
    }
    if (typeof fortune === 'object') {
        const parsed = parseFortuneFromObject(fortune);
        return FORTUNE_TEXT_MAP[parsed];
    }
    return FORTUNE_TEXT_MAP[FortuneType.Normal];
}

/**
 * 辅助函数：获取运势描述
 */
export function getFortuneDescription(fortune: FortuneType | any): string {
    if (typeof fortune === 'string' && fortune in FORTUNE_DESCRIPTION_MAP) {
        return FORTUNE_DESCRIPTION_MAP[fortune as FortuneType];
    }
    if (typeof fortune === 'object') {
        const parsed = parseFortuneFromObject(fortune);
        return FORTUNE_DESCRIPTION_MAP[parsed];
    }
    return FORTUNE_DESCRIPTION_MAP[FortuneType.Normal];
}
