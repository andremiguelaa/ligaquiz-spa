import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Trans } from '@lingui/macro';
import { I18n } from '@lingui/react';
import { t } from '@lingui/macro';
import { differenceInDays } from 'date-fns';
import Cookies from 'js-cookie';
import classnames from 'classnames';

import Markdown from 'components/Markdown';
import { useStateValue } from 'state/State';
import ApiRequest from 'utils/ApiRequest';
import Loading from 'components/Loading';

import classes from './Notifications.module.scss';

const Notifications = () => {
  const location = useLocation();
  const [{ user, notifications }, dispatch] = useStateValue();
  const [specialQuizSubject, setSpecialQuizSubject] = useState();
  const prevUserValue = useRef();
  const [specialQuizWinners, setSpecialQuizWinners] = useState();

  useEffect(() => {
    const getNotifications = () => {
      ApiRequest.get('notifications?current')
        .then(({ data }) => {
          dispatch({
            type: 'notifications.set',
            payload: {
              data: data.manual,
              quiz: data.quiz,
              special_quiz: data.special_quiz,
              special_quiz_yesterday: data.special_quiz_yesterday
                ? data.special_quiz_yesterday
                : false,
              not_corrected_quizzes: data.not_corrected_quizzes,
              not_corrected_special_quizzes: data.not_corrected_special_quizzes,
              now: data.now,
            },
          });
          if (
            data.special_quiz_yesterday &&
            data.special_quiz_yesterday.winners.length > 0
          ) {
            ApiRequest.get(
              `users?${data.special_quiz_yesterday.winners
                .map((item) => `id[]=${item}`)
                .join('&')}`
            )
              .then(({ data }) => {
                setSpecialQuizWinners(
                  data.map((user) => `${user.name} ${user.surname}`)
                );
                dispatch({
                  type: 'notifications.set',
                  payload: {
                    loading: false,
                    loaded: true,
                  },
                });
              })
              .catch(() => {
                dispatch({
                  type: 'notifications.set',
                  payload: {
                    loading: false,
                  },
                });
              });
          } else {
            dispatch({
              type: 'notifications.set',
              payload: {
                loading: false,
                loaded: true,
              },
            });
          }
        })
        .catch(() => {
          dispatch({
            type: 'notifications.set',
            payload: {
              loading: false,
            },
          });
        });
    };

    let interval;
    if (user && !user.valid_roles.blocked) {
      if (!prevUserValue.current) {
        dispatch({
          type: 'notifications.set',
          payload: {
            loading: true,
          },
        });
      }
      getNotifications();
      interval = setInterval(() => {
        getNotifications();
      }, 60000);
    } else {
      dispatch({
        type: 'notifications.set',
        payload: {
          loading: false,
          loaded: true,
          data: [],
        },
      });
    }
    prevUserValue.current = user;
    return () => clearInterval(interval);
  }, [user, dispatch]);

  useEffect(() => {
    if (notifications.special_quiz) {
      ApiRequest.get('special-quizzes?today').then(({ data }) => {
        setSpecialQuizSubject(data.quiz.subject);
      });
    }
  }, [notifications.special_quiz]);

  const [
    dismissedNotificationsSlugs,
    setDismissedNotificationsSlugs,
  ] = useState(
    Cookies.get('dismissed-notifications')
      ? JSON.parse(Cookies.get('dismissed-notifications'))
      : []
  );

  const showDimissedNotifications = () => {
    setDismissedNotificationsSlugs([]);
    Cookies.set('dismissed-notifications', [], {
      expires: 365,
      sameSite: 'strict',
    });
  };

  const dismissNotification = (slug) => {
    let newCookieValue;
    newCookieValue = Cookies.get('dismissed-notifications')
      ? JSON.parse(Cookies.get('dismissed-notifications'))
      : [];
    newCookieValue.push(slug);
    setDismissedNotificationsSlugs(newCookieValue);
    Cookies.set('dismissed-notifications', [...new Set(newCookieValue)], {
      expires: 365,
      sameSite: 'strict',
    });
  };

  if (notifications.loading) {
    return <Loading />;
  }

  let regularRemainingDays;
  let specialRemainingDays;
  if (user && user.roles && notifications.now) {
    if (user.roles.regular_player) {
      regularRemainingDays = differenceInDays(
        new Date(user.roles.regular_player),
        new Date(notifications.now)
      );
    }
    if (user.roles.special_quiz_player) {
      specialRemainingDays = differenceInDays(
        new Date(user.roles.special_quiz_player),
        new Date(notifications.now)
      );
    }
  }

  if (
    notifications.data.length > 0 ||
    (notifications.special_quiz_yesterday &&
      notifications.special_quiz_yesterday.winners.length > 0) ||
    (notifications.quiz && location.pathname !== '/quiz') ||
    (notifications.special_quiz && location.pathname !== '/special-quiz') ||
    (regularRemainingDays !== undefined && regularRemainingDays < 8) ||
    (specialRemainingDays !== undefined && specialRemainingDays < 8) ||
    (user && user.roles === null) ||
    notifications.not_corrected_quizzes ||
    notifications.not_corrected_special_quizzes
  ) {
    const {
      customNotifications,
      dismissedNotifications,
    } = notifications.data.reduce(
      (acc, item) => {
        if (!dismissedNotificationsSlugs.includes(`custom-${item.id}`)) {
          acc.customNotifications.push(item);
        } else {
          acc.dismissedNotifications.push(item);
        }
        return acc;
      },
      { customNotifications: [], dismissedNotifications: [] }
    );

    const dismissedSpecialQuizNotification =
      notifications.special_quiz_yesterday?.winners?.length > 0 &&
      dismissedNotificationsSlugs.includes(
        `special-quiz-${notifications.special_quiz_yesterday.date}`
      );

    let dismissedNotificationsCount = dismissedNotifications.length;
    if (dismissedSpecialQuizNotification) {
      dismissedNotificationsCount++;
    }

    return (
      <section className="section">
        {user && user.roles === null && (
          <div className={`notification is-info`}>
            <Trans>
              Obrigado pela tua inscrição! O teu registo encontra-se a aguardar
              aprovação da equipa da {process.env.REACT_APP_NAME}.
            </Trans>
          </div>
        )}
        {dismissedNotificationsCount > 0 && (
          <div className="is-clearfix">
            <button
              className={classnames(
                'button',
                'is-small',
                'is-warning',
                'is-pulled-right',
                classes.showDismissedButton
              )}
              onClick={() => showDimissedNotifications()}
            >
              {dismissedNotificationsCount === 1 ? (
                <Trans>Mostrar notificação oculta</Trans>
              ) : (
                <>
                  <Trans>Mostrar notificações ocultas</Trans> (
                  {dismissedNotificationsCount})
                </>
              )}
            </button>
          </div>
        )}
        {customNotifications.map((notification) => (
          <div
            key={notification.id}
            className={`notification is-${notification.type}`}
          >
            <button
              className="delete"
              onClick={() => dismissNotification(`custom-${notification.id}`)}
            ></button>
            <Markdown content={notification.content} />
          </div>
        ))}
        {regularRemainingDays !== undefined && regularRemainingDays < 8 && (
          <div className={`notification is-danger`}>
            {regularRemainingDays > 1 && (
              <Trans>
                A tua subscrição para jogar quizzes da liga termina daqui a{' '}
                {regularRemainingDays} dias.
              </Trans>
            )}
            {regularRemainingDays === 1 && (
              <Trans>
                A tua subscrição para jogar quizzes da liga termina amanhã.
              </Trans>
            )}
            {regularRemainingDays === 0 && (
              <Trans>
                A tua subscrição para jogar quizzes da liga termina hoje.
              </Trans>
            )}
            {regularRemainingDays < 0 && (
              <Trans>
                A tua subscrição para jogar quizzes da liga expirou.
              </Trans>
            )}{' '}
            <Trans>
              Clica <Link to="/rules#subscription">aqui</Link> para saber como
              renovar.
            </Trans>
          </div>
        )}
        {specialRemainingDays !== undefined && specialRemainingDays < 8 && (
          <div className={`notification is-danger`}>
            {specialRemainingDays > 1 && (
              <Trans>
                A tua subscrição para jogar quizzes especiais termina daqui a{' '}
                {specialRemainingDays} dias.
              </Trans>
            )}
            {specialRemainingDays === 1 && (
              <Trans>
                A tua subscrição para jogar quizzes especiais termina amanhã.
              </Trans>
            )}
            {specialRemainingDays === 0 && (
              <Trans>
                A tua subscrição para jogar quizzes especiais termina hoje.
              </Trans>
            )}
            {specialRemainingDays < 0 && (
              <Trans>
                A tua subscrição para jogar quizzes especiais expirou.
              </Trans>
            )}{' '}
            <Trans>
              Clica <Link to="/rules#subscription">aqui</Link> para saber como
              renovar.
            </Trans>
          </div>
        )}
        {specialQuizWinners &&
          notifications.special_quiz_yesterday?.winners?.length > 0 &&
          !dismissedNotificationsSlugs.includes(
            `special-quiz-${notifications.special_quiz_yesterday.date}`
          ) && (
            <div className={`notification is-warning`}>
              <button
                className="delete"
                onClick={() =>
                  dismissNotification(
                    `special-quiz-${notifications.special_quiz_yesterday.date}`
                  )
                }
              ></button>
              {notifications.special_quiz_yesterday.winners.length > 1 ? (
                <I18n>
                  {({ i18n }) => (
                    <Trans>
                      A vitória no quiz especial{' '}
                      <Link
                        to={`/special-quiz/${notifications.special_quiz_yesterday.date}`}
                      >
                        <em>{notifications.special_quiz_yesterday.subject}</em>
                      </Link>{' '}
                      é d@
                      {specialQuizWinners.slice(0, -1).join(i18n._(t`, d@`)) +
                        ' ' +
                        i18n._(t`e d@`) +
                        ' ' +
                        specialQuizWinners.slice(-1)}. Parabéns!
                    </Trans>
                  )}
                </I18n>
              ) : (
                <Trans>
                  A vitória no quiz especial{' '}
                  <Link
                    to={`/special-quiz/${notifications.special_quiz_yesterday.date}`}
                  >
                    <em>{notifications.special_quiz_yesterday.subject}</em>
                  </Link>{' '}
                  é d@ {specialQuizWinners[0]}. Parabéns!
                </Trans>
              )}
            </div>
          )}
        {notifications.quiz && location.pathname !== '/quiz' && (
          <div className={`notification is-info`}>
            <Link to="/quiz">
              <Trans>Quiz de hoje disponível aqui</Trans>
            </Link>
          </div>
        )}
        {notifications.special_quiz && location.pathname !== '/special-quiz' && (
          <div className={`notification is-info`}>
            <Link to="/special-quiz">
              <Trans>Quiz especial disponível aqui</Trans>
              {specialQuizSubject && `: ${specialQuizSubject}`}
            </Link>
          </div>
        )}
        {(notifications.not_corrected_quizzes ||
          notifications.not_corrected_special_quizzes) && (
          <div className={`notification is-warning`}>
            {notifications.not_corrected_quizzes && (
              <>
                <strong>
                  <Trans>Quizzes por corrigir</Trans>:
                </strong>{' '}
                {notifications.not_corrected_quizzes
                  .map((quiz) => (
                    <Link key={quiz} to={`/admin/quiz/${quiz}/correct`}>
                      {quiz}
                    </Link>
                  ))
                  .reduce((prev, curr) => [prev, ' / ', curr])}
              </>
            )}
            {notifications.not_corrected_quizzes &&
              notifications.not_corrected_special_quizzes && <br />}
            {notifications.not_corrected_special_quizzes && (
              <>
                <strong>
                  <Trans>Quizzes especiais por corrigir</Trans>:
                </strong>{' '}
                {notifications.not_corrected_special_quizzes
                  .map((quiz) => (
                    <Link key={quiz} to={`/admin/special-quiz/${quiz}/correct`}>
                      {quiz}
                    </Link>
                  ))
                  .reduce((prev, curr) => [prev, ' / ', curr])}
              </>
            )}
          </div>
        )}
      </section>
    );
  }
  return null;
};

export default Notifications;
