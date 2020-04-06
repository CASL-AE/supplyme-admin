import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import lightBlue from '@material-ui/core/colors/blue';

import MomentUtils from '@date-io/moment';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';

import './styles/app.scss';

const theme = createMuiTheme({
    // shadows: ["none"],
    typography: {
        fontSize: 14,
    },
    palette: {
        primary: {
            main: '#79bac1',
            secondary: '#82a4bc',
            background: '#eeeeee',
            appBar: '#eeebe9',
            black: '#000000',
        }
    },
});

class App extends React.PureComponent {
    render() {
        const { children } = this.props;
        return (
            <MuiThemeProvider theme={theme}>
                <section style={{margin: 0, padding: 0}}>
                    <MuiPickersUtilsProvider utils={MomentUtils}>
                        {children}
                    </MuiPickersUtilsProvider>
                </section>
            </MuiThemeProvider>
        );
    }
}

App.propTypes = {
    children: PropTypes.node,
};

export default App;
