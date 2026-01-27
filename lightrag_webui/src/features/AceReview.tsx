import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { getPendingRepairs, approveRepair, rejectRepair } from "@/api/lightrag";
import { RepairType } from "@/api/types";
import { CheckIcon, XIcon, RefreshCwIcon, AlertTriangleIcon, EyeIcon } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/Dialog";
import GraphViewer from "@/features/GraphViewer";
import { useSettingsStore } from "@/stores/settings";

export default function AceReview() {
    const { t } = useTranslation();
    const [repairs, setRepairs] = useState<RepairType[]>([]);
    const [loading, setLoading] = useState(false);
    const [visualizingRepair, setVisualizingRepair] = useState<RepairType | null>(null);
    const setQueryLabel = useSettingsStore.use.setQueryLabel();

    const fetchRepairs = async () => {
        setLoading(true);
        try {
            const data = await getPendingRepairs();
            setRepairs(data);
        } catch (error) {
            console.error("Failed to fetch repairs", error);
            toast.error("Failed to fetch pending repairs");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRepairs();
    }, []);

    const handleApprove = async (id: string) => {
        try {
            await approveRepair(id);
            toast.success("Repair approved");
            fetchRepairs();
            if (visualizingRepair?.id === id) {
                setVisualizingRepair(null);
            }
        } catch (error) {
            toast.error("Failed to approve repair");
        }
    };

    const handleReject = async (id: string) => {
        try {
            await rejectRepair(id);
            toast.success("Repair rejected");
            fetchRepairs();
            if (visualizingRepair?.id === id) {
                setVisualizingRepair(null);
            }
        } catch (error) {
            toast.error("Failed to reject repair");
        }
    };

    const handleVisualize = (repair: RepairType) => {
        let label = "";
        if (repair.action === 'delete_entity') {
            label = repair.name || "";
        } else if (repair.action === 'delete_relation') {
            label = repair.source || "";
        } else if (repair.action === 'merge_entities') {
            // For merge, we ideally want to see all sources. 
            // queryGraphs supports one label. We pick the first source.
            // Future improvement: support multiple labels or union queries.
            label = repair.sources?.[0] || "";
        }

        if (label) {
            setQueryLabel(label);
            setVisualizingRepair(repair);
        } else {
            toast.error("Could not determine visual target for this repair");
        }
    };

    return (
        <div className="container mx-auto py-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">ACE Repair Review</h1>
                    <p className="text-muted-foreground">Review and approve graph repairs suggested by the Agentic Context Evolution (ACE) system.</p>
                </div>
                <Button onClick={fetchRepairs} disabled={loading} variant="outline">
                    <RefreshCwIcon className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                </Button>
            </div>

            {repairs.length === 0 && !loading && (
                <div className="text-center py-12 text-muted-foreground">
                    No pending repairs found.
                </div>
            )}

            <div className="grid gap-4">
                {repairs.map((repair) => (
                    <Card key={repair.id}>
                        <CardHeader className="flex flex-row items-center gap-4">
                            <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-full">
                                <AlertTriangleIcon className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                            </div>
                            <div>
                                <CardTitle className="text-lg">
                                    {repair.action === 'delete_relation' && 'Delete Relationship'}
                                    {repair.action === 'delete_entity' && 'Delete Entity'}
                                    {repair.action === 'merge_entities' && 'Merge Entities'}
                                </CardTitle>
                                <CardDescription>
                                    Created at: {repair.created_at}
                                </CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {repair.action === 'delete_relation' && (
                                <div className="flex items-center gap-2">
                                    <span className="font-mono bg-muted px-2 py-1 rounded">{repair.source}</span>
                                    <span className="text-muted-foreground">→</span>
                                    <span className="font-mono bg-muted px-2 py-1 rounded">{repair.target}</span>
                                </div>
                            )}
                            {repair.action === 'delete_entity' && (
                                <div>
                                    Delete entity <span className="font-mono bg-muted px-2 py-1 rounded">{repair.name}</span>
                                </div>
                            )}
                            {repair.action === 'merge_entities' && (
                                <div>
                                    Merge entities
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {repair.sources?.map(s => <span key={s} className="font-mono bg-muted px-2 py-1 rounded">{s}</span>)}
                                    </div>
                                    <div className="mt-2 text-sm text-muted-foreground">
                                        into <span className="font-mono bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 px-2 py-1 rounded">{repair.target}</span>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                        <CardFooter className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => handleVisualize(repair)}>
                                <EyeIcon className="mr-2 h-4 w-4" /> Visualize
                            </Button>
                            <Button variant="ghost" onClick={() => handleReject(repair.id)} className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950">
                                <XIcon className="mr-2 h-4 w-4" /> Reject
                            </Button>
                            <Button onClick={() => handleApprove(repair.id)} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                                <CheckIcon className="mr-2 h-4 w-4" /> Approve
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            <Dialog open={!!visualizingRepair} onOpenChange={(open) => !open && setVisualizingRepair(null)}>
                <DialogContent className="max-w-5xl h-[80vh] flex flex-col p-0 overflow-hidden">
                    <DialogHeader className="p-4 border-b">
                        <DialogTitle>Inspect Repair Impact</DialogTitle>
                    </DialogHeader>
                    <div className="flex-1 relative w-full h-full bg-muted/20">
                        {visualizingRepair && (
                            <GraphViewer minimal={true} />
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
