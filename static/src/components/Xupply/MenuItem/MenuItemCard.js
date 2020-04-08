import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import MoreVertIcon from '@material-ui/icons/MoreVert';

import MiniDetailMap from '../../../components/Xupply/Misc/MiniDetailMap';

import {
  formatDateNoTime
} from '../../../utils/misc';
import { isMobileAndTablet } from '../../../utils/isMobileAndTablet';

const styles = (theme) => ({
  root: {
    maxWidth: isMobileAndTablet() ? '100%' : 345,
    backgroundColor: theme.palette.primary.background,
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    backgroundColor: red[500],
  },
});

function MenuItemCard(props) {
  const { classes, row } = props;
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  console.log(row)

  return (
    <Card className={classes.root}>
      <CardHeader
        title={row.itemName}
        subheader={row.brandName}
      />
      <img src={row.thumbnail ? row.thumbnail : '/src/containers/App/styles/img/broken.png'} style={{height: 200, width: 'auto'}} />
      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p">
          {'Requested: '}
        </Typography>
        <Typography style={{fontWeight: 600}} variant="body2" color="textSecondary" component="p">
          {row.items}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <span style={{fontSize: 12, color: 'gray', padding: 12}}>{`Created: ${formatDateNoTime(row.isStatusTime)}`}</span>
        <IconButton className={classes.expand} aria-label="delete">
          <DeleteForeverIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
}

MenuItemCard.propTypes = {
  row: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(MenuItemCard);
