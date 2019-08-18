import React from 'react';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import { Trans } from '@lingui/macro';
import classNames from 'classnames';

import NoMatch from 'components/NoMatchMatch';
import ControlPanelProfile from 'components/ControlPanel/ControlPanelProfileofile';
import ControlPanelRanking from 'components/ControlPanel/ControlPanelRankingnking';

const pages = {
  profile: {
    title: <Trans>Perfil</Trans>,
    component: <ControlPanelProfile />
  },
  ranking: {
    title: <Trans>Ranking</Trans>,
    component: <ControlPanelRanking />
  }
};

const ControlPanel = ({
  match: {
    params: { page }
  }
}) => {
  if (page && !Object.keys(pages).includes(page)) {
    return <NoMatch />;
  }
  if (!page) {
    return <Redirect to="/control-panel/profile" />;
  }
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
                'is-active': page && page === key
              })}
            >
              <Link to={`/control-panel/${key}`}>{value.title}</Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="message-body">
        <div className="content">{pages[page].component}</div>
      </div>
    </article>
  );
};

export default ControlPanel;
