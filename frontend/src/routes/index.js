import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import SignIn from '../pages/Auth/SignIn';
import SignUp from '../pages/Auth/SignUp';
import RecordsList from '../pages/Records/RecordsList';
import UsersList from '../pages/Users/UsersList';
import { useSelector } from 'react-redux';
import AdminOrManagerRoute from './private';

const Routes = () => {

  const isAuthenticated = useSelector(state => !!state.auth.token);
  return (
    <Switch>
      <Route exact path='/' render={() => {
        if (isAuthenticated) return (<Redirect to='/records' />);
        return (<Redirect to='/login' />);
      }} />
      <Route path='/login' component={SignIn} />
      <Route path='/signup' component={SignUp} />
      {isAuthenticated && <>
        <Route exact path="/records" component={RecordsList} />
        <AdminOrManagerRoute exact path="/users" component={UsersList}/>
      </>}
      <Route render={() => <Redirect to="/" />} />
    </Switch>
  );
};

export default Routes;