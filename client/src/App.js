import React, { useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';
import { compose } from 'redux';
import { connect } from 'react-redux';

import Login from './pages/Login/Login';
import Home from './pages/Home/Home';
import ProfilePage from './pages/Profile/ProfilePage';
import Users from './pages/Users/Users';
import Admin from './pages/Admin/Admin';
import NotFound from './pages/NotFound/NotFound';
import Assignments from './pages/Assignments/Assignments';

import { loadMe } from './store/actions/authActions';
import PrivacyPolicyPage from './pages/PrivacyPolicy/PrivacyPolicy';

const App = ({ auth, loadMe }) => {
  useEffect(() => {
    if (!auth.appLoaded && !auth.isLoading && !auth.isAuthenticated) {
      loadMe();
    }
  }, [auth.isAuthenticated, loadMe, auth.isLoading, auth.appLoaded]);

  return (
    <>
      {auth.appLoaded ? (
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/users" component={Users} />
          <Route path="/notfound" component={NotFound} />
          <Route path="/admin" component={Admin} />
          <Route path="/assignments" component={Assignments} />
          <Route path="/privacy" component={PrivacyPolicyPage} />
          <Route exact path="/:username" component={ProfilePage} />
          <Route exact path="/" component={Home} />
          <Route component={NotFound} />
        </Switch>
      ) : null}
    </>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default compose(connect(mapStateToProps, { loadMe }))(App);
