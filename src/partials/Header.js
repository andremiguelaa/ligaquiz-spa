import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import OutsideClickHandler from 'react-outside-click-handler';
import { Trans } from '@lingui/macro';
import classNames from 'classnames';
import Cookies from 'js-cookie';
import { catalogs } from 'App';

import { useStateValue } from 'state/State';
import logo from 'img/logo.png';

const Header = () => {
  const [{ settings, user }, dispatch] = useStateValue();
  const [menuDropdownOpen, setMenuDropdownOpen] = useState(false);

  const changeLanguage = lang => {
    Cookies.set('language', lang, { expires: 365 });
    dispatch({
      type: 'settings.language',
      payload: lang
    });
  };

  return (
    <header>
      <nav
        className="navbar is-fixed-top has-shadow"
        role="navigation"
        aria-label="main navigation"
      >
        <div className="container">
          <div className="navbar-brand">
            <Link to="/" className="navbar-item">
              <img src={logo} alt="logo" />
            </Link>
            <button className="navbar-burger burger">
              <span aria-hidden="true" />
              <span aria-hidden="true" />
              <span aria-hidden="true" />
            </button>
          </div>
          <div className="navbar-menu">
            <div className="navbar-end">
              <div className="navbar-item">
                <div className="buttons are-small">
                  {Object.keys(catalogs).map(language => (
                    <button
                      key={language}
                      disabled={settings.language === language}
                      className="button"
                      onClick={() => changeLanguage(language)}
                    >
                      {language.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
              {!user && (
                <div className="navbar-item">
                  <div className="buttons">
                    <Link to="/login" className="button is-light">
                      <Trans>Entrar</Trans>
                    </Link>
                    <Link to="/register" className="button is-primary">
                      <Trans>Registar</Trans>
                    </Link>
                  </div>
                </div>
              )}
              {user && (
                <div
                  className={classNames('navbar-item', 'has-dropdown', {
                    'is-active': menuDropdownOpen
                  })}
                >
                  <OutsideClickHandler
                    onOutsideClick={() => {
                      setMenuDropdownOpen(false);
                    }}
                    display="flex"
                  >
                    <button
                      className="navbar-link"
                      onClick={() => {
                        setMenuDropdownOpen(!menuDropdownOpen);
                      }}
                    >
                      André
                    </button>
                  </OutsideClickHandler>
                  <div className="navbar-dropdown is-right">
                    <Link to="/control-panel" className="navbar-item">
                      <i className="fa fa-btn fa-cogs" />
                      &nbsp;<Trans>Painel de controlo</Trans>
                    </Link>
                    <Link to="/logout" className="navbar-item">
                      <i className="fa fa-btn fa-sign-out" />
                      &nbsp;<Trans>Sair</Trans>
                    </Link>
                    <hr className="navbar-divider" />
                    <div className="navbar-item">
                      <Trans>Versão 4.0</Trans>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
