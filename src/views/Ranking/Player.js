import React from 'react';
import { Link } from 'react-router-dom';
import classnames from 'classnames';

import getAcronym from 'utils/getAcronym';

import classes from './Ranking.module.scss';

const Player = ({ player, index, tierNumber, users }) => (
  <tr
    className={classnames({
      'has-background-warning': player.forfeits === 3,
      'has-background-success':
        (index === 0 || (index === 1 && tierNumber > 1)) && player.forfeits < 3,
      'has-background-danger': index >= 8 || player.forfeits > 3,
    })}
  >
    <td className={classes.rankCell}>{player.rank}</td>
    <td className={classes.userCellContent}>
      <Link to={`/statistics/${player.id}`}>
        <div className={classes.avatar}>
          {users[player.id].avatar ? (
            <img
              alt={`${users[player.id].name} ${users[player.id].surname}`}
              src={users[player.id].avatar}
            />
          ) : (
            <i className="fa fa-user" />
          )}
        </div>
        <span className="is-hidden-mobile">
          {users[player.id].name} {users[player.id].surname}
        </span>
        <abbr
          data-tooltip={`${users[player.id].name} ${users[player.id].surname}`}
          className="is-hidden-tablet"
        >
          {getAcronym(users[player.id].name)}
          {getAcronym(users[player.id].surname)}
        </abbr>
      </Link>
      {users[player.id].national_rank && (
        <Link to="/national-ranking" className={classes.nationalRank}>
          {users[player.id].national_rank}
        </Link>
      )}
    </td>
    <td className="has-text-centered">{player.league_points}</td>
    <td className="has-text-centered">{player.game_points}</td>
    <td className="has-text-centered">{player.game_points_against}</td>
    <td className="has-text-centered">
      {player.game_points - player.game_points_against}
    </td>
    <td className="has-text-centered">{player.played_games}</td>
    <td className="has-text-centered">{player.forfeits}</td>
    <td className="has-text-centered">{player.wins}</td>
    <td className="has-text-centered">{player.draws}</td>
    <td className="has-text-centered">{player.losses}</td>
    <td className="has-text-centered">{player.correct_answers}</td>
  </tr>
);

export default Player;
