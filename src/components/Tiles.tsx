import './Tiles.css';

import { memo } from 'react';

import { afterMergeTile, afterNewTitle } from '../store/actions';
import { Tile } from '../store/models/tile.model';
import { selectTiles } from '../store/selectors';
import { useAppDispatch, useAppSelector } from '../store/store';

const TILE_WIDTH = 100;
const TILE_GAP = 10;

const TileComponent = memo(({ tile }: { tile: Tile }) => {
    let { col, row } = tile;
    let classMap = {
        tile: true,
        [`tile-${tile.number}`]: true,
        'tile-new': tile.isNewlyGenerated,
        'tile-merged': !!tile.isNewlyMerged,
    };
    let classNames = Object.keys(classMap)
        .filter((cls) => !!classMap[cls])
        .join(' ');
    let x = col * (TILE_WIDTH + TILE_GAP) + 'px';
    let y = row * (TILE_WIDTH + TILE_GAP) + 'px';
    let style = { transform: `translate3d(${x}, ${y}, 0)` };

    const dispatch = useAppDispatch();

    const onAnimationEnd = (animationName: string) => {
        if (animationName === 'a-tile-new') {
            dispatch(afterNewTitle(tile));
        } else if (animationName === 'a-tile-merged') {
            dispatch(afterMergeTile(tile));
        }
    };

    return (
        <div className={classNames} style={style}>
            <div className="tile-inner" onAnimationEnd={({ animationName }) => onAnimationEnd(animationName)}>
                {tile.number}
            </div>
        </div>
    );
});

export const Tiles = () => {
    const tiles = useAppSelector(selectTiles);

    return (
        <div className="tile-container">
            {[...Object.values(tiles)].map((tile) => (
                <TileComponent key={'tile-' + tile.id} tile={tile}></TileComponent>
            ))}
        </div>
    );
};
