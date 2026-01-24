import { useState, useEffect, useMemo } from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription
} from '@/components/ui/Dialog'
import { getDocumentContent, ReferenceItem } from '@/api/lightrag'
import { LoaderIcon, ExternalLinkIcon, SearchIcon } from 'lucide-react'
import { ScrollArea } from '@/components/ui/ScrollArea'
import { toast } from 'sonner'
import { Button } from '@/components/ui/Button'
import { useTranslation } from 'react-i18next'

interface ReferenceDocumentViewerProps {
    reference: ReferenceItem | null
    onClose: () => void
}

export const ReferenceDocumentViewer = ({ reference, onClose }: ReferenceDocumentViewerProps) => {
    const { t } = useTranslation()
    const [content, setContent] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (!reference) {
            setContent(null)
            return
        }

        const fetchContent = async () => {
            setIsLoading(true)
            try {
                const data = await getDocumentContent(reference.reference_id)
                setContent(data.content)
            } catch (err) {
                console.error('Failed to fetch document content:', err)
                toast.error('Failed to load document content')
                onClose()
            } finally {
                setIsLoading(false)
            }
        }

        fetchContent()
    }, [reference, onClose])

    const highlightedContent = useMemo(() => {
        if (!content) return null
        if (!reference?.content || reference.content.length === 0) return content

        let result = content
        // Sort chunks by length (descending) to avoid partial matches interfering with larger ones
        const chunks = [...reference.content].sort((a, b) => b.length - a.length)

        // Escaping regex characters but we want exact matches
        // Note: This is a simple implementation. For production, consider using a more robust
        // text search and highlight library that handles overlapping matches and fuzzy matching.

        // We'll use a placeholder strategy to avoid multiple highlights on the same text
        const placeholders: string[] = []

        chunks.forEach((chunk, idx) => {
            const placeholder = `__CHUNK_HL_${idx}__`
            // Try to find the chunk in the content
            // We use split and join for exact literal replacement without regex escaping issues
            if (result.includes(chunk)) {
                placeholders[idx] = chunk
                result = result.split(chunk).join(placeholder)
            }
        })

        // Now replace placeholders with actual marked content
        let finalResult: (string | JSX.Element)[] = [result]

        placeholders.forEach((originalText, idx) => {
            if (!originalText) return
            const placeholder = `__CHUNK_HL_${idx}__`

            const newPieces: (string | JSX.Element)[] = []
            finalResult.forEach(piece => {
                if (typeof piece !== 'string') {
                    newPieces.push(piece)
                    return
                }

                const parts = piece.split(placeholder)
                parts.forEach((part, pIdx) => {
                    newPieces.push(part)
                    if (pIdx < parts.length - 1) {
                        newPieces.push(
                            <mark key={`hl-${idx}-${pIdx}`} className="bg-yellow-200 dark:bg-yellow-800 rounded px-0.5 font-medium text-foreground border-b-2 border-yellow-400 dark:border-yellow-600 shadow-sm">
                                {originalText}
                            </mark>
                        )
                    }
                })
            })
            finalResult = newPieces
        })

        return finalResult
    }, [content, reference])

    return (
        <Dialog open={!!reference} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0 overflow-hidden border-border/40 shadow-2xl backdrop-blur-sm">
                <DialogHeader className="p-6 pb-2 border-b bg-muted/30">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1 pr-4">
                            <DialogTitle className="text-xl font-bold flex items-center gap-2">
                                <div className="p-1.5 rounded-md bg-primary/10 text-primary">
                                    <ExternalLinkIcon className="size-4" />
                                </div>
                                <span className="truncate">{reference?.file_path.split('/').pop()}</span>
                            </DialogTitle>
                            <DialogDescription className="text-xs font-mono opacity-60 truncate">
                                {reference?.file_path}
                            </DialogDescription>
                        </div>
                        {reference?.content && (
                            <div className="shrink-0 px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 rounded-full text-xs font-medium border border-yellow-200 dark:border-yellow-800 flex items-center gap-2">
                                <SearchIcon className="size-3" />
                                {t('retrievePanel.chatMessage.references.chunksHighlighted', { count: reference.content.length })}
                            </div>
                        )}
                    </div>
                </DialogHeader>

                <div className="flex-1 min-h-0 relative">
                    {isLoading ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-background/50 backdrop-blur-sm z-10">
                            <LoaderIcon className="size-8 animate-spin text-primary opacity-60" />
                            <p className="text-sm font-medium text-muted-foreground animate-pulse">{t('retrievePanel.chatMessage.references.loading')}</p>
                        </div>
                    ) : content ? (
                        <ScrollArea className="h-full">
                            <div className="p-8 prose dark:prose-invert max-w-none">
                                <div className="whitespace-pre-wrap font-sans leading-relaxed text-[15px] text-foreground/90 selection:bg-primary/20">
                                    {highlightedContent}
                                </div>
                            </div>
                        </ScrollArea>
                    ) : (
                        <div className="flex items-center justify-center p-12 text-muted-foreground italic">
                            {t('retrievePanel.chatMessage.references.noContent')}
                        </div>
                    )}
                </div>
                <div className="p-4 border-t bg-muted/20 flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={onClose}>{t('common.cancel')}</Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
