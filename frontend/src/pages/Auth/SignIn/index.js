import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LinearProgress from '@material-ui/core/LinearProgress';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { connect } from "react-redux";
import { signin } from '../../../store/reducers/auth';
import { compose } from 'redux';
import { Formik, Form, Field } from 'formik';
import { TextField } from 'formik-material-ui';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import Snack from '../../../components/Snack';
import { showSnack } from '../../../store/reducers/snack';

const initialValues = {
  email: "",
  password: ""
};

const validate = values => {
  const errors = {};
  const requiredFields = [
    'password',
    'email'
  ];
  requiredFields.forEach(field => {
    if (!values[field]) {
      errors[field] = 'Required';
    } else if(values[field].length < 3 || values[field].length > 50 ) {
      errors[field] = 'length must be between 3 and 50';
    }
  });
  if (
    values.email &&
    !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
  ) {
    errors.email = 'Invalid email address';
  }
  return errors ;
};

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
}));

function SignIn(props) {
  const classes = useStyles();
  const { signin, showSnack } = props;
  const history = useHistory();

  const handleSubmit = (values, actions) => {
    signin({ 
      body: values,
      success: () => {
        actions.setSubmitting(false);
        history.push('/');
        showSnack({ message: "Successfuly Logged in!", status: 'success' });
      },
      fail: (err) => {
        actions.setSubmitting(false);
        showSnack({ message: err.response.data, status: 'error' });
      }
    });
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Snack/>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Formik 
          onSubmit={handleSubmit}
          initialValues={initialValues}
          validate={validate}>
          {({ submitForm, isSubmitting }) => (
            <Form className={classes.form}>
              <Field
                variant="outlined"
                margin="normal"
                required
                fullWidth
                component={TextField}
                name="email"
                type="email"
                label="Email Address"
              />
              <br />
              <Field
                variant="outlined"
                margin="normal"
                required
                fullWidth
                component={TextField}
                type="password"
                label="Password"
                name="password"
              />
              {isSubmitting && <LinearProgress />}
              <br />
              <Button
                fullWidth
                variant="contained"
                color="primary"
                disabled={isSubmitting}
                onClick={submitForm}
                className={classes.submit}
              >
                Sign In
              </Button>
              <Grid container>
                <Grid item>
                  <Link href="/signup" variant="body2">
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
}

SignIn.propTypes = {
  signin: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  showSnack: PropTypes.func.isRequired
};



const mapStateToProps = state => ({
  auth: state.auth,
  error: state.auth.error
});

const mapDispatchToProps = {
  signin: signin,
  showSnack: showSnack
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps)
)(SignIn);
