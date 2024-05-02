export interface TilePayload {
    id: string;
}

export interface TileMovementPayload extends TilePayload {
    destRow: number;
    destCol: number;
}

export interface TileMergePayload extends TilePayload {
    tileToMerge: string;
}

export interface NewTilePayload extends TilePayload {
    row: number;
    col: number;
    number: number;
}
