/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/temple.json`.
 */
export type Temple = {
  "address": "81BWs7RGtN2EEvaGWZe8EQ8nhswHTHVzYUn5iPFoRr9o",
  "metadata": {
    "name": "temple",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "burnIncense",
      "discriminator": [
        192,
        206,
        18,
        53,
        21,
        1,
        239,
        134
      ],
      "accounts": [
        {
          "name": "incenseTypeConfig",
          "docs": [
            "香型配置账户"
          ],
          "writable": true
        },
        {
          "name": "templeAuthority",
          "writable": true
        },
        {
          "name": "templeConfig",
          "docs": [
            "寺庙状态账户"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  101,
                  109,
                  112,
                  108,
                  101,
                  95,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103,
                  95,
                  118,
                  49
                ]
              }
            ]
          }
        },
        {
          "name": "userIncenseState",
          "docs": [
            "用户香型状态账户"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  115,
                  101,
                  114,
                  95,
                  105,
                  110,
                  99,
                  101,
                  110,
                  115,
                  101,
                  95,
                  115,
                  116,
                  97,
                  116,
                  101,
                  95,
                  118,
                  49
                ]
              },
              {
                "kind": "account",
                "path": "user"
              }
            ]
          }
        },
        {
          "name": "userState",
          "docs": [
            "用户状态账户"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  115,
                  101,
                  114,
                  95,
                  115,
                  116,
                  97,
                  116,
                  101,
                  95,
                  118,
                  50
                ]
              },
              {
                "kind": "account",
                "path": "user"
              }
            ]
          }
        },
        {
          "name": "user",
          "docs": [
            "用户账户"
          ],
          "writable": true,
          "signer": true
        },
        {
          "name": "nftMintAccount",
          "docs": [
            "nft mint"
          ],
          "writable": true
        },
        {
          "name": "userNftAssociatedTokenAccount",
          "docs": [
            "用户NFT关联账户"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "user"
              },
              {
                "kind": "const",
                "value": [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169
                ]
              },
              {
                "kind": "account",
                "path": "nftMintAccount"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "metaAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  101,
                  116,
                  97,
                  100,
                  97,
                  116,
                  97
                ]
              },
              {
                "kind": "account",
                "path": "tokenMetadataProgram"
              },
              {
                "kind": "account",
                "path": "nftMintAccount"
              }
            ],
            "program": {
              "kind": "account",
              "path": "tokenMetadataProgram"
            }
          }
        },
        {
          "name": "rent",
          "address": "SysvarRent111111111111111111111111111111111"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "tokenMetadataProgram",
          "address": "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        }
      ],
      "args": [
        {
          "name": "incenseTypeId",
          "type": "u8"
        },
        {
          "name": "amount",
          "type": "u8"
        }
      ]
    },
    {
      "name": "burnIncenseSimplied",
      "discriminator": [
        249,
        53,
        124,
        89,
        219,
        139,
        68,
        135
      ],
      "accounts": [
        {
          "name": "incenseTypeConfig",
          "docs": [
            "香型配置账户"
          ],
          "writable": true
        },
        {
          "name": "templeAuthority",
          "writable": true
        },
        {
          "name": "templeConfig",
          "docs": [
            "寺庙状态账户"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  101,
                  109,
                  112,
                  108,
                  101,
                  95,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103,
                  95,
                  118,
                  49
                ]
              }
            ]
          }
        },
        {
          "name": "userState",
          "docs": [
            "用户状态账户"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  115,
                  101,
                  114,
                  95,
                  115,
                  116,
                  97,
                  116,
                  101,
                  95,
                  118,
                  50
                ]
              },
              {
                "kind": "account",
                "path": "user"
              }
            ]
          }
        },
        {
          "name": "user",
          "docs": [
            "用户账户"
          ],
          "writable": true,
          "signer": true
        },
        {
          "name": "nftMintAccount",
          "docs": [
            "nft mint"
          ],
          "writable": true
        },
        {
          "name": "userNftAssociatedTokenAccount",
          "docs": [
            "用户NFT关联账户"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "user"
              },
              {
                "kind": "const",
                "value": [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169
                ]
              },
              {
                "kind": "account",
                "path": "nftMintAccount"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "metaAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  101,
                  116,
                  97,
                  100,
                  97,
                  116,
                  97
                ]
              },
              {
                "kind": "account",
                "path": "tokenMetadataProgram"
              },
              {
                "kind": "account",
                "path": "nftMintAccount"
              }
            ],
            "program": {
              "kind": "account",
              "path": "tokenMetadataProgram"
            }
          }
        },
        {
          "name": "rent",
          "address": "SysvarRent111111111111111111111111111111111"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "tokenMetadataProgram",
          "address": "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        }
      ],
      "args": [
        {
          "name": "incenseTypeId",
          "type": "u8"
        },
        {
          "name": "amount",
          "type": "u8"
        },
        {
          "name": "paymentAmount",
          "type": "u64"
        }
      ],
      "returns": {
        "defined": {
          "name": "burnIncenseResult"
        }
      }
    },
    {
      "name": "buyIncense",
      "discriminator": [
        158,
        244,
        18,
        199,
        55,
        137,
        6,
        154
      ],
      "accounts": [
        {
          "name": "userIncenseState",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  115,
                  101,
                  114,
                  95,
                  105,
                  110,
                  99,
                  101,
                  110,
                  115,
                  101,
                  95,
                  115,
                  116,
                  97,
                  116,
                  101,
                  95,
                  118,
                  49
                ]
              },
              {
                "kind": "account",
                "path": "user"
              }
            ]
          }
        },
        {
          "name": "userState",
          "docs": [
            "用户状态账户"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  115,
                  101,
                  114,
                  95,
                  115,
                  116,
                  97,
                  116,
                  101,
                  95,
                  118,
                  50
                ]
              },
              {
                "kind": "account",
                "path": "user"
              }
            ]
          }
        },
        {
          "name": "templeTreasury",
          "writable": true
        },
        {
          "name": "templeConfig",
          "docs": [
            "寺庙状态账户"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  101,
                  109,
                  112,
                  108,
                  101,
                  95,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103,
                  95,
                  118,
                  49
                ]
              }
            ]
          }
        },
        {
          "name": "user",
          "docs": [
            "用户账户"
          ],
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "docs": [
            "系统程序"
          ],
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "buyIncenseParams",
          "type": {
            "vec": {
              "defined": {
                "name": "buyIncenseItem"
              }
            }
          }
        }
      ]
    },
    {
      "name": "cancelLikeWish",
      "discriminator": [
        56,
        227,
        111,
        152,
        222,
        177,
        242,
        74
      ],
      "accounts": [
        {
          "name": "wishLike",
          "docs": [
            "点赞账户 - 使用 close 回收账户租金"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  119,
                  105,
                  115,
                  104,
                  95,
                  108,
                  105,
                  107,
                  101,
                  95,
                  118,
                  49
                ]
              },
              {
                "kind": "account",
                "path": "liker"
              },
              {
                "kind": "account",
                "path": "creator"
              },
              {
                "kind": "arg",
                "path": "wishId"
              }
            ]
          }
        },
        {
          "name": "wish",
          "docs": [
            "愿望账户 - 需要更新点赞数"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  119,
                  105,
                  115,
                  104,
                  95,
                  118,
                  49
                ]
              },
              {
                "kind": "account",
                "path": "creator"
              },
              {
                "kind": "arg",
                "path": "wishId"
              }
            ]
          }
        },
        {
          "name": "creator"
        },
        {
          "name": "liker",
          "docs": [
            "点赞者账户 - 交易签名者和租金接收者"
          ],
          "writable": true,
          "signer": true
        }
      ],
      "args": [
        {
          "name": "wishId",
          "type": "u64"
        }
      ]
    },
    {
      "name": "createWish",
      "discriminator": [
        47,
        64,
        159,
        45,
        95,
        19,
        61,
        165
      ],
      "accounts": [
        {
          "name": "wish",
          "docs": [
            "愿望账户 - 使用 PDA 确保唯一性"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  119,
                  105,
                  115,
                  104,
                  95,
                  118,
                  49
                ]
              },
              {
                "kind": "account",
                "path": "user"
              },
              {
                "kind": "arg",
                "path": "wishId"
              }
            ]
          }
        },
        {
          "name": "userState",
          "docs": [
            "用户状态账户 - 存储用户的许愿记录和功德值"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  115,
                  101,
                  114,
                  95,
                  115,
                  116,
                  97,
                  116,
                  101,
                  95,
                  118,
                  50
                ]
              },
              {
                "kind": "account",
                "path": "user"
              }
            ]
          }
        },
        {
          "name": "user",
          "docs": [
            "用户账户 - 交易签名者和费用支付者"
          ],
          "writable": true,
          "signer": true
        },
        {
          "name": "templeConfig",
          "docs": [
            "寺庙全局状态账户 - 存储全局统计信息"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  101,
                  109,
                  112,
                  108,
                  101,
                  95,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103,
                  95,
                  118,
                  49
                ]
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "docs": [
            "系统程序 - 用于创建账户"
          ],
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "wishId",
          "type": "u64"
        },
        {
          "name": "contentHash",
          "type": {
            "array": [
              "u8",
              32
            ]
          }
        },
        {
          "name": "isAnonymous",
          "type": "bool"
        }
      ],
      "returns": {
        "defined": {
          "name": "createWishResult"
        }
      }
    },
    {
      "name": "donateFund",
      "discriminator": [
        117,
        129,
        166,
        102,
        104,
        194,
        124,
        179
      ],
      "accounts": [
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "userState",
          "docs": [
            "用户状态账户"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  115,
                  101,
                  114,
                  95,
                  115,
                  116,
                  97,
                  116,
                  101,
                  95,
                  118,
                  50
                ]
              },
              {
                "kind": "account",
                "path": "user"
              }
            ]
          }
        },
        {
          "name": "userIncenseState",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  115,
                  101,
                  114,
                  95,
                  105,
                  110,
                  99,
                  101,
                  110,
                  115,
                  101,
                  95,
                  115,
                  116,
                  97,
                  116,
                  101,
                  95,
                  118,
                  49
                ]
              },
              {
                "kind": "account",
                "path": "user"
              }
            ]
          }
        },
        {
          "name": "templeTreasury",
          "writable": true
        },
        {
          "name": "templeConfig",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  101,
                  109,
                  112,
                  108,
                  101,
                  95,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103,
                  95,
                  118,
                  49
                ]
              }
            ]
          }
        },
        {
          "name": "nftMintAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  98,
                  97,
                  100,
                  103,
                  101,
                  95,
                  110,
                  102,
                  116,
                  95,
                  118,
                  49
                ]
              },
              {
                "kind": "account",
                "path": "templeConfig"
              },
              {
                "kind": "account",
                "path": "user"
              }
            ]
          }
        },
        {
          "name": "userNftAssociatedTokenAccount",
          "docs": [
            "User's badge NFT associated account"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "user"
              },
              {
                "kind": "const",
                "value": [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169
                ]
              },
              {
                "kind": "account",
                "path": "nftMintAccount"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "metaAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  101,
                  116,
                  97,
                  100,
                  97,
                  116,
                  97
                ]
              },
              {
                "kind": "account",
                "path": "tokenMetadataProgram"
              },
              {
                "kind": "account",
                "path": "nftMintAccount"
              }
            ],
            "program": {
              "kind": "account",
              "path": "tokenMetadataProgram"
            }
          }
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "tokenMetadataProgram",
          "address": "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          "name": "rent",
          "address": "SysvarRent111111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ],
      "returns": {
        "defined": {
          "name": "donateFundResult"
        }
      }
    },
    {
      "name": "drawFortune",
      "discriminator": [
        167,
        57,
        67,
        163,
        76,
        93,
        229,
        97
      ],
      "accounts": [
        {
          "name": "userState",
          "docs": [
            "用户状态账户（PDA）",
            "存储用户的功德值、抽签次数等信息"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  115,
                  101,
                  114,
                  95,
                  115,
                  116,
                  97,
                  116,
                  101,
                  95,
                  118,
                  50
                ]
              },
              {
                "kind": "account",
                "path": "user"
              }
            ]
          }
        },
        {
          "name": "user",
          "docs": [
            "用户账户（签名者）",
            "必须是交易的签名者，用于身份验证"
          ],
          "writable": true,
          "signer": true
        },
        {
          "name": "templeConfig",
          "docs": [
            "寺庙全局配置账户（PDA）",
            "存储寺庙的全局统计信息"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  101,
                  109,
                  112,
                  108,
                  101,
                  95,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103,
                  95,
                  118,
                  49
                ]
              }
            ]
          }
        },
        {
          "name": "randomnessAccount",
          "docs": [
            "",
            "在生产环境中，此账户应该是 Switchboard 随机数账户。",
            "使用 Option 类型允许在某些测试场景下不提供此账户。",
            "",
            "安全性说明：",
            "- 应验证账户所有者是 Switchboard 程序",
            "- 应检查随机数的时效性（slot 差值）",
            "- 如果未提供，将降级到伪随机数（不推荐用于生产）"
          ],
          "optional": true
        },
        {
          "name": "systemProgram",
          "docs": [
            "Solana 系统程序"
          ],
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [],
      "returns": {
        "defined": {
          "name": "drawFortuneResult"
        }
      }
    },
    {
      "name": "initIncenseNft",
      "discriminator": [
        121,
        90,
        33,
        153,
        45,
        36,
        236,
        36
      ],
      "accounts": [
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "incenseTypeConfig",
          "docs": [
            "香型配置账户"
          ],
          "writable": true
        },
        {
          "name": "templeAuthority",
          "writable": true
        },
        {
          "name": "templeConfig",
          "docs": [
            "寺庙状态账户"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  101,
                  109,
                  112,
                  108,
                  101,
                  95,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103,
                  95,
                  118,
                  49
                ]
              }
            ]
          }
        },
        {
          "name": "nftMintAccount",
          "docs": [
            "nft mint"
          ],
          "writable": true
        },
        {
          "name": "metaAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  101,
                  116,
                  97,
                  100,
                  97,
                  116,
                  97
                ]
              },
              {
                "kind": "account",
                "path": "tokenMetadataProgram"
              },
              {
                "kind": "account",
                "path": "nftMintAccount"
              }
            ],
            "program": {
              "kind": "account",
              "path": "tokenMetadataProgram"
            }
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "tokenMetadataProgram",
          "address": "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
        },
        {
          "name": "rent",
          "address": "SysvarRent111111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "incenseTypeId",
          "type": "u8"
        }
      ]
    },
    {
      "name": "initIncenseType",
      "discriminator": [
        8,
        244,
        61,
        101,
        0,
        255,
        78,
        160
      ],
      "accounts": [
        {
          "name": "incenseTypeConfig",
          "docs": [
            "香型配置账户",
            "使用香型ID作为种子生成PDA"
          ],
          "writable": true
        },
        {
          "name": "templeConfig",
          "docs": [
            "寺庙全局状态账户",
            "需要更新香型计数"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  101,
                  109,
                  112,
                  108,
                  101,
                  95,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103,
                  95,
                  118,
                  49
                ]
              }
            ]
          }
        },
        {
          "name": "authority",
          "docs": [
            "寺庙管理员账户",
            "只有管理员可以创建香型"
          ],
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "docs": [
            "Solana系统程序"
          ],
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": {
              "name": "initializeIncenseTypeParams"
            }
          }
        }
      ]
    },
    {
      "name": "initTemple",
      "discriminator": [
        131,
        180,
        223,
        177,
        33,
        244,
        97,
        216
      ],
      "accounts": [
        {
          "name": "templeConfig",
          "docs": [
            "寺庙状态账户"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  101,
                  109,
                  112,
                  108,
                  101,
                  95,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103,
                  95,
                  118,
                  49
                ]
              }
            ]
          }
        },
        {
          "name": "authority",
          "docs": [
            "管理员账户"
          ],
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "docs": [
            "系统程序"
          ],
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "treasury",
          "type": "pubkey"
        }
      ]
    },
    {
      "name": "initUser",
      "discriminator": [
        14,
        51,
        68,
        159,
        237,
        78,
        158,
        102
      ],
      "accounts": [
        {
          "name": "userState",
          "docs": [
            "用户状态账户",
            "使用用户地址作为种子生成PDA"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  115,
                  101,
                  114,
                  95,
                  115,
                  116,
                  97,
                  116,
                  101,
                  95,
                  118,
                  50
                ]
              },
              {
                "kind": "account",
                "path": "user"
              }
            ]
          }
        },
        {
          "name": "user",
          "docs": [
            "用户账户",
            "用户为自己创建状态账户"
          ],
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "docs": [
            "Solana系统程序",
            "用于创建新账户"
          ],
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "likeWish",
      "discriminator": [
        237,
        115,
        19,
        77,
        234,
        31,
        168,
        83
      ],
      "accounts": [
        {
          "name": "wishLike",
          "docs": [
            "点赞账户 - 使用 PDA 确保唯一性"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  119,
                  105,
                  115,
                  104,
                  95,
                  108,
                  105,
                  107,
                  101,
                  95,
                  118,
                  49
                ]
              },
              {
                "kind": "account",
                "path": "liker"
              },
              {
                "kind": "account",
                "path": "creator"
              },
              {
                "kind": "arg",
                "path": "wishId"
              }
            ]
          }
        },
        {
          "name": "wish",
          "docs": [
            "愿望账户 - 使用 PDA 确保唯一性"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  119,
                  105,
                  115,
                  104,
                  95,
                  118,
                  49
                ]
              },
              {
                "kind": "account",
                "path": "creator"
              },
              {
                "kind": "arg",
                "path": "wishId"
              }
            ]
          }
        },
        {
          "name": "creator",
          "writable": true
        },
        {
          "name": "liker",
          "docs": [
            "用户账户 - 交易签名者和费用支付者"
          ],
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "wishId",
          "type": "u64"
        }
      ]
    },
    {
      "name": "mintBuddhaNft",
      "discriminator": [
        104,
        31,
        241,
        122,
        252,
        250,
        253,
        0
      ],
      "accounts": [
        {
          "name": "buddhaNftAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  98,
                  117,
                  100,
                  100,
                  104,
                  97,
                  95,
                  110,
                  102,
                  116
                ]
              },
              {
                "kind": "const",
                "value": [
                  97,
                  99,
                  99,
                  111,
                  117,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "templeConfig"
              },
              {
                "kind": "account",
                "path": "user"
              }
            ]
          }
        },
        {
          "name": "userState",
          "docs": [
            "用户状态账户"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  115,
                  101,
                  114,
                  95,
                  115,
                  116,
                  97,
                  116,
                  101,
                  95,
                  118,
                  50
                ]
              },
              {
                "kind": "account",
                "path": "user"
              }
            ]
          }
        },
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "templeConfig",
          "docs": [
            "寺庙状态账户"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  101,
                  109,
                  112,
                  108,
                  101,
                  95,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103,
                  95,
                  118,
                  49
                ]
              }
            ]
          }
        },
        {
          "name": "nftMintAccount",
          "docs": [
            "nft mint"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  98,
                  117,
                  100,
                  100,
                  104,
                  97,
                  95,
                  110,
                  102,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "templeConfig"
              },
              {
                "kind": "account",
                "path": "user"
              }
            ]
          }
        },
        {
          "name": "userNftAssociatedTokenAccount",
          "docs": [
            "用户NFT关联账户"
          ],
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "user"
              },
              {
                "kind": "const",
                "value": [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169
                ]
              },
              {
                "kind": "account",
                "path": "nftMintAccount"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "metaAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  101,
                  116,
                  97,
                  100,
                  97,
                  116,
                  97
                ]
              },
              {
                "kind": "account",
                "path": "tokenMetadataProgram"
              },
              {
                "kind": "account",
                "path": "nftMintAccount"
              }
            ],
            "program": {
              "kind": "account",
              "path": "tokenMetadataProgram"
            }
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "tokenMetadataProgram",
          "address": "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          "name": "rent",
          "address": "SysvarRent111111111111111111111111111111111"
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "buddhaNft",
      "discriminator": [
        101,
        250,
        64,
        55,
        201,
        40,
        191,
        249
      ]
    },
    {
      "name": "incenseTypeConfig",
      "discriminator": [
        162,
        227,
        127,
        175,
        222,
        242,
        56,
        90
      ]
    },
    {
      "name": "templeConfig",
      "discriminator": [
        27,
        116,
        7,
        67,
        209,
        48,
        108,
        209
      ]
    },
    {
      "name": "userIncenseState",
      "discriminator": [
        127,
        125,
        12,
        111,
        67,
        193,
        193,
        53
      ]
    },
    {
      "name": "userState",
      "discriminator": [
        72,
        177,
        85,
        249,
        76,
        167,
        186,
        126
      ]
    },
    {
      "name": "wish",
      "discriminator": [
        19,
        93,
        74,
        238,
        190,
        158,
        94,
        132
      ]
    },
    {
      "name": "wishLike",
      "discriminator": [
        225,
        166,
        172,
        94,
        61,
        243,
        114,
        238
      ]
    }
  ],
  "events": [
    {
      "name": "buyIncenseEvent",
      "discriminator": [
        88,
        19,
        166,
        230,
        230,
        138,
        39,
        13
      ]
    },
    {
      "name": "incenseInitEvent",
      "discriminator": [
        44,
        24,
        227,
        183,
        204,
        108,
        11,
        98
      ]
    },
    {
      "name": "templeInitEvent",
      "discriminator": [
        161,
        105,
        89,
        13,
        8,
        164,
        228,
        85
      ]
    },
    {
      "name": "userInitEvent",
      "discriminator": [
        152,
        33,
        34,
        92,
        89,
        65,
        176,
        155
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "invalidUser",
      "msg": "Invalid user"
    },
    {
      "code": 6001,
      "name": "burnCountOverflow",
      "msg": "Burn count overflow"
    },
    {
      "code": 6002,
      "name": "wishCountOverflow",
      "msg": "Wish count overflow"
    },
    {
      "code": 6003,
      "name": "invalidRandomnessAccount",
      "msg": "Invalid randomness account"
    },
    {
      "code": 6004,
      "name": "notEnoughKarmaPoints",
      "msg": "Not enough karma points"
    },
    {
      "code": 6005,
      "name": "burnOperationsOverflow",
      "msg": "Burn operations overflow"
    },
    {
      "code": 6006,
      "name": "incenseBurnedOverflow",
      "msg": "Incense burned overflow"
    },
    {
      "code": 6007,
      "name": "buyCountOverflow",
      "msg": "Buy count overflow"
    },
    {
      "code": 6008,
      "name": "karmaPointsOverflow",
      "msg": "Karma points overflow"
    },
    {
      "code": 6009,
      "name": "insufficientKarmaPoints",
      "msg": "Insufficient karma points"
    },
    {
      "code": 6010,
      "name": "incenseValueOverflow",
      "msg": "Incense value overflow"
    },
    {
      "code": 6011,
      "name": "spendingOverflow",
      "msg": "Spending amount overflow"
    },
    {
      "code": 6012,
      "name": "donationOverflow",
      "msg": "Donation amount overflow"
    },
    {
      "code": 6013,
      "name": "dailyBurnLimitExceeded",
      "msg": "Daily burn operation limit exceeded"
    },
    {
      "code": 6014,
      "name": "dailyDrawLimitExceeded",
      "msg": "Daily draw limit exceeded"
    },
    {
      "code": 6015,
      "name": "dailyWishLimitExceeded",
      "msg": "Daily wish limit exceeded"
    },
    {
      "code": 6016,
      "name": "userStateAlreadyExists",
      "msg": "User state already exists"
    },
    {
      "code": 6017,
      "name": "userStateNotFound",
      "msg": "User state not found"
    },
    {
      "code": 6018,
      "name": "unauthorizedUserAccess",
      "msg": "Unauthorized user access"
    }
  ],
  "types": [
    {
      "name": "buddhaNft",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "mint",
            "type": "pubkey"
          },
          {
            "name": "serialNumber",
            "type": "u32"
          },
          {
            "name": "mintedAt",
            "type": "i64"
          },
          {
            "name": "isActive",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "burnIncenseResult",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "rewardIncenseValue",
            "docs": [
              "奖励的香火值"
            ],
            "type": "u64"
          },
          {
            "name": "rewardKarmaPoints",
            "docs": [
              "奖励的功德值"
            ],
            "type": "u64"
          },
          {
            "name": "incenseTypeId",
            "docs": [
              "香型ID"
            ],
            "type": "u8"
          },
          {
            "name": "amount",
            "docs": [
              "烧香数量"
            ],
            "type": "u8"
          },
          {
            "name": "paymentAmount",
            "docs": [
              "支付金额"
            ],
            "type": "u64"
          },
          {
            "name": "currentTimestamp",
            "docs": [
              "当前时间戳"
            ],
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "buyIncenseEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "user",
            "type": "pubkey"
          },
          {
            "name": "buyItems",
            "type": {
              "vec": {
                "defined": {
                  "name": "buyIncenseItem"
                }
              }
            }
          },
          {
            "name": "totalSolAmount",
            "type": "u64"
          },
          {
            "name": "timestamp",
            "type": "i64"
          },
          {
            "name": "slot",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "buyIncenseItem",
      "docs": [
        "单个香型的购买项"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "incenseTypeId",
            "docs": [
              "香的类型ID"
            ],
            "type": "u8"
          },
          {
            "name": "quantity",
            "docs": [
              "购买数量 (1-10根)"
            ],
            "type": "u8"
          },
          {
            "name": "unitPrice",
            "docs": [
              "单价 (lamports)"
            ],
            "type": "u64"
          },
          {
            "name": "subtotal",
            "docs": [
              "小计金额 (lamports)"
            ],
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "createWishResult",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "wishId",
            "docs": [
              "许愿ID"
            ],
            "type": "u64"
          },
          {
            "name": "contentHash",
            "docs": [
              "内容哈希"
            ],
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "isAnonymous",
            "docs": [
              "是否匿名"
            ],
            "type": "bool"
          },
          {
            "name": "isFreeWish",
            "docs": [
              "是否为免费许愿"
            ],
            "type": "bool"
          },
          {
            "name": "isAmuletDropped",
            "docs": [
              "是否掉落御守"
            ],
            "type": "bool"
          },
          {
            "name": "rewardKarmaPoints",
            "docs": [
              "奖励功德值"
            ],
            "type": "u64"
          },
          {
            "name": "reduceKarmaPoints",
            "docs": [
              "消耗的功德值"
            ],
            "type": "u64"
          },
          {
            "name": "currentTimestamp",
            "docs": [
              "当前时间戳"
            ],
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "donateFundResult",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "rewardIncenseValue",
            "type": "u64"
          },
          {
            "name": "rewardKarmaPoints",
            "type": "u64"
          },
          {
            "name": "donationAmount",
            "type": "u64"
          },
          {
            "name": "currentTimestamp",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "drawFortuneResult",
      "docs": [
        "抽签结果数据结构",
        "",
        "包含抽签的所有相关信息，用于返回给客户端"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "reduceKarmaPoints",
            "docs": [
              "本次抽签消耗的功德值"
            ],
            "type": "u64"
          },
          {
            "name": "rewardKarmaPoints",
            "docs": [
              "本次抽签奖励的功德值"
            ],
            "type": "u64"
          },
          {
            "name": "currentTimestamp",
            "docs": [
              "抽签时间戳"
            ],
            "type": "i64"
          },
          {
            "name": "isFreeDraw",
            "docs": [
              "是否为免费抽签（每日首次）"
            ],
            "type": "bool"
          },
          {
            "name": "fortune",
            "docs": [
              "运势结果"
            ],
            "type": {
              "defined": {
                "name": "fortuneResult"
              }
            }
          }
        ]
      }
    },
    {
      "name": "fortuneResult",
      "docs": [
        "运势结果枚举",
        "",
        "定义了7种可能的运势结果，每种结果有不同的出现概率"
      ],
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "greatLuck"
          },
          {
            "name": "lucky"
          },
          {
            "name": "good"
          },
          {
            "name": "normal"
          },
          {
            "name": "nobad"
          },
          {
            "name": "bad"
          },
          {
            "name": "veryBad"
          }
        ]
      }
    },
    {
      "name": "incenseBalance",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "incenseTypeId",
            "type": "u8"
          },
          {
            "name": "balance",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "incenseInitEvent",
      "docs": [
        "香型初始化事件"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "incenseTypeConfig",
            "type": "pubkey"
          },
          {
            "name": "incenseTypeId",
            "type": "u8"
          },
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "pricePerUnit",
            "type": "u64"
          },
          {
            "name": "karmaReward",
            "type": "u32"
          },
          {
            "name": "incenseValue",
            "type": "u32"
          },
          {
            "name": "isActive",
            "type": "bool"
          },
          {
            "name": "timestamp",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "incenseRarity",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "common"
          },
          {
            "name": "rare"
          },
          {
            "name": "epic"
          },
          {
            "name": "legendary"
          }
        ]
      }
    },
    {
      "name": "incenseTypeConfig",
      "docs": [
        "香型配置",
        "管理端定义每种香的基本属性和价格"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "incenseTypeId",
            "docs": [
              "香型ID (使用上述常量)"
            ],
            "type": "u8"
          },
          {
            "name": "name",
            "docs": [
              "香的名称 (限制32字符)"
            ],
            "type": "string"
          },
          {
            "name": "description",
            "docs": [
              "香的描述 (限制128字符)"
            ],
            "type": "string"
          },
          {
            "name": "pricePerUnit",
            "docs": [
              "购买价格 (lamports per 根)"
            ],
            "type": "u64"
          },
          {
            "name": "karmaReward",
            "docs": [
              "烧香获得的功德值"
            ],
            "type": "u32"
          },
          {
            "name": "incenseValue",
            "docs": [
              "烧香贡献的香火值"
            ],
            "type": "u32"
          },
          {
            "name": "purchasableWithSol",
            "docs": [
              "是否可以通过SOL购买"
            ],
            "type": "bool"
          },
          {
            "name": "maxBuyPerTransaction",
            "docs": [
              "每次最大购买数量"
            ],
            "type": "u8"
          },
          {
            "name": "isActive",
            "docs": [
              "是否激活此香型"
            ],
            "type": "bool"
          },
          {
            "name": "rarity",
            "docs": [
              "香的稀有度"
            ],
            "type": {
              "defined": {
                "name": "incenseRarity"
              }
            }
          },
          {
            "name": "nftCollection",
            "docs": [
              "NFT Collection 地址"
            ],
            "type": "pubkey"
          },
          {
            "name": "metadataUriTemplate",
            "docs": [
              "NFT 元数据 URI 模板 (限制200字符)"
            ],
            "type": "string"
          },
          {
            "name": "totalMinted",
            "docs": [
              "该香型已铸造的总数量（解决NFT命名重复问题）"
            ],
            "type": "u64"
          },
          {
            "name": "createdAt",
            "docs": [
              "创建时间戳"
            ],
            "type": "i64"
          },
          {
            "name": "updatedAt",
            "docs": [
              "最后更新时间戳"
            ],
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "initializeIncenseTypeParams",
      "docs": [
        "初始化香型的参数结构"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "incenseTypeId",
            "docs": [
              "香型ID"
            ],
            "type": "u8"
          },
          {
            "name": "name",
            "docs": [
              "香的名称"
            ],
            "type": "string"
          },
          {
            "name": "description",
            "docs": [
              "香的描述"
            ],
            "type": "string"
          },
          {
            "name": "pricePerUnit",
            "docs": [
              "购买价格 (lamports)"
            ],
            "type": "u64"
          },
          {
            "name": "karmaReward",
            "docs": [
              "烧香获得的功德值"
            ],
            "type": "u32"
          },
          {
            "name": "incenseValue",
            "docs": [
              "烧香贡献的香火值"
            ],
            "type": "u32"
          },
          {
            "name": "purchasableWithSol",
            "docs": [
              "是否可以通过SOL购买"
            ],
            "type": "bool"
          },
          {
            "name": "maxBuyPerTransaction",
            "docs": [
              "每次最大购买数量"
            ],
            "type": "u8"
          },
          {
            "name": "isActive",
            "docs": [
              "是否激活此香型"
            ],
            "type": "bool"
          },
          {
            "name": "rarity",
            "docs": [
              "香的稀有度"
            ],
            "type": {
              "defined": {
                "name": "incenseRarity"
              }
            }
          },
          {
            "name": "nftCollection",
            "docs": [
              "NFT Collection 地址"
            ],
            "type": "pubkey"
          },
          {
            "name": "metadataUriTemplate",
            "docs": [
              "NFT 元数据 URI 模板"
            ],
            "type": "string"
          }
        ]
      }
    },
    {
      "name": "templeConfig",
      "docs": [
        "全局寺庙状态",
        "存储寺庙的整体信息和统计数据",
        "这是整个Solji应用的核心状态账户"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "docs": [
              "寺庙管理员地址 - 拥有管理权限的地址"
            ],
            "type": "pubkey"
          },
          {
            "name": "treasury",
            "docs": [
              "寺庙资金池地址 - 存储寺庙收入的地址"
            ],
            "type": "pubkey"
          },
          {
            "name": "templeLevel",
            "docs": [
              "当前寺庙等级 (1-4: 草庙->赤庙->灵殿->赛博神殿)",
              "影响UI展示和功能解锁"
            ],
            "type": "u8"
          },
          {
            "name": "totalIncenseValue",
            "docs": [
              "全网累积香火值，用于寺庙升级判断",
              "所有用户烧香贡献的香火值总和"
            ],
            "type": "u64"
          },
          {
            "name": "totalDraws",
            "docs": [
              "总抽签次数统计",
              "用于寺庙升级条件判断"
            ],
            "type": "u64"
          },
          {
            "name": "totalWishes",
            "docs": [
              "总许愿次数统计 (为未来功能预留)",
              "预留给后续许愿功能使用"
            ],
            "type": "u64"
          },
          {
            "name": "totalDonations",
            "docs": [
              "所有用户捐助的次数"
            ],
            "type": "u64"
          },
          {
            "name": "totalBuddhaNft",
            "docs": [
              "佛像 NFT 铸造数量统计 (为未来功能预留)",
              "预留给后续SBT系统使用"
            ],
            "type": "u32"
          },
          {
            "name": "incenseTypeCount",
            "docs": [
              "已初始化的香型数量",
              "用于统计当前可用的香型种类"
            ],
            "type": "u8"
          },
          {
            "name": "createdAt",
            "docs": [
              "寺庙创建时间戳",
              "记录寺庙初始化的时间"
            ],
            "type": "i64"
          },
          {
            "name": "updatedAt",
            "docs": [
              "最后更新时间戳",
              "记录状态最后一次更新的时间"
            ],
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "templeInitEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "templeConfig",
            "type": "pubkey"
          },
          {
            "name": "authority",
            "type": "pubkey"
          },
          {
            "name": "templeLevel",
            "type": "u8"
          },
          {
            "name": "timestamp",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "userIncenseState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "user",
            "type": "pubkey"
          },
          {
            "name": "incenseHavingBalances",
            "type": {
              "array": [
                {
                  "defined": {
                    "name": "incenseBalance"
                  }
                },
                6
              ]
            }
          },
          {
            "name": "incenseBurnedBalances",
            "type": {
              "array": [
                {
                  "defined": {
                    "name": "incenseBalance"
                  }
                },
                6
              ]
            }
          },
          {
            "name": "incenseTotalBalances",
            "type": {
              "array": [
                {
                  "defined": {
                    "name": "incenseBalance"
                  }
                },
                6
              ]
            }
          },
          {
            "name": "lastActiveAt",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "userInitEvent",
      "docs": [
        "用户初始化事件",
        "用于客户端监听和数据同步"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "userState",
            "type": "pubkey"
          },
          {
            "name": "user",
            "type": "pubkey"
          },
          {
            "name": "timestamp",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "userState",
      "docs": [
        "用户个人状态",
        "存储单个用户的所有行为数据和限制"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "user",
            "docs": [
              "用户钱包地址"
            ],
            "type": "pubkey"
          },
          {
            "name": "karmaPoints",
            "docs": [
              "用户累积功德值，可用于兑换额外操作"
            ],
            "type": "u64"
          },
          {
            "name": "totalIncenseValue",
            "docs": [
              "用户贡献的香火值总和"
            ],
            "type": "u64"
          },
          {
            "name": "totalSolSpent",
            "docs": [
              "用户总消费金额 (lamports)"
            ],
            "type": "u64"
          },
          {
            "name": "totalDonationAmount",
            "docs": [
              "用户捐助金额"
            ],
            "type": "u64"
          },
          {
            "name": "totalDonationCount",
            "docs": [
              "用户捐助次数"
            ],
            "type": "u64"
          },
          {
            "name": "canMintBuddhaNft",
            "docs": [
              "是否可以铸造佛像NFT"
            ],
            "type": "bool"
          },
          {
            "name": "hasMintedBuddhaNft",
            "docs": [
              "是否铸造过佛像NFT"
            ],
            "type": "bool"
          },
          {
            "name": "hasMintedBadgeNft",
            "docs": [
              "是否铸造过徽章NFT"
            ],
            "type": "bool"
          },
          {
            "name": "donationUnlockedBurns",
            "docs": [
              "通过捐助解锁的额外烧香次数（每日重置）"
            ],
            "type": "u8"
          },
          {
            "name": "dailyBurnCount",
            "docs": [
              "今日已进行烧香操作次数 (每日重置)"
            ],
            "type": "u8"
          },
          {
            "name": "dailyDrawCount",
            "docs": [
              "今日已抽签次数 (每日重置)"
            ],
            "type": "u8"
          },
          {
            "name": "dailyWishCount",
            "docs": [
              "今日已许愿次数 (每日重置，为未来功能预留)"
            ],
            "type": "u8"
          },
          {
            "name": "lastActionDay",
            "docs": [
              "上次操作日期，用于每日重置判断"
            ],
            "type": "u16"
          },
          {
            "name": "totalBurnCount",
            "docs": [
              "总烧香操作次数统计"
            ],
            "type": "u32"
          },
          {
            "name": "totalDrawCount",
            "docs": [
              "总抽签次数统计"
            ],
            "type": "u32"
          },
          {
            "name": "totalWishCount",
            "docs": [
              "总许愿次数统计 (为未来功能预留)"
            ],
            "type": "u32"
          },
          {
            "name": "createdAt",
            "docs": [
              "用户创建时间戳"
            ],
            "type": "i64"
          },
          {
            "name": "lastActiveAt",
            "docs": [
              "最后活跃时间戳"
            ],
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "wish",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "wishId",
            "docs": [
              "愿望唯一ID"
            ],
            "type": "u64"
          },
          {
            "name": "creator",
            "docs": [
              "愿望创建者地址"
            ],
            "type": "pubkey"
          },
          {
            "name": "contentHash",
            "docs": [
              "IPFS内容哈希 (32字节)",
              "存储愿望的实际内容，包括文本、图片等"
            ],
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "isAnonymous",
            "docs": [
              "是否匿名愿望",
              "true: 匿名模式，不显示创建者信息",
              "false: 公开模式，显示创建者地址"
            ],
            "type": "bool"
          },
          {
            "name": "createdAt",
            "docs": [
              "创建时间戳 (Unix时间戳)"
            ],
            "type": "i64"
          },
          {
            "name": "totalLikes",
            "docs": [
              "点赞数量",
              "记录该愿望被点赞的总次数"
            ],
            "type": "u64"
          },
          {
            "name": "isAmuletDropped",
            "docs": [
              "是否掉落御守"
            ],
            "type": "bool"
          },
          {
            "name": "isFreeWish",
            "docs": [
              "是否是免费愿望"
            ],
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "wishLike",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "wishId",
            "docs": [
              "愿望唯一ID"
            ],
            "type": "u64"
          },
          {
            "name": "creator",
            "docs": [
              "愿望创建者地址"
            ],
            "type": "pubkey"
          },
          {
            "name": "liker",
            "docs": [
              "点赞者地址"
            ],
            "type": "pubkey"
          },
          {
            "name": "createdAt",
            "docs": [
              "点赞时间戳 (Unix时间戳)"
            ],
            "type": "i64"
          }
        ]
      }
    }
  ]
};
