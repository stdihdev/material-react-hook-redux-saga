import React from 'react';
import { useSelector } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

function AdminOrManagerRoute({ component: Component, ...rest }) {
  const info = useSelector((state) => state.auth.me);
  return (
    <Route
      {...rest}
      render={({ location }) =>
        (info.role === 'manager' || info.role === 'admin') ? (
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

