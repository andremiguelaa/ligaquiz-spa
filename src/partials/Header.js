import React from "react";
import { Link } from "react-router-dom";

import { useStateValue } from "state/State";
import logo from "img/logo.png";

const Header = () => {
  const [{ user }] = useStateValue();
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
              <div className="navbar-item">
                {!user && (
                  <div className="buttons">
                    <Link to="/login" className="button is-light">
                      Entrar
                    </Link>
                    <Link to="/register" className="button is-primary">
                      Registar
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
