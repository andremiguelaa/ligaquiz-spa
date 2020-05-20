import React from 'react';
import { Link } from 'react-router-dom';
import { Trans } from '@lingui/macro';
import classNames from 'classnames';

import { useStateValue } from 'state/State';
import NoMatch from './NoMatch';
import Forbidden from './Forbidden';
import Profile from './ControlPanel/Profile';
import Ranking from './ControlPanel/Ranking';

const pages = {
  // TO DO: filter pages by role permissions
  profile: {
    title: <Trans>Perfil</Trans>,
    component: Profile,
  },
  ranking: {
    title: <Trans>Ranking</Trans>,
    component: Ranking,
  },
};

const ControlPanel = ({
  match: {
    params: { page = 'profile', arg1, arg2 },
  },
}) => {
  const [{ user }] = useStateValue();
  if (page && !Object.keys(pages).includes(page)) {
    return <NoMatch />;
  }
  if (!user) {
    return <Forbidden />;
  }
  const Page = pages[page].component;
  return (
    <article className="message">
      <div className="message-header">
        <h1>
          <Trans>Painel de controlo</Trans>
        </h1>
      </div>
      <div className="tabs is-fullwidth">
        <ul>
          {Object.entries(pages).map(([key, value]) => (
            <li
              key={key}
              className={classNames({
                'is-active': page && page === key,
              })}
            >
              <Link to={`/control-panel/${key}`}>{value.title}</Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="message-body">
        <div className="content"><Page arg1={arg1} arg2={arg2} /></div>
      </div>
    </article>
  );
};

export default ControlPanel;
