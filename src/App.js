import React from "react";
import { BrowserRouter, Switch } from "react-router-dom";
import { I18nProvider, I18n } from "@lingui/react";
import { t } from "@lingui/macro";
import slugify from "slugify";

import catalogPt from "locales/pt/messages.js";
import catalogEn from "locales/en/messages.js";
import "styles/App.scss";
import routes from "routes";
import { useStateValue } from "state/State";
import Auth from "utils/Auth";
import RouteWithTitle from "utils/RouteWithTitle";
import Header from "partials/Header";

export const catalogs = { pt: catalogPt, en: catalogEn };

const App = () => {
  const [{ settings }] = useStateValue();
  return (
    <Auth>
      <I18nProvider language={settings.language} catalogs={catalogs}>
        <I18n>
          {({ i18n }) => (
            <BrowserRouter>
              <Header />
              <main>
                <section className="section">
                  <div className="container">
                    <div className="columns">
                      <Switch>
                        {routes.map(route => {
                          const title = route.root
                            ? catalogs[settings.language].messages[
                                route.title.props.id
                              ]
                            : `${i18n._(t`Liga Quiz`)} | ${
                                catalogs[settings.language].messages[
                                  route.title.props.id
                                ]
                              }`;
                          const newProps = {
                            ...route,
                            title
                          };
                          return (
                            <RouteWithTitle
                              key={slugify(title)}
                              {...newProps}
                            />
                          );
                        })}
                      </Switch>
                    </div>
                  </div>
                </section>
              </main>
            </BrowserRouter>
          )}
        </I18n>
      </I18nProvider>
    </Auth>
  );
};

export default App;
