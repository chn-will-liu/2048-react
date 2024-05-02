import { GameStatus } from './gameStatus.enum';
import { Tile } from './tile.model';

export interface GameState {
    score: number;
    bestScore: number;
    gameStatus: GameStatus;
    size: number;
    tiles: Record<string, Tile>;
    recentlyAddedScores: { score: number; id: string }[];
}
