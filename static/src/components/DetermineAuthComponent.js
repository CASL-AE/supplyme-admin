/* eslint camelcase: 0, no-underscore-dangle: 0 */
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';

import Loader from '../components/Xupply/Base/Loader';

import { loginEmployeeWithPermissions, logoutAndRedirect } from '../services/app/actions';
import { auth } from '../store/firebase';

function mapStateToProps(state) {
    return {
        isAuthenticated: state.app.isAuthenticated,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: {
            loginEmployeeWithPermissions: bindActionCreators(loginEmployeeWithPermissions, dispatch),
            logoutAndRedirect: bindActionCreators(logoutAndRedirect, dispatch),
        },
    };
}

export function determineAuth(Component) {

    @connect(mapStateToProps)
    class DetermineAuthComponent extends React.Component {

        constructor(props) {
            super(props);
            this.state = {
                isLoaded: false,
            };
        }

        componentWillMount() {
            this.checkAuth();
        }

        componentWillReceiveProps(nextProps) {}

        checkAuth(props = this.props) {
            const { isAuthenticated } = props;
            if (!isAuthenticated) {
                console.log('A1');
                const storageToken = localStorage.getItem('idToken');
                if (!storageToken) {
                    console.log('A2');
                    this.setState({
                        isLoaded: true,
                    });
                } else {
                    console.log('A3');
                    auth().onAuthStateChanged((user) => {
                        if (user) {
                            props.actions.loginEmployeeWithPermissions(user.uid);
                        } else {
                            props.actions.logoutAndRedirect();
                        }
                    });
                }
            } else {
                console.log('A4');
                this.setState({
                    isLoaded: true,
                });
            }
        }

        render() {
            return (
                <div>
                    {this.state.isLoaded
                        ? (
                          <Component {...this.props} />
                        )
                        : <Loader/>
                    }
                </div>
            );
        }
    }

    DetermineAuthComponent.defaultProps = {
        isAuthenticated: false,
        loginEmployeeWithPermissions: f => f,
        logoutAndRedirect: f => f,
    };

    DetermineAuthComponent.propTypes = {
        isAuthenticated: PropTypes.bool,
        loginEmployeeWithPermissions: PropTypes.func,
        logoutAndRedirect: PropTypes.func,
    };

    return connect(mapStateToProps, mapDispatchToProps)(DetermineAuthComponent);
}
