/* eslint camelcase: 0, no-underscore-dangle: 0 */
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import IconButton from '@material-ui/core/IconButton';
import Switch from '@material-ui/core/Switch';
import Button from '@material-ui/core/Button';
import { KeyboardDatePicker } from '@material-ui/pickers';

import UploadMedia from '../../../components/Xupply/Media/UploadMedia';

import { toNewValor } from '../../../services/valor/model';
import { saveNewValor } from '../../../services/valor/actions';
import {
  validateString,
  roundUp,
} from '../../../utils/misc';

const styles = (theme) => ({
    root: {
        color: '#000',
        flex: 1,
        backgroundColor: theme.palette.primary.background,
    },
    content: {
        paddingTop: 42,
        paddingBottom: 42,
        paddingLeft: 80,
        paddingRight: 80,
    },
    outerCell: {
        marginBottom: 40,
    },
    headerCell: {
        marginBottom: 40,
        display: 'block',
    },
    headers: {
        display: 'inline-block',
        fontWeight: 500,
        fontSize: 28,
        fontFamily: 'AvenirNext-DemiBold',
    },
    subHeaderCell: {
        marginBottom: 24,
        display: 'block',
    },
    subHeaders: {
        display: 'inline-block',
        fontWeight: 500,
        fontSize: 20,
        fontFamily: 'AvenirNext-DemiBold',
    },
    childHeaderCell: {
        marginTop: 16,
        marginBottom: 16,
    },
    childHeaders: {
        display: 'inline-block',
        fontWeight: 500,
        fontSize: 16,
        fontFamily: 'AvenirNext',
    },
    textField: {
        width: 250,
    },
    textCell: {
        marginBottom: 15,
    },
    inputLabel: {
        fontSize: 13,
        fontFamily: 'AvenirNext',
        paddingBottom: 5,
        display: 'inline-block',
    },
    helperText: {
        fontSize: 12,
        color: '#d22323',
    },
    createButton: {
        color: '#ffffff',
        backgroundColor: '#202020',
        textTransform: 'none',
    },
});

function mapStateToProps(state) {
    return {};
}

function mapDispatchToProps(dispatch) {
    return {
        actions: {
            saveNewValor: bindActionCreators(saveNewValor, dispatch),
        },
    };
}

