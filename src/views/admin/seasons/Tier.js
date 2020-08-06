import React, { useState } from 'react';
import { Trans } from '@lingui/macro';

import Modal from 'components/Modal';

const Tier = ({
  league,
  index,
  formData,
  setFormData,
  users,
  remainingUsers,
  disabled,
}) => {
  const [addPlayersModal, setAddPlayersModal] = useState(false);
  const [playersToAdd, setPlayersToAdd] = useState([]);

  const userToShow = [
    ...new Set(playersToAdd.map((id) => users[id]).concat(remainingUsers)),
  ].sort((a, b) =>
    `${a.name} ${a.surname}`.localeCompare(`${b.name} ${b.surname}`)
  );

  return (
    <>
      <fieldset className="fieldset">
        <legend className="legend">
          <Trans>{league.tier}ª divisão</Trans>
        </legend>
        {league.user_ids.length > 0 && (
          <div className="field">
            {league.user_ids.map((id) => (
              <div key={id}>
                {users[id].name} {users[id].surname}
              </div>
            ))}
          </div>
        )}
        <div className="field">
          <button
            disabled={disabled}
            type="button"
            className="button"
            onClick={() => {
              setPlayersToAdd(league.user_ids);
              setAddPlayersModal(true);
            }}
          >
            <span className="icon">
              <i className="fa fa-plus"></i>
            </span>
            <span>
              <Trans>Editar jogadores</Trans>
            </span>
          </button>
        </div>
      </fieldset>
      {index === formData.leagues.length - 1 && (
        <div className="field">
          <button
            disabled={disabled}
            type="button"
            className="button is-danger"
            onClick={() => {
              setFormData((prev) => ({
                ...prev,
                leagues: [...prev.leagues.slice(0, prev.leagues.length - 1)],
              }));
            }}
          >
            <span className="icon">
              <i className="fa fa-trash"></i>
            </span>
            <span>
              <Trans>Remover última divisão</Trans>
            </span>
          </button>
        </div>
      )}
      {addPlayersModal && (
        <Modal
          type="info"
          open={addPlayersModal}
          title={<Trans>Editar jogadores</Trans>}
          body={
            <>
              <Trans>
                Selecciona os jogadores que farão parte desta divisão:
              </Trans>
              <br />
              <br />
              {userToShow.map((user) => (
                <div key={user.id}>
                  <label className="checkbox">
                    <input
                      disabled={
                        playersToAdd.length === 10 &&
                        !playersToAdd.includes(user.id)
                      }
                      type="checkbox"
                      checked={playersToAdd.includes(user.id)}
                      value={user.id}
                      onChange={(event) => {
                        const newPlayersToAdd = [...playersToAdd];
                        if (event.target.checked) {
                          newPlayersToAdd.push(parseInt(event.target.value));
                          setPlayersToAdd(newPlayersToAdd);
                        } else {
                          setPlayersToAdd(
                            newPlayersToAdd.filter(
                              (playerToAdd) =>
                                playerToAdd !== parseInt(event.target.value)
                            )
                          );
                        }
                      }}
                    />{' '}
                    {user.name} {user.surname} ({user.email})
                  </label>
                </div>
              ))}
            </>
          }
          action={() => {
            setAddPlayersModal(false);
            setFormData((prev) => {
              const newFormData = { ...prev };
              newFormData.leagues[index].user_ids = playersToAdd;
              return newFormData;
            });
          }}
          onClose={() => setAddPlayersModal(false)}
        />
      )}
    </>
  );
};

export default Tier;
