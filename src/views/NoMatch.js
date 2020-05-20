import React from 'react';
import { Link } from 'react-router-dom';
import { Trans } from '@lingui/macro';

import PageHeader from 'components/PageHeader';

const NoMatch = () => (
  <>
    <PageHeader
      title={<Trans>Página não encontrada</Trans>}
      subtitle={<Trans>Esta página não existe.</Trans>}
    />
    <div className="section content">
      <p>
        <Link to="/">
          <Trans>Voltar à página inicial</Trans>
        </Link>
      </p>
    </div>
  </>
);

export default NoMatch;
