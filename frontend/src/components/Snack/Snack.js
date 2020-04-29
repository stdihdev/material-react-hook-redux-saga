import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { compose } from 'redux';
import { connect } from "react-redux";
import { hideSnack } from '../../store/reducers/snack';
import { PropTypes } from 'prop-types';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function Snack(props) {
  const { snack, hideSnack } = props;
  return (
    <Snackbar open={snack.show} autoHideDuration={snack.duration} onClose={() => hideSnack()}>
      <Alert  severity={snack.status}>
        {snack.message}
      </Alert>
    </Snackbar>
  );
}

Snack.propTypes = {
  hideSnack: PropTypes.func.isRequired,
  snack: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  snack: state.snack
});

const mapDispatchToProps = {
  hideSnack: hideSnack
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps)
)(Snack);

