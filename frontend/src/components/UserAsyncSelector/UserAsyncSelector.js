import React from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import { compose } from 'redux';
import { connect } from "react-redux";
import { getUsers } from '../../store/reducers/user';
import PropTypes from 'prop-types';
import { getFullName } from '../../lib/lib';

function AsyncUserSelector(props) {
  const [open, setOpen] = React.useState(false);
  const { users, getUsers, value, onChange } = props;
  const loading = open && users.length === 0;

  React.useEffect(() => {
    if (!loading) {
      return;
    }
    getUsers();
  }, [loading, getUsers]);

  return (
    <Autocomplete
      id="asynchronous-demo"
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      value={value}
      onChange={onChange}
      getOptionSelected={(option, value) => value && option._id === value._id}
      getOptionLabel={(option) => option.firstName ? getFullName(option) : ''}
      options={users}
      loading={loading}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder="user"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            )
          }}
        />
      )}
    />
  );
}

AsyncUserSelector.propTypes = {
  users: PropTypes.array,
  getUsers: PropTypes.func.isRequired,
  value: PropTypes.object,
  onChange: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  users: state.user.users
});

const mapDispatchToProps = {
  getUsers: getUsers
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps)
)(AsyncUserSelector);