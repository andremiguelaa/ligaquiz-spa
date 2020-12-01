import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import OutsideClickHandler from 'react-outside-click-handler';
import { Trans } from '@lingui/macro';
import { I18n } from '@lingui/react';
import { t } from '@lingui/macro';
import classames from 'classnames';
import Cookies from 'js-cookie';

import { catalogs } from 'utils/catalogs';
import { useStateValue } from 'state/State';
import logo from 'img/logo.png';
import logoDark from 'img/logo-dark.png';
import classes from './Header.module.scss';

const version = '4.7.7';

const isDarkMode =
  window.matchMedia &&
  window.matchMedia('(prefers-color-scheme: dark)').matches;

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
    <I18n>
      {({ i18n }) => (
        <header>
          <nav
            className="navbar is-fixed-top has-shadow"
            role="navigation"
            aria-label={i18n._(t`Navegação primária`)}
          >
            <div className="navbar-brand">
              <Link to="/" className="navbar-item">
                <img src={isDarkMode ? logoDark : logo} alt="logo" />
              </Link>
              <div className={classes.burgerWrapper}>
                <OutsideClickHandler
                  onOutsideClick={() => {
                    setMenuBurgerOpen(false);
                  }}
                >
                  <button
                    className={classames('navbar-burger', classes.burger)}
                    type="button"
                    onClick={() => {
                      setMenuBurgerOpen(!menuBurgerOpen);
                    }}
                    aria-label={i18n._(t`Menu`)}
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
                {user && (
                  <Link to="/rules" className="navbar-item">
                    <i className="fa fa-btn fa-exclamation-triangle" />
                    &nbsp;<Trans>Regras</Trans>
                  </Link>
                )}
                {user &&
                  (user.valid_roles.admin ||
                    user.valid_roles.regular_player) && (
                    <Link to="/ranking" className="navbar-item">
                      <i className="fa fa-btn fa-diamond" />
                      &nbsp;<Trans>Classificação</Trans>
                    </Link>
                  )}
                {user && (
                  <Link to="/statistics" className="navbar-item">
                    <i className="fa fa-btn fa-line-chart" />
                    &nbsp;<Trans>As minhas estatísticas</Trans>
                  </Link>
                )}
                <Link to="/national-ranking/" className="navbar-item">
                  <i className="fa fa-btn fa-trophy" />
                  &nbsp;<Trans>Ranking Nacional</Trans>
                </Link>
              </div>

              <div className="navbar-end">
                {Object.keys(catalogs).length > 1 && (
                  <div className="navbar-item">
                    <div className="buttons are-small">
                      {Object.keys(catalogs).map((language) => (
                        <button
                          key={language}
                          disabled={settings.language === language}
                          className="button"
                          type="button"
                          onClick={() => changeLanguage(language)}
                        >
                          {language.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {!user && (
                  <div className="navbar-item">
                    <div className="buttons are-small">
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
                        type="button"
                        onClick={() => {
                          setMenuDropdownOpen(!menuDropdownOpen);
                        }}
                      >
                        {user.name}
                      </button>
                    </OutsideClickHandler>
                    <div className="navbar-dropdown is-right">
                      {user.valid_roles.admin && (
                        <>
                          <div className="navbar-item">
                            <Trans>Administração</Trans>
                          </div>
                          <Link to="/admin/users" className="navbar-item">
                            <i className="fa fa-btn fa-users" />
                            &nbsp;<Trans>Utilizadores</Trans>
                          </Link>
                          <Link
                            to="/admin/notifications"
                            className="navbar-item"
                          >
                            <i className="fa fa-btn fa-bell" />
                            &nbsp;<Trans>Notificações</Trans>
                          </Link>
                          <Link to="/admin/seasons" className="navbar-item">
                            <i className="fa fa-btn fa-calendar" />
                            &nbsp;<Trans>Temporadas</Trans>
                          </Link>
                          <hr className="navbar-divider" />
                        </>
                      )}
                      {(user.valid_roles.admin ||
                        user.valid_roles.quiz_editor ||
                        user.valid_roles.special_quiz_editor ||
                        user.valid_roles.answer_reviewer ||
                        user.valid_roles.translator) && (
                        <>
                          <div className="navbar-item">
                            <Trans>Gestão de Quizzes</Trans>
                          </div>
                          {(user.valid_roles.admin ||
                            user.valid_roles.quiz_editor ||
                            user.valid_roles.answer_reviewer) && (
                            <Link to="/admin/quizzes" className="navbar-item">
                              <i className="fa fa-btn fa-question-circle-o" />
                              &nbsp;<Trans>Quizzes</Trans>
                            </Link>
                          )}
                          {(user.valid_roles.admin ||
                            user.valid_roles.special_quiz_editor ||
                            user.valid_roles.answer_reviewer) && (
                            <Link
                              to="/admin/special-quizzes"
                              className="navbar-item"
                            >
                              <i className="fa fa-btn fa-question-circle-o" />
                              &nbsp;<Trans>Quizzes especiais</Trans>
                            </Link>
                          )}
                          {(user.valid_roles.admin ||
                            user.valid_roles.quiz_editor ||
                            user.valid_roles.translator) && (
                            <Link to="/admin/questions" className="navbar-item">
                              <i className="fa fa-btn fa-search" />
                              &nbsp;<Trans>Pesquisa de perguntas</Trans>
                            </Link>
                          )}
                          <hr className="navbar-divider" />
                        </>
                      )}
                      {(user.valid_roles.admin ||
                        user.valid_roles.national_ranking_manager) && (
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
                      {user &&
                        (user.valid_roles.admin ||
                          user.valid_roles.regular_player) && (
                          <>
                            <Link to="/genre-rankings" className="navbar-item">
                              <i className="fa fa-btn fa-shield" />
                              &nbsp;<Trans>Rankings temáticos</Trans>
                            </Link>
                            <Link to="/seasons" className="navbar-item">
                              <i className="fa fa-btn fa-archive" />
                              &nbsp;<Trans>Arquivo de temporadas</Trans>
                            </Link>
                            <Link to="/quizzes" className="navbar-item">
                              <i className="fa fa-btn fa-archive" />
                              &nbsp;<Trans>Arquivo de quizzes</Trans>
                            </Link>
                          </>
                        )}
                      {user &&
                        (user.valid_roles.admin ||
                          user.valid_roles.regular_player ||
                          user.valid_roles.special_quiz_player) && (
                          <>
                            <Link to="/special-quizzes" className="navbar-item">
                              <i className="fa fa-btn fa-archive" />
                              &nbsp;<Trans>Arquivo de quizzes especiais</Trans>
                            </Link>
                          </>
                        )}
                      <Link to="/logout/" className="navbar-item">
                        <i className="fa fa-btn fa-sign-out" />
                        &nbsp;<Trans>Sair</Trans>
                      </Link>
                      <hr className="navbar-divider" />
                      <div className="navbar-item">
                        <Trans>Versão {version}</Trans>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </nav>
        </header>
      )}
    </I18n>
  );
};

export default Header;
