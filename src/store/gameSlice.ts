import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { GameState } from './models/gameState.interface';
import { GameStatus } from './models/gameStatus.enum';
import {
    NewTilePayload, TileMergePayload, TileMovementPayload, TilePayload
} from './models/payload.interface';

const initialState: GameState = {
    score: 0,
    bestScore: JSON.parse(localStorage.getItem('bestScore') ?? '0'),
    gameStatus: GameStatus.Playing,
    size: 4,
    tiles: {},
    recentlyAddedScores: [],
};

export const gameSlice = createSlice({
    name: 'game',
    initialState,
    reducers: {
        resetGame(state) {
            state.score = 0;
            state.recentlyAddedScores = [];
            state.gameStatus = GameStatus.Playing;
            state.tiles = {};
        },
        endGame(state) {
            state.gameStatus = GameStatus.GameOver;
        },
        addScore(state, action: PayloadAction<{ score: number; id: string }>) {
            state.score += action.payload.score;
            state.recentlyAddedScores.push({ ...action.payload });
        },
        updateBestScore(state, action: PayloadAction<number>) {
            state.bestScore = action.payload;
        },
        cleanRecentlyAddedScore(state, action: PayloadAction<string>) {
            state.recentlyAddedScores = state.recentlyAddedScores.filter((score) => score.id !== action.payload);
        },
        moveTile(state, { payload }: PayloadAction<TileMovementPayload>) {
            const tileToMove = state.tiles[payload.id];
            tileToMove.row = payload.destRow;
            tileToMove.col = payload.destCol;
        },
        mergeTile(state, { payload }: PayloadAction<TileMergePayload>) {
            const tile = state.tiles[payload.id];
            const tileToMerge = state.tiles[payload.tileToMerge];

            delete state.tiles[payload.tileToMerge];
            tile.number += tileToMerge!.number;
            tile.isNewlyMerged = true;
            tile.tileToMerge = payload.tileToMerge;
        },
        afterMergeTile(state, { payload }: PayloadAction<TilePayload>) {
            const tile = state.tiles[payload.id];
            tile.isNewlyMerged = false;
            delete state.tiles[tile.tileToMerge!];
        },
        newTile(state, { payload }: PayloadAction<NewTilePayload>) {
            state.tiles[payload.id] = {
                number: payload.number,
                isNewlyGenerated: true,
                isNewlyMerged: false,
                tileToMerge: null,
                id: payload.id,
                col: payload.col,
                row: payload.row,
            };
        },
        afterNewTitle(state, { payload }: PayloadAction<TilePayload>) {
            const tile = state.tiles[payload.id];
            tile.isNewlyGenerated = false;
        },
    },
});

export const gameReducer = gameSlice.reducer;
