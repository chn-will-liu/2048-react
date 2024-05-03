import { useCallback, useEffect, useRef } from 'react';
import { SwipeDirections, useSwipeable } from 'react-swipeable';
import { moveTiles, setGameOver, startNewGame } from '../store/actions';
import { selectIsMovable } from '../store/selectors';
import { useAppDispatch, useAppSelector } from '../store/store';
import { GameBoard } from './GameBoard';

const useArrowKeyPress = (callback: (dir: SwipeDirections) => void) => {
    const callbackRef = useRef(callback);
    callbackRef.current = callback;

    useEffect(() => {
        const handleKeyPress = (ev: KeyboardEvent) => {
            const match = ev.key.toLowerCase().match(/arrow(up|right|down|left)/);
            if (match) {
                const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
                callbackRef.current(capitalize(match[1]) as SwipeDirections);
                ev.preventDefault();
            }
        };

        window.addEventListener('keydown', handleKeyPress);

        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [callbackRef]);
};

const useBeforeUnloadWarning = () => {
    useEffect(() => {
        const beforeUnload = (ev: BeforeUnloadEvent) => {
            ev.preventDefault();
        };
        window.addEventListener('beforeunload', beforeUnload);
        return () => window.removeEventListener('beforeunload', beforeUnload);
    }, []);
};

export const Game = () => {
    const dispatch = useAppDispatch();
    const isMovable = useAppSelector(selectIsMovable);

    if (!isMovable) {
        dispatch(setGameOver());
    }

    const move = useCallback((dir: SwipeDirections) => dispatch(moveTiles(dir)), [dispatch]);
    useArrowKeyPress(move);
    useBeforeUnloadWarning();

    useEffect(() => {
        dispatch(startNewGame());
    }, [dispatch]);

    const handlers = useSwipeable({ onSwiped: ({ dir }) => move(dir), preventScrollOnSwipe: true });
    return (
        <div {...handlers}>
            <GameBoard />
        </div>
    );
};
