import React from 'react';
import { Route, Switch } from 'react-router-dom';
import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';

const Routes = () => {
  return (
    <Switch>
      <Route path='/login' component={SignIn} />
      <Route path='/signup' component={SignUp} />
    </Switch>
  );
};

export default Routes;