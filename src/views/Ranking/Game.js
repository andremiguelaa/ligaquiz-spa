import React from 'react';
import { Link } from 'react-router-dom';
import classnames from 'classnames';

import getAcronym from 'utils/getAcronym';

import classes from './Ranking.module.scss';

const Game = ({ round, game, users }) => (
  <div className={classnames(classes.game, { [classes.solo]: game.solo })}>
    {game.solo ? (
      <>
        <div className={classes.avatarCell}>
          <div className={classes.avatar}>
            {users[game.user_id_1].avatar ? (
              <img
                alt={`${users[game.user_id_1].name} ${
                  users[game.user_id_1].surname
                }`}
                src={users[game.user_id_1].avatar}
              />
            ) : (
              <i className="fa fa-user" />
            )}
          </div>
        </div>
        <div className={classnames(classes.nameCell, classes.solo)}>
          <span className="is-hidden-mobile">
            {users[game.user_id_1].name} {users[game.user_id_1].surname}
          </span>
          <abbr
            data-tooltip={`${users[game.user_id_1].name} ${
              users[game.user_id_1].surname
            }`}
            className="is-hidden-tablet"
          >
            {getAcronym(users[game.user_id_1].name)}
            {getAcronym(users[game.user_id_1].surname)}
          </abbr>
        </div>
        <div className={classnames(classes.resultCell, classes.solo)}>
          {game.done ? (
            <>
              {game.corrected ? (
                <>
                  {game.hasOwnProperty('user_id_1_game_points') ? (
                    <Link to={`/game/${round.date}/${game.user_id_1}`}>
                      {game.user_id_1_game_points
                        ? game.user_id_1_game_points
                        : '-'}{' '}
                      {Boolean(
                        game.user_id_1_correct_answers &&
                          game.user_id_1_game_points !== 'F'
                      ) && `(${game.user_id_1_correct_answers})`}
                    </Link>
                  ) : (
                    '-'
                  )}
                </>
              ) : (
                <div>P</div>
              )}
            </>
          ) : (
            '-'
          )}
        </div>
      </>
    ) : (
      <>
        <div className={classnames(classes.nameCell, classes.home)}>
          <span className="is-hidden-mobile">
            {users[game.user_id_1].name} {users[game.user_id_1].surname}
          </span>
          <abbr
            data-tooltip={`${users[game.user_id_1].name} ${
              users[game.user_id_1].surname
            }`}
            className="is-hidden-tablet"
          >
            {getAcronym(users[game.user_id_1].name)}
            {getAcronym(users[game.user_id_1].surname)}
          </abbr>
        </div>
        <div className={classes.avatarCell}>
          <div className={classes.avatar}>
            {users[game.user_id_1].avatar ? (
              <img
                alt={`${users[game.user_id_1].name} ${
                  users[game.user_id_1].surname
                }`}
                src={users[game.user_id_1].avatar}
              />
            ) : (
              <i className="fa fa-user" />
            )}
          </div>
        </div>
        <div className={classes.resultCell}>
          {game.done &&
          game.hasOwnProperty('user_id_1_game_points') &&
          game.hasOwnProperty('user_id_2_game_points') ? (
            <Link
              to={`/game/${round.date}/${game.user_id_1}/${game.user_id_2}`}
            >
              {game.corrected && (
                <>
                  {game.user_id_1_game_points}
                  {game.user_id_1_game_points !== 'F' && (
                    <> ({game.user_id_1_correct_answers})</>
                  )}{' '}
                  -{' '}
                  {game.user_id_2_game_points !== 'F' && (
                    <>({game.user_id_2_correct_answers})</>
                  )}{' '}
                  {game.user_id_2_game_points}{' '}
                </>
              )}
            </Link>
          ) : (
            'vs.'
          )}
          {game.done && !game.corrected && <div>P</div>}
        </div>
        <div className={classes.avatarCell}>
          <div className={classes.avatar}>
            {users[game.user_id_2].avatar ? (
              <img
                alt={`${users[game.user_id_2].name} ${
                  users[game.user_id_2].surname
                }`}
                src={users[game.user_id_2].avatar}
              />
            ) : (
              <i className="fa fa-user" />
            )}
          </div>
        </div>
        <div className={classnames(classes.nameCell, classes.away)}>
          <span className="is-hidden-mobile">
            {users[game.user_id_2].name} {users[game.user_id_2].surname}
          </span>
          <abbr
            data-tooltip={`${users[game.user_id_2].name} ${
              users[game.user_id_2].surname
            }`}
            className="is-hidden-tablet"
          >
            {getAcronym(users[game.user_id_2].name)}
            {getAcronym(users[game.user_id_2].surname)}
          </abbr>
        </div>
      </>
    )}
  </div>
);

export default Game;
