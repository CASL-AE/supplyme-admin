
import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { routerMiddleware } from 'connected-react-router';
import rootReducer from '../services';

import history from '../history';

const debugware = [];
if (process.env.NODE_ENV !== 'production') {
    debugware.push(createLogger({
        collapsed: true,
    }));
}

export default function configureStore(initialState) {
    const store = createStore(
        rootReducer(history),
        initialState,
        compose(
            applyMiddleware(
                routerMiddleware(history),
                thunkMiddleware,
                ...debugware,
            ),
        ),
    );

    if (module.hot) {
        // Enable Webpack hot module replacement for reducers
        module.hot.accept('../services', () => {
            const nextRootReducer = require('../services/index').default;
            store.replaceReducer(nextRootReducer);
        });
    }

    return store;
}
