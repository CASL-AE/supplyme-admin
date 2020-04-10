/* eslint camelcase: 0, no-underscore-dangle: 0 */
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

// import { getMenuItem } from '../../../services/menuItem/actions';
import { toNewMenuItem } from '../../../services/menuItem/model';
import { getKeys, formatDateWTime, dispatchNewObject } from '../../../utils/misc';

const styles = (theme) => ({
    root: {
        flex: 1,
        height: '100vh'
    },
    display: {
        display: 'flex',
    },
    leftDetail: {
      flexBasis: 0,
      flexGrow: 1,
      marginRight: 30,
    },
    detailCard: {
      padding: '2.0rem',
      boxShadow: '0 8px 64px rgba(32, 32, 32, 0.08), 0 4px 16px rgba(32, 32, 32, 0.02)',
      backgroundColor: theme.palette.primary.appBar,
      borderRadius: 8,
    },
    detailTop: {
      marginBottom: 30,
      display: 'flex',
      alignItems: 'center',
      fontWeight: 500,
      color: '#202020',
    },
    detailTitle: {
        marginBottom: 30,
    },
    detailTitleText: {
      color: 'black',
      fontSize: 24,
      fontWeight: 600,
      lineHeight: 1.36,
      margin: 0,
    },
    detailActions: {
        display: 'flex',
    },
    button: {
        marginRight: 10,
        textTransform: 'none',
    },
    deleteButton: {
        backgroundColor: '#e02626',
        textTransform: 'none',
    },
    rightDetail: {
      flexGrow: 2,
      flexBasis: 0,
    },
    block: {
        marginBottom: 40,
    },
    section: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingBottom: 15,
      margin: 0,
    },
    detailList: {
      blocationTop: '1px solid #e6e6e6',
      display: 'block',
      backgroundColor: theme.palette.primary.appBar,
      borderRadius: 8,
      padding: 30,
    },
    editButton: {
        float: 'right',
        textTransform: 'none',
    },
    detailListDt: {
      minWidth: '30%',
      borderm: 0,
      padding: '.5rem 0',
      margin: 0,
    },
    detailListDd: {
      minWidth: '70%',
      borderm: 0,
      fontWeight: 500,
      padding: '.5rem 0',
      margin: 0,
    },
    detailListFlex: {
        display: 'flex',
    },
    img: {
        borderRadius: '50%',
        marginRight: 10,
    }
});

function mapStateToProps(state) {
    return {
        pathname: state.router.location.pathname,
        employeeID: state.app.employeeID,
        accountID: state.app.accountID,
        menuItems: state.menuItemData.menuItems,
        receivedAt: state.menuItemData.receivedAt,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: {
            // getMenuItem: bindActionCreators(getMenuItem, dispatch)
        },
    };
}

@connect(mapStateToProps, mapDispatchToProps)
class MenuItemDetailView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            menuItem: toNewMenuItem()
        };
    }

    componentDidMount() {
      console.log('MenuItem Detail Mounted')
      this.loadCompData();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.receivedAt !== null && this.props.receivedAt === null) {
            this.loadCompData(nextProps);
        }
    }

    componentWillUnmount() {
      console.log('MenuItem Detail UnMounted')
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextState === this.state) {
            return false;
        }
        return true;
    }

    loadCompData = () => {
        const { actions, accountID, menuItems, pathname } = this.props;
        const keys = getKeys(pathname);
        const itemID = keys.second;
        if (itemID && itemID !== null) {
            menuItems.forEach((menuItem) => {
                if (menuItem.itemID === itemID) {
                    this.setState({menuItem});
                }
            })
        }
    }

    renderItemQuantites = (quantity, index) => {
        const { classes } = this.props;
        console.log(quantity)
        return (
            <div className={classes.block}>
                <div className={classes.section}>
                    <span className={classes.detailTitleText}>{`$ ${quantity.pricePerUnit} - ${quantity.packageQuantity} / ${quantity.packageType}`}</span>
                </div>
                <dl className={classes.detailList}>
                    <div key={index} className={classes.detailListFlex}>
                        <dt className={classes.detailListDt}>
                            {'Stock'}
                        </dt>
                        <dd className={classes.detailListDd}>
                            {quantity.stock}
                        </dd>
                    </div>
                    <div key={index} className={classes.detailListFlex}>
                        <dt className={classes.detailListDt}>
                            {'Location'}
                        </dt>
                        <dd className={classes.detailListDd}>
                            {quantity.location.name}
                        </dd>
                    </div>
                </dl>
            </div>
        );
    }

    render() {
        const { classes, accountID } = this.props;
        const { menuItem } = this.state;
        console.log(menuItem)
        return (
          <div className={classes.root}>
              <div className={classes.display}>
                  <div className={classes.leftDetail}>
                      <div className={classes.detailCard}>
                          <div className={classes.detailTop}>
                            <img height='200' width='200' className={classes.img} src='/src/containers/App/styles/img/broken.png' />
                          </div>
                          <div className={classes.detailTitle}>
                            <span className={classes.detailTitleText}>{`${menuItem.brandName} - ${menuItem.itemName}`}</span>
                            <br />
                            <span>{`${menuItem.description}`}</span>
                            <br />
                            <span>{`${menuItem.itemType}`}</span>
                          </div>
                      </div>
                  </div>
                  <div className={classes.rightDetail}>
                      <div className={classes.block}>
                          <div className={classes.section}>
                              <span className={classes.detailTitleText}>Details</span>
                              <Button
                                variant="contained"
                                disableRipple
                                disableFocusRipple
                                onClick={(e) => dispatchNewObject(e, accountID, 'menuItem', menuItem.itemID, 'edit')}
                                className={classes.editButton}
                              >
                                  {'Edit'}
                              </Button>
                          </div>
                          <dl className={classes.detailList}>
                              <div className={classes.detailListFlex}>
                              <dt className={classes.detailListDt}>
                                  ID
                              </dt>
                              <dd className={classes.detailListDd}>
                                  {menuItem.itemID}
                              </dd>
                              </div>
                              <div className={classes.detailListFlex}>
                              <dt className={classes.detailListDt}>
                                  Created
                              </dt>
                              <dd className={classes.detailListDd}>
                                  {`${formatDateWTime(menuItem.createdDate)}`}
                              </dd>
                              </div>
                              <div className={classes.detailListFlex}>
                              <dt className={classes.detailListDt}>
                                  UPC ID
                              </dt>
                              <dd className={classes.detailListDd}>
                                  {menuItem.upcID}
                              </dd>
                              </div>
                              <div className={classes.detailListFlex}>
                              <dt className={classes.detailListDt}>
                                  Made In Country
                              </dt>
                              <dd className={classes.detailListDd}>
                                  {menuItem.madeInCountry}
                              </dd>
                              </div>
                          </dl>
                      </div>
                      {menuItem.quantities.map(this.renderItemQuantites, this)}
                  </div>
              </div>
          </div>
        );
    }
}

MenuItemDetailView.defaultProps = {
    router: PropTypes.object,
};

MenuItemDetailView.propTypes = {
    router: PropTypes.object,
};

export default withStyles(styles)(MenuItemDetailView);
