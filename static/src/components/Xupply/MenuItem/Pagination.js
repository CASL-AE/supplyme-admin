import React, { useState } from "react";
import { connectPagination } from "react-instantsearch-dom";
import { Stats } from "react-instantsearch-dom";
import PropTypes from "prop-types";
import TablePagination from "@material-ui/core/TablePagination";
import TablePaginationActions from "../../TablePaginationActions";

const Pagination = ({
    currentRefinement,
    refine,
    hitsPerPage,
    handleChangeRowsPerPage,
}) => {
    const [page, setPage] = useState(Number(currentRefinement));
    const [numberOfResults, setNumber] = useState();
    const [rowsPerPage, setRows] = useState(hitsPerPage);
    const handlePageChange = (e, newPage) => {
        refine(newPage);
        setPage(newPage);
    };
    const handleChange = (e) => {
        handleChangeRowsPerPage(e, setRows);
    };
    return (
        <>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                count={numberOfResults}
                page={page - 1}
                onChangePage={handlePageChange}
                onChangeRowsPerPage={handleChange}
                actionsComponent={TablePaginationActions}
                selectProps={{
                    inputProps: { "aria-label": "rows per page" },
                    native: true,
                }}
                rowsPerPage={rowsPerPage}
            />
            <Stats
                translations={{
                    stats(nbHits) {
                        setNumber(nbHits);
                    },
                }}
            />
        </>
    );
};

Pagination.propTypes = {
    currentRefinement: PropTypes.string,
    refine: PropTypes.function,
    hitsPerPage: PropTypes.number,
    handleChangeRowsPerPage: PropTypes.function,
};

Pagination.defaultProps = {
    currentRefinement: 1,
    refine: undefined,
    hitsPerPage: 1,
};

export default connectPagination(Pagination);
