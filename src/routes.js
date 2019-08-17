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
    path: "/",
    component: Home
  },
  {
    title: <Trans>Entrar</Trans>,
    path: "/login",
    component: Login
  },
  {
    title: <Trans>Recuperar palavra-passe</Trans>,
    path: "/recover-password",
    component: RecoverPassword
  },
  {
    title: <Trans>Redefinir palavra-passe</Trans>,
    path: "/reset-password/:token",
    component: ResetPassword
  },
  {
    title: <Trans>Registo</Trans>,
    path: "/register",
    component: Register
  },
  {
    title: <Trans>Sair</Trans>,
    path: "/logout",
    component: Logout
  },
  {
    title: <Trans>Página não encontrada</Trans>,
    component: NoMatch
  }
];
