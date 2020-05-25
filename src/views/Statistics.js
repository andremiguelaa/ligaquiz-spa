import React from 'react';
import { Trans } from '@lingui/macro';

import PageHeader from 'components/PageHeader';
import WorkInProgress from 'components/WorkInProgress';

const Statistics = () => {
  return (
    <>
      <PageHeader title={<Trans>As minhas estatísicas</Trans>} />
      <div className="section content">
        <WorkInProgress>
          <Trans>Em desenvolvimento...</Trans>
        </WorkInProgress>
      </div>
    </>
  );
};

export default Statistics;
