export const mmToPt = (mm: number): number => {
    return (mm / 25.4) * 72;
};

export const A4_MM = {
    WIDTH: 210,
    HEIGHT: 297,
} as const;

export const MARGIN_MM = {
    TOP: 20,
    BOTTOM: 20,
    LEFT: 20,
    RIGHT: 20,
};

export const WORK_AREA = {
    // Удобные координаты
    x: MARGIN_MM.LEFT,
    y: MARGIN_MM.BOTTOM,
    width: A4_MM.WIDTH - MARGIN_MM.LEFT - MARGIN_MM.RIGHT,
    height: A4_MM.HEIGHT - MARGIN_MM.TOP - MARGIN_MM.BOTTOM,
};
