import React from 'react';
import { Trans } from '@lingui/macro';

import Home from 'views/Home';
import Login from 'views/Login';
import RecoverPassword from 'views/RecoverPassword';
import ResetPassword from 'views/ResetPassword';
import Register from 'views/Register';
import Logout from 'views/Logout';
import Account from 'views/Account';
import NationalRanking from 'views/NationalRanking';

import NationalRankingAdminRankings from 'views/admin/nationalRanking/Rankings';
import NationalRankingAdminEvents from 'views/admin/nationalRanking/Events';
import NationalRankingAdminPlayers from 'views/admin/nationalRanking/Players';

import NoMatch from 'views/NoMatch';

export default [
  {
    title: <Trans>Liga Quiz</Trans>,
    path: '/',
    component: Home,
  },
  {
    title: <Trans>Entrar</Trans>,
    path: '/login',
    component: Login,
  },
  {
    title: <Trans>Recuperar palavra-passe</Trans>,
    path: '/recover-password',
    component: RecoverPassword,
  },
  {
    title: <Trans>Redefinir palavra-passe</Trans>,
    path: '/reset-password/:token',
    component: ResetPassword,
  },
  {
    title: <Trans>Registo</Trans>,
    path: '/register',
    component: Register,
  },
  {
    title: <Trans>Sair</Trans>,
    path: '/logout',
    component: Logout,
  },
  {
    title: <Trans>Conta</Trans>,
    path: '/account',
    component: Account,
  },
  {
    title: <Trans>Ranking Nacional | Ranking</Trans>,
    path: '/admin/national-ranking/ranking',
    component: NationalRankingAdminRankings,
  },
  {
    title: <Trans>Ranking Nacional | Provas mensais</Trans>,
    path: '/admin/national-ranking/events',
    component: NationalRankingAdminEvents,
  },
  {
    title: <Trans>Ranking Nacional | Jogadores</Trans>,
    path: '/admin/national-ranking/players',
    component: NationalRankingAdminPlayers,
  },
  {
    title: <Trans>Ranking Nacional</Trans>,
    path: '/national-ranking/:month?',
    component: NationalRanking,
  },
  {
    title: <Trans>Página não encontrada</Trans>,
    component: NoMatch,
  },
];
