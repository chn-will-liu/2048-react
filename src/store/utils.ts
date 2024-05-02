import { Tile } from './models/tile.model';

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const createArray2D = <T>(size: number, d: (row: number, col: number) => T): T[][] => {
    return new Array(size)
        .fill(null)
        .map((_, i) => new Array(size).fill(null).map((_, j) => d(i, j)));
};

export const deepForEach = <T>(arr: T[][], fn: (item: T, i: number, j: number) => void): void =>
    arr.forEach((row, i) => row.forEach((item, j) => fn(item, i, j)));

export function mapTilesToGrid<T>(
    size: number,
    tiles: Tile[],
    projector: (tile?: Tile) => T
): T[][];
export function mapTilesToGrid(size: number, tiles: Tile[]): Tile[][];
export function mapTilesToGrid(size: number, tiles: Tile[], projector?: (tile?: Tile) => unknown) {
    const array2d = createArray2D(size, () => projector?.());
    for (const tile of tiles) {
        array2d[tile.row][tile.col] = projector ? projector(tile) : tile;
    }
    return array2d;
}

export const getRandomCoordinate = (size: number, tiles: Tile[]) => {
    const cells = new Array(size * size).fill(null).map((_, index) => {
        return {
            isEmpty: true,
            row: Math.floor(index / size),
            col: index % size,
        };
    });

    tiles.forEach((tile) => {
        cells[tile.row * size + tile.col].isEmpty = false;
    });

    const emptyTiles = cells.filter((cell) => cell.isEmpty);

    if (emptyTiles.length) {
        const index = Math.floor(Math.random() * emptyTiles.length);
        return emptyTiles[index];
    }

    return null;
};
