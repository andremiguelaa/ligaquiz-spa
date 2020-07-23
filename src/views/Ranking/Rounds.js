import React from 'react';

const Rounds = ({ rounds, users }) => (
  <div>
    {rounds.map((round) => (
      <article key={round.round}>
        <h1>
          Jornada {round.round} ({round.date})
        </h1>
        <div>
          {round.games.map((game) => (
            <div key={game.id}>
              {game.solo ? (
                <>
                  {users[game.user_id_1].name} {users[game.user_id_1].surname}
                  {game.done && (
                    <>
                      {game.corrected
                        ? `: ${
                            game.user_id_1_game_points
                              ? game.user_id_1_game_points
                              : '-'
                          } (${
                            game.user_id_1_correct_answers
                              ? game.user_id_1_correct_answers
                              : '-'
                          })`
                        : ': P (P)'}
                    </>
                  )}
                </>
              ) : (
                <>
                  {users[game.user_id_1].name} {users[game.user_id_1].surname}{' '}
                  {game.done ? (
                    <>
                      {game.corrected && (
                        <>
                          {game.user_id_1_game_points
                            ? game.user_id_1_game_points
                            : '-'}
                          {game.user_id_1_game_points !== 'F' && (
                            <>
                              {' '}
                              (
                              {game.user_id_1_correct_answers
                                ? game.user_id_1_correct_answers
                                : '-'}
                              )
                            </>
                          )}{' '}
                          - {game.user_id_2_game_points !== 'F' && <>(
                          {game.user_id_1_correct_answers
                            ? game.user_id_1_correct_answers
                            : '-'}
                          ){' '}</>}
                          {game.user_id_2_game_points
                            ? game.user_id_2_game_points
                            : '-'}{' '}
                        </>
                      )}
                    </>
                  ) : (
                    <> - </>
                  )}
                  {game.done && !game.corrected && <>P (P) - (P) P </>}
                  {users[game.user_id_2].name} {users[game.user_id_2].surname}
                </>
              )}

              <div>{JSON.stringify(game)}</div>
            </div>
          ))}
        </div>
      </article>
    ))}
  </div>
);

export default Rounds;
