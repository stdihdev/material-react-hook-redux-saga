import React from 'react';
import Routes from './routes';
// import { ConnectedRouter } from 'react-router-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';

import AppHeader from './components/Layout/AppHeader';
import configureStore from './store/configureStore';
import './App.css';

const initialState = {};

const store = configureStore(initialState);

const App = () => {
  return (
    <Provider store={store}>
      <div className="App">
        <Router>
          <AppHeader />
          <Routes />
        </Router>
      </div>
    </Provider>
  );
};

export default App;
