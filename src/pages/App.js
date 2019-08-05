import React, { Component, Fragment } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Templates from "./Templates";
import SaveTemplate from "./SaveTemplate";
import NoMatch from "./NoMatch";
import { MainLayout } from "../layouts";

class App extends Component {
  render() {
    return (
      <Router>
        <Fragment>
          <MainLayout>
            <Switch>
              <Route exact path="/" component={Templates} />
              <Route exact path="/templates" component={Templates} />
              <Route
                exact
                path="/templates/edit/:name"
                component={SaveTemplate}
              />
              <Route exact path="/templates/new" component={SaveTemplate} />
              <Route component={NoMatch} />
            </Switch>
          </MainLayout>
        </Fragment>
      </Router>
    );
  }
}

export default App;
