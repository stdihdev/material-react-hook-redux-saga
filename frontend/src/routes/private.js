import React from 'react';
import { useSelector } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import ROLES from '../data/role';

function AdminOrManagerRoute({ children, ...rest }) {
  const info = useSelector((state) => state.auth.me);
  return (
    <Route
      {...rest}
      render={({ location }) =>
        info.role >= ROLES.MANAGER ? (
          children
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
  children: PropTypes.element
};

export default AdminOrManagerRoute;

