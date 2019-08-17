import React from "react";
import { Trans } from "@lingui/macro";

import Home from "pages/Home";
import Login from "pages/Login";
import RecoverPassword from "pages/RecoverPassword";
import ResetPassword from "pages/ResetPassword";
import Register from "pages/Register";
import Logout from "pages/Logout";
import NoMatch from "pages/NoMatch";

export default [
  {
    title: <Trans>Liga Quiz</Trans>,
    root: true,
    exact: true,
    path: "/",
    component: Home
  },
  {
    title: <Trans>Entrar</Trans>,
    exact: true,
    path: "/login",
    component: Login
  },
  {
    title: <Trans>Recuperar palavra-passe</Trans>,
    exact: true,
    path: "/recover-password",
    component: RecoverPassword
  },
  {
    title: <Trans>Redefinir palavra-passe</Trans>,
    exact: true,
    path: "/reset-password/:token",
    component: ResetPassword
  },
  {
    title: <Trans>Registo</Trans>,
    exact: true,
    path: "/register",
    component: Register
  },
  {
    title: <Trans>Sair</Trans>,
    exact: true,
    path: "/logout",
    component: Logout
  },
  {
    title: <Trans>Página não encontrada</Trans>,
    component: NoMatch
  }
];
