import React from 'react';
import { BrowserRouter, Switch } from 'react-router-dom';
import { I18nProvider, I18n } from '@lingui/react';
import { t } from '@lingui/macro';
import { ToastContainer } from 'react-toastify';

import catalogPt from 'locales/pt/messages.js';
import catalogEn from 'locales/en/messages.js';
import 'styles/App.scss';
import routes from 'routes';
import { useStateValue } from 'state/State';
import Auth from 'utils/Auth';
import RouteWithTitle from 'utils/RouteWithTitle';
import Header from 'partials/Header';

export const catalogs = { pt: catalogPt, en: catalogEn };

const App = () => {
  const [{ settings }] = useStateValue();
  return (
    <Auth>
      <I18nProvider language={settings.language} catalogs={catalogs}>
        <BrowserRouter>
          <Header />
          <main className="container">
            <div className="columns">
              <div className="column is-10-widescreen is-offset-1-widescreen">
                <div className="section">
                  <I18n>
                    {({ i18n }) => (
                      <Switch>
                        {routes.map(route => {
                          const title =
                            route.path === '/'
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
                            title,
                            exact: !!route.path
                          };
                          return <RouteWithTitle key={title} {...newProps} />;
                        })}
                      </Switch>
                    )}
                  </I18n>
                </div>
              </div>
            </div>
          </main>
          <ToastContainer />
        </BrowserRouter>
      </I18nProvider>
    </Auth>
  );
};

export default App;
