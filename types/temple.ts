/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/temple.json`.
 */
export type Temple = {
    "address": "D9immZaczS2ASFqqSux2iCCAaFat7vcusB1PQ2SW6d95",
    "metadata": {
        "name": "temple",
        "version": "0.1.0",
        "spec": "0.1.0",
        "description": "Created with Anchor"
    },
    "instructions": [
        {
            "name": "burnIncense",
            "docs": [
                "Distribute Buddha NFT to top 10,000 donors",
                "Burn incense"
            ],
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
                    "name": "authority",
                    "docs": [
                        "User account (payer, signer)"
                    ],
                    "writable": true,
                    "signer": true
                },
                {
                    "name": "templeAuthority",
                    "writable": true
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
                                    118,
                                    49
                                ]
                            }
                        ]
                    }
                },
                {
                    "name": "globalStats",
                    "writable": true,
                    "pda": {
                        "seeds": [
                            {
                                "kind": "const",
                                "value": [
                                    103,
                                    108,
                                    111,
                                    98,
                                    97,
                                    108,
                                    95,
                                    115,
                                    116,
                                    97,
                                    116,
                                    115,
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
                        "User account"
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
                                    101
                                ]
                            },
                            {
                                "kind": "account",
                                "path": "authority"
                            }
                        ]
                    }
                },
                {
                    "name": "userIncenseState",
                    "docs": [
                        "User incense state"
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
                                    101
                                ]
                            },
                            {
                                "kind": "account",
                                "path": "authority"
                            }
                        ]
                    }
                },
                {
                    "name": "nftMintAccount",
                    "docs": [
                        "NFT mint"
                    ],
                    "writable": true
                },
                {
                    "name": "nftAssociatedTokenAccount",
                    "docs": [
                        "User's NFT associated account"
                    ],
                    "writable": true,
                    "pda": {
                        "seeds": [
                            {
                                "kind": "account",
                                "path": "authority"
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
                    "name": "incenseId",
                    "type": "u8"
                },
                {
                    "name": "amount",
                    "type": "u64"
                },
                {
                    "name": "hasMeritAmulet",
                    "type": "bool"
                }
            ]
        },
        {
            "name": "createNftMint",
            "docs": [
                "Create NFT mint"
            ],
            "discriminator": [
                220,
                240,
                28,
                248,
                182,
                238,
                138,
                21
            ],
            "accounts": [
                {
                    "name": "authority",
                    "writable": true,
                    "signer": true
                },
                {
                    "name": "templeAuthority",
                    "writable": true
                },
                {
                    "name": "nftMintAccount",
                    "docs": [
                        "nft mint"
                    ],
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
                                    118,
                                    49
                                ]
                            }
                        ]
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
                    "name": "masterEditionAccount",
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
                            },
                            {
                                "kind": "const",
                                "value": [
                                    101,
                                    100,
                                    105,
                                    116,
                                    105,
                                    111,
                                    110
                                ]
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
                    "name": "tokenMetadataProgram",
                    "address": "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
                },
                {
                    "name": "systemProgram",
                    "address": "11111111111111111111111111111111"
                },
                {
                    "name": "rent",
                    "address": "SysvarRent111111111111111111111111111111111"
                }
            ],
            "args": [
                {
                    "name": "incenseId",
                    "type": "u8"
                }
            ]
        },
        {
            "name": "createShopConfig",
            "docs": [
                "Create shop configuration"
            ],
            "discriminator": [
                19,
                135,
                141,
                222,
                241,
                60,
                246,
                244
            ],
            "accounts": [
                {
                    "name": "owner",
                    "writable": true,
                    "signer": true,
                    "address": "FcKkQZRxD5P6JwGv58vGRAcX3CkjbX8oqFiygz6ohceU"
                },
                {
                    "name": "shopConfig",
                    "writable": true,
                    "pda": {
                        "seeds": [
                            {
                                "kind": "const",
                                "value": [
                                    115,
                                    104,
                                    111,
                                    112,
                                    95,
                                    99,
                                    111,
                                    110,
                                    102,
                                    105,
                                    103
                                ]
                            },
                            {
                                "kind": "account",
                                "path": "templeConfig"
                            }
                        ]
                    }
                },
                {
                    "name": "templeConfig",
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
                                    118,
                                    49
                                ]
                            }
                        ]
                    }
                },
                {
                    "name": "systemProgram",
                    "address": "11111111111111111111111111111111"
                },
                {
                    "name": "rent",
                    "address": "SysvarRent111111111111111111111111111111111"
                }
            ],
            "args": [
                {
                    "name": "shopItems",
                    "type": {
                        "vec": {
                            "defined": {
                                "name": "shopItem"
                            }
                        }
                    }
                }
            ]
        },
        {
            "name": "createTempleConfig",
            "docs": [
                "Create temple config initialization"
            ],
            "discriminator": [
                227,
                91,
                153,
                89,
                83,
                215,
                178,
                242
            ],
            "accounts": [
                {
                    "name": "owner",
                    "writable": true,
                    "signer": true,
                    "address": "FcKkQZRxD5P6JwGv58vGRAcX3CkjbX8oqFiygz6ohceU"
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
                                    118,
                                    49
                                ]
                            }
                        ]
                    }
                },
                {
                    "name": "globalStats",
                    "writable": true,
                    "pda": {
                        "seeds": [
                            {
                                "kind": "const",
                                "value": [
                                    103,
                                    108,
                                    111,
                                    98,
                                    97,
                                    108,
                                    95,
                                    115,
                                    116,
                                    97,
                                    116,
                                    115,
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
                    "address": "11111111111111111111111111111111"
                },
                {
                    "name": "rent",
                    "address": "SysvarRent111111111111111111111111111111111"
                }
            ],
            "args": [
                {
                    "name": "treasury",
                    "type": "pubkey"
                },
                {
                    "name": "regularFortune",
                    "type": {
                        "defined": {
                            "name": "fortuneConfig"
                        }
                    }
                },
                {
                    "name": "buddhaFortune",
                    "type": {
                        "defined": {
                            "name": "fortuneConfig"
                        }
                    }
                },
                {
                    "name": "donationLevels",
                    "type": {
                        "vec": {
                            "defined": {
                                "name": "donationLevelConfig"
                            }
                        }
                    }
                },
                {
                    "name": "donationRewards",
                    "type": {
                        "vec": {
                            "defined": {
                                "name": "donationRewardConfig"
                            }
                        }
                    }
                },
                {
                    "name": "templeLevels",
                    "type": {
                        "vec": {
                            "defined": {
                                "name": "templeLevelConfig"
                            }
                        }
                    }
                }
            ]
        },
        {
            "name": "createWish",
            "docs": [
                "Make wish"
            ],
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
                    "name": "user",
                    "writable": true,
                    "signer": true
                },
                {
                    "name": "wishAccount",
                    "writable": true
                },
                {
                    "name": "wishTowerAccount",
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
                                    116,
                                    111,
                                    119,
                                    101,
                                    114
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
                                    101
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
                                    101
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
                    "name": "templeConfig",
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
                                    118,
                                    49
                                ]
                            }
                        ]
                    }
                },
                {
                    "name": "globalStats",
                    "writable": true,
                    "pda": {
                        "seeds": [
                            {
                                "kind": "const",
                                "value": [
                                    103,
                                    108,
                                    111,
                                    98,
                                    97,
                                    108,
                                    95,
                                    115,
                                    116,
                                    97,
                                    116,
                                    115,
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
                    "address": "11111111111111111111111111111111"
                }
            ],
            "args": [
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
            ]
        },
        {
            "name": "donateFund",
            "docs": [
                "===== Donation instructions =====",
                "Donate fund (core donation logic)"
            ],
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
                    "name": "donor",
                    "writable": true,
                    "signer": true
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
                                    118,
                                    49
                                ]
                            }
                        ]
                    }
                },
                {
                    "name": "globalStats",
                    "writable": true,
                    "pda": {
                        "seeds": [
                            {
                                "kind": "const",
                                "value": [
                                    103,
                                    108,
                                    111,
                                    98,
                                    97,
                                    108,
                                    95,
                                    115,
                                    116,
                                    97,
                                    116,
                                    115,
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
                                    101
                                ]
                            },
                            {
                                "kind": "account",
                                "path": "donor"
                            }
                        ]
                    }
                },
                {
                    "name": "userDonationState",
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
                                    100,
                                    111,
                                    110,
                                    97,
                                    116,
                                    105,
                                    111,
                                    110
                                ]
                            },
                            {
                                "kind": "account",
                                "path": "donor"
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
                                    101
                                ]
                            },
                            {
                                "kind": "account",
                                "path": "donor"
                            }
                        ]
                    }
                },
                {
                    "name": "templeTreasury",
                    "writable": true
                },
                {
                    "name": "medalNftAccount",
                    "writable": true,
                    "pda": {
                        "seeds": [
                            {
                                "kind": "const",
                                "value": [
                                    109,
                                    101,
                                    100,
                                    97,
                                    108,
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
                                "path": "donor"
                            }
                        ]
                    }
                },
                {
                    "name": "medalNftMint",
                    "writable": true,
                    "pda": {
                        "seeds": [
                            {
                                "kind": "const",
                                "value": [
                                    109,
                                    101,
                                    100,
                                    97,
                                    108,
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
                                "path": "donor"
                            }
                        ]
                    }
                },
                {
                    "name": "medalNftTokenAccount",
                    "docs": [
                        "User's medal NFT associated account"
                    ],
                    "writable": true,
                    "pda": {
                        "seeds": [
                            {
                                "kind": "account",
                                "path": "donor"
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
                                "path": "medalNftMint"
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
                    "name": "medalNftMetadata",
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
                                "path": "medalNftMint"
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
            ]
        },
        {
            "name": "drawFortune",
            "docs": [
                "Draw fortune"
            ],
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
                    "name": "user",
                    "writable": true,
                    "signer": true
                },
                {
                    "name": "userState",
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
                                    101
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
                                    101
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
                                    118,
                                    49
                                ]
                            }
                        ]
                    }
                },
                {
                    "name": "fortuneNftAccount",
                    "writable": true,
                    "pda": {
                        "seeds": [
                            {
                                "kind": "const",
                                "value": [
                                    102,
                                    111,
                                    114,
                                    116,
                                    117,
                                    110,
                                    101,
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
                            },
                            {
                                "kind": "account",
                                "path": "user_incense_state.total_draws",
                                "account": "userIncenseState"
                            }
                        ]
                    }
                },
                {
                    "name": "fortuneNftMint",
                    "writable": true,
                    "pda": {
                        "seeds": [
                            {
                                "kind": "const",
                                "value": [
                                    102,
                                    111,
                                    114,
                                    116,
                                    117,
                                    110,
                                    101,
                                    95,
                                    110,
                                    102,
                                    116,
                                    95,
                                    109,
                                    105,
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
                            },
                            {
                                "kind": "account",
                                "path": "user_incense_state.total_draws",
                                "account": "userIncenseState"
                            }
                        ]
                    }
                },
                {
                    "name": "fortuneNftTokenAccount",
                    "docs": [
                        "User's fortune NFT associated account"
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
                                "path": "fortuneNftMint"
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
                    "name": "fortuneNftMetadata",
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
                                "path": "fortuneNftMint"
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
                    "name": "tokenMetadataProgram",
                    "address": "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
                },
                {
                    "name": "associatedTokenProgram",
                    "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
                },
                {
                    "name": "systemProgram",
                    "address": "11111111111111111111111111111111"
                },
                {
                    "name": "rent",
                    "address": "SysvarRent111111111111111111111111111111111"
                }
            ],
            "args": [
                {
                    "name": "useMerit",
                    "type": "bool"
                },
                {
                    "name": "hasFortuneAmulet",
                    "type": "bool"
                },
                {
                    "name": "hasProtectionAmulet",
                    "type": "bool"
                }
            ],
            "returns": {
                "defined": {
                    "name": "drawResult"
                }
            }
        },
        {
            "name": "initUser",
            "docs": [
                "Initialize user state"
            ],
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
                                    101
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
                                    101
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
                    "name": "userDonationState",
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
                                    100,
                                    111,
                                    110,
                                    97,
                                    116,
                                    105,
                                    111,
                                    110
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
                    "name": "globalStats",
                    "writable": true,
                    "pda": {
                        "seeds": [
                            {
                                "kind": "const",
                                "value": [
                                    103,
                                    108,
                                    111,
                                    98,
                                    97,
                                    108,
                                    95,
                                    115,
                                    116,
                                    97,
                                    116,
                                    115,
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
                    "writable": true,
                    "signer": true
                },
                {
                    "name": "systemProgram",
                    "address": "11111111111111111111111111111111"
                }
            ],
            "args": []
        },
        {
            "name": "likeWish",
            "docs": [
                "Like wish"
            ],
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
                    "name": "user",
                    "writable": true,
                    "signer": true
                },
                {
                    "name": "wishAccount",
                    "writable": true
                }
            ],
            "args": []
        },
        {
            "name": "mintAmuletNft",
            "docs": [
                "Mint amulet NFT"
            ],
            "discriminator": [
                242,
                216,
                48,
                78,
                202,
                225,
                160,
                243
            ],
            "accounts": [
                {
                    "name": "authority",
                    "docs": [
                        "User account"
                    ],
                    "writable": true,
                    "signer": true
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
                                    118,
                                    49
                                ]
                            }
                        ]
                    }
                },
                {
                    "name": "globalStats",
                    "writable": true,
                    "pda": {
                        "seeds": [
                            {
                                "kind": "const",
                                "value": [
                                    103,
                                    108,
                                    111,
                                    98,
                                    97,
                                    108,
                                    95,
                                    115,
                                    116,
                                    97,
                                    116,
                                    115,
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
                        "User account"
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
                                    101
                                ]
                            },
                            {
                                "kind": "account",
                                "path": "authority"
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
                                    97,
                                    109,
                                    117,
                                    108,
                                    101,
                                    116,
                                    95,
                                    110,
                                    102,
                                    116
                                ]
                            },
                            {
                                "kind": "account",
                                "path": "authority"
                            },
                            {
                                "kind": "const",
                                "value": [
                                    102,
                                    111,
                                    114,
                                    109,
                                    97,
                                    116,
                                    33,
                                    32,
                                    40,
                                    34,
                                    123,
                                    125,
                                    34,
                                    44,
                                    32,
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
                                    103
                                ]
                            }
                        ]
                    }
                },
                {
                    "name": "nftAssociatedTokenAccount",
                    "docs": [
                        "User's NFT associated token account"
                    ],
                    "writable": true,
                    "pda": {
                        "seeds": [
                            {
                                "kind": "account",
                                "path": "authority"
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
                    "docs": [
                        "CHECK： Metadata account"
                    ],
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
                    "name": "amuletType",
                    "type": "u8"
                },
                {
                    "name": "source",
                    "type": "u8"
                }
            ]
        },
        {
            "name": "mintBuddhaNft",
            "docs": [
                "Mint Buddha NFT"
            ],
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
                    "name": "authority",
                    "docs": [
                        "User account"
                    ],
                    "writable": true,
                    "signer": true
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
                                    118,
                                    49
                                ]
                            }
                        ]
                    }
                },
                {
                    "name": "globalStats",
                    "writable": true,
                    "pda": {
                        "seeds": [
                            {
                                "kind": "const",
                                "value": [
                                    103,
                                    108,
                                    111,
                                    98,
                                    97,
                                    108,
                                    95,
                                    115,
                                    116,
                                    97,
                                    116,
                                    115,
                                    95,
                                    118,
                                    49
                                ]
                            }
                        ]
                    }
                },
                {
                    "name": "templeTreasury",
                    "writable": true
                },
                {
                    "name": "userState",
                    "docs": [
                        "User account"
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
                                    101
                                ]
                            },
                            {
                                "kind": "account",
                                "path": "authority"
                            }
                        ]
                    }
                },
                {
                    "name": "userDonateState",
                    "docs": [
                        "Donation account"
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
                                    100,
                                    111,
                                    110,
                                    97,
                                    116,
                                    105,
                                    111,
                                    110
                                ]
                            },
                            {
                                "kind": "account",
                                "path": "authority"
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
                                    66,
                                    117,
                                    100,
                                    100,
                                    104,
                                    97,
                                    78,
                                    70,
                                    84
                                ]
                            },
                            {
                                "kind": "account",
                                "path": "templeConfig"
                            },
                            {
                                "kind": "account",
                                "path": "authority"
                            }
                        ]
                    }
                },
                {
                    "name": "nftAssociatedTokenAccount",
                    "docs": [
                        "User's NFT associated token account"
                    ],
                    "writable": true,
                    "pda": {
                        "seeds": [
                            {
                                "kind": "account",
                                "path": "authority"
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
                    "name": "buddhaNftAccount",
                    "writable": true,
                    "pda": {
                        "seeds": [
                            {
                                "kind": "const",
                                "value": [
                                    66,
                                    117,
                                    100,
                                    100,
                                    104,
                                    97,
                                    78,
                                    70,
                                    84
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
                                "path": "authority"
                            }
                        ]
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
            "args": []
        },
        {
            "name": "mintWishTowerNft",
            "docs": [
                "Mint wish tower NFT"
            ],
            "discriminator": [
                146,
                97,
                143,
                0,
                44,
                17,
                235,
                148
            ],
            "accounts": [
                {
                    "name": "authority",
                    "docs": [
                        "User account"
                    ],
                    "writable": true,
                    "signer": true
                },
                {
                    "name": "wishTowerAccount",
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
                                    116,
                                    111,
                                    119,
                                    101,
                                    114
                                ]
                            },
                            {
                                "kind": "account",
                                "path": "authority"
                            }
                        ]
                    }
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
                                    118,
                                    49
                                ]
                            }
                        ]
                    }
                },
                {
                    "name": "globalStats",
                    "writable": true,
                    "pda": {
                        "seeds": [
                            {
                                "kind": "const",
                                "value": [
                                    103,
                                    108,
                                    111,
                                    98,
                                    97,
                                    108,
                                    95,
                                    115,
                                    116,
                                    97,
                                    116,
                                    115,
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
                                    87,
                                    105,
                                    115,
                                    104,
                                    84,
                                    111,
                                    119,
                                    101,
                                    114,
                                    78,
                                    70,
                                    84
                                ]
                            },
                            {
                                "kind": "account",
                                "path": "wishTowerAccount"
                            }
                        ]
                    }
                },
                {
                    "name": "nftAssociatedTokenAccount",
                    "docs": [
                        "User's NFT associated token account"
                    ],
                    "writable": true,
                    "pda": {
                        "seeds": [
                            {
                                "kind": "account",
                                "path": "authority"
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
                    "name": "wishTowerNftAccount",
                    "writable": true,
                    "pda": {
                        "seeds": [
                            {
                                "kind": "const",
                                "value": [
                                    87,
                                    105,
                                    115,
                                    104,
                                    84,
                                    111,
                                    119,
                                    101,
                                    114,
                                    78,
                                    70,
                                    84,
                                    65,
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
                                "path": "wishTowerAccount"
                            }
                        ]
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
            "args": []
        },
        {
            "name": "purchaseItem",
            "docs": [
                "=== Shop related ====",
                "Get shop items list",
                "Purchase shop items"
            ],
            "discriminator": [
                38,
                91,
                106,
                119,
                28,
                153,
                35,
                183
            ],
            "accounts": [
                {
                    "name": "authority",
                    "writable": true,
                    "signer": true
                },
                {
                    "name": "templeTreasury",
                    "writable": true
                },
                {
                    "name": "shopConfig",
                    "pda": {
                        "seeds": [
                            {
                                "kind": "const",
                                "value": [
                                    115,
                                    104,
                                    111,
                                    112,
                                    95,
                                    99,
                                    111,
                                    110,
                                    102,
                                    105,
                                    103
                                ]
                            },
                            {
                                "kind": "account",
                                "path": "templeConfig"
                            }
                        ]
                    }
                },
                {
                    "name": "templeConfig",
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
                                    118,
                                    49
                                ]
                            }
                        ]
                    }
                },
                {
                    "name": "userState",
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
                                    101
                                ]
                            },
                            {
                                "kind": "account",
                                "path": "authority"
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
                                    101
                                ]
                            },
                            {
                                "kind": "account",
                                "path": "authority"
                            }
                        ]
                    }
                },
                {
                    "name": "systemProgram",
                    "address": "11111111111111111111111111111111"
                }
            ],
            "args": [
                {
                    "name": "itemId",
                    "type": "u8"
                },
                {
                    "name": "quantity",
                    "type": "u64"
                }
            ]
        },
        {
            "name": "shareFortune",
            "docs": [
                "Share fortune to get rewards"
            ],
            "discriminator": [
                175,
                114,
                248,
                97,
                144,
                5,
                16,
                202
            ],
            "accounts": [
                {
                    "name": "user",
                    "writable": true,
                    "signer": true
                },
                {
                    "name": "userState",
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
                                    101
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
                                    101
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
                    "name": "templeConfig",
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
                                    118,
                                    49
                                ]
                            }
                        ]
                    }
                }
            ],
            "args": [
                {
                    "name": "shareHash",
                    "type": {
                        "array": [
                            "u8",
                            32
                        ]
                    }
                }
            ]
        },
        {
            "name": "stakeMedalNft",
            "docs": [
                "Claim free Buddha NFT (limited to top 10000)",
                "Stake medal NFT"
            ],
            "discriminator": [
                163,
                165,
                87,
                104,
                247,
                42,
                74,
                173
            ],
            "accounts": [
                {
                    "name": "owner",
                    "writable": true,
                    "signer": true
                },
                {
                    "name": "userState",
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
                                    101
                                ]
                            },
                            {
                                "kind": "account",
                                "path": "owner"
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
                                    101
                                ]
                            },
                            {
                                "kind": "account",
                                "path": "owner"
                            }
                        ]
                    }
                },
                {
                    "name": "medalNftAccount",
                    "writable": true,
                    "pda": {
                        "seeds": [
                            {
                                "kind": "const",
                                "value": [
                                    109,
                                    101,
                                    100,
                                    97,
                                    108,
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
                                "path": "owner"
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
                                    109,
                                    101,
                                    100,
                                    97,
                                    108,
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
                                "path": "owner"
                            }
                        ]
                    }
                },
                {
                    "name": "nftAssociatedTokenAccount",
                    "docs": [
                        "User's medal NFT associated token account"
                    ],
                    "writable": true,
                    "pda": {
                        "seeds": [
                            {
                                "kind": "account",
                                "path": "owner"
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
                    "name": "stakedNftTokenAccount",
                    "docs": [
                        "Contract's medal NFT token account (for staking)"
                    ],
                    "writable": true,
                    "pda": {
                        "seeds": [
                            {
                                "kind": "account",
                                "path": "templeConfig"
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
                    "name": "templeConfig",
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
                                    118,
                                    49
                                ]
                            }
                        ]
                    }
                },
                {
                    "name": "tokenProgram",
                    "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
                },
                {
                    "name": "associatedTokenProgram",
                    "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
                },
                {
                    "name": "systemProgram",
                    "address": "11111111111111111111111111111111"
                }
            ],
            "args": []
        },
        {
            "name": "unstakeMedalNft",
            "docs": [
                "Unstake medal NFT"
            ],
            "discriminator": [
                172,
                6,
                149,
                222,
                30,
                31,
                137,
                190
            ],
            "accounts": [
                {
                    "name": "owner",
                    "writable": true,
                    "signer": true
                },
                {
                    "name": "userState",
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
                                    101
                                ]
                            },
                            {
                                "kind": "account",
                                "path": "owner"
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
                                    101
                                ]
                            },
                            {
                                "kind": "account",
                                "path": "owner"
                            }
                        ]
                    }
                },
                {
                    "name": "medalNftAccount",
                    "writable": true,
                    "pda": {
                        "seeds": [
                            {
                                "kind": "const",
                                "value": [
                                    109,
                                    101,
                                    100,
                                    97,
                                    108,
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
                                "path": "owner"
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
                                    109,
                                    101,
                                    100,
                                    97,
                                    108,
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
                                "path": "owner"
                            }
                        ]
                    }
                },
                {
                    "name": "nftAssociatedTokenAccount",
                    "docs": [
                        "User's medal NFT associated token account"
                    ],
                    "writable": true,
                    "pda": {
                        "seeds": [
                            {
                                "kind": "account",
                                "path": "owner"
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
                    "name": "stakedNftTokenAccount",
                    "docs": [
                        "Contract's medal NFT token account"
                    ],
                    "writable": true,
                    "pda": {
                        "seeds": [
                            {
                                "kind": "account",
                                "path": "templeConfig"
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
                    "name": "templeConfig",
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
                                    118,
                                    49
                                ]
                            }
                        ]
                    }
                },
                {
                    "name": "tokenProgram",
                    "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
                },
                {
                    "name": "associatedTokenProgram",
                    "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
                },
                {
                    "name": "systemProgram",
                    "address": "11111111111111111111111111111111"
                }
            ],
            "args": []
        },
        {
            "name": "updateDonationLevels",
            "docs": [
                "Update donation level configuration"
            ],
            "discriminator": [
                96,
                131,
                75,
                121,
                196,
                186,
                118,
                117
            ],
            "accounts": [
                {
                    "name": "templeConfig",
                    "writable": true
                },
                {
                    "name": "authority",
                    "writable": true,
                    "signer": true
                }
            ],
            "args": [
                {
                    "name": "donationLevels",
                    "type": {
                        "vec": {
                            "defined": {
                                "name": "donationLevelConfig"
                            }
                        }
                    }
                }
            ]
        },
        {
            "name": "updateDonationRewards",
            "docs": [
                "Update donation reward configuration"
            ],
            "discriminator": [
                136,
                125,
                168,
                247,
                163,
                84,
                62,
                170
            ],
            "accounts": [
                {
                    "name": "templeConfig",
                    "writable": true
                },
                {
                    "name": "authority",
                    "writable": true,
                    "signer": true
                }
            ],
            "args": [
                {
                    "name": "donationRewards",
                    "type": {
                        "vec": {
                            "defined": {
                                "name": "donationRewardConfig"
                            }
                        }
                    }
                }
            ]
        },
        {
            "name": "updateFortuneConfig",
            "docs": [
                "Update fortune drawing configuration"
            ],
            "discriminator": [
                103,
                193,
                204,
                242,
                205,
                62,
                148,
                221
            ],
            "accounts": [
                {
                    "name": "templeConfig",
                    "writable": true
                },
                {
                    "name": "authority",
                    "writable": true,
                    "signer": true
                }
            ],
            "args": [
                {
                    "name": "regularFortune",
                    "type": {
                        "defined": {
                            "name": "fortuneConfig"
                        }
                    }
                },
                {
                    "name": "buddhaFortune",
                    "type": {
                        "defined": {
                            "name": "fortuneConfig"
                        }
                    }
                }
            ]
        },
        {
            "name": "updateIncenseTypes",
            "docs": [
                "Update incense type configuration"
            ],
            "discriminator": [
                36,
                90,
                39,
                8,
                76,
                221,
                92,
                131
            ],
            "accounts": [
                {
                    "name": "templeConfig",
                    "writable": true
                },
                {
                    "name": "authority",
                    "writable": true,
                    "signer": true
                }
            ],
            "args": [
                {
                    "name": "incenseTypes",
                    "type": {
                        "vec": {
                            "defined": {
                                "name": "incenseType"
                            }
                        }
                    }
                }
            ]
        },
        {
            "name": "updateNftUri",
            "docs": [
                "Update NFT URI"
            ],
            "discriminator": [
                85,
                135,
                208,
                222,
                93,
                250,
                253,
                217
            ],
            "accounts": [
                {
                    "name": "adminAuthority",
                    "docs": [
                        "The admin wallet signing the transaction (payer/fee payer)"
                    ],
                    "signer": true
                },
                {
                    "name": "templeAuthority",
                    "writable": true
                },
                {
                    "name": "templeConfig",
                    "docs": [
                        "Temple Configuration Account - This PDA is the CPI Signer, must be 'mut'."
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
                        "NFT Mint Account"
                    ]
                },
                {
                    "name": "metaAccount",
                    "docs": [
                        "Its address is validated via the seeds and seeds::program constraints below."
                    ],
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
                    "name": "tokenMetadataProgram",
                    "docs": [
                        "Metaplex Token Metadata Program"
                    ],
                    "address": "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
                }
            ],
            "args": [
                {
                    "name": "incenseId",
                    "type": "u8"
                },
                {
                    "name": "newUri",
                    "type": "string"
                }
            ]
        },
        {
            "name": "updateShopItems",
            "docs": [
                "Update shop items configuration"
            ],
            "discriminator": [
                173,
                103,
                158,
                132,
                232,
                31,
                219,
                239
            ],
            "accounts": [
                {
                    "name": "shopConfig",
                    "writable": true
                },
                {
                    "name": "templeConfig",
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
                                    118,
                                    49
                                ]
                            }
                        ]
                    }
                },
                {
                    "name": "authority",
                    "writable": true,
                    "signer": true
                }
            ],
            "args": [
                {
                    "name": "shopItems",
                    "type": {
                        "vec": {
                            "defined": {
                                "name": "shopItem"
                            }
                        }
                    }
                }
            ]
        },
        {
            "name": "updateTempleLevels",
            "docs": [
                "Update temple level configuration"
            ],
            "discriminator": [
                91,
                193,
                3,
                146,
                212,
                177,
                214,
                96
            ],
            "accounts": [
                {
                    "name": "templeConfig",
                    "writable": true
                },
                {
                    "name": "authority",
                    "writable": true,
                    "signer": true
                }
            ],
            "args": [
                {
                    "name": "templeLevels",
                    "type": {
                        "vec": {
                            "defined": {
                                "name": "templeLevelConfig"
                            }
                        }
                    }
                }
            ]
        },
        {
            "name": "updateTempleStatus",
            "docs": [
                "Update temple status"
            ],
            "discriminator": [
                45,
                169,
                176,
                19,
                223,
                64,
                40,
                107
            ],
            "accounts": [
                {
                    "name": "templeConfig",
                    "writable": true
                },
                {
                    "name": "authority",
                    "writable": true,
                    "signer": true
                }
            ],
            "args": [
                {
                    "name": "status",
                    "type": "u8"
                }
            ]
        },
        {
            "name": "updateTempleStatusByBit",
            "docs": [
                "Update temple status by bit"
            ],
            "discriminator": [
                149,
                222,
                218,
                99,
                118,
                195,
                123,
                147
            ],
            "accounts": [
                {
                    "name": "templeConfig",
                    "writable": true
                },
                {
                    "name": "authority",
                    "writable": true,
                    "signer": true
                }
            ],
            "args": [
                {
                    "name": "bit",
                    "type": "u8"
                },
                {
                    "name": "disabled",
                    "type": "bool"
                }
            ]
        }
    ],
    "accounts": [
        {
            "name": "buddhaNft",
            "discriminator": [
                42,
                248,
                94,
                111,
                99,
                57,
                196,
                133
            ]
        },
        {
            "name": "fortuneNft",
            "discriminator": [
                217,
                82,
                61,
                10,
                112,
                65,
                205,
                232
            ]
        },
        {
            "name": "globalStats",
            "discriminator": [
                119,
                53,
                78,
                3,
                254,
                129,
                78,
                28
            ]
        },
        {
            "name": "medalNft",
            "discriminator": [
                43,
                98,
                76,
                249,
                249,
                33,
                17,
                233
            ]
        },
        {
            "name": "shopConfig",
            "discriminator": [
                172,
                16,
                104,
                212,
                87,
                129,
                125,
                155
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
            "name": "userDonationState",
            "discriminator": [
                220,
                247,
                222,
                176,
                15,
                57,
                96,
                194
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
            "name": "wishTower",
            "discriminator": [
                193,
                95,
                124,
                166,
                21,
                93,
                96,
                41
            ]
        },
        {
            "name": "wishTowerNft",
            "discriminator": [
                37,
                39,
                34,
                225,
                171,
                31,
                98,
                159
            ]
        }
    ],
    "events": [
        {
            "name": "amuletDropped",
            "discriminator": [
                24,
                100,
                210,
                40,
                5,
                63,
                105,
                27
            ]
        },
        {
            "name": "amuletMinted",
            "discriminator": [
                5,
                74,
                5,
                29,
                227,
                131,
                7,
                204
            ]
        },
        {
            "name": "donationCompleted",
            "discriminator": [
                34,
                178,
                117,
                6,
                39,
                189,
                241,
                48
            ]
        },
        {
            "name": "donationNftMinted",
            "discriminator": [
                142,
                88,
                211,
                148,
                62,
                90,
                172,
                20
            ]
        },
        {
            "name": "fortuneDrawn",
            "discriminator": [
                134,
                252,
                88,
                211,
                24,
                112,
                209,
                240
            ]
        },
        {
            "name": "fortuneNftMinted",
            "discriminator": [
                226,
                138,
                253,
                243,
                89,
                224,
                0,
                199
            ]
        },
        {
            "name": "incenseBurned",
            "discriminator": [
                211,
                166,
                224,
                11,
                104,
                105,
                175,
                186
            ]
        },
        {
            "name": "rewardsProcessed",
            "discriminator": [
                217,
                74,
                206,
                32,
                228,
                181,
                17,
                146
            ]
        },
        {
            "name": "shopConfigUpdated",
            "discriminator": [
                225,
                68,
                254,
                156,
                42,
                153,
                151,
                172
            ]
        },
        {
            "name": "wishAddedToTower",
            "discriminator": [
                160,
                192,
                0,
                5,
                186,
                140,
                121,
                8
            ]
        },
        {
            "name": "wishCreated",
            "discriminator": [
                225,
                167,
                37,
                207,
                75,
                1,
                226,
                130
            ]
        },
        {
            "name": "wishTowerCreated",
            "discriminator": [
                12,
                159,
                171,
                141,
                71,
                1,
                65,
                54
            ]
        },
        {
            "name": "wishTowerNftMinted",
            "discriminator": [
                236,
                199,
                169,
                246,
                132,
                131,
                201,
                15
            ]
        },
        {
            "name": "wishTowerUpdated",
            "discriminator": [
                32,
                74,
                144,
                164,
                26,
                236,
                220,
                133
            ]
        }
    ],
    "errors": [
        {
            "code": 6000,
            "name": "invalidOwner",
            "msg": "Input account owner is not the program address"
        },
        {
            "code": 6001,
            "name": "mathOverflow",
            "msg": "Math overflow"
        },
        {
            "code": 6002,
            "name": "invalidIncenseId",
            "msg": "Invalid incense ID"
        },
        {
            "code": 6003,
            "name": "insufficientSolBalance",
            "msg": "Insufficient SOL balance to pay for incense"
        },
        {
            "code": 6004,
            "name": "invalidTempleTreasury",
            "msg": "Temple treasury account mismatch"
        },
        {
            "code": 6005,
            "name": "dailyIncenseLimitExceeded",
            "msg": "Daily incense limit exceeded"
        },
        {
            "code": 6006,
            "name": "invalidAmount",
            "msg": "Invalid Amount"
        },
        {
            "code": 6007,
            "name": "exceedDailyIncenseLimit",
            "msg": "Exceed daily incense limit"
        },
        {
            "code": 6008,
            "name": "insufficientIncenseBalance",
            "msg": "Insufficient incense balance"
        },
        {
            "code": 6009,
            "name": "donationOnlyIncense",
            "msg": "This incense type is only available through donations"
        },
        {
            "code": 6010,
            "name": "specialEffectFailed",
            "msg": "Failed to trigger special effect"
        },
        {
            "code": 6011,
            "name": "insufficientMerit",
            "msg": "Insufficient merit points"
        },
        {
            "code": 6012,
            "name": "dailyWishLimitExceeded",
            "msg": "Daily wish limit exceeded"
        },
        {
            "code": 6013,
            "name": "wishAlreadyExists",
            "msg": "Wish already exists"
        },
        {
            "code": 6014,
            "name": "invalidWishAccount",
            "msg": "Invalid wish account"
        },
        {
            "code": 6015,
            "name": "invalidUserState",
            "msg": "Invalid user state"
        },
        {
            "code": 6016,
            "name": "cannotLikeOwnWish",
            "msg": "Cannot like own wish"
        },
        {
            "code": 6017,
            "name": "userHasBuddhaNft",
            "msg": "User has Buddha NFT"
        },
        {
            "code": 6018,
            "name": "buddhaNftSupplyExceeded",
            "msg": "Buddha NFT supply exceeded"
        },
        {
            "code": 6019,
            "name": "insufficientDonation",
            "msg": "Insufficient donation"
        },
        {
            "code": 6020,
            "name": "randomnessNotReady",
            "msg": "Randomness not ready"
        },
        {
            "code": 6021,
            "name": "randomnessNotResolved",
            "msg": "Randomness not resolved"
        },
        {
            "code": 6022,
            "name": "randomnessAlreadyUsed",
            "msg": "Randomness already used"
        },
        {
            "code": 6023,
            "name": "randomnessExpired",
            "msg": "Randomness expired"
        },
        {
            "code": 6024,
            "name": "invalidRandomness",
            "msg": "Invalid randomness"
        },
        {
            "code": 6025,
            "name": "randomnessRequestRequired",
            "msg": "Randomness request required"
        },
        {
            "code": 6026,
            "name": "unauthorized",
            "msg": "Unauthorized access"
        },
        {
            "code": 6027,
            "name": "invalidIncenseType",
            "msg": "Invalid incense type"
        },
        {
            "code": 6028,
            "name": "invalidFortuneConfig",
            "msg": "Invalid fortune config"
        },
        {
            "code": 6029,
            "name": "invalidDonationLevel",
            "msg": "Invalid donation level"
        },
        {
            "code": 6030,
            "name": "invalidTempleLevel",
            "msg": "Invalid temple level"
        },
        {
            "code": 6031,
            "name": "userAlreadyHasMedalNft",
            "msg": "User already has medal NFT"
        },
        {
            "code": 6032,
            "name": "invalidMedalLevel",
            "msg": "Invalid medal level"
        },
        {
            "code": 6033,
            "name": "medalLevelNotIncreasing",
            "msg": "Medal level not increasing"
        },
        {
            "code": 6034,
            "name": "insufficientDonationForUpgrade",
            "msg": "Insufficient donation for medal upgrade"
        },
        {
            "code": 6035,
            "name": "invalidMedalOwner",
            "msg": "Invalid medal owner"
        },
        {
            "code": 6036,
            "name": "insufficientDonationForMedal",
            "msg": "Insufficient donation for medal"
        },
        {
            "code": 6037,
            "name": "userDoesNotHaveMedalNft",
            "msg": "User does not have medal NFT"
        },
        {
            "code": 6038,
            "name": "medalAlreadyStaked",
            "msg": "Medal already staked"
        },
        {
            "code": 6039,
            "name": "medalNotStaked",
            "msg": "Medal not staked"
        },
        {
            "code": 6040,
            "name": "shareTooLate",
            "msg": "Share too late after fortune draw"
        },
        {
            "code": 6041,
            "name": "notApproved",
            "msg": "Not approved"
        },
        {
            "code": 6042,
            "name": "insufficientPendingAmulets",
            "msg": "Insufficient pending amulets balance"
        },
        {
            "code": 6043,
            "name": "insufficientStock",
            "msg": "Insufficient stock for the item"
        },
        {
            "code": 6044,
            "name": "invalidShopItemId",
            "msg": "Invalid shop item ID"
        },
        {
            "code": 6045,
            "name": "shopItemNotAvailable",
            "msg": "Shop item not available"
        },
        {
            "code": 6046,
            "name": "invalidMaxLevel",
            "msg": "Invalid max level for wish tower"
        },
        {
            "code": 6047,
            "name": "wishTowerCompleted",
            "msg": "Wish tower is completed"
        },
        {
            "code": 6048,
            "name": "wishTowerLevelFull",
            "msg": "Wish tower level is full"
        },
        {
            "code": 6049,
            "name": "wishNotOwnedByUser",
            "msg": "Wish not owned by user"
        }
    ],
    "types": [
        {
            "name": "amuletDropped",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "user",
                        "type": "pubkey"
                    },
                    {
                        "name": "amuletType",
                        "type": "u8"
                    },
                    {
                        "name": "source",
                        "type": "string"
                    },
                    {
                        "name": "timestamp",
                        "type": "i64"
                    }
                ]
            }
        },
        {
            "name": "amuletMinted",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "user",
                        "type": "pubkey"
                    },
                    {
                        "name": "amuletMint",
                        "type": "pubkey"
                    },
                    {
                        "name": "source",
                        "type": "string"
                    },
                    {
                        "name": "serialNumber",
                        "type": "u32"
                    },
                    {
                        "name": "timestamp",
                        "type": "i64"
                    }
                ]
            }
        },
        {
            "name": "buddhaNft",
            "docs": [
                "Buddha NFT"
            ],
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
            "name": "dailyIncenseCount",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "incenseId",
                        "type": "u8"
                    },
                    {
                        "name": "count",
                        "type": "u8"
                    }
                ]
            }
        },
        {
            "name": "donationCompleted",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "user",
                        "type": "pubkey"
                    },
                    {
                        "name": "amount",
                        "type": "u64"
                    },
                    {
                        "name": "totalDonated",
                        "type": "u64"
                    },
                    {
                        "name": "level",
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
            "name": "donationLevelConfig",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "level",
                        "type": "u8"
                    },
                    {
                        "name": "minAmountSol",
                        "type": "f64"
                    },
                    {
                        "name": "meritReward",
                        "type": "u64"
                    },
                    {
                        "name": "incenseReward",
                        "type": "u64"
                    }
                ]
            }
        },
        {
            "name": "donationNftMinted",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "user",
                        "type": "pubkey"
                    },
                    {
                        "name": "nftMint",
                        "type": "pubkey"
                    },
                    {
                        "name": "level",
                        "type": "u8"
                    },
                    {
                        "name": "serialNumber",
                        "type": "u32"
                    },
                    {
                        "name": "timestamp",
                        "type": "i64"
                    }
                ]
            }
        },
        {
            "name": "donationRewardConfig",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "minDonationSol",
                        "type": "f64"
                    },
                    {
                        "name": "incenseId",
                        "type": "u8"
                    },
                    {
                        "name": "incenseAmount",
                        "type": "u64"
                    },
                    {
                        "name": "burnBonusPer001Sol",
                        "type": "u64"
                    }
                ]
            }
        },
        {
            "name": "drawResult",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "fortune",
                        "type": {
                            "defined": {
                                "name": "fortuneResult"
                            }
                        }
                    },
                    {
                        "name": "timestamp",
                        "type": "i64"
                    },
                    {
                        "name": "usedMerit",
                        "type": "bool"
                    }
                ]
            }
        },
        {
            "name": "dynamicConfig",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "incenseTypes",
                        "type": {
                            "vec": {
                                "defined": {
                                    "name": "incenseType"
                                }
                            }
                        }
                    },
                    {
                        "name": "regularFortune",
                        "type": {
                            "defined": {
                                "name": "fortuneConfig"
                            }
                        }
                    },
                    {
                        "name": "buddhaFortune",
                        "type": {
                            "defined": {
                                "name": "fortuneConfig"
                            }
                        }
                    },
                    {
                        "name": "donationLevels",
                        "type": {
                            "vec": {
                                "defined": {
                                    "name": "donationLevelConfig"
                                }
                            }
                        }
                    },
                    {
                        "name": "donationRewards",
                        "type": {
                            "vec": {
                                "defined": {
                                    "name": "donationRewardConfig"
                                }
                            }
                        }
                    },
                    {
                        "name": "templeLevels",
                        "type": {
                            "vec": {
                                "defined": {
                                    "name": "templeLevelConfig"
                                }
                            }
                        }
                    },
                    {
                        "name": "specialIncenseTypes",
                        "type": {
                            "vec": {
                                "defined": {
                                    "name": "specialIncenseType"
                                }
                            }
                        }
                    }
                ]
            }
        },
        {
            "name": "fortuneConfig",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "greatLuckProb",
                        "type": "u8"
                    },
                    {
                        "name": "goodLuckProb",
                        "type": "u8"
                    },
                    {
                        "name": "neutralProb",
                        "type": "u8"
                    },
                    {
                        "name": "badLuckProb",
                        "type": "u8"
                    },
                    {
                        "name": "greatBadLuckProb",
                        "type": "u8"
                    }
                ]
            }
        },
        {
            "name": "fortuneDrawn",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "user",
                        "type": "pubkey"
                    },
                    {
                        "name": "fortuneResult",
                        "type": "string"
                    },
                    {
                        "name": "usedMerit",
                        "type": "bool"
                    },
                    {
                        "name": "amuletDropped",
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
            "name": "fortuneNft",
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
                        "name": "fortuneResult",
                        "type": {
                            "defined": {
                                "name": "fortuneResult"
                            }
                        }
                    },
                    {
                        "name": "mintedAt",
                        "type": "i64"
                    },
                    {
                        "name": "meritCost",
                        "type": "u8"
                    },
                    {
                        "name": "serialNumber",
                        "type": "u32"
                    }
                ]
            }
        },
        {
            "name": "fortuneNftMinted",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "user",
                        "type": "pubkey"
                    },
                    {
                        "name": "fortuneNftMint",
                        "type": "pubkey"
                    },
                    {
                        "name": "fortuneResult",
                        "type": "string"
                    },
                    {
                        "name": "meritCost",
                        "type": "u32"
                    },
                    {
                        "name": "serialNumber",
                        "type": "u32"
                    },
                    {
                        "name": "timestamp",
                        "type": "i64"
                    }
                ]
            }
        },
        {
            "name": "fortuneResult",
            "type": {
                "kind": "enum",
                "variants": [
                    {
                        "name": "greatLuck"
                    },
                    {
                        "name": "goodLuck"
                    },
                    {
                        "name": "neutral"
                    },
                    {
                        "name": "badLuck"
                    },
                    {
                        "name": "greatBadLuck"
                    }
                ]
            }
        },
        {
            "name": "globalStats",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "templeConfig",
                        "type": "pubkey"
                    },
                    {
                        "name": "totalIncensePoints",
                        "type": "u64"
                    },
                    {
                        "name": "totalMerit",
                        "type": "u64"
                    },
                    {
                        "name": "totalDrawFortune",
                        "type": "u64"
                    },
                    {
                        "name": "totalWishes",
                        "type": "u64"
                    },
                    {
                        "name": "totalDonationsLamports",
                        "type": "u64"
                    },
                    {
                        "name": "totalUsers",
                        "type": "u64"
                    },
                    {
                        "name": "totalFortuneNfts",
                        "type": "u64"
                    },
                    {
                        "name": "totalAmulets",
                        "type": "u64"
                    },
                    {
                        "name": "totalBuddhaLights",
                        "type": "u64"
                    },
                    {
                        "name": "updatedAt",
                        "type": "i64"
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
                        "name": "incenseId",
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
            "name": "incenseBurned",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "user",
                        "type": "pubkey"
                    },
                    {
                        "name": "incenseId",
                        "type": "u8"
                    },
                    {
                        "name": "amount",
                        "type": "u64"
                    },
                    {
                        "name": "timestamp",
                        "type": "i64"
                    }
                ]
            }
        },
        {
            "name": "incenseItemConfig",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "merit",
                        "type": "u64"
                    },
                    {
                        "name": "incensePoints",
                        "type": "u64"
                    }
                ]
            }
        },
        {
            "name": "incenseType",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "id",
                        "type": "u8"
                    },
                    {
                        "name": "name",
                        "type": "string"
                    },
                    {
                        "name": "priceLamports",
                        "type": "u64"
                    },
                    {
                        "name": "merit",
                        "type": "u64"
                    },
                    {
                        "name": "incensePoints",
                        "type": "u64"
                    },
                    {
                        "name": "isDonation",
                        "type": "bool"
                    }
                ]
            }
        },
        {
            "name": "medalNft",
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
                        "name": "level",
                        "type": "u8"
                    },
                    {
                        "name": "totalDonation",
                        "type": "u64"
                    },
                    {
                        "name": "mintedAt",
                        "type": "i64"
                    },
                    {
                        "name": "lastUpgrade",
                        "type": "i64"
                    },
                    {
                        "name": "merit",
                        "type": "u64"
                    },
                    {
                        "name": "serialNumber",
                        "type": "u32"
                    },
                    {
                        "name": "stakedAt",
                        "type": {
                            "option": "i64"
                        }
                    }
                ]
            }
        },
        {
            "name": "rewardsProcessed",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "user",
                        "type": "pubkey"
                    },
                    {
                        "name": "meritReward",
                        "type": "u64"
                    },
                    {
                        "name": "incensePointsReward",
                        "type": "u64"
                    },
                    {
                        "name": "timestamp",
                        "type": "i64"
                    }
                ]
            }
        },
        {
            "name": "shopConfig",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "templeConfig",
                        "type": "pubkey"
                    },
                    {
                        "name": "owner",
                        "type": "pubkey"
                    },
                    {
                        "name": "createdAt",
                        "type": "i64"
                    },
                    {
                        "name": "updatedAt",
                        "type": "i64"
                    },
                    {
                        "name": "shopItems",
                        "type": {
                            "vec": {
                                "defined": {
                                    "name": "shopItem"
                                }
                            }
                        }
                    }
                ]
            }
        },
        {
            "name": "shopConfigUpdated",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "shopConfig",
                        "type": "pubkey"
                    },
                    {
                        "name": "templeConfig",
                        "type": "pubkey"
                    },
                    {
                        "name": "owner",
                        "type": "pubkey"
                    },
                    {
                        "name": "shopItems",
                        "type": {
                            "vec": {
                                "defined": {
                                    "name": "shopItem"
                                }
                            }
                        }
                    },
                    {
                        "name": "timestamp",
                        "type": "i64"
                    }
                ]
            }
        },
        {
            "name": "shopItem",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "id",
                        "type": "u8"
                    },
                    {
                        "name": "name",
                        "type": "string"
                    },
                    {
                        "name": "description",
                        "type": "string"
                    },
                    {
                        "name": "price",
                        "type": "u64"
                    },
                    {
                        "name": "itemType",
                        "type": {
                            "defined": {
                                "name": "shopItemType"
                            }
                        }
                    },
                    {
                        "name": "stock",
                        "type": "u64"
                    },
                    {
                        "name": "isAvailable",
                        "type": "bool"
                    },
                    {
                        "name": "incenseConfig",
                        "type": {
                            "option": {
                                "defined": {
                                    "name": "incenseItemConfig"
                                }
                            }
                        }
                    }
                ]
            }
        },
        {
            "name": "shopItemType",
            "type": {
                "kind": "enum",
                "variants": [
                    {
                        "name": "incense"
                    },
                    {
                        "name": "amulet"
                    },
                    {
                        "name": "prop"
                    },
                    {
                        "name": "special"
                    }
                ]
            }
        },
        {
            "name": "specialIncenseType",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "id",
                        "type": "u8"
                    },
                    {
                        "name": "name",
                        "type": "string"
                    },
                    {
                        "name": "requiredDonationSol",
                        "type": "f64"
                    },
                    {
                        "name": "amountPerDonation",
                        "type": "u64"
                    },
                    {
                        "name": "merit",
                        "type": "u64"
                    },
                    {
                        "name": "incensePoints",
                        "type": "u64"
                    },
                    {
                        "name": "isDonationOnly",
                        "type": "bool"
                    }
                ]
            }
        },
        {
            "name": "templeConfig",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "owner",
                        "type": "pubkey"
                    },
                    {
                        "name": "treasury",
                        "type": "pubkey"
                    },
                    {
                        "name": "level",
                        "type": "u8"
                    },
                    {
                        "name": "createdAt",
                        "type": "i64"
                    },
                    {
                        "name": "totalBuddhaNft",
                        "type": "u32"
                    },
                    {
                        "name": "totalMedalNft",
                        "type": "u32"
                    },
                    {
                        "name": "totalAmulets",
                        "type": "u32"
                    },
                    {
                        "name": "status",
                        "type": "u8"
                    },
                    {
                        "name": "openTime",
                        "type": "u64"
                    },
                    {
                        "name": "donationDeadline",
                        "type": "u64"
                    },
                    {
                        "name": "dynamicConfig",
                        "type": {
                            "defined": {
                                "name": "dynamicConfig"
                            }
                        }
                    }
                ]
            }
        },
        {
            "name": "templeLevelConfig",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "level",
                        "type": "u8"
                    },
                    {
                        "name": "requiredIncensePoints",
                        "type": "u64"
                    },
                    {
                        "name": "requiredDrawFortune",
                        "type": "u64"
                    },
                    {
                        "name": "requiredWishes",
                        "type": "u64"
                    },
                    {
                        "name": "requiredDonationsSol",
                        "type": "f64"
                    },
                    {
                        "name": "requiredFortuneNfts",
                        "type": "u64"
                    },
                    {
                        "name": "requiredAmulets",
                        "type": "u64"
                    }
                ]
            }
        },
        {
            "name": "userDonationState",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "user",
                        "type": "pubkey"
                    },
                    {
                        "name": "donationAmount",
                        "type": "u64"
                    },
                    {
                        "name": "donationLevel",
                        "type": "u8"
                    },
                    {
                        "name": "totalDonationCount",
                        "type": "u32"
                    },
                    {
                        "name": "lastDonationTime",
                        "type": "i64"
                    },
                    {
                        "name": "bump",
                        "type": "u8"
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
                        "name": "title",
                        "type": {
                            "defined": {
                                "name": "userTitle"
                            }
                        }
                    },
                    {
                        "name": "incensePoints",
                        "type": "u64"
                    },
                    {
                        "name": "merit",
                        "type": "u64"
                    },
                    {
                        "name": "incenseNumber",
                        "type": "u8"
                    },
                    {
                        "name": "updateTime",
                        "type": "i64"
                    },
                    {
                        "name": "bump",
                        "type": "u8"
                    },
                    {
                        "name": "incenseBalance",
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
                        "name": "dailyIncenseCount",
                        "type": {
                            "array": [
                                {
                                    "defined": {
                                        "name": "dailyIncenseCount"
                                    }
                                },
                                6
                            ]
                        }
                    },
                    {
                        "name": "dailyDrawCount",
                        "type": "u8"
                    },
                    {
                        "name": "lastDrawTime",
                        "type": "i64"
                    },
                    {
                        "name": "totalDraws",
                        "type": "u32"
                    },
                    {
                        "name": "dailyWishCount",
                        "type": "u8"
                    },
                    {
                        "name": "lastWishTime",
                        "type": "i64"
                    },
                    {
                        "name": "totalWishes",
                        "type": "u32"
                    }
                ]
            }
        },
        {
            "name": "userState",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "user",
                        "type": "pubkey"
                    },
                    {
                        "name": "hasBuddhaNft",
                        "type": "bool"
                    },
                    {
                        "name": "hasMedalNft",
                        "type": "bool"
                    },
                    {
                        "name": "bump",
                        "type": "u8"
                    },
                    {
                        "name": "pendingRandomRequestId",
                        "type": {
                            "option": {
                                "array": [
                                    "u8",
                                    32
                                ]
                            }
                        }
                    }
                ]
            }
        },
        {
            "name": "userTitle",
            "type": {
                "kind": "enum",
                "variants": [
                    {
                        "name": "pilgrim"
                    },
                    {
                        "name": "disciple"
                    },
                    {
                        "name": "protector"
                    },
                    {
                        "name": "patron"
                    },
                    {
                        "name": "abbot"
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
                        "name": "id",
                        "type": "u64"
                    },
                    {
                        "name": "creator",
                        "type": "pubkey"
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
                    },
                    {
                        "name": "createdAt",
                        "type": "i64"
                    },
                    {
                        "name": "likes",
                        "type": "u64"
                    },
                    {
                        "name": "bump",
                        "type": "u8"
                    }
                ]
            }
        },
        {
            "name": "wishAddedToTower",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "user",
                        "type": "pubkey"
                    },
                    {
                        "name": "towerId",
                        "type": "u64"
                    },
                    {
                        "name": "wishId",
                        "type": "u64"
                    },
                    {
                        "name": "level",
                        "type": "u8"
                    },
                    {
                        "name": "levelCompleted",
                        "type": "bool"
                    },
                    {
                        "name": "towerCompleted",
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
            "name": "wishCreated",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "user",
                        "type": "pubkey"
                    },
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
                    },
                    {
                        "name": "amuletDropped",
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
            "name": "wishTower",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "creator",
                        "type": "pubkey"
                    },
                    {
                        "name": "wishCount",
                        "type": "u32"
                    },
                    {
                        "name": "level",
                        "type": "u8"
                    },
                    {
                        "name": "wishIds",
                        "type": {
                            "vec": "u64"
                        }
                    },
                    {
                        "name": "createdAt",
                        "type": "i64"
                    },
                    {
                        "name": "lastUpdated",
                        "type": "i64"
                    },
                    {
                        "name": "bump",
                        "type": "u8"
                    }
                ]
            }
        },
        {
            "name": "wishTowerCreated",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "user",
                        "type": "pubkey"
                    },
                    {
                        "name": "towerId",
                        "type": "u64"
                    },
                    {
                        "name": "maxLevel",
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
            "name": "wishTowerNft",
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
                        "name": "towerId",
                        "type": "u64"
                    },
                    {
                        "name": "level",
                        "type": "u8"
                    },
                    {
                        "name": "wishCount",
                        "type": "u8"
                    },
                    {
                        "name": "mintedAt",
                        "type": "i64"
                    }
                ]
            }
        },
        {
            "name": "wishTowerNftMinted",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "user",
                        "type": "pubkey"
                    },
                    {
                        "name": "nftMint",
                        "type": "pubkey"
                    },
                    {
                        "name": "wishCount",
                        "type": "u32"
                    },
                    {
                        "name": "level",
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
            "name": "wishTowerUpdated",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "user",
                        "type": "pubkey"
                    },
                    {
                        "name": "wishCount",
                        "type": "u32"
                    },
                    {
                        "name": "level",
                        "type": "u8"
                    },
                    {
                        "name": "timestamp",
                        "type": "i64"
                    }
                ]
            }
        }
    ]
};