import React from 'react';

export const PageHeader = ({ title, subtitle }) => (
  <header className="hero">
    <div className="hero-body">
      <h1 className="title">{title}</h1>
      {subtitle && <p className="subtitle">{subtitle}</p>}
    </div>
  </header>
);

export default PageHeader;
