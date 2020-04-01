
import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

import { withStyles } from '@material-ui/core/styles';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

const styles = (theme) => ({
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: theme.palette.primary.main,
    },
});

function Loader(props) {
  const { classes, open } = props;
  return (
      <Backdrop className={classes.backdrop} open={!open}>
            <CircularProgress color="inherit" />
      </Backdrop>
  );
}

Loader.propTypes = {
  open: PropTypes.bool.isRequired,
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(Loader);
