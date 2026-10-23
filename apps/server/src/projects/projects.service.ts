import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateProjectDto } from "./dto/create-project.dto";
import { PrismaService } from "../prisma.service";
import { UpdateProjectDto } from "./dto/update-project.dto";
import { SchemeDataDto } from "./dto/scheme.dto";
import { InputJsonValue } from "@prisma/client/runtime/client";
import { Project } from "@/generated/prisma/client";
import { PDFDocument, rgb } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import { readFile } from "fs/promises";
import { join } from "path";
import { A4_MM, MARGIN_MM, mmToPt, WORK_AREA } from "@/shared/constants";
@Injectable()
export class ProjectsService {
    constructor(private readonly prismaService: PrismaService) {}

    async createProject(dto: CreateProjectDto) {
        const newProject = await this.prismaService.project.create({
            data: {
                description: dto.description,
                title: dto.title,
                projectType: dto.projectType,
                createdAt: dto.createdAt,
                updatedAt: dto.updatedAt,
                position: dto.position as unknown as InputJsonValue,
                markerColor: dto.markerColor,
            },
        });
        return { newProject };
    }

    async findAllProjects() {
        const projects = await this.prismaService.project.findMany({
            orderBy: { updatedAt: "desc" },
        });
        return projects.map((project) => ({
            ...project,
            position: project.position,
        }));
    }

    async findProjectInfo(id: string) {
        const project = await this.prismaService.project.findUnique({
            where: {
                id,
            },

            omit: {
                projectScheme: true,
            },
        });
        if (!project) {
            throw new NotFoundException("Проект не найден");
        }

        return project;
    }
    async findProjectScheme(id: string) {
        const projectScheme = await this.prismaService.project.findUnique({
            where: {
                id,
            },
            select: {
                projectScheme: true,
            },
        });
        if (!projectScheme) {
            throw new NotFoundException("Проект не найден");
        }

        return projectScheme;
    }

    async updateProject(id: string, dto: UpdateProjectDto) {
        const findProject = await this.prismaService.project.findUnique({
            where: { id },
        });
        if (!findProject) {
            throw new NotFoundException("Проект не найден");
        }

        const updatedProject = await this.prismaService.project.update({
            where: {
                id,
            },

            data: {
                markerColor: dto.markerColor,
                position: JSON.stringify(dto.position),
                projectType: dto.projectType,
                title: dto.title,
                description: dto.description,
            },
        });
        if (!updatedProject) {
            throw new NotFoundException("Проект не найден");
        }

        return { message: `Данные проекта ${id} успешно обновлены` };
    }

    async updateProjectScheme(id: string, dto: SchemeDataDto) {
        const findProject = await this.prismaService.project.findUnique({
            where: { id },
        });
        if (!findProject) {
            throw new NotFoundException("Проект не найден");
        }

        await this.prismaService.project.update({
            where: {
                id,
            },
            data: { projectScheme: dto as unknown as InputJsonValue },
        });

        return { message: `Данные проекта ${id} успешно обновлены` };
    }

    async removeProject(id: string) {
        const findProject = await this.prismaService.project.findUnique({
            where: { id },
        });
        if (!findProject) {
            throw new NotFoundException("Проект не найден");
        }
        await this.prismaService.project.delete({
            where: {
                id,
            },
        });

        return { message: `Данные проекта ${id} успешно удалены` };
    }

