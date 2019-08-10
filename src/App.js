import React from "react";
import { BrowserRouter, Switch } from "react-router-dom";

import "styles/App.sass";
import { StateProvider } from "state/State";
import { initialState, MainReducer } from "state/MainReducer";

import Auth from "utils/Auth";
import RouteWithTitle from "utils/RouteWithTitle";

import Header from "partials/Header";
import Home from "pages/Home";
import Login from "pages/Login";
import Register from "pages/Register";
import NoMatch from "pages/NoMatch";

const App = () => (
  <StateProvider initialState={initialState} reducer={MainReducer}>
    <BrowserRouter>
      <Auth>
        <Header />
        <main>
          <section className="section">
            <div className="container">
              <div className="columns">
                <Switch>
                  <RouteWithTitle
                    title="Liga Quiz"
                    exact
                    path="/"
                    component={Home}
                  />
                  <RouteWithTitle
                    title="Liga Quiz | Entrar"
                    exact
                    path="/login"
                    component={Login}
                  />
                  <RouteWithTitle
                    title="Liga Quiz | Registar"
                    exact
                    path="/register"
                    component={Register}
                  />
                  <RouteWithTitle
                    title="Liga Quiz | Página não encontrada"
                    component={NoMatch}
                  />
                </Switch>
              </div>
            </div>
          </section>
        </main>
      </Auth>
    </BrowserRouter>
  </StateProvider>
);

export default App;
