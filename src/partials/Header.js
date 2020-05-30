import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import OutsideClickHandler from 'react-outside-click-handler';
import { Trans } from '@lingui/macro';
import classames from 'classnames';
import Cookies from 'js-cookie';
import { catalogs } from 'App';

import { useStateValue } from 'state/State';
import logo from 'img/logo.png';
import classes from './Header.module.scss';

const Header = () => {
  const [{ settings, user }, dispatch] = useStateValue();
  const [menuDropdownOpen, setMenuDropdownOpen] = useState(false);
  const [menuBurgerOpen, setMenuBurgerOpen] = useState(false);

  const changeLanguage = (lang) => {
    Cookies.set('language', lang, { expires: 365 });
    dispatch({
      type: 'settings.language',
      payload: lang,
    });
  };

  return (
    <header>
      <nav
        className="navbar is-fixed-top has-shadow"
        role="navigation"
        aria-label="main navigation"
      >
        <div className="navbar-brand">
          <Link to="/" className="navbar-item">
            <img src={logo} alt="logo" />
          </Link>
          <div className={classes.burgerWrapper}>
            <OutsideClickHandler
              onOutsideClick={() => {
                setMenuBurgerOpen(false);
              }}
            >
              <button
                className={classames('navbar-burger', classes.burger)}
                onClick={() => {
                  setMenuBurgerOpen(!menuBurgerOpen);
                }}
              >
                <span aria-hidden="true" />
                <span aria-hidden="true" />
                <span aria-hidden="true" />
              </button>
            </OutsideClickHandler>
          </div>
        </div>

        <div
          className={classames('navbar-menu', {
            'is-active': menuBurgerOpen,
          })}
        >
          <div className="navbar-start">
            <Link to="/national-ranking/" className="navbar-item">
              <i className="fa fa-btn fa-trophy" />
              &nbsp;<Trans>Ranking Nacional</Trans>
            </Link>
            {user && (
              <Link to="/statistics" className="navbar-item">
                <i className="fa fa-btn fa-line-chart" />
                &nbsp;<Trans>As minhas estatísicas</Trans>
              </Link>
            )}
            {/* 
            <div className="navbar-item has-dropdown is-hoverable is-hidden">
              <a className="navbar-link">More</a>
              <div className="navbar-dropdown">
                <a className="navbar-item">About</a>
                <hr className="navbar-divider" />
                <a className="navbar-item">Report an issue</a>
              </div>
            </div>
            */}
          </div>

          <div className="navbar-end">
            <div className="navbar-item">
              <div className="buttons are-small">
                {Object.keys(catalogs).map((language) => (
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
                  <Link to="/login/" className="button is-light">
                    <Trans>Entrar</Trans>
                  </Link>
                  <Link to="/register/" className="button is-primary">
                    <Trans>Registar</Trans>
                  </Link>
                </div>
              </div>
            )}
            {user && (
              <div
                className={classames('navbar-item', 'has-dropdown', {
                  'is-active': menuDropdownOpen,
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
                    {user.name}
                  </button>
                </OutsideClickHandler>
                <div className="navbar-dropdown is-right">
                  {user.roles.admin && (
                    <>
                      <div className="navbar-item">
                        <Trans>Administração</Trans>
                      </div>
                      <Link to="/admin/users" className="navbar-item">
                        <i className="fa fa-btn fa-users" />
                        &nbsp;<Trans>Utilizadores</Trans>
                      </Link>
                      <Link to="/admin/notifications" className="navbar-item">
                        <i className="fa fa-btn fa-bell" />
                        &nbsp;<Trans>Notificações</Trans>
                      </Link>
                      <hr className="navbar-divider" />
                    </>
                  )}
                  {(user.roles.admin ||
                    user.roles.national_ranking_manager) && (
                    <>
                      <div className="navbar-item">
                        <Trans>Gestão de Ranking Nacional</Trans>
                      </div>
                      <Link
                        to="/admin/national-ranking/ranking"
                        className="navbar-item"
                      >
                        <i className="fa fa-btn fa-trophy" />
                        &nbsp;<Trans>Rankings mensais</Trans>
                      </Link>
                      <Link
                        to="/admin/national-ranking/events"
                        className="navbar-item"
                      >
                        <i className="fa fa-btn fa-calendar" />
                        &nbsp;<Trans>Provas mensais</Trans>
                      </Link>
                      <Link
                        to="/admin/national-ranking/players"
                        className="navbar-item"
                      >
                        <i className="fa fa-btn fa-users" />
                        &nbsp;<Trans>Jogadores</Trans>
                      </Link>
                      <hr className="navbar-divider" />
                    </>
                  )}
                  <Link to="/account/" className="navbar-item">
                    <i className="fa fa-btn fa-user" />
                    &nbsp;<Trans>Conta</Trans>
                  </Link>
                  <Link to="/logout/" className="navbar-item">
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
      </nav>
    </header>
  );
};

export default Header;
