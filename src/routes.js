import React from 'react';
import { Trans } from '@lingui/macro';

import Home from 'views/Home';
import Login from 'views/Login';
import RecoverPassword from 'views/RecoverPassword';
import ResetPassword from 'views/ResetPassword';
import Register from 'views/Register';
import Logout from 'views/Logout';
import Account from 'views/Account';
import Statistics from 'views/Statistics';
import NationalRanking from 'views/NationalRanking';

import NationalRankingAdminRankings from 'views/admin/nationalRanking/Rankings';
import NationalRankingAdminEvents from 'views/admin/nationalRanking/Events';
import NationalRankingAdminPlayers from 'views/admin/nationalRanking/Players';

import NotificationsAdmin from 'views/admin/notifications/Notifications';
import UsersAdmin from 'views/admin/users/Users';

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
    free: true,
    component: Logout,
  },
  {
    title: <Trans>Conta</Trans>,
    path: '/account',
    free: true,
    component: Account,
  },
  {
    title: <Trans>Estatísticas</Trans>,
    path: '/statistics/:id?',
    component: Statistics,
  },
  {
    title: <Trans>Ranking Nacional</Trans>,
    path: '/national-ranking/:month?',
    free: true,
    component: NationalRanking,
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
    title: <Trans>Notificações</Trans>,
    path: '/admin/notifications',
    component: NotificationsAdmin,
  },
  {
    title: <Trans>Utilizadores</Trans>,
    path: '/admin/users',
    component: UsersAdmin,
  },
  {
    title: <Trans>Página não encontrada</Trans>,
    component: NoMatch,
  },
];
