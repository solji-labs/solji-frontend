/**
 * CID ↔ ContentHash 转换工具
 * 
 * CID (Content Identifier) 是 IPFS 的内容标识符，包含了内容的哈希值。
 * 我们可以从 CID 中提取 32 字节的 SHA-256 哈希，用于链上存储。
 * 这个转换是完全可逆的，可以从哈希重建 CID。
 * 
 * CID 结构:
 * - CIDv1 = Base32(version + codec + multihash)
 * - multihash = hash_type + hash_length + hash_value
 * - 我们提取的是 hash_value (32 字节 SHA-256)
 */

import { CID } from 'multiformats/cid';
import * as raw from 'multiformats/codecs/raw';
import { sha256 } from 'multiformats/hashes/sha2';

/**
 * 从 CID 提取 32 字节哈希
 * 
 * @param cidString - IPFS CID 字符串，例如 "bafkreihqjvztwpft456dcv3zxo527qzyfjdku7rihjlznn3o4fwoj6nt7q"
 * @returns 32 字节哈希数组，用于链上存储
 * 
 * @example
 * const cid = "bafkreihqjvztwpft456dcv3zxo527qzyfjdku7rihjlznn3o4fwoj6nt7q";
 * const hash = cidToContentHash(cid);
 * // hash = [232, 232, 238, 244, ...]
 */
export function cidToContentHash(cidString: string): number[] {
    try {
        // 解析 CID
        const cid = CID.parse(cidString);
        
        // 获取 multihash 的 digest（这就是原始的 SHA-256 哈希）
        const digest = cid.multihash.digest;
        
        // 验证哈希长度
        if (digest.length !== 32) {
            throw new Error(`Invalid hash length: expected 32 bytes, got ${digest.length} bytes`);
        }
        
        // 转换为 number[] 以匹配链上程序的要求 [u8; 32]
        return Array.from(digest);
    } catch (error) {
        console.error('Failed to extract hash from CID:', error);
        throw new Error(`Invalid CID format: ${cidString}`);
    }
}

/**
 * 从 32 字节哈希重建 CID
 * 
 * @param hashBytes - 32 字节哈希数组或 Uint8Array
 * @returns IPFS CID 字符串
 * 
 * 注意：重建的 CID 会使用默认参数：
 * - CID version: v1
 * - Codec: raw (0x55)
 * - Hash: SHA-256 (0x12)
 * 
 * @example
 * const hash = [232, 232, 238, 244, ...];
 * const cid = contentHashToCid(hash);
 * // cid = "bafkreihqjvztwpft456dcv3zxo527qzyfjdku7rihjlznn3o4fwoj6nt7q"
 */
export function contentHashToCid(hashBytes: number[] | Uint8Array): string {
    try {
        // 转换为 Uint8Array
        const bytes = hashBytes instanceof Uint8Array 
            ? hashBytes 
            : new Uint8Array(hashBytes);
        
        // 验证哈希长度
        if (bytes.length !== 32) {
            throw new Error(`Invalid hash length: expected 32 bytes, got ${bytes.length} bytes`);
        }
        
        // 手动构建 multihash
        // 格式: [hash_type, hash_length, ...hash_value]
        // 0x12 = SHA-256, 0x20 = 32 bytes
        const multihashBytes = new Uint8Array(34);
        multihashBytes[0] = 0x12; // SHA-256 hash type
        multihashBytes[1] = 0x20; // 32 bytes length
        multihashBytes.set(bytes, 2);
        
        // 构建 CID bytes
        // 格式: [version, codec, ...multihash]
        // 0x01 = CIDv1, 0x55 = raw codec
        const cidBytes = new Uint8Array(36);
        cidBytes[0] = 0x01; // CIDv1
        cidBytes[1] = 0x55; // raw codec
        cidBytes.set(multihashBytes, 2);
        
        // 解码为 CID 对象并转换为字符串
        const cid = CID.decode(cidBytes);
        return cid.toString();
    } catch (error) {
        console.error('Failed to create CID from hash:', error);
        throw error;
    }
}

/**
 * 验证 CID 和哈希的对应关系
 * 
 * @param cidString - IPFS CID 字符串
 * @param hashBytes - 32 字节哈希数组
 * @returns 如果 CID 和哈希匹配返回 true，否则返回 false
 * 
 * @example
 * const cid = "bafkreihqjvztwpft456dcv3zxo527qzyfjdku7rihjlznn3o4fwoj6nt7q";
 * const hash = cidToContentHash(cid);
 * const isValid = verifyCidHash(cid, hash); // true
 */
export function verifyCidHash(cidString: string, hashBytes: number[]): boolean {
    try {
        const extractedHash = cidToContentHash(cidString);
        return extractedHash.every((byte, i) => byte === hashBytes[i]);
    } catch {
        return false;
    }
}

/**
 * 批量转换 CID 到哈希
 * 
 * @param cids - CID 字符串数组
 * @returns 哈希数组的数组
 */
export function batchCidToContentHash(cids: string[]): number[][] {
    return cids.map(cid => {
        try {
            return cidToContentHash(cid);
        } catch (error) {
            console.error(`Failed to convert CID ${cid}:`, error);
            return [];
        }
    }).filter(hash => hash.length > 0);
}

/**
 * 批量转换哈希到 CID
 * 
 * @param hashes - 哈希数组的数组
 * @returns CID 字符串数组
 */
export function batchContentHashToCid(hashes: (number[] | Uint8Array)[]): string[] {
    return hashes.map(hash => {
        try {
            return contentHashToCid(hash);
        } catch (error) {
            console.error('Failed to convert hash to CID:', error);
            return '';
        }
    }).filter(cid => cid !== '');
}

/**
 * 检查字符串是否为有效的 CID
 * 
 * @param str - 待检查的字符串
 * @returns 如果是有效的 CID 返回 true
 */
export function isValidCid(str: string): boolean {
    try {
        CID.parse(str);
        return true;
    } catch {
        return false;
    }
}

/**
 * 获取 CID 的详细信息
 * 
 * @param cidString - IPFS CID 字符串
 * @returns CID 详细信息对象
 */
export function getCidInfo(cidString: string): {
    version: number;
    codec: number;
    hashType: number;
    hashLength: number;
    hash: Uint8Array;
} | null {
    try {
        const cid = CID.parse(cidString);
        const multihash = cid.multihash;
        
        return {
            version: cid.version,
            codec: cid.code,
            hashType: multihash.code,
            hashLength: multihash.size,
            hash: multihash.digest,
        };
    } catch {
        return null;
    }
}
