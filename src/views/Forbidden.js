import React from 'react';
import { Link } from 'react-router-dom';
import { Trans } from '@lingui/macro';

import PageHeader from 'components/PageHeader';

const Forbidden = () => (
  <>
    <PageHeader
      title={<Trans>Não autorizado</Trans>}
      subtitle={<Trans>Não tens permissões para aceder a esta página.</Trans>}
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

export default Forbidden;
