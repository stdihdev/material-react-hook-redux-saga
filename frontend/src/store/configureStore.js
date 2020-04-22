import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { routerMiddleware } from 'react-router-redux';
import { createBrowserHistory } from 'history';
import rootReducer from './reducers';
import sagas from './sagas';

export const history = createBrowserHistory();

export default function configureStore(initialState = {}) {
  const sagaMiddleware = createSagaMiddleware();
  const middleware = [];
  const enhancers = [];
  

  middleware.push(sagaMiddleware);
  middleware.push(routerMiddleware(history));

  // eslint-disable-next-line no-undef
  if (process.env.NODE_ENV === 'development') {
    const devToolsExtension = window.devToolsExtension;
	
    if (typeof devToolsExtension === 'function') {
      enhancers.push(devToolsExtension());
    }
  }
	
  const composedEnhancers = compose(
    applyMiddleware(...middleware),
    ...enhancers
  );

  const store = createStore(
    rootReducer,
    initialState,
    composedEnhancers
  );

  sagaMiddleware.run(sagas);
  return store;
}