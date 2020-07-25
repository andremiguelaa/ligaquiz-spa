import React, { useState, useEffect } from 'react';
import { Trans } from '@lingui/macro';
import classnames from 'classnames';

import classes from './Paginator.module.scss';

const Paginator = ({
  array,
  key = 'id',
  itemClassName = '',
  itemsPerPage = 20,
  initialPage = 1,
  render,
  onChange = () => {},
  onError = () => {},
}) => {
  const numberOfPages = Math.ceil(array.length / itemsPerPage);

  const [page, setPage] = useState(parseInt(initialPage));

  const changePage = (page) => {
    setPage(page);
    onChange(page);
  };

  useEffect(() => {
    if (initialPage > numberOfPages) {
      onError(404);
    }
  }, [initialPage, numberOfPages, onError]);

  return (
    <>
      {array
        .slice((page - 1) * itemsPerPage, page * itemsPerPage)
        .map((item) => (
          <div key={item[key]} className={itemClassName}>
            {render(item)}
          </div>
        ))}
      {numberOfPages > 1 && (
        <nav
          className={classnames('pagination', 'is-centered', classes.nav)}
          role="navigation"
          aria-label="pagination"
        >
          <button
            className="pagination-previous"
            disabled={page === 1}
            onClick={() => {
              changePage(page - 1);
            }}
          >
            <Trans>Anterior</Trans>
          </button>
          <button
            className="pagination-next"
            disabled={page === Math.ceil(array.length / itemsPerPage)}
            onClick={() => {
              changePage(page + 1);
            }}
          >
            <Trans>Próxima</Trans>
          </button>
          <ul className="pagination-list">
            <li>
              <button
                className={classnames('pagination-link', {
                  'is-current': page === 1,
                })}
                onClick={() => {
                  changePage(1);
                }}
              >
                1
              </button>
            </li>
            {page > 2 && numberOfPages > 2 && (
              <li>
                <span className="pagination-ellipsis">&hellip;</span>
              </li>
            )}
            {page !== 1 && page !== numberOfPages && (
              <li>
                <button
                  className="pagination-link is-current"
                  onClick={() => {}}
                >
                  {page}
                </button>
              </li>
            )}
            {page < numberOfPages - 1 && numberOfPages > 2 && (
              <li>
                <span className="pagination-ellipsis">&hellip;</span>
              </li>
            )}
            <li>
              <button
                className={classnames('pagination-link', {
                  'is-current': page === numberOfPages,
                })}
                onClick={() => {
                  changePage(numberOfPages);
                }}
              >
                {numberOfPages}
              </button>
            </li>
          </ul>
        </nav>
      )}
    </>
  );
};

export default Paginator;
