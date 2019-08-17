import React from 'react';
import { Trans } from '@lingui/macro';

const NoMatch = () => (
  <div className="columns">
    <div className="column is-6-widescreen is-offset-3-widescreen is-8-tablet is-offset-2-tablet">
      <article className="message">
        <div className="message-header">
          <h1>
            <Trans>Página não encontrada</Trans>
          </h1>
        </div>
        <div className="message-body">
          <Trans>Esta página não existe.</Trans>
        </div>
      </article>
    </div>
  </div>
);

export default NoMatch;
