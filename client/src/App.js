import React, { useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';
import { compose } from 'redux';
import { connect } from 'react-redux';

import Home from './pages/Home/Home';
import ProfilePage from './pages/Profile/ProfilePage';
import Users from './pages/Users/Users';
import Admin from './pages/Admin/Admin';
import NotFound from './pages/NotFound/NotFound';
import Assignments from './pages/Assignments/Assignments';

import { loadMe } from './store/actions/authActions';
import PrivacyPolicyPage from './pages/PrivacyPolicy/PrivacyPolicy';
import CanvasAssignments from './pages/CanvasAssignments/CanvasAssignments';

const App = ({ auth, assignment, profile, loadMe }) => {
  useEffect(() => {
    if (!auth.appLoaded && !auth.isLoading && !auth.isAuthenticated) {
      loadMe();
    }
  }, [auth.isAuthenticated, loadMe, auth.isLoading, auth.appLoaded]);

  useEffect(() => {
    if (auth.error || assignment?.error || profile?.error) {
      window.location.href = '/';
    }
  }, []);

  return (
    <>
      {auth.appLoaded ? (
        <Switch>
          <Route path="/users" component={Users} />
          <Route path="/notfound" component={NotFound} />
          <Route path="/admin" component={Admin} />
          <Route path="/assignments" component={Assignments} />
          <Route path="/canvas" component={CanvasAssignments} />
          <Route path="/privacy" component={PrivacyPolicyPage} />
          <Route exact path="/:username" component={ProfilePage} />
          <Route exact path="/" component={Home} />
          <Route component={NotFound} />
        </Switch>
      ) : (
        <div className="bg-white dark:bg-black"></div>
      )}
    </>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  assignment: state.assignment,
  profile: state.profile,
});

export default compose(connect(mapStateToProps, { loadMe }))(App);
