import React, { PureComponent, Fragment } from "react";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import InfiniteScroll from "react-infinite-scroller";
import AWS from "aws-sdk";
import { Link } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import { Fab, Tooltip } from "@material-ui/core";
import withRoot from "../withRoot";
import { TemplateList, Title } from "../components";
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

const LABEL_ADD_TEMPLATE = "Agregar Template";

class Templates extends PureComponent {
  state = {
    templates: [],
    selectedTemplate: null,
    selectedListItem: null,
    formStatus: null,
    nextToken: null
  };

  componentDidMount() {
    this.loadTemplates();
  }

  loadTemplates = () => {
    const { nextToken, templates } = this.state;
    const params = {};

    if (nextToken) {
      params.NextToken = nextToken;
    }

    ses.listTemplates(params, (err, data) => {
      if (err) {
        console.log(err, err.stack);
      } else {
        this.setState({
          templates: [...templates, ...data.TemplatesMetadata],
          nextToken: data.NextToken
        });
      }
    });
  };

  navigateToEditPage = (itemName, index) => {
    const { history } = this.props;
    history.push(`/templates/edit/${itemName}`);
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
    const { templates, selectedListItem, nextToken } = this.state;
    return (
      <Fragment>
        <Title>Templates de Email</Title>
        <div className={classes.buttonContainer}>
          <Tooltip title={LABEL_ADD_TEMPLATE} aria-label="Add">
            <Link to="/templates/new">
              <Fab className={classes.fab} color="primary">
                <AddIcon />
              </Fab>
            </Link>
          </Tooltip>
        </div>
        <div style={{ marginTop: 20 }}>
          <InfiniteScroll
            pageStart={0}
            loadMore={this.loadTemplates}
            hasMore={typeof nextToken === "string"}
            useWindow={false}
            loader={
              <div className="loader" key={0}>
                Cargando...
              </div>
            }
          >
            <TemplateList
              items={templates}
              onClickListItem={this.navigateToEditPage}
              selectedListItem={selectedListItem}
              onDeleteListItem={this.deleteTemplate}
              removeTemplate={this.removeTemplate}
            />
          </InfiniteScroll>
        </div>
      </Fragment>
    );
  }
}

Templates.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withRoot(withStyles(styles)(withRouter(Templates)));
