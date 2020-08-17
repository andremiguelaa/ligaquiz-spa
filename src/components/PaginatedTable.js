import React, { useState, useEffect } from 'react';
import { Trans } from '@lingui/macro';
import classnames from 'classnames';

import classes from './PaginatedTable.module.scss';

const PaginatedTable = ({
  array,
  key = 'id',
  rowClassName,
  hideHeader = false,
  columns,
  itemsPerPage = 10,
  initialPage = 1,
  onChange = () => {},
  onError = () => {},
}) => {
  const numberOfPages = Math.ceil(array.length / itemsPerPage);

  const [page, setPage] = useState();

  useEffect(() => {
    setPage(parseInt(initialPage));
  }, [initialPage]);

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
      <div className="table-container">
        <table className={classnames('table', 'is-fullwidth', 'is-hoverable')}>
          {!hideHeader && (
            <thead>
              <tr>
                {columns.map((column) => (
                  <th key={column.id} className={column.className}>
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
          )}

          <tbody>
            {array
              .slice((page - 1) * itemsPerPage, page * itemsPerPage)
              .map((item) => (
                <tr
                  key={item[key]}
                  className={rowClassName && rowClassName(item)}
                >
                  {columns.map((column) => (
                    <td key={column.id} className={column.className}>
                      {column.render(item)}
                    </td>
                  ))}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
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

export default PaginatedTable;
