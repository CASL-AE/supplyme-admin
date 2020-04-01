/* eslint camelcase: 0, no-underscore-dangle: 0 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';

const styles = {
    middleBox: {
        maxWidth: 400,
        zIndex: 100,
        margin: 'auto',
        paddingTop: 40,
        textAlign: 'center',
    },
    bold: {
        fontWeight: 600,
    },
};

class NotFoundView extends Component { // eslint-disable-line react/prefer-stateless-function
    render() {
        const { classes } = this.props;
        return (
            <div className={classes.middleBox}>
                <h1>404</h1>
                <h3 className={classes.bold}>Page Not Found</h3>
                <div>
                    {'Sorry, but the page you are looking for has not been found. Try checking the URL for error, then hit the refresh button on your browser.'}
                </div>
            </div>
        );
    }
}

NotFoundView.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(NotFoundView);