    async printReport(id: Project["id"]) {
        const findProject = await this.prismaService.project.findUnique({
            where: {
                id,
            },
        });

        if (!findProject) {
            throw new NotFoundException("Проект не найден");
        }

        const blueColor = rgb(0, 0.53, 0.71);
        const blackColor = rgb(0, 0, 0);

        const pdfDoc = await PDFDocument.create();
        pdfDoc.registerFontkit(fontkit);
        const regularFontBytes = await readFile(
            join(
                process.cwd(),
                "src",
                "shared",
                "fonts",
                "IBMPlexSerif",
                "IBMPlexSerif-Regular.ttf",
            ),
        );
        const boldFontBytes = await readFile(
            join(
                process.cwd(),
                "src",
                "shared",
                "fonts",
                "IBMPlexSerif",
                "IBMPlexSerif-Bold.ttf",
            ),
        );
        const italicFontBytes = await readFile(
            join(
                process.cwd(),
                "src",
                "shared",
                "fonts",
                "IBMPlexSerif",
                "IBMPlexSerif-Italic.ttf",
            ),
        );

        const logoImage = await readFile(
            join(
                process.cwd(),
                "src",
                "shared",
                "images",
                "transmission-tower.png",
            ),
        );
        const stampImage = await readFile(
            join(process.cwd(), "src", "shared", "images", "stamp.png"),
        );

        const embeddedStampImage = await pdfDoc.embedPng(stampImage);
        const embeddedLogoImage = await pdfDoc.embedPng(logoImage);
        const {
            width: embeddedLogoImageWidth,
            height: embeddedLogoImageHeight,
        } = embeddedLogoImage.scale(0.5);

        const regularFont = await pdfDoc.embedFont(regularFontBytes);
        const boldFont = await pdfDoc.embedFont(boldFontBytes);
        const italicFont = await pdfDoc.embedFont(italicFontBytes);

        const page = pdfDoc.addPage([
            mmToPt(A4_MM.WIDTH),
            mmToPt(A4_MM.HEIGHT),
        ]);

        const fontSize = 14;
        const textHeight = fontSize * 1.2;
        const textPadding = mmToPt(MARGIN_MM.LEFT) + fontSize;
        const { width: pageWidth, height: pageHeight } = page.getSize();
        const titleText = "Название проекта: ";
        const descriptionText = "Описание: ";
        const typeOfProjectText = "Тип проекта: ";
        const locationText = "Местонахождение: ";
        const markerColor = "Цвет маркера: ";
        const titleTextWidth = regularFont.widthOfTextAtSize(
            titleText,
            fontSize,
        );
        page.drawRectangle({
            x: mmToPt(WORK_AREA.x),
            y: mmToPt(WORK_AREA.y),
            width: mmToPt(WORK_AREA.width),
            height: mmToPt(WORK_AREA.height),
            borderColor: blackColor,
            borderWidth: 2,
        });
        const logoHeight =
            mmToPt(WORK_AREA.y) +
            mmToPt(WORK_AREA.height) -
            embeddedLogoImageHeight;
        page.drawImage(embeddedLogoImage, {
            x: (pageWidth - embeddedLogoImageWidth) / 2,
            y: logoHeight,
            opacity: 0.9,
            width: embeddedLogoImageWidth,
            height: embeddedLogoImageHeight,
        });

        const titleHeight = logoHeight - textHeight;
        page.drawText(`Название проекта: `, {
            x: textPadding,

            y: titleHeight,
            size: fontSize,
            font: regularFont,
            color: blackColor,
        });
        page.drawText(`${findProject.title}`, {
            x: textPadding + titleTextWidth,
            y: titleHeight,
            size: fontSize,
            font: boldFont,
            color: blackColor,
        });
        page.drawText(`Описание: `, {
            x: mmToPt(MARGIN_MM.LEFT) + fontSize,

            y: titleHeight,
            size: fontSize,
            font: regularFont,
            color: blackColor,
        });
        page.drawText(`${findProject.description}`, {
            x: mmToPt(MARGIN_MM.LEFT) + fontSize + WORK_AREA.x + titleTextWidth,

            y: titleHeight,
            maxWidth: 0,
            size: fontSize,
            font: boldFont,
            color: blackColor,
        });

        // const tableData = [
        //     ["Имя", "Возраст", "Город"],
        //     ["Анна", "25", "Москва"],
        //     ["Борис", "30", "СПб"],
        //     ["Виктор", "28", "Казань"],
        // ];

        // const columnWidths = [150, 100, 150];
        // await drawTablePdf(a4, 100, 400, tableData, columnWidths, 50);

        const pdfBytes = await pdfDoc.save();
        return pdfBytes;
    }
}
