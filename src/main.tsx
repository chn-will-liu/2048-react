import './index.css';

import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';

import { Game } from './components/Game';
import { store } from './store/store';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <Provider store={store}>
            <Game />
        </Provider>
    </React.StrictMode>
);
