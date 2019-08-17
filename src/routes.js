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
    slug: "home",
    title: <Trans>Liga Quiz</Trans>,
    exact: true,
    path: "/",
    component: Home
  },
  {
    slug: "login",
    title: <Trans>Entrar</Trans>,
    exact: true,
    path: "/login",
    component: Login
  },
  {
    slug: "recover-password",
    title: <Trans>Recuperar palavra-passe</Trans>,
    exact: true,
    path: "/recover-password",
    component: RecoverPassword
  },
  {
    slug: "reset-password",
    title: <Trans>Redefinir palavra-passe</Trans>,
    exact: true,
    path: "/reset-password/:token",
    component: ResetPassword
  },
  {
    slug: "register",
    title: <Trans>Registo</Trans>,
    exact: true,
    path: "/register",
    component: Register
  },
  {
    slug: "logout",
    title: <Trans>Sair</Trans>,
    exact: true,
    path: "/logout",
    component: Logout
  },
  {
    slug: "no-match",
    title: <Trans>Página não encontrada</Trans>,
    component: NoMatch
  }
];
