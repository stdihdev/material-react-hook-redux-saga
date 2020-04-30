import 'date-fns';
import React from 'react';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';

import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from '@material-ui/pickers';
import { setParams } from '../../store/reducers/record';
import { compose } from 'redux';
import { connect } from "react-redux";
import PropTypes from 'prop-types';

function ExportFilter(props) {
  const { params, setParams } = props;
  // The first commit of Material-UI
  // const [selectedDate, setSelectedDate] = React.useState(new Date('2014-08-18T21:11:54'));

  const handleFromDateChange = (date) => {
    if(!date) { 
      setParams({ from: null });
    } else if(date > new Date(params.to) && params.to) {
      setParams({ from: date.toLocaleDateString(), to: null });
    } else {
      setParams({ from: date.toLocaleDateString() });
    }
  };

  const handleToDateChange = (date) => {
    if(!date) {
      setParams({ to: null });
    } else if(date < new Date(params.from) && params.from) {
      setParams({ to: date.toLocaleDateString(), from: null });
    } else {
      setParams({ to: date.toLocaleDateString() });
    }
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
      </Grid>
    </MuiPickersUtilsProvider>
  );
}


ExportFilter.propTypes = {
  setParams: PropTypes.func.isRequired,
  params: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  params: state.record.params
});

const mapDispatchToProps = {
  setParams: setParams
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps)
)(ExportFilter);
