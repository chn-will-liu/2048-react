import { createSelector } from '@reduxjs/toolkit';

import { GameState } from './models/gameState.interface';
import { GameStatus } from './models/gameStatus.enum';
import { deepForEach, mapTilesToGrid } from './utils';

export const selectSize = (state: GameState) => state.size;
export const selectTiles = (state: GameState) => state.tiles;
export const selectIsGameStarted = (state: GameState) => state.gameStatus === GameStatus.Playing;

export const selectIsStable = createSelector([selectTiles], (tiles) => {
    for (const tile of Object.values(tiles)) {
        if (tile.isNewlyMerged || tile.isNewlyGenerated) {
            return false;
        }
    }
    return true;
});

export const selectRecentlyAddedScores = (state: GameState) => state.recentlyAddedScores;
export const selectBestScore = (state: GameState) => state.bestScore;
export const selectScore = (state: GameState) => state.score;

export const selectIsMovable = createSelector([selectIsStable, selectSize, selectTiles], (isStable, size, tiles) => {
    if (!isStable) {
        return true;
    }

    const tilesAsGrid = mapTilesToGrid(size, Object.values(tiles));

    let movable = false;
    // check each tile,
    // if there is any empty tile, sets movable to true
    // if there is any adjacent tile which has the same number, sets movable to true
    deepForEach(tilesAsGrid, (cell, i, j) => {
        if (movable) return;
        if (cell.length === 0) {
            movable = true;
            return;
        }

        if (i < size - 1) {
            let bottomTile = tilesAsGrid[i + 1][j][0];
            if (bottomTile && bottomTile.number === cell[0].number) {
                movable = true;
                return;
            }
        }

        if (j < size - 1) {
            let rightTile = tilesAsGrid[i][j + 1][0];
            if (rightTile && rightTile.number === cell[0].number) {
                movable = true;
                return;
            }
        }
    });

    return movable;
});
