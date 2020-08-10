import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import moment from 'moment';
import { Trans } from '@lingui/macro';

import Markdown from 'components/Markdown';
import { useStateValue } from 'state/State';
import ApiRequest from 'utils/ApiRequest';
import Loading from 'components/Loading';

const Header = () => {
  const [{ user }] = useStateValue();
  const location = useLocation();
  const [notifications, setNotifications] = useState({
    notifications: [],
    quiz: false,
    submitted_quiz: false,
  });
  const [loading, setLoading] = useState({
    notifications: false,
    quiz: false,
    special_quiz: false,
  });
  const [specialQuiz, setSpecialQuiz] = useState();

  useEffect(() => {
    const getNotifications = () => {
      ApiRequest.get('notifications?current')
        .then(({ data }) => {
          setNotifications((prev) => ({
            ...prev,
            notifications: data,
          }));
        })
        .finally(() => {
          setLoading((prev) => ({
            ...prev,
            notifications: true,
          }));
        });
      if (
        user.roles.admin ||
        user.roles.regular_player >= moment().format('YYYY-MM-DD')
      ) {
        ApiRequest.get('quizzes?today')
          .then(({ data }) => {
            setNotifications((prev) => ({
              ...prev,
              quiz: !data.quiz.submitted,
            }));
          })
          .catch(({ response }) => {
            if (response?.status === 404) {
              setNotifications((prev) => ({
                ...prev,
                quiz: false,
              }));
            }
          })
          .finally(() => {
            setLoading((prev) => ({
              ...prev,
              quiz: true,
            }));
          });
      } else {
        setLoading((prev) => ({
          ...prev,
          quiz: true,
        }));
      }
      if (
        user.roles.admin ||
        user.roles.regular_player >= moment().format('YYYY-MM-DD') ||
        user.roles.specialquiz_player >= moment().format('YYYY-MM-DD')
      ) {
        ApiRequest.get('special-quizzes?today')
          .then(({ data }) => {
            setSpecialQuiz(data.quiz);
            setNotifications((prev) => ({
              ...prev,
              special_quiz: true,
            }));
          })
          .catch(({ response }) => {
            if (response?.status === 404) {
              setNotifications((prev) => ({
                ...prev,
                special_quiz: false,
              }));
            }
          })
          .finally(() => {
            setLoading((prev) => ({
              ...prev,
              special_quiz: true,
            }));
          });
      } else {
        setLoading((prev) => ({
          ...prev,
          quiz: true,
        }));
      }
    };

    let interval;
    if (user && !user.roles.blocked) {
      setLoading(true);
      getNotifications();
      interval = setInterval(() => {
        getNotifications();
      }, 60000);
    } else {
      setNotifications();
    }
    return () => clearInterval(interval);
  }, [user]);

  if (!loading.notifications || !loading.quiz || !loading.special_quiz) {
    return <Loading />;
  }

  if (
    notifications.notifications.length > 0 ||
    notifications.quiz ||
    notifications.special_quiz
  ) {
    return (
      <section className="section">
        {notifications.notifications.map((notification) => (
          <div
            key={notification.id}
            className={`notification is-${notification.type}`}
          >
            <Markdown content={notification.content} />
          </div>
        ))}
        {notifications.quiz && location.pathname !== '/quiz' && (
          <div className={`notification is-info`}>
            <Trans>
              Quiz de hoje disponível <Link to="/quiz">aqui</Link>
            </Trans>
          </div>
        )}
        {notifications.special_quiz && location.pathname !== '/special-quiz' && (
          <div className={`notification is-info`}>
            <Trans>
              Quiz especial disponível:{' '}
              <Link to="/special-quiz">{specialQuiz.subject}</Link>
            </Trans>
          </div>
        )}
      </section>
    );
  }
  return null;
};

export default Header;
