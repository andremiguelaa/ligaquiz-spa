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
import StatisticsComparison from 'views/StatisticsComparison';
import NationalRanking from 'views/NationalRanking';
import Ranking from 'views/Ranking';
import Seasons from 'views/Seasons';
import Quizzes from 'views/Quizzes';
import SpecialQuizzes from 'views/SpecialQuizzes';
import Game from 'views/Game';
import Quiz from 'views/Quiz';

import NationalRankingAdminRankings from 'views/admin/nationalRanking/Rankings';
import NationalRankingAdminEvents from 'views/admin/nationalRanking/Events';
import NationalRankingAdminPlayers from 'views/admin/nationalRanking/Players';
import NotificationsAdmin from 'views/admin/notifications/Notifications';
import UsersAdmin from 'views/admin/users/Users';
import QuizzesAdmin from 'views/admin/quizzes/Quizzes';
import QuizForm from 'views/admin/quizzes/QuizForm';
import QuizCorrect from 'views/admin/quizzes/QuizCorrect';
import SpecialQuizzesAdmin from 'views/admin/specialQuizzes/SpecialQuizzes';
// import SpecialQuizForm from 'views/admin/specialQuizzes/SpecialQuizForm';
import SpecialQuizCorrect from 'views/admin/specialQuizzes/SpecialQuizCorrect';

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
    title: <Trans>Comparação de Estatísticas</Trans>,
    path: '/statistics-comparison/:id1/:id2',
    component: StatisticsComparison,
  },
  {
    title: <Trans>Ranking Nacional</Trans>,
    path: '/national-ranking/:month?',
    free: true,
    component: NationalRanking,
  },
  {
    title: <Trans>Classificação</Trans>,
    path: '/ranking/:season?/:tier?',
    component: Ranking,
  },
  {
    title: <Trans>Arquivo de temporadas</Trans>,
    path: '/seasons/:page?',
    component: Seasons,
  },
  {
    title: <Trans>Arquivo de quizzes</Trans>,
    path: '/quizzes/:page?',
    component: Quizzes,
  },
  {
    title: <Trans>Arquivo de quizzes especiais</Trans>,
    path: '/special-quizzes/:page?',
    component: SpecialQuizzes,
  },
  {
    title: <Trans>Jogo</Trans>,
    path: '/game/:date/:user1/:user2?',
    component: Game,
  },
  {
    title: <Trans>Quiz</Trans>,
    path: '/quiz/:date',
    component: Quiz,
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
    title: <Trans>Quizzes</Trans>,
    path: '/admin/quizzes/:page?',
    component: QuizzesAdmin,
  },
  {
    title: <Trans>Quiz | Criar</Trans>,
    path: '/admin/quiz/create',
    component: QuizForm,
  },
  {
    title: <Trans>Quiz | Corrigir</Trans>,
    path: '/admin/quiz/:date/correct',
    component: QuizCorrect,
  },
  {
    title: <Trans>Quiz | Editar</Trans>,
    path: '/admin/quiz/:date/edit',
    component: QuizForm,
  },
  {
    title: <Trans>Special Quizzes</Trans>,
    path: '/admin/special-quizzes/:page?',
    component: SpecialQuizzesAdmin,
  },
  {
    title: <Trans>Special Quiz | Criar</Trans>,
    path: '/admin/special-quiz/create',
    // component: SpecialQuizForm,
  },
  {
    title: <Trans>Special Quiz | Corrigir</Trans>,
    path: '/admin/special-quiz/:date/correct',
    component: SpecialQuizCorrect,
  },
  {
    title: <Trans>Special Quiz | Editar</Trans>,
    path: '/admin/special-quiz/:date/edit',
    // component: SpecialQuizForm,
  },
  {
    title: <Trans>Página não encontrada</Trans>,
    component: NoMatch,
  },
];
