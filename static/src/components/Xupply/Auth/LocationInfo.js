import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';

import AutoCompletePlaces from '../AutoCompletes/AutoCompletePlaces';

import { isMobileAndTablet } from '../../../utils/isMobileAndTablet';

const styles = (theme) => ({
    gridItemBoxInner: {
        padding: 30,
    },
});

function LocationInfo(props) {
  const {
      classes,
      location,
      locationName_error_text,
      street1_error_text,
      locality_error_text,
      region_error_text,
      postal_error_text,
      handleLocationChange,
      handleLocationSelected,
  } = props;
  return (
    <section>
    <div>
        <TextField
            placeholder="Location Name"
            label="Location Name"
            variant="outlined"
            margin="dense"
            helperText={locationName_error_text}
            value={location.name || ''}
            style={{width: '100%'}}
            onChange={e => handleLocationChange(e, null, 'name')}
            FormHelperTextProps={{ classes: { root: classes.helperText } }}
        />
        <AutoCompletePlaces name={location.name} onFinishedSelecting={handleLocationSelected}/>
        <TextField
            placeholder="Street Address"
            label="Street Address"
            variant="outlined"
            margin="dense"
            helperText={street1_error_text}
            value={location.address.street1 || ''}
            style={{paddingRight: 20, width: '67%'}}
            onChange={e => handleLocationChange(e, 'address', 'street1')}
            FormHelperTextProps={{ classes: { root: classes.helperText } }}
        />
        <TextField
            placeholder="Address 2"
            label="Address 2"
            variant="outlined"
            margin="dense"
            value={location.address.street2 || ''}
            style={{width: '33%'}}
            onChange={e => handleLocationChange(e, 'address', 'street2')}
        />
    </div>
    <div style={{paddingTop: 10}}>
        <TextField
            placeholder="Locality"
            label="Locality"
            variant="outlined"
            margin="dense"
            type="text"
            helperText={locality_error_text}
            value={location.address.locality || ''}
            style={{paddingRight: 20, width: '33%'}}
            onChange={e => handleLocationChange(e, 'address', 'locality')}
            FormHelperTextProps={{ classes: { root: classes.helperText } }}
        />
        <TextField
            placeholder="Region"
            label="Region"
            variant="outlined"
            margin="dense"
            type="text"
            helperText={region_error_text}
            value={location.address.region || ''}
            style={{paddingRight: 20, width: '33%'}}
            onChange={e => handleLocationChange(e, 'address', 'region')}
            FormHelperTextProps={{ classes: { root: classes.helperText } }}
        />
        <TextField
            placeholder="Zip Code"
            label="Zip Code"
            variant="outlined"
            margin="dense"
            type="number"
            helperText={postal_error_text}
            value={location.address.postal || ''}
            style={{float: 'right', width: '33%'}}
            onChange={e => handleLocationChange(e, 'address', 'postal')}
            FormHelperTextProps={{ classes: { root: classes.helperText } }}
        />
    </div>
    </section>
  );
}


LocationInfo.propTypes = {
    location: PropTypes.object.isRequired,
    locationName_error_text: PropTypes.string.isRequired,
    street1_error_text: PropTypes.string.isRequired,
    locality_error_text: PropTypes.string.isRequired,
    region_error_text: PropTypes.string.isRequired,
    postal_error_text: PropTypes.string.isRequired,
    handleLocationChange: PropTypes.func.isRequired,
    handleLocationSelected: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(LocationInfo);
