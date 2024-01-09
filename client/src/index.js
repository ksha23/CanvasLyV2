import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { GoogleOAuthProvider } from '@react-oauth/google';

import App from './App';
import './index.css';
import rootReducer from './store/reducers';

const initialState = {};

const store = createStore(
  rootReducer,
  initialState,
  compose(
    applyMiddleware(thunk),
    (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ &&
      window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__()) ||
      compose,
  ),
);

ReactDOM.render(
  <Provider store={store}>
    <GoogleOAuthProvider clientId="628732787503-gqfknfu4fmd33nj7pfkjrra2vfiksh0a.apps.googleusercontent.com">
      <Router>
        <Switch>
          <Route path="/" component={App} />
        </Switch>
      </Router>
    </GoogleOAuthProvider>
  </Provider>,
  document.getElementById('root'),
);
