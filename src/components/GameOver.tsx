import './GameOver.css';

import { startNewGame } from '../store/actions';
import { useAppDispatch } from '../store/store';

export const GameOver = () => {
    const dispatch = useAppDispatch();
    return (
        <div className="game-over">
            <h1 className="title">Game Over!</h1>
            <button onClick={() => dispatch(startNewGame())}>Try Again</button>
        </div>
    );
};
