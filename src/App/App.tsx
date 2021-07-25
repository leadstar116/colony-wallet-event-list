import React, { useEffect } from "react";
import { Switch, Route, Router } from "react-router-dom";
import HomePage from "../HomePage/HomePage";
import { history } from "../_helpers/history";
import { alertClear } from "../_actions/alert.actions";
import { useDispatch } from "react-redux";
import Page404 from "../Page404/Page404";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    history.listen(() => {
      dispatch(alertClear());
    });
  }, [dispatch]);

  return (
    <div className="main-page min-vh-100 mb-0">
      <div className="container">
        <Router history={history}>
          <Switch>
            <Route exact path="/" component={HomePage} />
            <Route component={Page404} />
          </Switch>
        </Router>
      </div>
    </div>
  );
}

export default App;
