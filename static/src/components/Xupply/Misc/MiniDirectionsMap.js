import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, useTheme } from '@material-ui/core/styles';

import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import LocalHospitalIcon from '@material-ui/icons/LocalHospital';

import { withScriptjs, withGoogleMap, GoogleMap, Marker, DirectionsRenderer } from "react-google-maps";

import TablePaginationActions from '../../TablePaginationActions';

import {
  formatDateWTime,
  formatAddress,
  formatDateNoTime
} from '../../../utils/misc';
import {
  formatRequestStatus
} from '../../../utils/events';

const styles = (theme) => ({
  root: {
    width: '100%',
    marginTop: 40,
    overflowX: 'auto',
    boxShadow: 'none',
  },
  table: {
    minWidth: 650,
    overflow: 'hidden',
  },
  tableHeaders: {
    fontSize: 12,
    fontWeight: 500,
    borderBottom: '1px solid #d6d6d6',
    borderLeft: 0,
    verticalAlign: 'bottom',
    color: theme.palette.primary.black,
  },
  linkText: {
    color: '#2A38D8',
    fontWeight: 500,
    cursor: 'pointer',
    textAlign: 'left',
  },
  cancelIcon: {
    color: '#e02626',
    margin: 0,
    padding: 0,
  },
  checkIcon: {
    color: '#37e026',
    margin: 0,
    padding: 0,
  },
  mapStyles: {
    width: '100%',
    height: '100%',
  },
});

const MiniDirectionsMap = withScriptjs(withGoogleMap((props) => {
  const { classes, directions, centerCoord } = props;
  var myOptions = {
     mapTypeControl: false,
     draggable: false,
     scaleControl: false,
     scrollwheel: false,
     navigationControl: false,
     streetViewControl: false,
     disableDefaultUI: true,
     mapTypeId: google.maps.MapTypeId.ROADMAP,
     center: centerCoord
  };
  console.log(directions)
  return (
    <Paper className={classes.root}>
        <GoogleMap
            defaultZoom={6}
            defaultOptions={myOptions}
        >
            {directions && <DirectionsRenderer directions={directions} />}
        </GoogleMap>
    </Paper>
  );
}));

MiniDirectionsMap.propTypes = {
  googleMapURL: PropTypes.string.isRequired,
  loadingElement: PropTypes.object.isRequired,
  containerElement: PropTypes.object.isRequired,
  mapElement: PropTypes.object.isRequired,
  directions: PropTypes.object.isRequired,
  centerCoord: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(MiniDirectionsMap);
