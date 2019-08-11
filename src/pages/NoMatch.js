import React from "react";
import { Trans } from "@lingui/macro";

const NoMatch = () => (
  <>
    <div className="column is-4-widescreen is-offset-4-widescreen is-8-tablet is-offset-2-tablet">
      <article className="message">
        <div className="message-header">
          <p>
            <Trans>Página não encontrada</Trans>
          </p>
        </div>
        <div className="message-body">
          <Trans>Esta página não existe.</Trans>
        </div>
      </article>
    </div>
  </>
);

export default NoMatch;
