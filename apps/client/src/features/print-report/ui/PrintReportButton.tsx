import { ProjectId } from "@/shared/api/types";
import { cn } from "@/shared/lib";
import { Button } from "@/shared/ui";
import { usePrintReport } from "../model/use-print-report";
interface PrintReportButtonProps {
    className?: string;
    projectId?: ProjectId;
}

export function PrintReportButton({ className, projectId }: PrintReportButtonProps) {
    const printReportMutation = usePrintReport();
    const handleClickPrint = async () => {
        if (!projectId) {
            return;
        }
        printReportMutation.mutate(projectId);
    };
    return (
        <Button
            className={cn(className)}
            onClick={handleClickPrint}
        >
            Печать отчёта
        </Button>
    );
}
