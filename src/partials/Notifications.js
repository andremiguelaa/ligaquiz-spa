import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Trans } from '@lingui/macro';

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

  if (
    notifications.data.length > 0 ||
    (notifications.quiz && location.pathname !== '/quiz') ||
    (notifications.special_quiz && location.pathname !== '/special-quiz')
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
