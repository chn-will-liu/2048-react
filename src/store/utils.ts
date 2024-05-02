import { Tile } from './models/tile.model';

export const createArray2D = <T>(size: number, d: () => T): T[][] => {
    return new Array(size).fill(null).map(() => new Array(size).fill(null).map(d));
};

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const deepForEach = <T>(arr: T[][], fn: (item: T, i: number, j: number) => any) =>
    arr.forEach((row, i) => row.forEach((item, j) => fn(item, i, j)));

export const mapTilesToGrid = (size: number, tiles: Tile[]) => {
    const array2d = createArray2D<Tile[]>(size, () => []);
    for (const tile of tiles) {
        array2d[tile.row][tile.col].push(tile);
    }
    return array2d;
};

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
        let index = Math.floor(Math.random() * emptyTiles.length);
        return emptyTiles[index];
    }

    return null;
};
