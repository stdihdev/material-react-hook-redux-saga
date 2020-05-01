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
import UserAsyncSelector from '../UserAsyncSelector';

function ExportFilter(props) {
  const { params, setParams, allowUser } = props;

  const handleToUserChange = (e, value) => {
    setParams({ user: value ? value._id : null });
  };

  const handleFromDateChange = (date) => {
    if(!date || date instanceof Date === false) {
      setParams({ from: null });
    } else if(date > new Date(params.to) && params.to) {
      setParams({ from: new Date(date.toDateString()), to: null });
    } else {
      setParams({ from: new Date(date.toDateString()) });
    }
  };

  const handleToDateChange = (date) => {
    if(!date || date instanceof Date === false) {
      setParams({ to: null });
    } else if(date < new Date(params.from) && params.from) {
      setParams({ to: new Date(date.toDateString()), from: null });
    } else {
      setParams({ to: new Date(date.toDateString()) });
    }
  };

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Grid container justify="space-around" spacing={2} alignItems='flex-end'>
        <Grid item xs={12} sm={4}>
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
            format="dd/MM/yyyy"
            placeholder="dd/mm/yyyy"
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
        </Grid>
        <Grid item xs={12} sm={4}>
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
            placeholder="dd/mm/yyyy"
            clearable
            format="dd/MM/yyyy"
            id="date-picker-to"
            minDate={params.from ? params.from : new Date(1900, 1, 1)}
            maxDate={new Date()}
            value={params.to}
            onChange={handleToDateChange}
            KeyboardButtonProps={{
              'aria-label': 'change date'
            }}
          />
        </Grid>
        {allowUser &&
        <Grid item xs={12} sm={4}>
          <UserAsyncSelector
            label="User"
            margin="normal"
            onChange={handleToUserChange}/>
        </Grid>}
      </Grid>
    </MuiPickersUtilsProvider>
  );
}


ExportFilter.propTypes = {
  setParams: PropTypes.func.isRequired,
  params: PropTypes.object.isRequired,
  allowUser: PropTypes.bool
};

ExportFilter.defaultProps = {
  allowUser: false
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
