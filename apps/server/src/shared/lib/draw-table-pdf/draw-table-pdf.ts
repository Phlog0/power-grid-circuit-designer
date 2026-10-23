import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { PDFPage, rgb } from "pdf-lib";
const tableData = [
    ["Имя", "Возраст", "Город"],
    ["Анна", "25", "Москва"],
    ["Борис", "30", "СПб"],
    ["Виктор", "28", "Казань"],
];
const columnWidths = [150, 100, 150];
// await drawTablePdf(a4Landscape, 50, 500, tableData, columnWidths, 30);
export async function drawTablePdf(
    page: PDFPage,
    startX: number,
    startY: number = 400,
    data: string[][],
    columnWidths: number[],
    rowHeight: number = 50,
) {
    const fontSize = 12;
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
    const font = await page.doc.embedFont(regularFontBytes);
    page.drawRectangle({
        x: startX,
        y: startY,
        width: columnWidths.reduce((acc, item) => acc + item, 0),
        height: -rowHeight * tableData.length,
        borderColor: rgb(1, 0, 0),
        borderWidth: 3,
    });
    for (let row = 0; row < data.length; row++) {
        for (let col = 0; col < data[row].length; col++) {
            const x =
                startX +
                columnWidths.slice(0, col).reduce((acc, item) => acc + item, 0);
            const y = startY - rowHeight * (row + 1);
            page.drawRectangle({
                x: x,
                y: y,
                width: columnWidths[col],
                height: rowHeight,
                borderColor: rgb(0, 0, 0),
                borderWidth: 1,
                color: row === 0 ? rgb(0.9, 0.9, 0.9) : undefined, // Заголовок серым
            });
            // Текст в ячейке
            page.drawText(data[row][col], {
                x: x + 5,
                y: y + 8,
                size: fontSize,
                font: font,
                color: rgb(0, 0, 0),
            });
        }
    }
    // Рисуем каждую ячейку
    // for (let row = 0; row < data.length; row++) {
    //     for (let col = 0; col < data[row].length; col++) {
    //         const x =
    //             startX + columnWidths.slice(0, col).reduce((a, b) => a + b, 0);
    //         const y = startY - (row + 1) * rowHeight;

    //         // Рамка ячейки
    //         page.drawRectangle({
    //             x: x,
    //             y: y,
    //             width: columnWidths[col],
    //             height: rowHeight,
    //             borderColor: rgb(0, 0, 0),
    //             borderWidth: 1,
    //             color: row === 0 ? rgb(0.9, 0.9, 0.9) : undefined, // Заголовок серым
    //         });

    //         // Текст в ячейке
    //         page.drawText(data[row][col], {
    //             x: x + 5,
    //             y: y + 8,
    //             size: fontSize,
    //             font: font,
    //             color: rgb(0, 0, 0),
    //         });
    //     }
    // }
}
