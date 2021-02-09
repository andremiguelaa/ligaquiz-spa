import React from 'react';
import { Trans } from '@lingui/macro';

import Home from 'views/Home';
import Login from 'views/Login';
import RecoverPassword from 'views/RecoverPassword';
import ResetPassword from 'views/ResetPassword';
import Register from 'views/Register';
import Logout from 'views/Logout';
import Account from 'views/Account';
import Profile from 'views/Profile';
import StatisticsComparison from 'views/StatisticsComparison';
import NationalRanking from 'views/NationalRanking';
import Ranking from 'views/Ranking';
import Cup from 'views/Cup';
import Seasons from 'views/Seasons';
import Quizzes from 'views/Quizzes';
import SpecialQuizzes from 'views/SpecialQuizzes';
import Game from 'views/Game';
import CupGame from 'views/CupGame';
import Question from 'views/Question';
import Quiz from 'views/Quiz';
import SpecialQuiz from 'views/SpecialQuiz';
import Rules from 'views/Rules';
import Invitations from 'views/Invitations';
import GenreRanking from 'views/GenreRanking';
import SpecialQuizProposal from 'views/SpecialQuizProposal';

import NationalRankingAdminRankings from 'views/admin/nationalRanking/Rankings';
import NationalRankingAdminEventsList from 'views/admin/nationalRanking/Events/List';
import NationalRankingAdminEventsForm from 'views/admin/nationalRanking/Events/Form';
import NationalRankingAdminPlayersList from 'views/admin/nationalRanking/Players/List';
import NationalRankingAdminPlayersForm from 'views/admin/nationalRanking/Players/Form';
import NotificationsAdmin from 'views/admin/notifications/Notifications';
import UsersAdmin from 'views/admin/users/Users';
import QuizzesAdmin from 'views/admin/quizzes/Quizzes';
import QuizForm from 'views/admin/quizzes/QuizForm';
import QuizCorrect from 'views/admin/quizzes/QuizCorrect';
import SpecialQuizzesAdmin from 'views/admin/specialQuizzes/SpecialQuizzes';
import SpecialQuizForm from 'views/admin/specialQuizzes/SpecialQuizForm';
import SpecialQuizCorrect from 'views/admin/specialQuizzes/SpecialQuizCorrect';
import SeasonsAdmin from 'views/admin/seasons/Seasons';
import SeasonForm from 'views/admin/seasons/SeasonForm';
import Questions from 'views/admin/questions/Questions';
import ExternalQuestions from 'views/admin/externalQuestions/ExternalQuestions';

import NoMatch from 'components/NoMatch';

export default [
  {
    title: process.env.REACT_APP_NAME,
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
    title: <Trans>Regras</Trans>,
    path: '/rules',
    component: Rules,
  },
  {
    title: <Trans>Convites</Trans>,
    path: '/invitations',
    component: Invitations,
  },
  {
    title: <Trans>Rankings temáticos</Trans>,
    path: '/genre-rankings/:season?/:genre?',
    component: GenreRanking,
  },
  {
    title: <Trans>Perfil</Trans>,
    path: '/profile/:id?/:tab?',
    component: Profile,
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
    title: <Trans>Taça</Trans>,
    path: '/cup/:season?',
    component: Cup,
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
    title: <Trans>Jogo da Liga</Trans>,
    path: '/game/:date/:user1/:user2?',
    component: Game,
  },
  {
    title: <Trans>Jogo da Taça</Trans>,
    path: '/cup-game/:date/:user1/:user2',
    component: CupGame,
  },
  {
    title: <Trans>Pergunta</Trans>,
    path: '/question/:id',
    component: Question,
  },
  {
    title: <Trans>Quiz</Trans>,
    path: '/quiz/:date?',
    component: Quiz,
  },
  {
    title: <Trans>Quiz Especial</Trans>,
    path: '/special-quiz/:date?',
    component: SpecialQuiz,
  },
  {
    title: <Trans>Propor quiz especial</Trans>,
    path: '/create-special-quiz',
    component: SpecialQuizProposal,
  },
  {
    title: <Trans>Ranking Nacional | Ranking</Trans>,
    path: '/admin/national-ranking/ranking',
    component: NationalRankingAdminRankings,
  },
  {
    title: <Trans>Ranking Nacional | Provas mensais</Trans>,
    path: '/admin/national-ranking/events',
    component: NationalRankingAdminEventsList,
  },
  {
    title: <Trans>Ranking Nacional | Provas mensais | Criar</Trans>,
    path: '/admin/national-ranking/events/create',
    component: NationalRankingAdminEventsForm,
  },
  {
    title: <Trans>Ranking Nacional | Provas mensais | Editar</Trans>,
    path: '/admin/national-ranking/events/:month/edit',
    component: NationalRankingAdminEventsForm,
  },
  {
    title: <Trans>Ranking Nacional | Jogadores</Trans>,
    path: '/admin/national-ranking/players',
    component: NationalRankingAdminPlayersList,
  },
  {
    title: <Trans>Ranking Nacional | Jogadores | Criar</Trans>,
    path: '/admin/national-ranking/players/create',
    component: NationalRankingAdminPlayersForm,
  },
  {
    title: <Trans>Ranking Nacional | Jogadores | Editar</Trans>,
    path: '/admin/national-ranking/players/:id/edit',
    component: NationalRankingAdminPlayersForm,
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
    title: <Trans>Quizzes especiais</Trans>,
    path: '/admin/special-quizzes/:page?',
    component: SpecialQuizzesAdmin,
  },
  {
    title: <Trans>Quiz especial | Criar</Trans>,
    path: '/admin/special-quiz/create',
    component: SpecialQuizForm,
  },
  {
    title: <Trans>Quiz especial | Corrigir</Trans>,
    path: '/admin/special-quiz/:date/correct',
    component: SpecialQuizCorrect,
  },
  {
    title: <Trans>Quiz especial | Editar</Trans>,
    path: '/admin/special-quiz/:date/edit',
    component: SpecialQuizForm,
  },
  {
    title: <Trans>Temporadas</Trans>,
    path: '/admin/seasons/:page?',
    component: SeasonsAdmin,
  },
  {
    title: <Trans>Temporada | Criar</Trans>,
    path: '/admin/season/create',
    component: SeasonForm,
  },
  {
    title: <Trans>Temporada | Editar</Trans>,
    path: '/admin/season/:season/edit',
    component: SeasonForm,
  },
  {
    title: <Trans>Pesquisa de perguntas</Trans>,
    path: '/admin/questions',
    component: Questions,
  },
  {
    title: <Trans>Pesquisa de perguntas externas</Trans>,
    path: '/admin/external-questions',
    component: ExternalQuestions,
  },
  {
    title: <Trans>Página não encontrada</Trans>,
    component: NoMatch,
  },
];
