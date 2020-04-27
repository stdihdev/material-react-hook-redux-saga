import React, { useEffect, useState } from 'react';
import MaterialTable from 'material-table';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { getRecords, postRecord, putRecord, deleteRecord } from '../../store/reducers/record';
import { showSnack } from '../../store/reducers/snack';
import { compose } from 'redux';
import { connect } from "react-redux";
import PropTypes from 'prop-types';
import PreferredHoursForm from '../../components/PreferredHoursForm';
import Snack from '../../components/Snack';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8)
  },
  margin: {
    margin: theme.spacing(2, 0)
  }
}));

function RecordsList(props){
  const classes = useStyles();
  const {
    getRecords,
    records,
    postRecord,
    showSnack,
    putRecord,
    deleteRecord
  } = props;
  const columns = [
    { title: 'No', render: rowData => rowData && rowData.tableData.id + 1, disableClick: true, editable: 'never' },
    { title: 'Date', field: 'date', type: 'date' },
    { title: 'Note', field: 'note' },
    { title: 'Hour', field: 'hour', type: 'numeric' }
  ];
  const [open, setOpen] = useState(false);

  const handleOpenDialog = () => {
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  useEffect(() => {
    getRecords();
  }, []);

  return (
    <Container component="main">
      <div className={classes.paper}>
        <Snack/>
        <Button variant="contained" color="primary" onClick={handleOpenDialog} className={classes.margin}>
          Set Preferred Working Hours
        </Button>
        <MaterialTable
          title="Time Records"
          options={
            {
              search: false,
              actionsColumnIndex: -1
            }
          }
          columns={columns}
          data={records}
          editable={{
            onRowAdd: (newData) => new Promise((resolve, reject) => {
              setTimeout(() => {
                postRecord({
                  body: newData,
                  success: () => {
                    resolve();
                    showSnack({ message: "Time Record created.", status: 'success' });
                  },
                  fail: (err) => {
                    reject();
                    showSnack({ message: err.response.data, status: 'error' });
                  }
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
                    success: () => {
                      resolve();
                      showSnack({ message: "Time Record updated.", status: 'success' });
                    },
                    fail: (err) => {
                      reject();
                      showSnack({ message: err.response.data, status: 'error' });
                    }
                  });
                }, 600);
              }),
            onRowDelete: (oldData) =>
              new Promise((resolve, reject) => {
                setTimeout(() => {
                  deleteRecord({
                    id: oldData._id,
                    success: () => {
                      resolve();
                      showSnack({ message: "Time Record removed.", status: 'success' });
                    },
                    fail: (err) => {
                      reject();
                      showSnack({ message: err.response.data, status: 'error' });
                    }
                  });
                }, 600);
              })
          }}
        />
      </div>
      <PreferredHoursForm open={open} handleClose={handleCloseDialog}/>
    </Container>
  );
}

RecordsList.propTypes = {
  getRecords: PropTypes.func.isRequired,
  postRecord: PropTypes.func.isRequired,
  putRecord: PropTypes.func.isRequired,
  deleteRecord: PropTypes.func.isRequired,
  records: PropTypes.array.isRequired,
  showSnack: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  records: state.record.records
});

const mapDispatchToProps = {
  getRecords: getRecords,
  postRecord: postRecord,
  showSnack: showSnack,
  putRecord: putRecord,
  deleteRecord: deleteRecord
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps)
)(RecordsList);