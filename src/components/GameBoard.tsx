import './GameBoard.css';
import { selectIsGameStarted, selectSize } from '../store/selectors';
import { useAppSelector } from '../store/store';
import { createArray2D } from '../store/utils';
import { GameOver } from './GameOver';
import { HeaderBox } from './HeaderBox';
import { Tiles } from './Tiles';

const BackgroundGrids = () => {
    const size = useAppSelector(selectSize);

    const grids = createArray2D(size, (i, j) => (
        <div className="grid-cell" key={`grid-cell-${i * size + j}`}></div>
    ));

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
