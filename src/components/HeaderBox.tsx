import { PropsWithChildren } from 'react';
import { cleanRecentlyAddedScore, startNewGame } from '../store/actions';
import { selectBestScore, selectRecentlyAddedScores, selectScore } from '../store/selectors';
import { useAppDispatch, useAppSelector } from '../store/store';
import './HeaderBox.css';

type ScoreBoxProps = PropsWithChildren<{ label: 'SCORE' | 'BEST' }>;

const ScoreBox = ({ label, children }: ScoreBoxProps) => {
    const score = useAppSelector(label === 'SCORE' ? selectScore : selectBestScore);
    return (
        <div className="score-box">
            <div className="score-label">{label}</div>
            <div className="score-content">{score}</div>
            {children}
        </div>
    );
};

const RecentScores = () => {
    const dispatch = useAppDispatch();
    const recentlyAddedScore = useAppSelector(selectRecentlyAddedScores);
    return recentlyAddedScore.map((score) => (
        <div
            className="addition-score"
            key={score.id}
            onAnimationEnd={() => dispatch(cleanRecentlyAddedScore(score.id))}
        >
            +{score.score}
        </div>
    ));
};

export const HeaderBox = () => {
    const dispatch = useAppDispatch();

    return (
        <div className="header-box">
            <h1 className="title">2048</h1>
            <ScoreBox label="SCORE">
                <RecentScores />
            </ScoreBox>
            <ScoreBox label="BEST" />
            <div className="desc-txt">
                <span className="bold">Play 2048 Game Online</span>
                <br />
                Join the numbers and get to the <span className="bold">2048 tile!</span>
            </div>
            <button className="new-game-btn" onClick={() => dispatch(startNewGame())}>
                New Game
            </button>
        </div>
    );
};
