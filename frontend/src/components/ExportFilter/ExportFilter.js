import 'date-fns';
import React from 'react';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Blob from 'blob';
import FileSaver from 'file-saver';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from '@material-ui/pickers';
import { setParams, exportRecords } from '../../store/reducers/record';
import { compose } from 'redux';
import { connect } from "react-redux";
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(2, 0)
  }
}));

function ExportFilter(props) {
  const classes = useStyles();
  const { params, setParams, exportRecords } = props;
  // The first commit of Material-UI
  // const [selectedDate, setSelectedDate] = React.useState(new Date('2014-08-18T21:11:54'));

  const handleFromDateChange = (date) => {
    setParams({ from: date });
  };

  const handleToDateChange = (date) => {
    setParams({ to: date });
  };

  const exportRecordsInHtml = (records) => {
    const fileName = "Time Records Export";
    let content = [`<style>
      table {
        margin-top: 50px;
        width: 100%;
      }
      table, th ,td {
        border: 1px solid black;
        border-collapse: collapse;
      }
      th, td {
        padding: 5px;
        text-align: left;
      }
      caption {
        font-size: 20px;
        margin-bottom: 10px;
      }
      </style>
      <table>
      <caption> Time Records from ${params.from.toLocaleDateString("en-US")} to ${params.to.toLocaleDateString("en-US")}.</caption>
      <tr><th>No</th><th>Date</th><th>Total Hours</th><th>Notes</th></tr>`];
    const recordContent = records.map((record, index) => {
      const note = record.note.join('<br/>');
      return `<tr>
      <td style="width:20px">${index + 1}</td>
      <td>${record._id}</td>
      <td>${record.hour}</td>
      <td>${note}</td></tr>`;
    });
    content = content.concat(recordContent, ['</table>']);
    const blob = new Blob(content, { type: 'text/html' });
    FileSaver.saveAs(blob, fileName);
  };

  const handleExportData = () => {
    exportRecords({ 
      params,
      success: (res) => {
        exportRecordsInHtml(res.data.records);
      }
    });
  };

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Grid container justify="space-around">
        <KeyboardDatePicker
          disableToolbar
          variant="inline"
          format="MM/dd/yyyy"
          margin="normal"
          id="date-picker-from"
          label="From"
          value={params.from}
          onChange={handleFromDateChange}
          KeyboardButtonProps={{
            'aria-label': 'change date'
          }}
        />
        <KeyboardDatePicker
          disableToolbar
          variant="inline"
          format="MM/dd/yyyy"
          margin="normal"
          id="date-picker-to"
          label="To"
          value={params.to}
          onChange={handleToDateChange}
          KeyboardButtonProps={{
            'aria-label': 'change date'
          }}
        />
        <Button variant="contained" color="primary" className={classes.button} onClick={handleExportData}>
          Export the filtered times
        </Button>
      </Grid>
    </MuiPickersUtilsProvider>
  );
}


ExportFilter.propTypes = {
  setParams: PropTypes.func.isRequired,
  exportRecords: PropTypes.func.isRequired,
  params: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  params: state.record.params
});

const mapDispatchToProps = {
  setParams: setParams,
  exportRecords: exportRecords
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps)
)(ExportFilter);
