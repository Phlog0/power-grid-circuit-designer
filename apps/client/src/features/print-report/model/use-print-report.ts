import { $api } from "@/shared/api/services";
import { ProjectId } from "@/shared/api/types";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export function usePrintReport() {
    return useMutation({
        mutationFn: (projectId: ProjectId) => $api.projects.printReport(projectId),
        onSuccess: (response, projectId) => {
            const blob = response.data;
            const url = window.URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = url;
            link.download = `report-${projectId}.pdf`;

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            window.URL.revokeObjectURL(url);
        },
        onError: error => {
            console.error("Ошибка при скачивании:", error);
            toast.error("Не удалось скачать отчет");
        },
    });
}
