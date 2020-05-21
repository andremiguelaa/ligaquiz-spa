import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Trans } from '@lingui/macro';

export const Breadcrumbs = ({ pages }) => {
  const { pathname } = useLocation();
  return (
    <nav className="breadcrumb" aria-label="breadcrumbs">
      <ul>
        <li>
          <Link to="/">
            <span className="icon is-small">
              <i className="fa fa-home" aria-hidden="true"></i>
            </span>
            <Trans>Página inicial</Trans>
          </Link>
        </li>
        {pages.map((page) => (
          <li
            key={page.url}
            className={
              pathname.replace(/\/(?=\s|$)/, '') ===
              page.url.replace(/\/(?=\s|$)/, '')
                ? 'is-active'
                : ''
            }
          >
            <Link to={page.url} aria-current="page">
              {page.title}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Breadcrumbs;
