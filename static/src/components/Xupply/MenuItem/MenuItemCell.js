import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Badge from '@material-ui/core/Badge';

const styles = (theme) => ({
    badgeStyle: {
        float: 'left',
        paddingLeft: 10,
    },
    nameStyle: {
        float: 'left',
        paddingLeft: 10,
        marginBottom: 5,
        marginTop: 10,
        width: '100%',
    },
});

const boxStyle = {
  backgroundColor: 'white',
  height: '88px',
  minWidth: '100px',
  overflow: 'visible',
  display: 'inline-flex',
  float: 'left',
  margin: 20,
}
const imageStyle = {
  height: 70,
  width: 70,
  marginTop: 10,
  paddingLeft: 10,
}
const headerStyle = {
  fontSize: 22,
  fontFamily: 'Poppins-BoldItalic',
}
const textStyle = {
  fontSize: 22,
  fontFamily: 'Poppins-BoldItalic',
  marginBottom: -8,
}
const smallTextStyle = {
  fontSize: 12,
  paddingTop: 3,
  color: '#d2d2d2',
  textAlign: 'center',
  fontFamily: 'Poppins-BoldItalic',
}
function selectBackgroundOpacity(isActive, canDrop) {
  if (isActive) {
    return 0.9
  } else if (canDrop) {
    return 0.2
  } else {
    return 0.4
  }
}

function changeFontSize(value) {
  var fontSize = 700/value.length;
  if (fontSize > 24) {
    return 24;
  }
  return fontSize;
}

const MenuItemCell = ({ itemID, itemName, itemImage, classes }) => {
  return (
    <div style={{ ...boxStyle }}>
      <img src={itemImage ? itemImage : '/src/containers/App/styles/img/broken.png'} style={{...imageStyle}} />
    </div>
  )
}

MenuItemCell.propTypes = {
    classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(MenuItemCell);
