/* eslint camelcase: 0, no-underscore-dangle: 0, react/jsx-indent-props: 0, max-len: 0, react/forbid-prop-types: 0 */
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    root: {
        flex: 1,
        height: '100%',
        background: 'linear-gradient(to right, #000000 0%, #79bac1 100%, #79bac1 100%, #79bac1 100%)',
    },
    rightContent: {
        margin: 'auto',
        display: 'flex-inline',
        width: '90%',
    },
    gridItem: {
      marginLeft: '3%',
      marginRight: '3%',
    },
    gridItemBox: {
      backgroundColor: theme.palette.primary.background,
      borderRadius: 8,
      boxShadow: '0 0.5rem 4rem 0.5rem rgba(0,0,0,0.08)',
    },
    gridItemBoxInner: {
      padding: 80,
    },
    divider: {
        display: 'flex',
        color: '#5c5c5c',
        fontSize: 15,
    },
    dividerLine: {
        margin: 'auto',
        content: "",
        borderTop: '10px solid #000000',
        // flex: 1,
        width: 40,
        transform: 'translateY(50%)',
    },
});

function mapStateToProps(state) {
    return {};
}

function mapDispatchToProps(dispatch) {
    return {
        actions: {},
    };
}

@connect(mapStateToProps, mapDispatchToProps)
class XupplyDialogView extends Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {}

    componentDidUpdate(nextProps) {}

    shouldComponentUpdate(nextProps, nextState) {
        if (nextState === this.state) {
            return false;
        }
        return true;
    }

    render() {
        const { classes } = this.props;
        const {} = this.state;

        const SignupContainer = (
          <div className={classes.rightContent}>
              <div className={classes.gridItem}>
                  <div className={classes.gridItemBox}>
                      <div className={classes.gridItemBoxInner}>
                          <div style={{ margin: 'auto', textAlign: 'center' }}>
                              <a href="https://caslnpo.org"><img alt="ae_logo" height="40px" width="auto" src="/src/containers/App/styles/img/logo-named.png" /></a>
                          </div>
                          <div style={{ paddingTop: 60 }}>
                              <h4 style={{ fontWeight: 300, fontSize: 20, textAlign: 'center', paddingBottom: 15 }}>{'Please sign in with your Google Account'}</h4>
                              <div className={classes.divider} >
                                  <div className={classes.dividerLine} />
                              </div>
                          </div>
                          <div style={{ margin: 'auto', textAlign: 'center', paddingTop: 40 }}>
                              <a onClick={e => this.isDisabled(e)} href="https://caslnpo.org"><img alt="google_signup" height="48px" width="300px" src="/src/containers/App/styles/img/google.png" /></a>
                          </div>
                          <div style={{ margin: 'auto', textAlign: 'center', paddingTop: 10 }}>
                              <a onClick={e => this.isDisabled(e)} href="https://caslnpo.org"><img alt="google_signup" height="48px" width="300px" src="/src/containers/App/styles/img/email.png" /></a>
                          </div>
                          <div style={{ margin: 'auto', width: '50%' }}>
                              <p style={{ fontSize: 14, textAlign: 'center', paddingTop: 20 }}>By creating an account, you confirm that you accept the<a style={{color: 'blue'}} href=""> terms and conditions.</a></p>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
        );

        return (
            <div className={classes.root}>
                <div style={{paddingTop: 66}}>
                    {SignupContainer}
                </div>
            </div>
        );
    }
}

XupplyDialogView.defaultProps = {};

XupplyDialogView.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(XupplyDialogView);
