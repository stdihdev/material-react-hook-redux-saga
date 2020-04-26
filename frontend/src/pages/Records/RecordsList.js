import React, { useEffect } from 'react';
import MaterialTable from 'material-table';
import Container from '@material-ui/core/Container';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';
import { getRecords, postRecord, hideSnack, putRecord, deleteRecord } from '../../store/reducers/record';
import { compose } from 'redux';
import { connect } from "react-redux";
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8)
  }
}));

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function RecordsList(props){
  const classes = useStyles();
  const {
    getRecords,
    records,
    postRecord,
    error,
    hideSnack,
    putRecord,
    deleteRecord
  } = props;
  const columns = [
    { title: 'No', render: rowData => rowData && rowData.tableData.id + 1, disableClick: true, editable: 'never' },
    { title: 'Date', field: 'date', type: 'date' },
    { title: 'Note', field: 'note' },
    { title: 'Hour', field: 'hour', type: 'numeric' }
  ];

  useEffect(() => {
    getRecords();
  }, []);

  return (
    <Container component="main">
      <div className={classes.paper}>
        <Snackbar open={!!error} autoHideDuration={2000} onClose={() => hideSnack()}>
          <Alert  severity="error">
            {error}
          </Alert>
        </Snackbar>
        <MaterialTable
          title="Time Records"
          options={{ search: false }}
          columns={columns}
          data={records}
          editable={{
            onRowAdd: (newData) => new Promise((resolve, reject) => {
              setTimeout(() => {
                postRecord({
                  body: newData,
                  success: () => resolve(),
                  fail: () => reject()
                });
              }, 600);
            }),
            onRowUpdate: (newData) =>
              new Promise((resolve, reject) => {
                setTimeout(() => {
                  putRecord({
                    id: newData._id,
                    body: {
                      hour: newData.hour,
                      note: newData.note,
                      date: newData.date
                    },
                    success: () => resolve(),
                    fail: () => reject()
                  });
                }, 600);
              }),
            onRowDelete: (oldData) =>
              new Promise((resolve, reject) => {
                setTimeout(() => {
                  deleteRecord({
                    id: oldData._id,
                    success: () => resolve(),
                    fail: () => reject()
                  });
                }, 600);
              })
          }}
        />
      </div>
    </Container>
  );
}

RecordsList.propTypes = {
  getRecords: PropTypes.func.isRequired,
  postRecord: PropTypes.func.isRequired,
  hideSnack: PropTypes.func.isRequired,
  putRecord: PropTypes.func.isRequired,
  deleteRecord: PropTypes.func.isRequired,
  records: PropTypes.array.isRequired,
  error: PropTypes.string
};

const mapStateToProps = state => ({
  records: state.record.records,
  error: state.record.error
});

const mapDispatchToProps = {
  getRecords: getRecords,
  postRecord: postRecord,
  hideSnack: hideSnack,
  putRecord: putRecord,
  deleteRecord: deleteRecord
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps)
)(RecordsList);