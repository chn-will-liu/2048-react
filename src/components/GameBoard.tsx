import './GameBoard.css';

import { selectIsGameStarted, selectSize } from '../store/selectors';
import { useAppSelector } from '../store/store';
import { GameOver } from './GameOver';
import { HeaderBox } from './HeaderBox';
import { Tiles } from './Tiles';

const BackgroundGrids = () => {
    const size = useAppSelector(selectSize);
    let row = (i: number) => {
        return new Array(size)
            .fill(null)
            .map((_, j) => <div className="grid-cell" key={`grid-cell-${i * size + j}`}></div>);
    };
    let grids = new Array(size).fill(null).map((_, i) => row(i));

    return <div className="grid-container">{grids}</div>;
};

export const GameBoard = () => {
    const isGameStarted = useAppSelector(selectIsGameStarted);

    return (
        <div className="game-board">
            <HeaderBox />
            <div className="game-box">
                <BackgroundGrids />
                <Tiles />
                {!isGameStarted && <GameOver />}
            </div>
            <a href="https://github.com/chn-will-liu/2048-react" className="view-score-link">
                view source on github
            </a>
        </div>
    );
};
