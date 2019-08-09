import React from 'react';
import { NavLink } from 'react-router-dom';
import { useStateValue } from 'state/State';

const Header = () => {
  const [{ user }] = useStateValue();
  return (
    <header>
      <nav
        className="navbar has-shadow is-fixed-top"
        role="navigation"
        aria-label="main navigation"
      >
        <div className="container">
          <div className="navbar-brand">
            <NavLink to="/" className="navbar-item">
              <img src="/img/logo.png" alt="logo" />
            </NavLink>
            <a className="navbar-burger burger">
              <span aria-hidden="true"></span>
              <span aria-hidden="true"></span>
              <span aria-hidden="true"></span>
            </a>
          </div>
          <div className="navbar-menu">
            <div className="navbar-end">
              <div className="navbar-item">
                {!user && (
                  <div className="buttons">
                    <NavLink to="/login" className="button is-light">
                      Entrar
                    </NavLink>
                    <NavLink to="/register" className="button is-primary">
                      Registar
                    </NavLink>
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
