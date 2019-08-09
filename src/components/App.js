import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Switch } from 'react-router-dom';

import { StateProvider } from 'state/State';
import { initialState, MainReducer } from 'state/MainReducer';

import Auth from 'utils/Auth';
import RouteWithTitle from 'utils/RouteWithTitle';

import Header from 'components/partials/Header';
import Home from 'components/pages/Home';
import Login from 'components/pages/Login';
import Register from 'components/pages/Register';
import NoMatch from 'components/pages/NoMatch';

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
                  <RouteWithTitle title="Liga Quiz" exact path="/" component={Home} />
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
                  <RouteWithTitle title="Liga Quiz | Página não encontrada" component={NoMatch} />
                </Switch>
              </div>
            </div>
          </section>
        </main>
      </Auth>
    </BrowserRouter>
  </StateProvider>
);
ReactDOM.render(<App />, document.getElementById('app'));
