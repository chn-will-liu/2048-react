export interface Tile {
    id: string;
    number: number;
    isNewlyGenerated: boolean;
    isNewlyMerged: boolean;
    tileToMerge: string | null;
    col: number;
    row: number;
}
