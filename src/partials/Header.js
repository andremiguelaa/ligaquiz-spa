import React, { useState } from "react";
import { Link } from "react-router-dom";
import OutsideClickHandler from "react-outside-click-handler";
import { Trans } from "@lingui/macro";

import { useStateValue } from "state/State";
import logo from "img/logo.png";

const Header = () => {
  const [{ user }] = useStateValue();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header>
      <nav
        className="navbar is-fixed-top is-light"
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
              {!user ? (
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
              ) : (
                <div
                  className={`navbar-item has-dropdown ${dropdownOpen &&
                    "is-active"}`}
                >
                  <OutsideClickHandler
                    onOutsideClick={() => {
                      setDropdownOpen(false);
                    }}
                    display="flex"
                  >
                    <button
                      className="navbar-link"
                      onClick={() => {
                        setDropdownOpen(!dropdownOpen);
                      }}
                    >
                      André
                    </button>
                  </OutsideClickHandler>
                  <div className="navbar-dropdown is-right">
                    <Link to="/national-ranking" className="navbar-item">
                      <i className="fa fa-btn fa-trophy" />
                      &nbsp;<Trans>Ranking nacional</Trans>
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
