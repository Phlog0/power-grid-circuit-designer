import { readFile } from "fs/promises";
import { join } from "path";
import fontkit from "@pdf-lib/fontkit";
export async function optimizeFont(text: string, ...fontPath: string[]) {
    const fontData = await readFile(
        join(process.cwd(), "shared", "fonts", ...fontPath),
    );
    const font = fontkit.create(fontData);
}
