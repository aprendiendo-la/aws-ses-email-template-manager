import React, { PureComponent, Fragment } from "react";
import AWS from "aws-sdk";
import { TemplateForm, Title } from "../components";
import { withRouter } from "react-router-dom";

const ses = new AWS.SES({
  region: process.env.REACT_APP_REGION,
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY
});

const FORM_STATUS = Object.freeze({
  CREATE: "CREATE",
  EDIT: "EDIT"
});

const LABEL_CREATE_TEMPLATE = "Crear Template";
const LABEL_EDIT_TEMPLATE = "Editar Template";

class SaveTemplate extends PureComponent {
  state = {
    selectedTemplate: null,
    formStatus: FORM_STATUS.CREATE,
    success: false,
    errorMessage: ""
  };

  componentDidMount() {
    const { match } = this.props;

    if (match.params.name) {
      this.getTemplate(match.params.name);
    }
  }

  getTemplate = templateName => {
    const { history } = this.props;
    ses.getTemplate({ TemplateName: templateName }, (err, data) => {
      if (err) {
        history.push("/404");
      } else {
        this.setState({
          selectedTemplate: data.Template,
          formStatus: FORM_STATUS.EDIT
        });
      }
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
    if (formStatus === FORM_STATUS.CREATE) {
      ses.createTemplate(params, (err, data) => {
        if (err) {
          this.setError(err.message);
        } else {
          this.handleSuccess(data);
        }
      });
    } else {
      ses.updateTemplate(params, (err, data) => {
        if (err) {
          this.setError(err.message);
        } else {
          this.handleSuccess(data);
        }
      });
    }
  };

  setError = errorMessage => {
    this.setState({
      errorMessage: errorMessage
    });
  };

  handleSuccess = data => {
    const { history } = this.props;
    this.setState({ success: true }, () => {
      history.push("/templates");
    });
  };

  render() {
    const { selectedTemplate, formStatus, success } = this.state;
    const isCreate = formStatus === FORM_STATUS.CREATE;

    return (
      <Fragment>
        <Title>{isCreate ? LABEL_CREATE_TEMPLATE : LABEL_EDIT_TEMPLATE}</Title>
        <TemplateForm
          template={selectedTemplate}
          isCreate={isCreate}
          onSubmit={this.handleSubmit}
          pushTemplate={this.pushTemplate}
          success={success}
        />
      </Fragment>
    );
  }
}

export default withRouter(SaveTemplate);
