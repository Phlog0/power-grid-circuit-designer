import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    StreamableFile,
    Delete,
} from "@nestjs/common";
import { ProjectsService } from "./projects.service";
import { CreateProjectDto } from "./dto/create-project.dto";
import { ApiCreatedResponse, ApiTags } from "@nestjs/swagger";
import { CreatedProjectResponse } from "./dto/created-project-response.dto";
import { UpdateProjectDto } from "./dto/update-project.dto";
import { SchemeDataDto } from "./dto/scheme.dto";
import { Project } from "@/generated/prisma/client";
@ApiTags("projects")
@Controller("projects")
export class ProjectsController {
    constructor(private readonly projectsService: ProjectsService) {}

    @ApiCreatedResponse({ type: CreatedProjectResponse })
    @Post("create")
    createProject(@Body() createProjectDto: CreateProjectDto) {
        return this.projectsService.createProject(createProjectDto);
    }
    @ApiCreatedResponse({ type: CreatedProjectResponse })
    @Get("all-projects")
    async findAllProjects() {
        return await this.projectsService.findAllProjects();
    }
    @Get("project-info/:id")
    async findProjectInfo(@Param("id") id: string) {
        return await this.projectsService.findProjectInfo(id);
    }
    @Get("project-scheme/:id")
    async findProjectScheme(@Param("id") id: string) {
        const projectScheme = await this.projectsService.findProjectScheme(id);

        return projectScheme;
    }

    @Patch(":id")
    async update(
        @Param("id") id: string,
        @Body() updateProjectDto: UpdateProjectDto,
    ) {
        return await this.projectsService.updateProject(id, updateProjectDto);
    }
    @Patch("/project-scheme/:id")
    async updateProjectScheme(
        @Param("id") id: string,

        @Body() dto: SchemeDataDto,
    ) {
        return await this.projectsService.updateProjectScheme(id, dto);
    }

    @Delete(":id")
    async removeProject(@Param("id") id: string) {
        return await this.projectsService.removeProject(id);
    }

    @Post("/printReport/:id")
    async printReport(@Param("id") id: Project["id"]) {
        const pdfBytes = await this.projectsService.printReport(id);
        return new StreamableFile(pdfBytes, {
            type: "application/pdf",
            disposition: `attachment; filename="report-${id}.pdf"`,
        });
    }
}
