import React from 'react';
import PropTypes from 'prop-types';
import TablePagination from '@material-ui/core/TablePagination';
import TablePaginationActions from './PaginationActions';

function Pagination(props) {
  const { rowsPerPageOptions, params, onChangePage, onChangeRowsPerPage, count } = props;

  return (
    <TablePagination
      rowsPerPageOptions={rowsPerPageOptions}
      colSpan={3}
      count={count}
      rowsPerPage={params.rowsPerPage}
      page={params.page}
      SelectProps={{
        inputProps: { 'aria-label': 'rows per page' },
        native: true
      }}
      onChangePage={onChangePage}
      onChangeRowsPerPage={onChangeRowsPerPage}
      ActionsComponent={TablePaginationActions}
    />
  );
}

Pagination.propTypes = {
  count: PropTypes.number.isRequired,
  params: PropTypes.object.isRequired,
  onChangePage: PropTypes.func.isRequired,
  onChangeRowsPerPage: PropTypes.func.isRequired,
  rowsPerPageOptions: PropTypes.array
};

Pagination.defaultProps = {
  rowsPerPageOptions: [5, 10, 25]
};

export default Pagination;
