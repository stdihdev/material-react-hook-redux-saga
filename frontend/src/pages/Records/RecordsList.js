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
import ExportFilter from '../../components/ExportFilter';
import Roles from '../../data/role';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8)
  },
  button: {
    margin: theme.spacing(2, 0)
  }
}));

const validate = values => {
  const errors = {};
  const requiredFields = [
    'date',
    'note',
    'hour'
  ];

  requiredFields.forEach(field => {
    if (!values[field]) {
      errors[field] = `${field} required.`;
    }
  });
  if (values.hour < '1' || values.hour > '24' ) {
    errors.hour = "hour sould be between 1 and 24.";
  }

  const message = Object.keys(errors).reduce((prev, cur) => (prev += ' ' + errors[cur]), '');
  return message;
};

function RecordsList(props){
  const classes = useStyles();
  const {
    getRecords,
    records,
    postRecord,
    showSnack,
    putRecord,
    deleteRecord,
    info
  } = props;
  const columns = [
    { title: 'No', render: rowData => rowData && rowData.tableData.id + 1, disableClick: true, editable: 'never' },
    { title: 'Date', field: 'date', type: 'date', defaultSort: 'desc' },
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isUnderPreferredWorkingHours = ( date ) => {
    const recordsByDate = records.filter((record) => record.date === date);
    let totalHours = 0;
    recordsByDate.forEach((record) => totalHours += record.hour);
    return totalHours;
  };

  const defaultOptions = {
    search: false,
    actionsColumnIndex: -1,
    pageSize: 10
  };

  if(info && info.role <= Roles.MANAGER)
    defaultOptions.rowStyle = rowData => ({
      backgroundColor: (isUnderPreferredWorkingHours(rowData.date) > info.preferredWorkingHours ? '#4caf50' : '#f44336')
    });

  return (
    <Container component="main">
      <div className={classes.paper}>
        <Snack/>
        {info && info.role <= 1 &&  <>
          <Button variant="contained" color="primary" onClick={handleOpenDialog} className={classes.button}>
            Set Preferred Working Hours
          </Button>
          <ExportFilter/>
        </>}
        <MaterialTable
          title="Time Records"
          options={defaultOptions}
          columns={columns}
          data={records}
          editable={{
            onRowAdd: (newData) => new Promise((resolve, reject) => {
              const message = validate(newData);
              if(message) {
                reject();
                showSnack({ message: message, status: 'error', duration: 6000 });
                return;
              }
              setTimeout(() => {
                postRecord({
                  body: newData,
                  success: () => {
                    resolve();
                    getRecords();
                    showSnack({ message: "Time Record created.", status: 'success' });
                  },
                  fail: (err) => {
                    reject();
                    showSnack({ message: err.response.data, status: 'error' });
                  }
                });
              }, 600);
            }),
            onRowUpdate: (newData) => new Promise((resolve, reject) => {
              const message = validate(newData);
              if(message) {
                reject();
                showSnack({ message: message, status: 'error', duration: 6000 });
                return;
              }
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
                    getRecords();
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
  showSnack: PropTypes.func.isRequired,
  info: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  records: state.record.records,
  info: state.auth.me
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