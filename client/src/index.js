import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { StyledEngineProvider } from '@mui/material';

import App from './App';
import './index.css';
import rootReducer from './store/reducers';
import ErrorBoundary from './components/ErrorBoundary';

const initialState = {};

const store = createStore(
  rootReducer,
  initialState,
  compose(
    applyMiddleware(thunk),
    window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : (f) => f,
  ),
);

const root = createRoot(document.getElementById('root'));

root.render(
  <Provider store={store}>
    <ErrorBoundary>
      <GoogleOAuthProvider clientId={process.env.GOOGLE_CLIENT_ID}>
        <StyledEngineProvider injectFirst>
          <Router>
            <Switch>
              <Route path="/" component={App} />
            </Switch>
          </Router>
        </StyledEngineProvider>
      </GoogleOAuthProvider>
    </ErrorBoundary>
  </Provider>,
);
