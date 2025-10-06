import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Award, Flame, Heart, Sparkles } from 'lucide-react';

export default function NFTCollectionPage() {
  // Mock NFT collection data
  const incenseNFTs = [
    {
      id: '1',
      name: 'Supreme Incense #1234',
      image: '/supreme-golden-incense-with-rainbow-aura.jpg',
      rarity: 'Legendary',
      mintDate: '2024-01-15',
      meritValue: 30
    },
    {
      id: '2',
      name: 'Dragon Incense #5678',
      image: '/mystical-dragon-incense-with-purple-smoke.jpg',
      rarity: 'Epic',
      mintDate: '2024-01-14',
      meritValue: 10
    },
    {
      id: '3',
      name: 'Sandalwood #9012',
      image: '/sandalwood-incense-with-golden-glow.jpg',
      rarity: 'Rare',
      mintDate: '2024-01-13',
      meritValue: 5
    }
  ];

  const badgeNFTs = [
    {
      id: '1',
      name: 'Gold Guardian Badge',
      tier: 'Gold',
      image: '🏅',
      mintDate: '2024-01-10',
      meritValue: 14000
    },
    {
      id: '2',
      name: 'Silver Progress Badge',
      tier: 'Silver',
      image: '🥈',
      mintDate: '2024-01-05',
      meritValue: 1300
    }
  ];

  const amuletNFTs = [
    {
      id: '1',
      name: 'Fortune Amulet',
      type: 'Fortune',
      image: '🧿',
      effect: '+5% Fortune Draw Luck',
      mintDate: '2024-01-12'
    },
    {
      id: '2',
      name: 'Merit Amulet',
      type: 'Merit',
      image: '✨',
      effect: '+10% Merit Points',
      mintDate: '2024-01-11'
    },
    {
      id: '3',
      name: 'Protection Amulet',
      type: 'Protection',
      image: '🛡️',
      effect: 'Prevents Bad Fortune',
      mintDate: '2024-01-09'
    }
  ];

  const wishNFTs = [
    {
      id: '1',
      name: 'Wish Plaque #001',
      content: 'May my family be healthy and happy',
      image: '🎋',
      mintDate: '2024-01-16',
      isPublic: true
    },
    {
      id: '2',
      name: 'Wish Plaque #002',
      content: 'Success in my new venture',
      image: '🎋',
      mintDate: '2024-01-14',
      isPublic: false
    }
  ];

  return (
    <div className='container mx-auto px-4 py-8 max-w-7xl'>
      {/* Header */}
      <div className='mb-8'>
        <h1 className='text-4xl font-bold mb-2'>NFT Collection</h1>
        <p className='text-muted-foreground'>
          Your sacred digital treasures from Solji
        </p>
      </div>

      {/* Collection Stats */}
      <div className='grid md:grid-cols-4 gap-6 mb-8'>
        <Card className='temple-card p-6'>
          <div className='flex items-center gap-3 mb-2'>
            <Flame className='w-6 h-6 text-orange-500' />
            <span className='text-2xl font-bold'>{incenseNFTs.length}</span>
          </div>
          <p className='text-sm text-muted-foreground'>Incense NFTs</p>
        </Card>

        <Card className='temple-card p-6'>
          <div className='flex items-center gap-3 mb-2'>
            <Award className='w-6 h-6 text-yellow-500' />
            <span className='text-2xl font-bold'>{badgeNFTs.length}</span>
          </div>
          <p className='text-sm text-muted-foreground'>Badge NFTs</p>
        </Card>

        <Card className='temple-card p-6'>
          <div className='flex items-center gap-3 mb-2'>
            <Sparkles className='w-6 h-6 text-purple-500' />
            <span className='text-2xl font-bold'>{amuletNFTs.length}</span>
          </div>
          <p className='text-sm text-muted-foreground'>Amulet NFTs</p>
        </Card>

        <Card className='temple-card p-6'>
          <div className='flex items-center gap-3 mb-2'>
            <Heart className='w-6 h-6 text-pink-500' />
            <span className='text-2xl font-bold'>{wishNFTs.length}</span>
          </div>
          <p className='text-sm text-muted-foreground'>Wish NFTs</p>
        </Card>
      </div>

      {/* NFT Tabs */}
      <Card className='temple-card p-6'>
        <Tabs defaultValue='incense' className='w-full'>
          <TabsList className='grid w-full grid-cols-4 mb-6'>
            <TabsTrigger value='incense'>Incense</TabsTrigger>
            <TabsTrigger value='badges'>Badges</TabsTrigger>
            <TabsTrigger value='amulets'>Amulets</TabsTrigger>
            <TabsTrigger value='wishes'>Wishes</TabsTrigger>
          </TabsList>

          {/* Incense NFTs */}
          <TabsContent value='incense'>
            <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {incenseNFTs.map((nft) => (
                <Card
                  key={nft.id}
                  className='overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow'>
                  <div className='aspect-square relative overflow-hidden bg-gradient-to-br from-orange-500/10 to-red-500/10'>
                    <img
                      src={nft.image || '/placeholder.svg'}
                      alt={nft.name}
                      className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-300'
                    />
                    <Badge className='absolute top-3 right-3 bg-background/80 backdrop-blur-sm'>
                      {nft.rarity}
                    </Badge>
                  </div>
                  <div className='p-4 space-y-2'>
                    <h3 className='font-semibold'>{nft.name}</h3>
                    <div className='flex items-center justify-between text-sm'>
                      <span className='text-muted-foreground'>Merit Value</span>
                      <span className='font-semibold text-primary'>
                        {nft.meritValue}
                      </span>
                    </div>
                    <div className='flex items-center justify-between text-xs text-muted-foreground'>
                      <span>Minted</span>
                      <span>{nft.mintDate}</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Badge NFTs */}
          <TabsContent value='badges'>
            <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {badgeNFTs.map((nft) => (
                <Card
                  key={nft.id}
                  className='overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow'>
                  <div className='aspect-square relative overflow-hidden bg-gradient-to-br from-yellow-500/10 to-amber-500/10 flex items-center justify-center'>
                    <div className='text-9xl group-hover:scale-110 transition-transform duration-300'>
                      {nft.image}
                    </div>
                    <Badge className='absolute top-3 right-3 bg-background/80 backdrop-blur-sm'>
                      {nft.tier}
                    </Badge>
                  </div>
                  <div className='p-4 space-y-2'>
                    <h3 className='font-semibold'>{nft.name}</h3>
                    <div className='flex items-center justify-between text-sm'>
                      <span className='text-muted-foreground'>Merit Value</span>
                      <span className='font-semibold text-primary'>
                        {nft.meritValue.toLocaleString()}
                      </span>
                    </div>
                    <div className='flex items-center justify-between text-xs text-muted-foreground'>
                      <span>Minted</span>
                      <span>{nft.mintDate}</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Amulet NFTs */}
          <TabsContent value='amulets'>
            <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {amuletNFTs.map((nft) => (
                <Card
                  key={nft.id}
                  className='overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow'>
                  <div className='aspect-square relative overflow-hidden bg-gradient-to-br from-purple-500/10 to-pink-500/10 flex items-center justify-center'>
                    <div className='text-9xl group-hover:scale-110 transition-transform duration-300'>
                      {nft.image}
                    </div>
                    <Badge className='absolute top-3 right-3 bg-background/80 backdrop-blur-sm'>
                      {nft.type}
                    </Badge>
                  </div>
                  <div className='p-4 space-y-2'>
                    <h3 className='font-semibold'>{nft.name}</h3>
                    <div className='flex items-center justify-between text-sm'>
                      <span className='text-muted-foreground'>Effect</span>
                      <span className='font-semibold text-primary text-xs'>
                        {nft.effect}
                      </span>
                    </div>
                    <div className='flex items-center justify-between text-xs text-muted-foreground'>
                      <span>Minted</span>
                      <span>{nft.mintDate}</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Wish NFTs */}
          <TabsContent value='wishes'>
            <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {wishNFTs.map((nft) => (
                <Card
                  key={nft.id}
                  className='overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow'>
                  <div className='aspect-square relative overflow-hidden bg-gradient-to-br from-pink-500/10 to-rose-500/10 flex items-center justify-center'>
                    <div className='text-9xl group-hover:scale-110 transition-transform duration-300'>
                      {nft.image}
                    </div>
                    <Badge className='absolute top-3 right-3 bg-background/80 backdrop-blur-sm'>
                      {nft.isPublic ? 'Public' : 'Private'}
                    </Badge>
                  </div>
                  <div className='p-4 space-y-2'>
                    <h3 className='font-semibold'>{nft.name}</h3>
                    <p className='text-sm text-muted-foreground line-clamp-2'>
                      {nft.content}
                    </p>
                    <div className='flex items-center justify-between text-xs text-muted-foreground'>
                      <span>Minted</span>
                      <span>{nft.mintDate}</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
