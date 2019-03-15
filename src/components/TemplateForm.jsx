import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import {
  Paper,
  TextField,
  Typography,
  CircularProgress,
  Fab,
  withStyles,
  Button,
  Modal
} from "@material-ui/core";
import { Check as CheckIcon, Save as SaveIcon } from "@material-ui/icons";
import AceEditor from "react-ace";

import "brace/mode/html";
import "brace/theme/monokai";

import styles from "./TemplateFormStyles";

const LABEL_CREATE_TEMPLATE = "Crear Template";
const LABEL_EDIT_TEMPLATE = "Editar Template";
const LABEL_PREVIEW = "Previsualizar";

class TemplateForm extends Component {
  state = {
    template: {
      TemplateName: "",
      SubjectPart: "",
      TextPart: "",
      HtmlPart: ""
    },
    loading: false,
    success: false,
    errorMessage: "",
    open: false
  };

  componentDidMount() {
    const { template } = this.props;

    if (template) {
      this.setTemplate(template);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { template } = nextProps;

    if (template) {
      this.setTemplate(template);
    }
  }

  setTemplate = template => {
    this.setState({
      template: {
        TemplateName: template.TemplateName,
        SubjectPart: template.SubjectPart,
        TextPart: template.TextPart,
        HtmlPart: template.HtmlPart
      },
      errorMessage: "",
      success: false
    });
  };

  handleChange = name => event => {
    const { template } = this.state;
    this.setState({
      template: Object.assign({}, template, {
        [name]: name === "HtmlPart" ? event : event.target.value
      })
    });
  };

  resolved = template => {
    const { pushTemplate, isCreate } = this.props;

    this.setState({ success: true });
    if (isCreate) {
      pushTemplate(template);
    }
  };

  rejected = result => {
    this.setState({ errorMessage: result });
  };

  handleSubmit = async event => {
    event.preventDefault();

    const { onSubmit } = this.props;
    const { template } = this.state;

    this.setState({ loading: true });

    await onSubmit(template).then(this.resolved(template), this.rejected);

    this.setState({ loading: false });
  };

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { classes, isCreate, template: templateFromProps } = this.props;
    const { template, loading, success, errorMessage } = this.state;

    const buttonClassname = classNames({
      [classes.buttonSuccess]: success
    });

    if (!templateFromProps) return "";

    return (
      <Paper className={classes.appContainer}>
        <form onSubmit={e => this.handleSubmit(e)}>
          <Typography variant="h5" gutterBottom>
            {isCreate ? LABEL_CREATE_TEMPLATE : LABEL_EDIT_TEMPLATE}
          </Typography>
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
            <Button onClick={this.handleOpen}>{LABEL_PREVIEW}</Button>
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
              <Fab color="primary" className={buttonClassname} type="submit">
                {success ? <CheckIcon /> : <SaveIcon />}
              </Fab>
              {loading && (
                <CircularProgress size={68} className={classes.fabProgress} />
              )}
            </div>
          </div>
        </form>
        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={this.state.open}
          onClose={this.handleClose}
        >
          <div
            style={{
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)"
            }}
            className={classes.paper}
          >
            <div dangerouslySetInnerHTML={{ __html: template.HtmlPart }} />
          </div>
        </Modal>
      </Paper>
    );
  }
}

TemplateForm.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(TemplateForm);
