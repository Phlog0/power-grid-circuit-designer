import { PossibleEdge } from "@/shared/react-flow/edges";
import { PossibleNode, RFNodeTypesValues } from "@/shared/react-flow/nodes/shared";
import { apiInstance } from "../api-instacne";
import {
    ProjectInfo,
    ProjectId,
    SuccessAddProjectResponse,
    SuccessDeleteProjectResponse,
    SuccessUpdateProjectResponse,
    SuccessSyncProjectScheme,
    AiBody,
} from "../types";
import {
    CreateProjectInfo,
    SuccessGetProjectScheme,
    UpdateProjectInfo,
} from "../types/project.schema";
import { API_ROUTES } from "../api-routes";
import { TableColumnsApi, TableModelApi } from "@/features/project-card/api";

export type SuccessGetProjectResponse = {
    dictionaryData: {
        tableColumns: TableColumnsApi;
        tableBody: TableModelApi[];
    };
};

export const projectApiService = {
    getAllProjects: async () => {
        const response = await apiInstance.get<ProjectInfo[]>(
            API_ROUTES.PROJECTS + "/all-projects"
        );
        return response.data;
    },

    updateProject: async (projectId: ProjectId, projectMetaData: UpdateProjectInfo) => {
        const response = await apiInstance.patch<SuccessUpdateProjectResponse>(
            API_ROUTES.PROJECTS + `/${projectId}`,
            projectMetaData
        );
        return response.data;
    },
    deleteProject: async (projectId: ProjectId) => {
        const response = await apiInstance.delete<SuccessDeleteProjectResponse>(
            API_ROUTES.PROJECTS + `/${projectId}`
        );
        return response.data;
    },
    createProject: async (projectMetaData: CreateProjectInfo) => {
        const response = await apiInstance.post<SuccessAddProjectResponse>(
            API_ROUTES.PROJECTS + "/create",
            projectMetaData
        );
        return response.data;
    },
    addProjectAi: async (prompt: AiBody["prompt"]) => {
        const response = await apiInstance.post<SuccessAddProjectResponse>("/ai", { prompt });
        return response.data;
    },

    syncProjectScheme: async (
        id: ProjectId,
        projectScheme: { nodes: PossibleNode[]; edges: PossibleEdge[] }
    ) => {
        const response = await apiInstance.patch<SuccessSyncProjectScheme>(
            API_ROUTES.PROJECTS + `/project-scheme/${id}`,
            projectScheme
        );
        return response;
    },
    getProjectScheme: async (id: ProjectId) => {
        const response = await apiInstance.get<SuccessGetProjectScheme>(
            API_ROUTES.PROJECTS + `/project-scheme/${id}`
        );
        return response.data;
    },

    getReadySolutionsList: async (query: string, dictionaryFolder: RFNodeTypesValues) => {
        const response = await apiInstance.get<SuccessGetProjectResponse>(
            `getReadySolutionsList/${dictionaryFolder}/${query}`
        );
        return response.data.dictionaryData;
    },

    printReport: async (projectId: ProjectId) => {
        const response = await apiInstance.post(
            API_ROUTES.PROJECTS + `/printReport/${projectId}`,
            null,
            {
                responseType: "blob",
            }
        );
        return response;
    },
};
