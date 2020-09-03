import React, { useState, useEffect } from 'react';
import { BrowserRouter, Switch } from 'react-router-dom';
import { I18nProvider, I18n } from '@lingui/react';
import { t, Trans } from '@lingui/macro';
import { ToastContainer, toast } from 'react-toastify';
import { registerLocale, setDefaultLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import 'styles/App.scss';
import routes from 'routes';
import { useStateValue } from 'state/State';
import { catalogs } from 'utils/catalogs';
import Auth from 'utils/Auth';
import RouteWithTitle from 'utils/RouteWithTitle';
import Header from 'partials/Header';
import Notifications from 'partials/Notifications';
import Message from 'partials/Message';
import Blocked from 'components/Blocked';
import Logger from 'components/Logger';
import Error from 'components/Error';

import pt from 'date-fns/locale/pt';
registerLocale('pt', pt);

const App = () => {
  const [
    {
      user,
      settings: { language },
    },
  ] = useStateValue();
  setDefaultLocale(language);

  const [online, setOnline] = useState(navigator.onLine);

  useEffect(() => {
    if (!online) {
      toast.error(<Trans>Perdeste a ligação à internet.</Trans>);
    }
  }, [online]);

  window.addEventListener('load', function () {
    window.addEventListener('online', () => {
      setOnline(navigator.onLine);
    });
    window.addEventListener('offline', () => {
      setOnline(navigator.onLine);
    });
  });

  return (
    <Auth>
      <I18nProvider language={language} catalogs={catalogs}>
        <BrowserRouter>
          <Header />
          <Notifications />
          <main className="section">
            <div className="container">
              {online ? (
                <I18n>
                  {({ i18n }) => (
                    <Switch>
                      {routes.map((route) => {
                        const title =
                          route.path === '/'
                            ? catalogs[language].messages[route.title.props.id]
                            : `${i18n._(t`Liga Quiz`)} | ${
                                catalogs[language].messages[
                                  route.title.props.id
                                ]
                              }`;
                        const newProps = {
                          ...route,
                          title,
                          exact: !!route.path && !route.loose,
                        };
                        if (user && user.valid_roles.blocked && !route.free) {
                          newProps.component = Blocked;
                        }
                        return <RouteWithTitle key={title} {...newProps} />;
                      })}
                    </Switch>
                  )}
                </I18n>
              ) : (
                <Error status={666} />
              )}
            </div>
          </main>
          {online && <Message />}
          <ToastContainer />
          {user && online && <Logger />}
        </BrowserRouter>
      </I18nProvider>
    </Auth>
  );
};

export default App;
