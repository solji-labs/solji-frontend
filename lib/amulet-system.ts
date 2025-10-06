import { AMULET_TYPES } from "./constants"

export function checkAmuletDrop(): { dropped: boolean; amulet?: any } {
  // Random chance for amulet drop
  const randomChance = Math.random()

  for (const amuletType of AMULET_TYPES) {
    if (randomChance < amuletType.dropChance) {
      return {
        dropped: true,
        amulet: {
          name: amuletType.name,
          nameZh: amuletType.nameZh,
          type: amuletType.type,
          effect: amuletType.effect,
          rarity: amuletType.rarity,
          image: getAmuletImage(amuletType.type),
        },
      }
    }
  }

  return { dropped: false }
}

function getAmuletImage(type: string): string {
  const images: Record<string, string> = {
    fortune: "🧿",
    merit: "✨",
    protection: "🛡️",
    wealth: "💰",
    health: "❤️",
  }
  return images[type] || "✨"
}
