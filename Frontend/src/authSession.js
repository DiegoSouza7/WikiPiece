import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const isAuth = () => {
  const token = localStorage.getItem('Authorization')
  if (token !== null) {
    return false
  }

  return true;

}

const RouteSessions = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props =>
        isAuth() ? (
          <Component {...props} />
        ) : (
            <Redirect to={{ pathname: "/", state: { from: props.location } }} />
          )
      }
    />
  )
}

export default RouteSessions