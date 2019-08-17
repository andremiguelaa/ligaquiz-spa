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

import routes from "routes";

import Header from "partials/Header";

export const catalogs = { pt: catalogPt, en: catalogEn };

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
                        {routes.map(route => {
                          let { slug, ...rest } = route;
                          const title = i18n._(t`${route.title.props.id}`);
                          rest = {
                            ...rest,
                            title
                          };
                          return <RouteWithTitle key={route.slug} {...rest} />;
                        })}
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
