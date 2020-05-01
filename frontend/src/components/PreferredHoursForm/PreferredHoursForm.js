import React from 'react';
import Button from '@material-ui/core/Button';
import { TextField } from 'formik-material-ui';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import LinearProgress from '@material-ui/core/LinearProgress';
import { Formik, Form, Field } from 'formik';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { updateProfile } from '../../store/reducers/auth';
import { connect } from "react-redux";
import { compose } from 'redux';
import { showSnack } from '../../store/reducers/snack';
import Snack from '../Snack';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1)
  },
  content: {
    overflow: 'unset'
  }
}));

const validate = values => {
  const errors = {};
  if (!values.preferredWorkingHours) {
    errors.preferredWorkingHours = 'Required';
  }
  if ( values.preferredWorkingHours < 0 || values.preferredWorkingHours > 24 ) {
    errors.preferredWorkingHours = 'Working Hours should be less or equal to 24.';
  }
  return errors ;
};

function PreferredHoursForm(props) {
  const { open, handleClose, showSnack, updateProfile, info } = props;
  const classes = useStyles();
  const initialValues = {
    preferredWorkingHours: info.preferredWorkingHours
  };
  const handleSubmit = (values, actions) => {
    updateProfile({ 
      body: values,
      success: () => {
        actions.setSubmitting(false);
        handleClose();
        showSnack({ message: "Successfuly Updated.", status: 'success' });
      },
      fail: (err) => {
        actions.setSubmitting(false);
        showSnack({ message: err.response.data, status: 'error' });
      }
    });
  };

  return (
    <div  className={classes.paper}>
      <Snack/>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Set Preferred Working Hours</DialogTitle>
        <DialogContent className={classes.content}>
          <Formik 
            onSubmit={handleSubmit}
            initialValues={initialValues}
            validate={validate}>
            {({ submitForm, isSubmitting, values }) => (
              <Form className={classes.form}>
                <Field
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  component={TextField}
                  name="preferredWorkingHours"
                  type="number"
                  inputProps={{ min: 1, max:24, step: 1 }}
                  value={values.preferredWorkingHours}
                  label="Preferred Working Hours"
                />
                <br />
                {isSubmitting && <LinearProgress />}
                <Grid container spacing={3}>
                  <Grid item xs={6}>
                    <Button
                      fullWidth
                      variant="contained"
                      color="primary"
                      disabled={isSubmitting}
                      onClick={submitForm}
                    >
                      Set
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button
                      fullWidth
                      variant="contained"
                      color="primary"
                      onClick={handleClose}
                    >
                      Close
                    </Button>
                  </Grid>
                </Grid>
              </Form>
            )}
          </Formik>
        </DialogContent>
        <DialogActions>
        </DialogActions>
      </Dialog>
    </div>
  );
}

PreferredHoursForm.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  showSnack: PropTypes.func.isRequired,
  updateProfile: PropTypes.func.isRequired,
  info: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  info: state.auth.me
});

const mapDispatchToProps = {
  updateProfile: updateProfile,
  showSnack: showSnack
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps)
)(PreferredHoursForm);
