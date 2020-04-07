/* eslint camelcase: 0, no-underscore-dangle: 0 */
import React from 'react';
import PropTypes from 'prop-types';

const EmptyResults = ({isType}) => (
    <div style={{ color: '#fff', textAlign: 'center', paddingTop: 40, paddingBottom: 40 }}>
        <img alt="noResults" height="180" width="180" src="/src/containers/App/styles/img/no_results.png" />
        <p style={{ fontSize: 16 }}>
            {`You haven't created any ${isType}s...`}
        </p>
        <p style={{ fontSize: 14 }}>
            {`You will see active ${isType}s appear here. Create one to get started...`}
        </p>
    </div>
);

EmptyResults.defaultProps = {
    title: '',
    message: '',
};

EmptyResults.propTypes = {
    title: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
};

export default EmptyResults;
