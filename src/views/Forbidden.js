import React from 'react';
import { Trans } from '@lingui/macro';

const Forbidden = () => (
  <div className="columns">
    <div className="column is-6-widescreen is-offset-3-widescreen is-8-tablet is-offset-2-tablet">
      <article className="message">
        <div className="message-header">
          <h1>
            <Trans>Não autorizado</Trans>
          </h1>
        </div>
        <div className="message-body">
          <Trans>Não tens permissões para aceder a esta página.</Trans>
        </div>
      </article>
    </div>
  </div>
);

export default Forbidden;
