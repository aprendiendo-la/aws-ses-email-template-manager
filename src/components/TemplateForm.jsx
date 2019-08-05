import React, { PureComponent, Fragment } from "react";
import PropTypes from "prop-types";
import {
  TextField,
  Typography,
  CircularProgress,
  Fab,
  withStyles,
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  Select,
  FormControl,
  MenuItem,
  Switch,
  InputLabel,
  Paper,
  FormControlLabel
} from "@material-ui/core";
import { Check as CheckIcon, Save as SaveIcon } from "@material-ui/icons";
import AceEditor from "react-ace";

import "brace/mode/html";
import "brace/theme/monokai";

import styles from "./TemplateFormStyles";

const LABEL_PREVIEW = "Previsualizar";

class TemplateForm extends PureComponent {
  state = {
    template: {
      TemplateName: "",
      SubjectPart: "",
      TextPart: "",
      HtmlPart: ""
    },
    open: false,
    modalFullWidth: true,
    modalMaxWidth: "sm"
  };

  componentWillReceiveProps(nextProps) {
    const { template } = nextProps;

    if (template) {
      this.setState({
        template: {
          TemplateName: template.TemplateName,
          SubjectPart: template.SubjectPart,
          TextPart: template.TextPart,
          HtmlPart: template.HtmlPart
        }
      });
    }
  }

  handleChange = name => event => {
    const { template } = this.state;
    this.setState({
      template: Object.assign({}, template, {
        [name]: name === "HtmlPart" ? event : event.target.value
      })
    });
  };

  handleSubmit = async event => {
    event.preventDefault();

    const { onSubmit } = this.props;
    const { template } = this.state;

    onSubmit(template);
  };

  handlePreviewOpen = () => {
    this.setState({ open: true });
  };

  handlePreviewClose = () => {
    this.setState({ open: false });
  };

  handleMaxWidthChange = event => {
    this.setState({
      modalMaxWidth: event.target.value
    });
  };

  handleFullWidthChange = event => {
    this.setState({
      modalFullWidth: event.target.checked
    });
  };

  render() {
    const {
      classes,
      isCreate,
      loadingSubmit,
      success,
      errorMessage
    } = this.props;
    const { template, modalFullWidth, modalMaxWidth } = this.state;

    return (
      <Fragment>
        <form onSubmit={e => this.handleSubmit(e)}>
          <TextField
            id="outlined-name"
            label="TemplateName"
            className={classes.textField}
            value={template.TemplateName}
            margin="normal"
            variant="outlined"
            placeholder="MiNuevoTemplate"
            onChange={this.handleChange("TemplateName")}
            required
            disabled={!isCreate}
          />
          <TextField
            id="outlined-name"
            label="SubjectPart"
            className={classes.textField}
            value={template.SubjectPart}
            margin="normal"
            variant="outlined"
            placeholder="Saludos, {{name}}!"
            onChange={this.handleChange("SubjectPart")}
            required
          />
          <TextField
            id="outlined-name"
            label="TextPart"
            className={classes.textField}
            value={template.TextPart}
            margin="normal"
            variant="outlined"
            onChange={this.handleChange("TextPart")}
          />
          <div
            style={{
              marginTop: 5,
              display: "flex",
              justifyContent: "space-between"
            }}
          >
            <Typography variant="subtitle2" gutterBottom>
              {"HtmlPart"}
            </Typography>
            <Button onClick={this.handlePreviewOpen}>{LABEL_PREVIEW}</Button>
          </div>
          <AceEditor
            className={classes.aceEditor}
            mode="html"
            theme="monokai"
            onChange={this.handleChange("HtmlPart")}
            name="HtmlPart"
            editorProps={{ $blockScrolling: true }}
            value={template.HtmlPart}
            width="612"
            fontSize={14}
          />
          <div className={classes.buttonContainer}>
            <Typography className={classes.errorMessage} variant="subtitle2">
              {errorMessage}
            </Typography>
            <div className={classes.wrapper}>
              <Fab color="primary" type="submit">
                {success ? <CheckIcon /> : <SaveIcon />}
              </Fab>
              {loadingSubmit && (
                <CircularProgress size={68} className={classes.fabProgress} />
              )}
            </div>
          </div>
        </form>
        <Dialog
          fullWidth={modalFullWidth}
          maxWidth={modalMaxWidth}
          open={this.state.open}
          onClose={this.handlePreviewClose}
          aria-labelledby="preview-email-dialog"
        >
          <DialogContent>
            <DialogContentText>
              Puedes cambiar el tamaño del diálogo que se ajuste a cada
              dispositivo:
            </DialogContentText>
            <form className={classes.form} noValidate>
              <FormControl className={classes.formControl}>
                <InputLabel htmlFor="max-width">Ancho del diálogo</InputLabel>
                <Select
                  value={modalMaxWidth}
                  onChange={this.handleMaxWidthChange}
                  inputProps={{
                    name: "max-width",
                    id: "max-width"
                  }}
                >
                  <MenuItem value={false}>false</MenuItem>
                  <MenuItem value="xs">xs</MenuItem>
                  <MenuItem value="sm">sm</MenuItem>
                  <MenuItem value="md">md</MenuItem>
                  <MenuItem value="lg">lg</MenuItem>
                  <MenuItem value="xl">xl</MenuItem>
                </Select>
              </FormControl>
              <FormControlLabel
                className={classes.formControlLabel}
                control={
                  <Switch
                    checked={modalFullWidth}
                    onChange={this.handleFullWidthChange}
                    value="fullWidth"
                  />
                }
                label="Full width"
              />
            </form>
            <Paper style={{ padding: "10px 20px 20px 20px" }}>
              <div dangerouslySetInnerHTML={{ __html: template.HtmlPart }} />
            </Paper>
          </DialogContent>
        </Dialog>
      </Fragment>
    );
  }
}

TemplateForm.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(TemplateForm);
