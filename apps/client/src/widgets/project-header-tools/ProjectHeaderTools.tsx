import { ChangeThemeButton } from "@/entities/(change-layout)/change-theme";
import { cn } from "@/shared/lib/cn";
import { RemoveReactFlowNodeButton, OpenModalPropertiesButton } from "@/features";
import { useBoundStore } from "@/shared/appStore";

import { Spinner } from "@/shared/ui/spinners";
import { ContactMe } from "@/entities/me";
import { ExitProjectButton } from "@/entities/exit-project";
import { ResponsiveButtons } from "./ResponsiveButtons";
import { ActionButtons } from "@/pages/ActionsButtons";
import { useParams } from "react-router-dom";
import { ExternalReactFlowDimensions } from "@/pages/FlowLayout";
import { PrintReportButton } from "@/features/print-report";

export function ProjectHeaderTools({
    className,
    externalReactFlowDimensions,
}: {
    className?: string;
    externalReactFlowDimensions: ExternalReactFlowDimensions;
}) {
    const isSyncing = useBoundStore(state => state.isSyncing);

    const { projectId } = useParams();

    return (
        <header
            className={cn("project-header", "overflow-y-visible", "theme-bg relative", className)}
        >
            <div className="flex items-center justify-start gap-4 h-full overflow-x-scroll">
                <ActionButtons
                    projectId={projectId}
                    reactFLowHeight={externalReactFlowDimensions.height}
                    reactFlowWidth={externalReactFlowDimensions.width}
                />
                <ChangeThemeButton /> <ResponsiveButtons className="hidden max-lg:block" />
                <OpenModalPropertiesButton />
                <RemoveReactFlowNodeButton />
                <PrintReportButton projectId={projectId} />
                <ExitProjectButton />
                <div className="flex items-center gap-4 max-lg:hidden">
                    <ContactMe />
                </div>
                {isSyncing && (
                    <div>
                        <Spinner
                            size={"small"}
                            animate={isSyncing === true ? "spin" : "none"}
                        />
                    </div>
                )}
            </div>
        </header>
    );
}
