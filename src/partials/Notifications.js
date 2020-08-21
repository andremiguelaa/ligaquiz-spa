import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Trans } from '@lingui/macro';
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

  useEffect(() => {
    const getNotifications = () => {
      ApiRequest.get('notifications?current')
        .then(({ data }) => {
          dispatch({
            type: 'notifications.set',
            payload: {
              loading: false,
              loaded: true,
              data: data.manual,
              quiz: data.quiz,
              special_quiz: data.special_quiz,
              now: data.now,
            },
          });
        })
        .finally(() => {
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

  let remainingDays;
  if (user && notifications.now) {
    if (user.roles.regular_player) {
      remainingDays = differenceInDays(
        new Date(user.roles.regular_player),
        new Date(notifications.now)
      );
    } else if (user.roles.special_quiz_player) {
      remainingDays = differenceInDays(
        new Date(user.roles.special_quiz_player),
        new Date(notifications.now)
      );
    }
  }

  if (
    notifications.data.length > 0 ||
    (notifications.quiz && location.pathname !== '/quiz') ||
    (notifications.special_quiz && location.pathname !== '/special-quiz') ||
    (remainingDays !== undefined && remainingDays < 8)
  ) {
    return (
      <section className="section">
        {notifications.data.map((notification) => (
          <div
            key={notification.id}
            className={`notification is-${notification.type}`}
          >
            <Markdown content={notification.content} />
          </div>
        ))}
        {remainingDays !== undefined && remainingDays < 8 && (
          <div className={`notification is-danger`}>
            {remainingDays > 1 && (
              <Trans>
                A tua subscrição termina daqui a {remainingDays} dias.
              </Trans>
            )}
            {remainingDays === 1 && (
              <Trans>A tua subscrição termina amanhã.</Trans>
            )}
            {remainingDays === 0 && (
              <Trans>A tua subscrição termina hoje.</Trans>
            )}
            {remainingDays < 0 && <Trans>A tua subscrição expirou.</Trans>}{' '}
            <Trans>
              Clica <Link to="/rules#subscription">aqui</Link> para saber como
              renovar.
            </Trans>
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
      </section>
    );
  }
  return null;
};

export default Notifications;
