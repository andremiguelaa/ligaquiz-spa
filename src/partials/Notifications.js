import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Trans } from '@lingui/macro';
import { I18n } from '@lingui/react';
import { t } from '@lingui/macro';
import { differenceInDays } from 'date-fns';

import Markdown from 'components/Markdown';
import { useStateValue } from 'state/State';
import ApiRequest from 'utils/ApiRequest';
import Loading from 'components/Loading';

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
          if (data.special_quiz_yesterday) {
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
    notifications.special_quiz_yesterday ||
    (notifications.quiz && location.pathname !== '/quiz') ||
    (notifications.special_quiz && location.pathname !== '/special-quiz') ||
    (regularRemainingDays !== undefined && regularRemainingDays < 8) ||
    (specialRemainingDays !== undefined && specialRemainingDays < 8) ||
    (user && user.roles === null) ||
    notifications.not_corrected_quizzes ||
    notifications.not_corrected_special_quizzes
  ) {
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
        {notifications.data.map((notification) => (
          <div
            key={notification.id}
            className={`notification is-${notification.type}`}
          >
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
        {notifications.special_quiz_yesterday && (
          <div className={`notification is-warning`}>
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
                      specialQuizWinners.slice(-1)}
                    . Parabéns!
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
                  <Trans>Quizzes por corrigir:</Trans>
                </strong>{' '}
                {notifications.not_corrected_quizzes
                  .map((quiz) => (
                    <Link to={`/admin/quiz/${quiz}/correct`}>{quiz}</Link>
                  ))
                  .reduce((prev, curr) => [prev, ' / ', curr])}
              </>
            )}
            {notifications.not_corrected_quizzes &&
              notifications.not_corrected_special_quizzes && <br />}
            {notifications.not_corrected_special_quizzes && (
              <>
                <strong>
                  <Trans>Quizzes especiais por corrigir:</Trans>
                </strong>{' '}
                {notifications.not_corrected_special_quizzes
                  .map((quiz) => (
                    <Link to={`/admin/special-quiz/${quiz}/correct`}>{quiz}</Link>
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
