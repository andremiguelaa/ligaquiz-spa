import React from "react";
import { BrowserRouter, Switch } from "react-router-dom";

import { I18nProvider, I18n } from "@lingui/react";
import { t } from "@lingui/macro";

import catalogPt from "locales/pt/messages.js";
import catalogEn from "locales/en/messages.js";

import "styles/App.scss";

import { useStateValue } from "state/State";
import Auth from "utils/Auth";
import RouteWithTitle from "utils/RouteWithTitle";
import Header from "partials/Header";
import Home from "pages/Home";
import Login from "pages/Login";
import RecoverPassword from "pages/RecoverPassword";
import ResetPassword from "pages/ResetPassword";
import Register from "pages/Register";
import Logout from "pages/Logout";
import NoMatch from "pages/NoMatch";

const catalogs = { pt: catalogPt, en: catalogEn };

const App = () => {
  const [{ settings }] = useStateValue();
  return (
    <I18nProvider language={settings.language} catalogs={catalogs}>
      <BrowserRouter>
        <Auth>
          <Header />
          <main>
            <section className="section">
              <div className="container">
                <div className="columns">
                  <I18n>
                    {({ i18n }) => (
                      <Switch>
                        <RouteWithTitle
                          title={i18n._(t`Liga Quiz`)}
                          exact
                          path="/"
                          component={Home}
                        />
                        <RouteWithTitle
                          title={`${i18n._(t`Liga Quiz`)} | ${i18n._(
                            t`Entrar`
                          )}`}
                          exact
                          path="/login"
                          component={Login}
                        />
                        <RouteWithTitle
                          title={`${i18n._(t`Liga Quiz`)} | ${i18n._(
                            t`Recuperar palavra-passe`
                          )}`}
                          exact
                          path="/recover-password"
                          component={RecoverPassword}
                        />
                        <RouteWithTitle
                          title={`${i18n._(t`Liga Quiz`)} | ${i18n._(
                            t`Redefinir palavra-passe`
                          )}`}
                          exact
                          path="/reset-password/:token"
                          component={ResetPassword}
                        />
                        <RouteWithTitle
                          title={`${i18n._(t`Liga Quiz`)} | ${i18n._(
                            t`Registo`
                          )}`}
                          exact
                          path="/register"
                          component={Register}
                        />
                        <RouteWithTitle
                          title={`${i18n._(t`Liga Quiz`)} | ${i18n._(t`Sair`)}`}
                          exact
                          path="/logout"
                          component={Logout}
                        />
                        <RouteWithTitle
                          title={`${i18n._(t`Liga Quiz`)} | ${i18n._(
                            t`Página não encontrada`
                          )}`}
                          component={NoMatch}
                        />
                      </Switch>
                    )}
                  </I18n>
                </div>
              </div>
            </section>
          </main>
        </Auth>
      </BrowserRouter>
    </I18nProvider>
  );
};

export default App;
