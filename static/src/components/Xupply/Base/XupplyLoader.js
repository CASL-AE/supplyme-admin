
import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

const styles = (theme) => ({
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

function XupplyLoader(props) {
  const { classes, open } = props;
  if (open) {
    return (
      <div style={{ top: '50%', left: '50%', position: 'fixed', textAlign: 'center', paddingTop: 20 }}>
          <CircularProgress style={{marginBottom: 15}} color="inherit" />
          <h4 style={{ fontWeight: 300, fontSize: 20, paddingBottom: 15 }}>{'Loading...'}</h4>
          <div className={classes.divider} >
              <div className={classes.dividerLine} />
          </div>
      </div>
    );
  }
  return null;
}

XupplyLoader.propTypes = {
  open: PropTypes.bool.isRequired,
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(XupplyLoader);