@connect(mapStateToProps, mapDispatchToProps)
class ValorCreateView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            valor: toNewValor(),
            name_error_text: null,
            birth_error_text: null,
            death_error_text: null,
            notes_error_text: null
        };
    }

    componentDidMount() {
      console.log('Valor Create Mounted');
    }

    componentWillUnmount() {
      console.log('Valor Create UnMounted')
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextState === this.state) {
            return false;
        }
        return true;
    }

    handleText = (e, name) => {
        const { value } = e.target;
        const next_state = this.state;
        next_state.valor[name] = value;
        this.setState(next_state, () => {});
    }

    handleDateChange = (name) => (date) => {
        const next_state = this.state;
        next_state.valor[name] = date.toDate();
        this.setState(next_state, () => {});
    }

    isValorDisabled = () => {
        this.setState({
            disabled: true,
        });
        let name_is_valid = false;

        // Validate Valor First Name
        if (this.state.valor.name === null) {
            this.setState({
                name_error_text: null,
            });
        } else if (validateString(this.state.valor.name) && this.state.valor.name.length < 20){
            name_is_valid = true;
            this.setState({
                name_error_text: null,
            });
        } else {
            this.setState({
                name_error_text: `The valor first name must be < ${20} characters.`,
            });
        }

        console.warn(this.state.valor)
        console.warn(name_is_valid)

        if (
          name_is_valid
        ) {
            this.createNewValor();
        }
    }

    createNewValor = () => {
        const { actions } = this.props;
        const { valor } = this.state;
        actions.saveNewValor(valor, this.state.redirectRoute);
    }

    onFinishedMediaSelected = (file) => {
        const next_state = this.state;
        next_state.valor.imageData = file;
        this.setState(next_state, () => {});
    }

    render() {
        const { classes } = this.props;
        const {
            valor,
            name_error_text,
            birth_error_text,
            death_error_text,
            notes_error_text
        } = this.state;

        const NameContainer = (
            <div className={classes.outerCell}>
            <div className={classes.subHeaderCell}>
              <div className={classes.subHeaders}>
                  Diseased (Valor) Information
              </div>
            </div>
            <div className={classes.childHeaderCell}>
              <div className={classes.childHeaders}>
                  Enter the valor's name and other information.
              </div>
            </div>
            <label className={classes.inputLabel}>Full Name</label>
            <div className={classes.textCell}>
                <TextField
                  placeholder="Ex. John Doe"
                  margin="dense"
                  variant="outlined"
                  helperText={name_error_text}
                  value={valor.name || ''}
                  className={classes.textField}
                  onChange={e => this.handleText(e, 'name')}
                  FormHelperTextProps={{ classes: { root: classes.helperText } }}
                  autoComplete=""
                />
            </div>
            <label className={classes.inputLabel}>Avatar</label>
            <div className={classes.textCell}>
                <UploadMedia media={valor.avatar} onFinishedSelecting={this.onFinishedMediaSelected} />
            </div>
            </div>
        );

        const DeathContainer = (
            <div className={classes.outerCell}>
            <div className={classes.subHeaderCell}>
              <div className={classes.subHeaders}>
                  Birth & Death Information
              </div>
            </div>
            <div className={classes.childHeaderCell}>
              <div className={classes.childHeaders}>
                  Enter the valor's birthdate and death date.
              </div>
            </div>
            <label className={classes.inputLabel}>{'Birth Date'}</label>
            <div className={classes.textCell}>
                <KeyboardDatePicker
                    autoOk
                    value={valor.birthDate}
                    margin="normal"
                    variant="outline"
                    helperText={birth_error_text}
                    className={classes.pickerField}
                    onChange={this.handleDateChange('birthDate')}
                    format="MM/DD/YYYY"
                    id="date-picker-inline"
                />
            </div>
            <label className={classes.inputLabel}>{'Death Date'}</label>
            <div className={classes.textCell}>
                <KeyboardDatePicker
                    autoOk
                    value={valor.deathDate}
                    margin="normal"
                    variant="outline"
                    helperText={death_error_text}
                    className={classes.pickerField}
                    onChange={this.handleDateChange('deathDate')}
                    format="MM/DD/YYYY"
                    id="date-picker-inline"
                />
            </div>
            </div>
        );

        const NotesContainer = (
            <div className={classes.outerCell}>
            <div className={classes.subHeaderCell}>
              <div className={classes.subHeaders}>
                  Diseased (Valor) Obituary
              </div>
            </div>
            <div className={classes.childHeaderCell}>
              <div className={classes.childHeaders}>
                  Enter the valor's Obituary.
              </div>
            </div>
            <label className={classes.inputLabel}>Full Name</label>
            <div className={classes.textCell}>
                <TextField
                  placeholder="Ex. John Doe was a loving and caring father of 3 children."
                  rows={3}
                  multiline
                  margin="dense"
                  variant="outlined"
                  helperText={notes_error_text}
                  value={valor.notes || ''}
                  className={classes.textField}
                  onChange={e => this.handleText(e, 'notes')}
                  FormHelperTextProps={{ classes: { root: classes.helperText } }}
                  autoComplete=""
                />
            </div>
            </div>
        );

        const CreateContainer = (
          <div className={classes.outerCell}>
              <div className={classes.textCell}>
                  <Button
                    variant="contained"
                    disableRipple
                    disableFocusRipple
                    onClick={this.isValorDisabled}
                    className={classes.createButton}
                  >
                      {'Create Valor'}
                  </Button>
              </div>
          </div>
        )

        return (
          <div className={classes.root}>
              <div className={classes.content}>
                  <div className={classes.headerCell}>
                      <div className={classes.headers}>
                          {'New Valor'}
                      </div>
                  </div>
                  {NameContainer}
                  {DeathContainer}
                  {NotesContainer}
                  {CreateContainer}
              </div>
          </div>
        );
    }
}

ValorCreateView.defaultProps = {
    saveNewValor: f => f,
};
ValorCreateView.propTypes = {
    saveNewValor: PropTypes.func,
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ValorCreateView);
