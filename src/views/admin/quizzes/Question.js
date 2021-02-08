import React, { useState, useEffect } from 'react';
import { Trans } from '@lingui/macro';
import classnames from 'classnames';
import { toast } from 'react-toastify';

import { useStateValue } from 'state/State';
import { getGenreTranslation } from 'utils/getGenreTranslation';
import ApiRequest from 'utils/ApiRequest';
import renderMedia from 'utils/renderMedia';
import Markdown from 'components/Markdown';
import Modal from 'components/Modal';

import ExternalQuestionPick from './ExternalQuestionPick';

import classes from './Quizzes.module.scss';

const Question = ({
  genre,
  genreStats,
  index,
  quizData,
  setFormData,
  uploading,
  setUploading,
  disabled,
  editMode,
  setPickedExternalQuestions,
}) => {
  const [
    {
      settings: { language },
    },
  ] = useStateValue();

  const [content, setContent] = useState(
    quizData?.quiz.questions[index]?.content || ''
  );
  const [answer, setAnswer] = useState(
    quizData?.quiz.questions[index]?.answer || ''
  );
  const [genreId, setGenreId] = useState(
    quizData?.quiz.questions[index]?.genre_id || undefined
  );
  const [mediaId, setMediaId] = useState(
    quizData?.quiz.questions[index]?.media_id || undefined
  );
  const [media, setMedia] = useState(
    quizData?.quiz.questions[index]?.media_id
      ? quizData.media[mediaId]
      : undefined
  );

  useEffect(() => {
    setFormData((prev) => {
      if (!prev.questions[index]) {
        prev.questions[index] = {};
      }
      prev.questions[index].content = content;
      prev.questions[index].answer = answer;
      prev.questions[index].genre_id = genreId;
      prev.questions[index].media_id = mediaId || null;
      return { ...prev };
    });
  }, [index, setFormData, content, answer, genreId, mediaId]);

  const externalQuestionPick =
    process.env.REACT_APP_EXTERNAL_QUESTION_PICK === 'true' &&
    genreId &&
    !editMode;
  const [externalQuestionModal, setExternalQuestionModal] = useState(false);

  const grabQuestion = (question) => {
    setPickedExternalQuestions((prev) => ({
      ...prev,
      [index]: question,
    }));
    setContent(question.formulation);
    setAnswer(question.answer);
    setExternalQuestionModal(false);
    if (question.media) {
      setUploading(true);
      fetch(question.media)
        .then((response) => response.blob())
        .then((blob) => {
          const filename = question.media.substr(
            question.media.lastIndexOf('/') + 1
          );
          const file = new File([blob], filename);
          const mediaFormData = new FormData();
          mediaFormData.append('file', file);
          ApiRequest.post('media', mediaFormData, {
            headers: {
              'content-type': 'multipart/form-data',
            },
          })
            .then(({ data }) => {
              setMediaId(data.id);
              setMedia(data);
            })
            .catch(() => {
              toast.error(
                <Trans>Não foi possível importar o ficheiro multimédia.</Trans>
              );
            })
            .finally(() => {
              setUploading(false);
            });
        });
    }
  };

  return (
    <>
      <fieldset className="fieldset" key={genre.id}>
        <legend className="legend">
          <Trans>Pergunta {index + 1}</Trans> (
          {getGenreTranslation(genre.slug, language)})
        </legend>
        <div className="field">
          <div className="control">
            {genre.subgenres.map((subgenre) => (
              <label className="radio" key={subgenre.id}>
                <input
                  disabled={disabled}
                  name={genre.slug}
                  type="radio"
                  checked={genreId === subgenre.id}
                  onChange={(event) => {
                    if (event.target.checked) {
                      setGenreId(subgenre.id);
                    }
                  }}
                />{' '}
                {getGenreTranslation(subgenre.slug, language)} (
                {genreStats[subgenre.id] ? genreStats[subgenre.id] : '0'} de{' '}
                {subgenre.target})
              </label>
            ))}
          </div>
        </div>
        {externalQuestionPick && (
          <div className="field">
            <div className="control">
              <button
                className="button is-primary"
                type="button"
                onClick={() => setExternalQuestionModal(true)}
              >
                <Trans>Escolher pergunta externa</Trans>
              </button>
            </div>
          </div>
        )}
        <div className="field">
          <label className="label">
            <Trans>Enunciado</Trans>
          </label>
          <textarea
            disabled={disabled}
            defaultValue={content}
            className="textarea"
            onChange={(event) => {
              setContent(event.target.value);
            }}
          ></textarea>
        </div>
        <div className="field">
          <Markdown content={content} />
        </div>
        <div className="field">
          <label className="label">
            <Trans>Resposta</Trans>
          </label>
          <input
            disabled={disabled}
            defaultValue={answer}
            className="input"
            onChange={(event) => {
              setAnswer(event.target.value);
            }}
          />
        </div>
        <div className="field">
          <label className="label">
            <Trans>Multimédia</Trans>
          </label>
          <div
            className={classnames('file', {
              'is-loading': uploading,
            })}
          >
            <label className="file-label">
              <input
                disabled={disabled || uploading}
                className="file-input"
                type="file"
                accept=".mp3,.jpg,.jpeg,.png,.gif,.mp4"
                onChange={(event) => {
                  const mediaFormData = new FormData();
                  console.log(event.target.files[0]);
                  mediaFormData.append('file', event.target.files[0]);
                  setUploading(true);
                  ApiRequest.post('media', mediaFormData, {
                    headers: {
                      'content-type': 'multipart/form-data',
                    },
                  })
                    .then(({ data }) => {
                      setMediaId(data.id);
                      setMedia(data);
                    })
                    .catch(() => {
                      toast.error(
                        <Trans>
                          Não foi possível adicionar este ficheiro multimédia.
                        </Trans>
                      );
                    })
                    .finally(() => {
                      setUploading(false);
                    });
                }}
              />
              <span className="file-cta">
                <span className="file-icon">
                  <i className="fa fa-upload"></i>
                </span>
                <span className="file-label">
                  <Trans>Escolhe o ficheiro</Trans>
                </span>
              </span>
            </label>
          </div>
        </div>
        {media && (
          <>
            <button
              disabled={disabled || uploading}
              className="button is-danger"
              type="button"
              onClick={() => {
                setMediaId();
                setMedia();
              }}
            >
              <span className="icon">
                <i className="fa fa-trash"></i>
              </span>
            </button>
            <div className={classnames(classes.media, classes[media.type])}>
              {renderMedia(media.type, media.url, index + 1)}
            </div>
          </>
        )}
      </fieldset>
      {externalQuestionPick && (
        <Modal
          type="info"
          size="large"
          open={externalQuestionModal}
          title={<Trans>Escolher pergunta externa</Trans>}
          body={
            <>
              {externalQuestionModal && (
                <ExternalQuestionPick
                  genre={
                    genre.subgenres.find((item) => item.id === genreId).slug
                  }
                  grabQuestion={grabQuestion}
                />
              )}
            </>
          }
          action={() => {
            setExternalQuestionModal(false);
          }}
          onClose={() => setExternalQuestionModal(false)}
        />
      )}
    </>
  );
};

export default Question;
