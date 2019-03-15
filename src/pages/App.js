import React, { Component } from "react";
import PropTypes from "prop-types";
import AWS from "aws-sdk";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import { Fab, Paper, Tooltip } from "@material-ui/core";
import withRoot from "../withRoot";
import TemplateList from "../components/TemplateList";
import TemplateForm from "../components/TemplateForm";
import styles from "./AppStyles";

const ses = new AWS.SES({
  region: process.env.REACT_APP_REGION,
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY
});

const FORM_STATUS = Object.freeze({
  CREATE: "CREATE",
  EDIT: "EDIT"
});

const LABEL_APP_TITLE = "AWS SES Templates Manager";
const LABEL_ADD_TEMPLATE = "Agregar Template";

class App extends Component {
  state = {
    templates: [],
    selectedTemplate: null,
    selectedListItem: null,
    formStatus: null
  };

  componentDidMount() {
    this.loadTemplates();
  }

  loadTemplates = async () => {
    const templates = new Promise(function(resolve, reject) {
      ses.listTemplates({}, function(err, data) {
        if (err) {
          console.log(err, err.stack);
          reject(err.stack);
        } else {
          resolve(data.TemplatesMetadata);
        }
      });
    });
    this.setState({ templates: await templates });
  };

  getTemplate = async (templateName, index) => {
    const template = new Promise(function(resolve, reject) {
      ses.getTemplate({ TemplateName: templateName }, function(err, data) {
        if (err) {
          console.log(err, err.stack);
          reject(err.stack);
        } else {
          resolve(data.Template);
        }
      });
    });
    this.setState({
      selectedTemplate: await template,
      selectedListItem: index,
      formStatus: FORM_STATUS.EDIT
    });
  };

  handleSubmit = async template => {
    const { formStatus } = this.state;

    var params = {
      Template: {
        TemplateName: template.TemplateName,
        HtmlPart: template.HtmlPart,
        SubjectPart: template.SubjectPart,
        TextPart: template.TextPart
      }
    };

    return new Promise(function(resolve, reject) {
      if (formStatus === FORM_STATUS.CREATE) {
        ses.createTemplate(params, function(err, data) {
          if (err) {
            reject(err.message);
            return;
          } else {
            resolve(data);
          }
        });
      } else {
        ses.updateTemplate(params, function(err, data) {
          if (err) {
            reject(err.message);
            return;
          } else {
            resolve(data);
          }
        });
      }
    });
  };

  pushTemplate = template => {
    const { templates } = this.state;

    this.setState({
      templates: [...templates, { Name: template.TemplateName }]
    });
  };

  removeTemplate = templateName => {
    const { templates } = this.state;

    this.setState({
      templates: templates.filter(e => e.Name !== templateName)
    });
  };

  deleteTemplate = async templateName => {
    return new Promise(function(resolve, reject) {
      ses.deleteTemplate({ TemplateName: templateName }, function(err, data) {
        if (err) {
          reject(err.message);
          return;
        } else {
          resolve(data);
        }
      });
    });
  };

  handleAddTemplateClick = () => {
    this.setState({
      selectedTemplate: {
        TemplateName: "",
        SubjectPart: "",
        TextPart: "",
        HtmlPart: ""
      },
      formStatus: FORM_STATUS.CREATE
    });
  };

  render() {
    const { classes } = this.props;
    const {
      templates,
      selectedTemplate,
      selectedListItem,
      formStatus
    } = this.state;

    return (
      <div className={classes.root}>
        <Paper className={classes.appContainer} elevation={1}>
          <div className={classes.paperHeader}>
            <Typography variant="h4" gutterBottom>
              {LABEL_APP_TITLE}
            </Typography>
            <div className={classes.buttonContainer}>
              <Tooltip title={LABEL_ADD_TEMPLATE} aria-label="Add">
                <Fab
                  onClick={this.handleAddTemplateClick}
                  className={classes.fab}
                  color="primary"
                >
                  <AddIcon />
                </Fab>
              </Tooltip>
            </div>
          </div>
          <TemplateList
            items={templates}
            onClickListItem={this.getTemplate}
            selectedListItem={selectedListItem}
            onDeleteListItem={this.deleteTemplate}
            removeTemplate={this.removeTemplate}
          />
        </Paper>
        <TemplateForm
          template={selectedTemplate}
          isCreate={formStatus === FORM_STATUS.CREATE}
          onSubmit={this.handleSubmit}
          pushTemplate={this.pushTemplate}
        />
      </div>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withRoot(withStyles(styles)(App));
