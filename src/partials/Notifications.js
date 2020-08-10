import React, { useState, useEffect } from 'react';
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
    if (user && !user.roles.blocked) {
      dispatch({
        type: 'notifications.set',
        payload: {
          loading: true,
        },
      });
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
    return () => clearInterval(interval);
  }, [user]);

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
    notifications.quiz ||
    notifications.special_quiz
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
          <Link to="/quiz">
            <div className={`notification is-info`}>
              <u>
                <Trans>Quiz de hoje disponível aqui</Trans>
              </u>
            </div>
          </Link>
        )}
        {notifications.special_quiz && location.pathname !== '/special-quiz' && (
          <Link to="/special-quiz">
            <div className={`notification is-info`}>
              <u>
                <Trans>
                  Quiz especial disponível aqui
                  {specialQuizSubject && `: ${specialQuizSubject}`}
                </Trans>
              </u>
            </div>
          </Link>
        )}
      </section>
    );
  }
  return null;
};

export default Notifications;
