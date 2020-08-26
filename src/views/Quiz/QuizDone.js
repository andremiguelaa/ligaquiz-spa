import React from 'react';
import { Link } from 'react-router-dom';
import { Trans } from '@lingui/macro';
import classnames from 'classnames';

import renderMedia from 'utils/renderMedia';
import Markdown from 'components/Markdown';

import classes from './Quiz.module.scss';

const QuizDone = ({ data, userAnswers }) => (
  <>
    {data.quiz.questions.map((question, index) => (
      <div key={question.id} className={classes.question}>
        <h2 className="subtitle has-text-weight-bold">
          <Trans>Pergunta {index + 1}</Trans>
        </h2>
        {question.content && (
          <div className={classes.questionText}>
            <Markdown content={question.content} />
          </div>
        )}
        {question.answer && (
          <div>
            <strong>
              <Trans>Resposta correcta</Trans>:
            </strong>{' '}
            {question.answer}
          </div>
        )}
        {userAnswers?.[question.id]?.[0] && (
          <div>
            <strong>
              <Trans>Resposta dada</Trans>:
            </strong>{' '}
            {userAnswers[question.id][0].text
              ? userAnswers[question.id][0].text
              : '-'}
          </div>
        )}
        {!data.quiz.solo && userAnswers?.[question.id]?.[0] && (
          <div>
            <strong>
              <Trans>Pontos atribuídos ao adverário</Trans>:
            </strong>{' '}
            {userAnswers[question.id][0].points}
          </div>
        )}
        {question.hasOwnProperty('percentage') && (
          <div>
            <strong>
              <Trans>Percentagem de acerto</Trans>:
            </strong>{' '}
            <Link to={`/question/${question.id}`}>
              {Math.round(question.percentage)}%
            </Link>
          </div>
        )}
        {question.media_id && (
          <div
            className={classnames(
              classes.media,
              classes[data.media[question.media_id].type]
            )}
          >
            {renderMedia(
              data.media[question.media_id].type,
              data.media[question.media_id].url,
              index
            )}
          </div>
        )}
      </div>
    ))}
  </>
);

export default QuizDone;
