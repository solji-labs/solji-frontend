'use client';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { WishItem } from '@/lib/api/types';
import { Globe, Heart, Share2 } from 'lucide-react';
import { useMemo } from 'react';

interface WishDetailDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    wish: WishItem | null;
}

export function WishDetailDialog({ open, onOpenChange, wish }: WishDetailDialogProps) {
    const timeAgo = useMemo(() => {
        if (!wish) return '';
        const date = new Date(wish.created_at);
        const now = new Date();
        const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
        if (diffInMinutes < 1) return 'just now';
        if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) return `${diffInHours} hours ago`;
        const diffInDays = Math.floor(diffInHours / 24);
        return `${diffInDays} days ago`;
    }, [wish]);

    const shortKey = (pubkey: string) => {
        return pubkey ? `${pubkey.slice(0, 4)}...${pubkey.slice(-4)}` : '';
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg" showCloseButton={false}>
                {!!wish && (
                    <>
                        <DialogHeader>
                            <DialogTitle className="flex items-center justify-between">
                                <span className="flex items-center gap-2">
                                    <Globe className="w-5 h-5 text-primary" />
                                    Wish #{wish.wish_id}
                                </span>
                                <Badge variant="secondary" className="text-xs">
                                    {shortKey(wish.user_pubkey)}
                                </Badge>
                            </DialogTitle>
                            <DialogDescription>
                                Public wish detail and basic metadata
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-6">
                            <div className="rounded-lg border border-border/50 bg-muted/20 p-4">
                                <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                                    {wish.content}
                                </p>
                            </div>

                            <div className="space-y-2 text-sm">
                                <div className="flex items-center justify-between py-2 border-b border-border/60">
                                    <span className="text-muted-foreground">User</span>
                                    <span className="font-mono">{wish.user_pubkey}</span>
                                </div>
                                <div className="flex items-center justify-between py-2 border-b border-border/60">
                                    <span className="text-muted-foreground">Wish ID</span>
                                    <span className="font-medium">#{wish.wish_id}</span>
                                </div>
                                <div className="flex items-center justify-between py-2 border-b border-border/60">
                                    <span className="text-muted-foreground">Created</span>
                                    <span className="font-medium">{timeAgo}</span>
                                </div>
                                <div className="flex items-center justify-between py-2">
                                    <span className="text-muted-foreground">Likes</span>
                                    <span className="flex items-center gap-2 font-medium">
                                        <Heart className={`w-4 h-4 ${wish.is_liked ? 'text-pink-500' : 'text-muted-foreground'}`} fill={wish.is_liked ? 'currentColor' : 'none'} />
                                        {wish.likes}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-2">
                                <Button variant="outline" onClick={() => onOpenChange(false)}>
                                    Close
                                </Button>
                                <Button
                                    variant="secondary"
                                    onClick={() => {
                                        if (!wish) return
                                        const baseUrl =
                                            typeof window !== 'undefined'
                                                ? window.location.href
                                                : 'https://devnet.solji.fun/temple/wishes'
                                        const text = encodeURIComponent(wish.content)
                                        const url = encodeURIComponent(baseUrl)
                                        const via = 'solji' // optional: brand
                                        const intent = `https://twitter.com/intent/tweet?text=${text}&url=${url}&via=${via}`
                                        window.open(intent, '_blank', 'noopener,noreferrer')
                                    }}
                                >
                                    <Share2 className="w-4 h-4 mr-2" />
                                    Share
                                </Button>
                            </div>
                        </div>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}


