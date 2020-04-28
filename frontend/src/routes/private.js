import React from 'react';
import { useSelector } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import ROLES from '../data/role';

function AdminOrManagerRoute({ component: Component, ...rest }) {
  const info = useSelector((state) => state.auth.me);
  return (
    <Route
      {...rest}
      render={({ location }) =>
        info.role >= ROLES.MANAGER ? (
          <Component />
        ) : (
          <Redirect
            to={{
              pathname: '/',
              state: { from: location }
            }}
          />
        )
      }
    />
  );
}

AdminOrManagerRoute.propTypes = {
  component: PropTypes.func
};

export default AdminOrManagerRoute;

