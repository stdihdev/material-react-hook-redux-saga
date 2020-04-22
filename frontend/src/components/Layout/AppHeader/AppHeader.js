import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { NavLink } from 'react-router-dom';

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

export default function AppHeader() {
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
          <NavLink className={classes.navLink} activeClassName={classes.active} to="/login">
            <Button color="inherit">Login</Button>
          </NavLink>
          <NavLink className={classes.navLink} activeClassName={classes.active} to="/signup">
            <Button color="inherit">SignUp</Button>
          </NavLink>
        </Toolbar>
      </AppBar>
    </div>
  );
}
