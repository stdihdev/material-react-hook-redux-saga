import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { NavLink } from 'react-router-dom';
import { compose } from 'redux';
import { connect } from "react-redux";
import PropTypes from 'prop-types';
import { signout } from '../../../store/reducers/auth';
import ROLES from '../../../data/role';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  title: {
    flexGrow: 1
  },
  navLink: {
    color: 'white',
    textDecoration: 'none'
  },
  active: {
    backgroundColor: '#1f308c7a'
  }
}));

function AppHeader(props) {
  const { me, signout } = props;
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            Time Management System
          </Typography>
          { me
            ? <>
              {(me.role >= ROLES.MANAGER) &&
              <NavLink className={classes.navLink} activeClassName={classes.active} to="/users">
                <Button color="inherit">Users</Button>
              </NavLink>
              }
              {(me.role >= ROLES.MANAGER) &&
              <NavLink className={classes.navLink} activeClassName={classes.active} to="/records">
                <Button color="inherit">Records</Button>
              </NavLink>
              }
              <NavLink
                className={classes.navLink}
                activeClassName={classes.active}
                to="/logout"
                onClick={signout} >
                <Button color="inherit">Log Out</Button>
              </NavLink>
            </>
            : <>
              <NavLink className={classes.navLink} activeClassName={classes.active} to="/login">
                <Button color="inherit">Login</Button>
              </NavLink>
              <NavLink className={classes.navLink} activeClassName={classes.active} to="/signup">
                <Button color="inherit">SignUp</Button>
              </NavLink>
            </>
          }
        </Toolbar>
      </AppBar>
    </div>
  );
}

AppHeader.propTypes = {
  me: PropTypes.object,
  signout: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  me: state.auth.me
});

const mapDispatchToProps = {
  signout
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps)
)(AppHeader);