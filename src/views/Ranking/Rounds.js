import React, { useState } from 'react';
import classnames from 'classnames';

import Game from './Game';

import classes from './Ranking.module.scss';

const Rounds = ({ rounds, users }) => {
  const [currentRound, setCurrentRound] = useState(1);
  return (
    <section className={classes.roundsWrapper}>
      <header className={classes.header}>
        <button
          className="button is-primary"
          onClick={() => setCurrentRound((prev) => prev - 1)}
          disabled={currentRound <= 1}
        >
          Anterior
        </button>
        <h1 className="is-size-4">Calendário</h1>
        <button
          className="button is-primary"
          onClick={() => setCurrentRound((prev) => prev + 1)}
          disabled={currentRound >= 19}
        >
          Próxima
        </button>
      </header>
      <div className={classes.rounds}>
        {rounds.map((round) => {
          if (
            round.round === currentRound ||
            round.round === currentRound + 1
          ) {
            return (
              <article key={round.round} className={classes.round}>
                <h1 className={classnames('is-size-5', classes.title)}>
                  Jornada {round.round} ({round.date})
                </h1>
                <div className={classes.games}>
                  {round.games.map((game) => (
                    <Game
                      key={game.id}
                      round={round}
                      game={game}
                      users={users}
                    />
                  ))}
                </div>
              </article>
            );
          }
          return null;
        })}
      </div>
    </section>
  );
};

export default Rounds;
