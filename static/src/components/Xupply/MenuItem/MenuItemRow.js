import React from "react";
import { connectHits } from 'react-instantsearch-dom';
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import Tooltip from "@material-ui/core/Tooltip";
import { styles } from "./PublicMenuItemResultsTable";

const ImageTooltip = withStyles((theme) => ({
    tooltip: {
        backgroundColor: "#f5f5f9",
        color: "rgba(0, 0, 0, 0.87)",
        maxWidth: 220,
        fontSize: theme.typography.pxToRem(12),
        border: "1px solid #dadde9",
    },
}))(Tooltip);

const LocationTooltip = withStyles((theme) => ({
    tooltip: {
        backgroundColor: "#f5f5f9",
        color: "rgba(0, 0, 0, 0.87)",
        maxWidth: 220,
        fontSize: theme.typography.pxToRem(12),
        border: "1px solid #dadde9",
    },
}))(Tooltip);

const HitComponent = (props) => {
    const { classes, hit } = props;
    return (
        <TableRow key={hit.itemID}>
            <TableCell>
                <ImageTooltip
                    title={
                        <React.Fragment>
                            <img
                                src={
                                    hit.thumbItemImageURL
                                        ? hit.thumbItemImageURL
                                        : "/src/containers/App/styles/img/broken.png"
                                }
                                style={{ height: 50, width: 50 }}
                            />
                        </React.Fragment>
                    }
                >
                    <a
                        onClick={(e) => handleLink(e, hit.itemID)}
                        className={classes.linkText}
                    >
                        {hit.itemName}
                    </a>
                </ImageTooltip>
            </TableCell>
            <TableCell>
                <LocationTooltip
                    title={
                        <React.Fragment>
                            <em>
                                {`${hit.quantities[0].location.address.locality}, ${hit.quantities[0].location.address.region}`}
                            </em>
                        </React.Fragment>
                    }
                >
                    <span
                        className={classes.linkText}
                    >{`${hit.quantities[0].packageQuantity} / ${hit.quantities[0].packageType}`}</span>
                </LocationTooltip>
            </TableCell>
            <TableCell>{"$ 30.00"}</TableCell>
            <TableCell>{hit.brandName}</TableCell>
            <TableCell>{hit.upcID || "None"}</TableCell>
            <TableCell style={{ textAlign: "center" }}>
                <div className={classes.textCell}>
                    <TextField
                        placeholder="Ex. 10"
                        label="Quantity"
                        margin="dense"
                        variant="outlined"
                        type="number"
                        // helperText={'cbdContent_error_text'}
                        // value={menuItemQuaa.stock || ''}
                        className={classes.textField}
                        onChange={(e) => handleChange(e, "quantity")}
                        // FormHelperTextProps={{ classes: { root: classes.helperText } }}
                        autoComplete=""
                    />
                </div>
                <div
                    onClick={(e) => handleAction(e, menuItem)}
                    style={{
                        fontWeight: 600,
                        color: "blue",
                        cursor: "pointer",
                    }}
                >
                    Add To Cart
                </div>
            </TableCell>
        </TableRow>
    );
};

HitComponent.propTypes = {
    props: PropTypes.shape().isRequired,
}

const Hits = ({ hits }) => {
    const Hit = withStyles(styles)(HitComponent);
    return (
        <>
        {
          hits.map(hit => (
            <Hit {...{hit}} />
          ))
        }
        </>
      )
}

Hits.propTypes = {
    hits: PropTypes.arrayOf().isRequired
}

export default connectHits(Hits);