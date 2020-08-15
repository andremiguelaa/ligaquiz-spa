import React from 'react';
import { Trans } from '@lingui/macro';
import classnames from 'classnames';

import classes from './Quizzes.module.scss';

const Answer = ({ answer, correctAnswers }) => (
  <tr
    className={classnames({
      'has-background-warning': !answer.corrected,
      'has-background-success': answer.correct,
      'has-background-danger': answer.corrected && !answer.correct,
    })}
  >
    <td className="is-vertical-middle">{answer.text}</td>
    <td className={classnames('is-vertical-middle', classes.statusCell)}>
      {Boolean(answer.correct) && <Trans>Correcta</Trans>}
      {Boolean(answer.corrected && !answer.correct) && <Trans>Errada</Trans>}
      {!answer.corrected && '-'}
    </td>
    <td className={classes.actionsCell}>
      <div className="buttons has-addons is-pulled-right">
        <button
          className={classnames('button', {
            'is-success': !answer.correct,
          })}
          disabled={answer.correct || answer.loading}
          onClick={() => {
            correctAnswers(answer.id, answer.question_id, true);
          }}
        >
          <span className="icon">
            <i className="fa fa-check"></i>
          </span>
        </button>
        <button
          className={classnames('button', {
            'is-danger': answer.correct || !answer.corrected,
          })}
          disabled={(answer.corrected && !answer.correct) || answer.loading}
          onClick={() => {
            correctAnswers(answer.id, answer.question_id, false);
          }}
        >
          <span className="icon">
            <i className="fa fa-times"></i>
          </span>
        </button>
      </div>
    </td>
  </tr>
);

export default Answer;
