import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, useTheme } from '@material-ui/core/styles';

import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import LocalHospitalIcon from '@material-ui/icons/LocalHospital';

import { withScriptjs, withGoogleMap, GoogleMap, Marker, InfoWindow } from "react-google-maps";
import { MarkerClusterer } from "react-google-maps/lib/components/addons/MarkerClusterer";

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

const PublicRequestMap = withScriptjs(withGoogleMap((props) => {
  const { classes, isMarkerShown, markers, currentCoords, isOpen, onToggleOpen, onMarkerClustererClick } = props;
  console.log(markers)
  return (
    <Paper className={classes.root}>
        <GoogleMap
            defaultZoom={8}
            defaultCenter={currentCoords}
        >
            {
              <MarkerClusterer
                onClick={onMarkerClustererClick}
                averageCenter
                enableRetinaIcons
                gridSize={60}
              >
              {markers.map(marker => (
                <Marker
                  key={marker.id}
                  position={marker.location}
                  // icon={markers.img}
                  onClick={onToggleOpen}
                >
                {
                  isOpen &&
                  <InfoWindow
                      onCloseClick={onToggleOpen}
                  >
                    <div>
                        <h1>
                            {marker.priority}
                        </h1>
                        <p>
                            <b>Requested: </b>{formatDateNoTime(marker.requiredBy)}
                            <br />
                            <b>Budget: </b>{marker.budget}
                            <br />
                            <b>Items: </b>{marker.items}
                        </p>
                    </div>
                  </InfoWindow>
                }
                </Marker>
              ))}
              </MarkerClusterer>
            }
        </GoogleMap>
    </Paper>
  );
}));

PublicRequestMap.propTypes = {
  isMarkerShown: PropTypes.bool.isRequired,
  googleMapURL: PropTypes.string.isRequired,
  loadingElement: PropTypes.object.isRequired,
  containerElement: PropTypes.object.isRequired,
  mapElement: PropTypes.object.isRequired,
  markers: PropTypes.array.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onToggleOpen: PropTypes.func.isRequired,
  onMarkerClustererClick: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(PublicRequestMap);
