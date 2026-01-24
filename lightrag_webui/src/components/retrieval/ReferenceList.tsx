import { ReferenceItem } from '@/api/lightrag'
import { FileTextIcon } from 'lucide-react'
import Badge from '@/components/ui/Badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/Tooltip'
import { useTranslation } from 'react-i18next'

interface ReferenceListProps {
    references?: ReferenceItem[]
    onReferenceClick?: (reference: ReferenceItem) => void
}

export const ReferenceList = ({ references, onReferenceClick }: ReferenceListProps) => {
    const { t } = useTranslation()
    if (!references || references.length === 0) return null

    return (
        <div className="mt-2 flex flex-wrap gap-2 pt-2 border-t border-border/50">
            <div className="text-xs text-muted-foreground w-full mb-1">{t('retrievePanel.chatMessage.references.sources')}</div>
            {references.map((ref) => (
                <TooltipProvider key={ref.reference_id}>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Badge
                                variant="outline"
                                className="flex items-center gap-1 cursor-pointer hover:bg-accent transition-colors py-1 px-2"
                                onClick={() => onReferenceClick?.(ref)}
                            >
                                <FileTextIcon className="size-3 text-muted-foreground" />
                                <span className="max-w-[150px] truncate">{ref.file_path.split('/').pop()}</span>
                            </Badge>
                        </TooltipTrigger>
                        <TooltipContent side="bottom" className="max-w-xs break-all">
                            <p>{ref.file_path}</p>
                            {ref.content && (
                                <div className="mt-1 text-[10px] opacity-70">
                                    {t('retrievePanel.chatMessage.references.viewInParent')}
                                </div>
                            )}
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            ))}
        </div>
    )
}
