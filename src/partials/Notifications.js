import React, { useState, useEffect } from 'react';

import Markdown from 'components/Markdown';
import { useStateValue } from 'state/State';
import ApiRequest from 'utils/ApiRequest';
import Loading from 'components/Loading';

const Header = () => {
  const [{ user }] = useStateValue();
  const [notifications, setNotifications] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getNotifications = () => {
      ApiRequest.get('notifications?current')
        .then(({ data }) => {
          setNotifications(data);
        })
        .finally(() => {
          setLoading(false);
        });
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

  if (loading) {
    return <Loading />;
  }

  if (notifications.length > 0) {
    return (
      <section className="section">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`notification is-${notification.type}`}
          >
            <Markdown content={notification.content} />
          </div>
        ))}
      </section>
    );
  }
  return null;
};

export default Header;
