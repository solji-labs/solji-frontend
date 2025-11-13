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
import type { FortuneHistoryItem } from '@/lib/api/types';
import type { FortuneLevel } from '@/lib/types';
import { ExternalLink, ScrollText, Share2 } from 'lucide-react';

interface FortuneHistoryDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    fortune: FortuneHistoryItem | null;
    mapFortuneTextToLevel: (fortuneText: string) => FortuneLevel;
    getFortuneColor: (level: FortuneLevel) => string;
    formatDateTime: (dateString: string) => string;
    onShare: (fortune: FortuneHistoryItem) => void;
    onClose: () => void;
}

export function FortuneHistoryDialog({
    open,
    onOpenChange,
    fortune,
    mapFortuneTextToLevel,
    getFortuneColor,
    formatDateTime,
    onShare,
    onClose
}: FortuneHistoryDialogProps) {
    const level = fortune ? mapFortuneTextToLevel(fortune.fortune_text) : null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className='sm:max-w-lg' showCloseButton={false}>
                {fortune && level && (
                    <>
                        <DialogHeader>
                            <DialogTitle className='flex items-center justify-between'>
                                <span className='flex items-center gap-2'>
                                    <ScrollText className='w-5 h-5 text-primary' />
                                    Fortune Detail
                                </span>
                                <Badge variant='secondary' className='text-xs'>
                                    #{fortune.id}
                                </Badge>
                            </DialogTitle>
                            <DialogDescription>
                                Overview of your draw record and related metadata
                            </DialogDescription>
                        </DialogHeader>

                        <div className='space-y-5'>
                            <div className='flex items-center gap-3 flex-wrap'>
                                <Badge
                                    variant='secondary'
                                    className={`px-3 py-1 font-semibold ${getFortuneColor(level)}`}>
                                    {level}
                                </Badge>
                                <Badge variant='secondary' className='px-3 py-1'>
                                    {fortune.is_free ? 'Free Draw' : `${fortune.merit_cost} Merit`}
                                </Badge>
                                {fortune.transaction_signature && (
                                    <Badge variant='outline' className='px-3 py-1 flex items-center gap-1'>
                                        <ExternalLink className='w-3 h-3' />
                                        Signed
                                    </Badge>
                                )}
                            </div>

                            <div className='rounded-lg border border-border/50 bg-muted/20 p-4 text-sm leading-relaxed space-y-3'>
                                <div className='flex items-center justify-between gap-4'>
                                    <span className='text-muted-foreground'>Fortune Text</span>
                                    <span className='font-medium text-right'>{fortune.fortune_text}</span>
                                </div>
                                <div className='flex items-center justify-between gap-4'>
                                    <span className='text-muted-foreground'>Created At</span>
                                    <span className='font-mono text-xs text-right'>
                                        {formatDateTime(fortune.created_at)}
                                    </span>
                                </div>
                                <div className='flex items-center justify-between gap-4'>
                                    <span className='text-muted-foreground'>Merit Cost</span>
                                    <span className='font-medium text-right'>
                                        {fortune.is_free ? '0 (Free)' : `${fortune.merit_cost} Merit`}
                                    </span>
                                </div>
                                <div className='flex flex-col gap-1'>
                                    <span className='text-muted-foreground'>Transaction Signature</span>
                                    <span className='font-mono text-xs break-all'>
                                        {fortune.transaction_signature || 'N/A'}
                                    </span>
                                </div>
                            </div>

                            <div className='flex justify-end gap-2'>
                                <Button variant='outline' onClick={onClose}>
                                    Close
                                </Button>
                                <Button onClick={() => onShare(fortune)}>
                                    <Share2 className='w-4 h-4 mr-2' />
                                    Share on X
                                </Button>
                            </div>
                        </div>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}

