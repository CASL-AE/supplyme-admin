import React, { useState, cloneElement } from "react";
import PropTypes from "prop-types";
import TablePagination from "@material-ui/core/TablePagination";
import algoliasearch from "algoliasearch/lite";
import { InstantSearch, SearchBox, Configure, connectHits, connectPagination, Stats } from "react-instantsearch-dom";


const searchClient = algoliasearch(
  "5EIN2BYQ8O",
  "db2234eba37bde834ae2504e6c6bbeca"
);

const Hits = ({ hits, HitItemComponent }) => {
    return (
        <>
            {hits.map((hit) => (
                <HitItemComponent {...{ hit }} />
            ))}
        </>
    );
};

Hits.propTypes = {
    hits: PropTypes.arrayOf().isRequired,
};

const Pagination = ({
    currentRefinement,
    refine,
    hitsPerPage,
    handlePagesChange,
    handleChangeRowsPerPage,
}) => {
    const [numberOfResults, setNumber] = useState();
    const [rowsPerPage, setRows] = useState(hitsPerPage);
    const handlePageChange = (e, newPage) => {
        refine(newPage+1);
        handlePagesChange(newPage);
    };
    const handleChange = (e) => {
        handleChangeRowsPerPage(e, setRows);
    };
    
    return (
        <>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                count={Number(numberOfResults)}
                page={Number(currentRefinement)-1}
                onChangePage={handlePageChange}
                onChangeRowsPerPage={handleChange}
                selectProps={{
                    inputProps: { "aria-label": "rows per page" },
                    native: true,
                }}
                rowsPerPage={rowsPerPage}
            />
            <Stats
                translations={{
                    stats(nbHits) {
                        setNumber(Number(nbHits));
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


const SearchComponent = ({ children, indexName }) => {
  const [ hitsPerPage, setHitsPerPage ] = useState(5)
  const [ page, setPage ] = useState(0);
    return (
        <InstantSearch indexName={indexName} searchClient={searchClient}>
            <SearchBox />
            <Configure hitsPerPage={hitsPerPage} />
            {cloneElement(children, {...{setHitsPerPage, hitsPerPage, page, setPage}})}
        </InstantSearch>
    );
};


let HitComponent = connectHits(Hits);
let PaginationComponent = connectPagination(Pagination);

export default SearchComponent;
export { HitComponent, PaginationComponent };
