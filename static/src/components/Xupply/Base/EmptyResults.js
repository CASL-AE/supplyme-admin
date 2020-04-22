/* eslint camelcase: 0, no-underscore-dangle: 0 */
import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';

import { isMobileAndTablet } from '../../../utils/isMobileAndTablet';

const styles = (theme) => ({
    root: {
        flexGrow: 1,
        padding: isMobileAndTablet() ? 0 : 12,
    },
    content: {
        flexBasis: 0,
        flexGrow: 2,
        width: 400,
    },
    header: {
        marginTop: 40,
        marginBottom: 40,
        display: 'flex',
        flex: '1',
        flexDirection: 'column',
        justifyContent: 'center',
    },
    headerLabel: {
        fontWeight: 500,
        fontSize: 28,
    },
    titleLabel: {
        marginTop: 15,
        fontWeight: 300,
        fontSize: 16,
    },
    getCovidStarted: {
        height: 40,
        borderRadius: 10,
        borderColor: 'red',
        textTransform: 'none',
        fontSize: 14,
        backgroundColor: theme.palette.primary.appBar,
        color: 'red'
    },
    learnRoot: {
        flexGrow: 1,
        padding: 0,
    },
    learnContent: {
        flexBasis: 0,
        flexGrow: 2,
        paddingBottom: 28,
        borderBottomWidth: 1,
        borderBottomStyle: 'solid',
        borderBottomColor: '#d6d6d6',
    },
    learnHeader: {
        marginTop: 40,
        marginBottom: 40,
        display: 'flex',
        flex: '1',
        flexDirection: 'column',
        justifyContent: 'center',
    },
    learnLabel: {
        fontWeight: 500,
        fontSize: 18,
    },
    listRoot: {
      width: '100%',
      backgroundColor: theme.palette.background.paper,
      borderRadius: 8,
    },
    inline: {
        display: 'inline',
    },
    listItem: {
        padding: 20,
    },
    listButton: {
        cursor: 'pointer',
        color: theme.palette.primary.secondary,
    }
});

function EmptyResults(props) {
    const {classes, header, title, emptyType, handleLink} = props;
    return (
    <Grid container justify="center" className={classes.root} spacing={2}>
        <Grid item xs={isMobileAndTablet() ? 12 : 10}>
            <div className={classes.content}>
                <div className={classes.header}>
                    <div className={classes.headerLabel}>{header}</div>
                    <div className={classes.titleLabel}>{title}</div>
                </div>
                <Button
                    className={classes.getCovidStarted}
                    variant="outlined"
                    onClick={e => handleLink(e, emptyType)}
                >
                    {'COVID19 Quick start'}
                </Button>
            </div>
        </Grid>
        <Grid item xs={isMobileAndTablet() ? 12 : 10}>
            <div className={classes.learnContent}>
                <div className={classes.learnHeader}>
                    <div className={classes.learnLabel}>Learn More</div>
                </div>
                <Grid container justify="center" className={classes.learnRoot} spacing={3}>
                    <Grid item xs={4}>
                        <Paper style={{borderRadius: 8, height: 348, backgroundColor: '#fff'}}>
                        <List className={classes.listRoot}>
                            <ListItem className={classes.listItem} alignItems="flex-start">
                              <ListItemAvatar>
                                <Avatar alt={emptyType} src="/src/containers/App/styles/img/xrp/button.png" />
                              </ListItemAvatar>
                              <ListItemText
                                primary={'How do I get started?'}
                                secondary={
                                  <React.Fragment>
                                    <div className={classes.listButton} onClick={e => e}>{'View the docs'}</div>
                                  </React.Fragment>
                                }
                              />
                            </ListItem>
                            <Divider variant="inset" component="li" />
                            <ListItem className={classes.listItem} alignItems="flex-start">
                              <ListItemAvatar>
                                <Avatar alt={emptyType} src="/src/containers/App/styles/img/xrp/button.png" />
                              </ListItemAvatar>
                              <ListItemText
                                primary={`How do ${emptyType} work?`}
                                secondary={
                                  <React.Fragment>
                                    <div className={classes.listButton} onClick={e => e}>{'Learn More'}</div>
                                  </React.Fragment>
                                }
                              />
                            </ListItem>
                            <Divider variant="inset" component="li" />
                            <ListItem className={classes.listItem} alignItems="flex-start">
                              <ListItemAvatar>
                                <Avatar alt={emptyType} src="/src/containers/App/styles/img/xrp/button.png" />
                              </ListItemAvatar>
                              <ListItemText
                                primary={`What can ${emptyType} do for me?`}
                                secondary={
                                  <React.Fragment>
                                    <div className={classes.listButton} onClick={e => e}>{'Learn More'}</div>
                                  </React.Fragment>
                                }
                              />
                            </ListItem>
                          </List>
                        </Paper>
                    </Grid>
                    <Grid item xs={8}>
                        <Paper style={{borderRadius: 8, backgroundColor: '#fff'}}>
                            <iframe style={{borderRadius: 8}} width="616" height="348" src="https://www.youtube.com/embed/jsRVHeQd5kU" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                        </Paper>
                    </Grid>
                </Grid>
            </div>
        </Grid>
    </Grid>
    );
}

EmptyResults.defaultProps = {
    startedLink: f => f,
    hiwLink: f => f,
    whatLink: f => f,
};

EmptyResults.propTypes = {
    header: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    emptyType: PropTypes.string.isRequired,
    handleLink: PropTypes.func.isRequired,
    startedLink: PropTypes.func.isRequired,
    hiwLink: PropTypes.func.isRequired,
    whatLink: PropTypes.func.isRequired,
};

export default withStyles(styles)(EmptyResults);
