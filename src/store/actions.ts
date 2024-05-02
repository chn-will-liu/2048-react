import { createAsyncThunk, nanoid } from '@reduxjs/toolkit';
import { SwipeDirections } from 'react-swipeable';
import { gameSlice } from './gameSlice';
import { GameState } from './models/gameState.interface';
import { selectIsGameStarted, selectIsStable, selectSize, selectTiles } from './selectors';
import { deepForEach, getRandomCoordinate, mapTilesToGrid, sleep } from './utils';

export const {
    resetGame,
    endGame,
    addScore,
    updateBestScore,
    cleanRecentlyAddedScore,
    newTile,
    afterNewTitle,
    moveTile,
    mergeTile,
    afterMergeTile,
} = gameSlice.actions;

export const generateNewTile = createAsyncThunk<void, void, { state: GameState }>(
    'game/generateNewTile',
    (_, { getState, dispatch }) => {
        const { tiles, size } = getState();
        const coord = getRandomCoordinate(size, Object.values(tiles));

        if (coord) {
            dispatch(
                newTile({
                    number: Math.random() > 0.8 ? 4 : 2,
                    id: nanoid(),
                    ...coord,
                })
            );
        }
    }
);

export const startNewGame = createAsyncThunk<void, void, { state: GameState }>(
    'game/startNewGame',
    (_, { dispatch }) => {
        dispatch(resetGame());
        dispatch(generateNewTile());
        dispatch(generateNewTile());
    }
);

export const setGameOver = createAsyncThunk<void, void, { state: GameState }>(
    'game/setGameOver',
    (_, { dispatch, getState }) => {
        const { score, bestScore } = getState();
        const updatedBestScore = Math.max(bestScore, score);
        localStorage.setItem('bestScore', updatedBestScore.toString());
        dispatch(updateBestScore(updatedBestScore));
        dispatch(endGame());
    }
);

const DirectionOffsets: Record<SwipeDirections, [number, number]> = {
    Up: [0, -1],
    Down: [0, 1],
    Left: [-1, 0],
    Right: [1, 0],
};

export const moveTiles = createAsyncThunk<void, SwipeDirections, { state: GameState }>(
    'game/moveTiles',
    async (dir, { getState, dispatch }) => {
        const state = getState();
        if (!selectIsGameStarted(state) || !selectIsStable(state)) {
            return;
        }

        const [size, tiles] = [selectSize(state), selectTiles(state)];
        const tileGrid = mapTilesToGrid(size, Object.values(tiles), (tile) => (tile ? [tile] : []));
        const dirOffset = DirectionOffsets[dir];
        let hasMovement = false;

        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                let row = i,
                    col = j;
                if (dir === 'Right') {
                    // reverse col to iterate form right to left
                    col = size - j - 1;
                }
                if (dir === 'Down') {
                    // reverse row to iteratefrom bottom t -top
                    row = size - i - 1;
                }

                // map <i, j> to <row, col> according direction `dir`
                // every iteration, we have to get new state case
                const cell = tileGrid[row][col];
                if (cell.length !== 1) continue; // current tile is empty or is a tile to merge

                // detect next tile in the direction of `dir`
                // firstly, get the next coordinate
                let nextCol = col + dirOffset[0];
                let nextRow = row + dirOffset[1];
                let nextCell: typeof cell | null = null;

                // while it's still in game board
                while (nextCol >= 0 && nextCol < size && nextRow >= 0 && nextRow < size) {
                    nextCell = tileGrid[nextRow][nextCol];
                    if (nextCell.length) {
                        // a non-empty tile found in the direction, break
                        break;
                    }
                    // if next cell is empty, step forward in this direction
                    nextCol += dirOffset[0];
                    nextRow += dirOffset[1];
                }

                if (nextCell && nextCell.length === 1 && nextCell[0].number === cell[0].number) {
                    // if nextTile has same number and is now a newly merged tile
                    const payload = {
                        id: cell[0].id,
                        destCol: nextCol,
                        destRow: nextRow,
                    };

                    dispatch(moveTile(payload));
                    // mutate tileGrid is okay which is just a copy of the tiles in state
                    // and we mutate the cell because it's required to make the rest of the iteration work correctly
                    nextCell.push(cell[0]);
                    cell.length = 0;
                    hasMovement = true;
                } else {
                    // otherwise step back and place the cell before nextCell
                    nextCol -= dirOffset[0];
                    nextRow -= dirOffset[1];
                    // if next cell is not the current cell
                    if (nextCol !== col || nextRow !== row) {
                        dispatch(
                            moveTile({
                                id: cell[0].id,
                                destRow: nextRow,
                                destCol: nextCol,
                            })
                        );
                        tileGrid[nextRow][nextCol].push(cell[0]);
                        cell.length = 0;
                        hasMovement = true;
                    }
                }
            }
        }

        if (hasMovement) {
            // allow move tiles animation to finish
            await sleep(100);
        }

        let score = 0;
        deepForEach(tileGrid, (cell) => {
            if (cell.length === 2) {
                score += cell[0].number + cell[1].number;
                dispatch(mergeTile({ id: cell[0].id, tileToMerge: cell[1].id }));
            }
        });

        if (score) {
            dispatch(addScore({ score, id: nanoid() }));
        }

        if (hasMovement) {
            dispatch(generateNewTile());
        }
    }
);
