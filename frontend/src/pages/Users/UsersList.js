import React, { useEffect } from 'react';
import MaterialTable from 'material-table';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import { getUsers, deleteUser, setParams } from '../../store/reducers/user';
import { showSnack } from '../../store/reducers/snack';
import { compose } from 'redux';
import { connect } from "react-redux";
import PropTypes from 'prop-types';
import Snack from '../../components/Snack';
import ROLES from '../../data/role';
import { useHistory } from 'react-router-dom';
import TablePagination from '@material-ui/core/TablePagination';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8)
  },
  margin: {
    margin: theme.spacing(2, 0)
  }
}));

function UsersList(props){
  const classes = useStyles();
  const {
    getUsers,
    users,
    showSnack,
    info,
    deleteUser,
    setParams,
    params,
    count
  } = props;
  const columns = [
    { title: 'No', render: rowData => rowData && rowData.tableData.id + 1 + params.page * params.rowsPerPage, disableClick: true, editable: 'never' },
    { title: 'Name', render: rowData => rowData && rowData.firstName + ' ' + rowData.lastName },
    { title: 'Email', field: 'email' },
    { title: 'Role',
      field: 'role',
      lookup: info.role === ROLES.ADMIN ? {
        0: 'User',
        1: 'Manager',
        2: 'Admin'
      } : {
        0: 'User',
        1: 'Manager'
      }
    }
  ];
  const history = useHistory();

  useEffect(() => {
    getUsers({ params });
  }, [params, getUsers]);

  const handleChangePage = (event, newPage) => {
    setParams({ page: newPage });
  };

  const handleChangeRowsPerPage = (event, callBack) => {
    setParams({ rowsPerPage: parseInt(event.target.value, 10), page: 0 });
    callBack(event);
  };

  return (
    <Container component="main">
      <div className={classes.paper}>
        <Snack/>
        <MaterialTable
          title="Users"
          options={
            {
              search: false,
              actionsColumnIndex: -1,
              pageSize: params.rowsPerPage
            }
          }
          actions={[
            {
              icon: 'add',
              tooltip: 'Add User',
              isFreeAction: true,
              onClick: () => history.push('/add-user')
            },
            {
              icon: 'edit',
              tooltip: 'Edit User',
              onClick: (event, rowData) => history.push(`/users/${rowData._id}`)
            }
          ]}
          columns={columns}
          data={users}
          components={{
            // eslint-disable-next-line react/display-name
            Pagination: props => {
              return (
                <TablePagination
                  {...props}
                  count={count}
                  rowsPerPage={params.rowsPerPage}
                  page={params.page}
                  onChangePage={handleChangePage}
                  onChangeRowsPerPage={
                    // eslint-disable-next-line react/prop-types
                    (event) => handleChangeRowsPerPage(event, props.onChangeRowsPerPage)
                  }
                />
              );
            }
          }}
          localization={{
            pagination: {
              labelDisplayedRows: `${params.page * params.rowsPerPage + 1}-${Math.min((params.page + 1) * params.rowsPerPage, count)} of ${count}`
            }
          }}
          editable={{
            onRowDelete: (oldData) =>
              new Promise((resolve, reject) => {
                setTimeout(() => {
                  deleteUser({
                    id: oldData._id,
                    success: () => {
                      resolve();
                      getUsers({ params });
                      showSnack({ message: "User removed.", status: 'success' });
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
    </Container>
  );
}

UsersList.propTypes = {
  getUsers: PropTypes.func.isRequired,
  deleteUser: PropTypes.func.isRequired,
  setParams: PropTypes.func.isRequired,
  users: PropTypes.array.isRequired,
  showSnack: PropTypes.func.isRequired,
  params: PropTypes.object.isRequired,
  count: PropTypes.number.isRequired,
  info: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  users: state.user.users,
  info: state.auth.me,
  params: state.user.params,
  count: state.user.count
});

const mapDispatchToProps = {
  getUsers: getUsers,
  setParams: setParams,
  showSnack: showSnack,
  deleteUser: deleteUser
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps)
)(UsersList);