import React from 'react';
import { Trans } from '@lingui/macro';

import Login from 'views/Login';

import classes from './Error.module.scss';

const error = {
  400: {
    icon: <i className="fa fa-bomb" />,
    message: <Trans>Conteúdo não encontrado.</Trans>,
  },
  401: {
    icon: <i className="fa fa-ban" />,
    message: (
      <Trans>
        É necessário autenticares-te primeiro para aceder a esta página.
      </Trans>
    ),
  },
  403: {
    icon: <i className="fa fa-ban" />,
    message: <Trans>Não tens acesso a esta página.</Trans>,
  },
  404: {
    icon: <i className="fa fa-exclamation-triangle" />,
    message: <Trans>Página não encontrada</Trans>,
  },
  500: {
    icon: <i className="fa fa-bomb" />,
    message: <Trans>Erro de servidor. Tenta mais tarde.</Trans>,
  },
  666: {
    icon: <i className="fa fa-chain-broken" />,
    message: <Trans>Estás sem ligação à internet.</Trans>,
  },
};

const Error = ({ status }) => (
  <>
    <div className={classes.icon}>
      {status && error[status] ? (
        error[status].icon
      ) : (
        <i className="fa fa-bomb" />
      )}
    </div>
    <div className={classes.content}>
      {status && error[status] ? (
        error[status].message
      ) : (
        <Trans>Erro de servidor. Tenta mais tarde.</Trans>
      )}
    </div>
    {status === 401 && <Login refresh />}
  </>
);

Error.defaultProps = {
  children: null,
};

export default Error;
