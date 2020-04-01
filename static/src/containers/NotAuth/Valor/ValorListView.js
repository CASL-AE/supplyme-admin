/* eslint camelcase: 0, no-underscore-dangle: 0 */
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';

import { filterBy, dispatchNewRoute } from '../../../utils/misc';

import { fetchValors } from '../../../services/valor/actions';

const styles = {
    root: {
      flex: 1,
      height: '100vh',
      backgroundColor: '#e8e8e8',
      fontFamily: "Times New Roman",
    },
    header: {
        fontSize: 62,
        fontWeight: 800,
        paddingTop: 40,
    },
    headerImg: {
        padding: 20,
    },
    headerBox: {
        zIndex: 100,
        margin: 'auto',
        paddingTop: 40,
        textAlign: 'center',
        color: '#000'
    },
    middleBox: {
        maxWidth: 400,
        zIndex: 100,
        margin: 'auto',
        paddingTop: 20,
        textAlign: 'center',
        color: '#000'
    },
    bold: {
        fontWeight: 600,
    },
    quote: {
        fontSize: 16,
    },
    tributeBox: {
      paddingTop: 30,
      width: '80%',
      margin: 'auto',
      overflowX: 'auto',
    },
    tribute: {
      display: 'inline-flex',
      justifyContent: 'space-between',
    },
    tributeChild: {
      textAlign: 'center',
      padding: 10
    },
    img: {
        borderRadius: '50%',
        height: 40,
        margin: 'auto',
        width: 'auto',
    },
    name: {
        fontSize: 14,
        fontWeight: 500,
        color: '#000'
    },
    link: {
        fontSize: 14,
        fontWeight: 600,
        color: '#1835ff',
        cursor: 'pointer'
    }
};

function mapStateToProps(state) {
    return {
        valors: state.valorData.valors,
        receivedAt: state.valorData.receivedAt,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: {
            fetchValors: bindActionCreators(fetchValors, dispatch),
        },
    };
}

@connect(mapStateToProps, mapDispatchToProps)
class WallOfValor extends React.Component { // eslint-disable-line react/prefer-stateless-function

    constructor(props) {
        super(props);
        this.state = {
            rows: [],
        };
    }

    componentDidMount() {
        console.log('Valors View Mounted');
        const { receivedAt, valors } = this.props;
        if (!receivedAt) {
            this.loadCompData();
        } else {
            this.receiveValors(valors);
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.receivedAt && !this.props.receivedAt) {
            this.receiveValors(nextProps.valors);
        }
    }

    receiveValors = (valors) => {
        console.warn('Received Valors');
        const rows = filterBy(valors).map(v => v);
        this.setState({
            rows,
        });
    }

    loadCompData = () => {
        const { actions } = this.props;
        actions.fetchValors();
    }

    renderValor = (valor) => {
        const { classes } = this.props;
        return (
            <div key={valor.valorID} className={classes.tribute}>
                <div className={classes.tributeChild}>
                    <img className={classes.img} src={valor.avatar || "/src/containers/App/styles/img/temp_anon.jpg"} alt="valorImage" />
                    <div className={classes.name}>{valor.name}</div>
                </div>
            </div>
        )
    }

    render() {
        const { classes } = this.props;
        const { rows } = this.state;
        return (
            <div className={classes.root}>
                <div className={classes.headerBox}>
                  <span className={classes.header}>THE WALL</span><img className={classes.headerImg} alt="ae_logo" height="200px" width="200px" src="/src/containers/App/styles/img/aelogo.png" /><span className={classes.header}>OF VALOR</span>
                  <div className={classes.middleBox}>
                      <h3 className={classes.bold}>COVID-19 Lives Claimed: 12354</h3>
                      <div className={classes.quote}>
                          {'IN HONOR OF THOSE WHO LOST THEIR LIVES DURING THE 2020 GLOBAL PANDEMIC'}
                      </div>
                      <div onClick={e => dispatchNewRoute('valor/create')} className={classes.link}>
                          {'Want To Add Someone Special?'}
                      </div>
                  </div>
                </div>
                <div className={classes.tributeBox}>
                    {rows.map(this.renderValor, this)}
                </div>
            </div>
        );
    }
}

WallOfValor.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(WallOfValor);
