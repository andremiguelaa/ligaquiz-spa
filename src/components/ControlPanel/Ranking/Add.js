import React from 'react';
import { Trans } from '@lingui/macro';

const Add = ({ data, setPage }) => {
  return (
    <>
      <button onClick={() => setPage('list')} className="button is-primary">
        <span className="icon">
          <i className="fa fa-chevron-left"></i>
        </span>
        <span>
          <Trans>Voltar à listagem</Trans>
        </span>
      </button>
    </>
  );
};

export default Add;
