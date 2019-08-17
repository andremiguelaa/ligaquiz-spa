import React from "react";
import { Link } from "react-router-dom";
import { Trans } from "@lingui/macro";
import NoMatch from "pages/NoMatch";
import ControlPanelRanking from "pages/ControlPanel/ControlPanelRanking";
import classNames from "classnames";

const ControlPanel = ({
  match: {
    params: { page }
  }
}) => {
  if (page && !["ranking"].includes(page)) {
    return <NoMatch />;
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
          <li
            className={classNames({
              "is-active": page && page === "ranking"
            })}
          >
            <Link to="/control-panel/ranking">Ranking</Link>
          </li>
        </ul>
      </div>
      <div className="content">
        {
          {
            ranking: <ControlPanelRanking />
          }[page]
        }
      </div>
    </article>
  );
};

export default ControlPanel;
