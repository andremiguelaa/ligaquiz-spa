import React from 'react';

export const Breadcrumbs = () => (
  <nav className="breadcrumb" aria-label="breadcrumbs">
    <ul>
      <li>
        <a href="#">Bulma</a>
      </li>
      <li>
        <a href="#">Documentation</a>
      </li>
      <li>
        <a href="#">Components</a>
      </li>
      <li class="is-active">
        <a href="#" aria-current="page">
          Breadcrumb
        </a>
      </li>
    </ul>
  </nav>
);

export default Breadcrumbs;
