import React from 'react';
import { Trans } from '@lingui/macro';

import Home from 'components/Home';
import Login from 'components/Login';
import RecoverPassword from 'components/RecoverPassword';
import ResetPassword from 'components/ResetPassword';
import Register from 'components/Register';
import Logout from 'components/Logout';
import ControlPanel from 'components/ControlPanel';
import NationalRanking from 'components/NationalRanking';
import NoMatch from 'components/NoMatch';

export default [
  {
    title: <Trans>Liga Quiz</Trans>,
    path: '/',
    component: Home
  },
  {
    title: <Trans>Entrar</Trans>,
    path: '/login',
    component: Login
  },
  {
    title: <Trans>Recuperar palavra-passe</Trans>,
    path: '/recover-password',
    component: RecoverPassword
  },
  {
    title: <Trans>Redefinir palavra-passe</Trans>,
    path: '/reset-password/:token',
    component: ResetPassword
  },
  {
    title: <Trans>Registo</Trans>,
    path: '/register',
    component: Register
  },
  {
    title: <Trans>Sair</Trans>,
    path: '/logout',
    component: Logout
  },
  {
    title: <Trans>Painel de controlo</Trans>,
    path: '/control-panel/:page?',
    component: ControlPanel
  },
  {
    title: <Trans>Ranking Nacional</Trans>,
    path: '/national-ranking/:month?',
    component: NationalRanking
  },
  {
    title: <Trans>Página não encontrada</Trans>,
    component: NoMatch
  }
];
