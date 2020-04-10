/* eslint camelcase: 0, no-underscore-dangle: 0 */
import React from 'react';
import PropTypes from 'prop-types';

const EmptyResults = ({title, message}) => (
    <div style={{ textAlign: 'center', paddingTop: 40, paddingBottom: 40 }}>
        <img alt="noResults" height="180" width="180" src="/src/containers/App/styles/img/no_results.png" />
        <p style={{ fontSize: 16 }}>
            {title}
        </p>
        <p style={{ fontSize: 14 }}>
            {message}
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
