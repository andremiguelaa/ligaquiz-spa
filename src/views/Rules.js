import React, { useEffect } from 'react';
import { Trans } from '@lingui/macro';

import { useStateValue } from 'state/State';
import Error from 'components/Error';
import PageHeader from 'components/PageHeader';

import LigaQuiz from './Rules/LigaQuiz';
import Equizition from './Rules/Equizition';

const Rules = () => {
  const [{ user }] = useStateValue();

  useEffect(() => {
    if (window.location.hash) {
      document
        .getElementById(window.location.hash.substring(1))
        .scrollIntoView();
    }
  }, []);

  if (!user) {
    return <Error status={401} />;
  }

  return (
    <>
      <PageHeader title={<Trans>Regras</Trans>} />
      <div className="section content">
        {process.env.REACT_APP_SLUG === 'ligaquiz' && <LigaQuiz />}
        {process.env.REACT_APP_SLUG === 'equizition' && <Equizition />}
      </div>
    </>
  );
};

export default Rules;
