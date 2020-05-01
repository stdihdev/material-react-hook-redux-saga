import 'date-fns';
import React from 'react';
import Grid from '@material-ui/core/Grid';
import ClearIcon from "@material-ui/icons/Clear";
import { IconButton } from "@material-ui/core";
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
    if(!date || date instanceof Date === false) {
      setParams({ from: null });
    } else if(date > new Date(params.to) && params.to) {
      setParams({ from: date.toLocaleDateString(), to: null });
    } else {
      setParams({ from: date.toLocaleDateString() });
    }
  };

  const handleToDateChange = (date) => {
    if(!date || date instanceof Date === false) {
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
          InputProps={{
            endAdornment: (
              <IconButton onClick={() => handleFromDateChange(null)}>
                <ClearIcon />
              </IconButton>
            )
          }}
          clearable
          label="From"
          format="MM/dd/yyyy"
          placeholder="mm/dd/yyy"
          margin="normal"
          id="date-picker-from"
          maxDate={params.to ? params.to : new Date()}
          value={params.from}
          onChange={handleFromDateChange}
          KeyboardButtonProps={{
            'aria-label': 'change date'
          }}
          InputAdornmentProps={{
            position: "start"
          }}
        />
        <KeyboardDatePicker
          InputProps={{
            endAdornment: (
              <IconButton onClick={() => handleToDateChange(null)}>
                <ClearIcon />
              </IconButton>
            )
          }}
          InputAdornmentProps={{
            position: "start"
          }}
          label="To"
          placeholder="mm/dd/yyy"
          clearable
          format="MM/dd/yyyy"
          margin="normal"
          id="date-picker-to"
          minDate={params.from ? params.from : new Date(1900,1,1)}
          maxDate={new Date()}
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
