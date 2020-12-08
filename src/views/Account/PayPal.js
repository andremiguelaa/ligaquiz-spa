import React, { useState } from 'react';
import { Trans } from '@lingui/macro';
import classnames from 'classnames';
import { toast } from 'react-toastify';

import ApiRequest from 'utils/ApiRequest';

import classes from './PayPal.module.scss';

const PayPal = () => {
  const [loading, setLoading] = useState(false);
  const [periodLoading, setPeriodLoading] = useState();

  const createOrder = (period) => {
    setLoading(true);
    setPeriodLoading(period);
    ApiRequest.post('payment/create', { period })
      .then(({ data: { url } }) => {
        window.location = url;
      })
      .catch(() => {
        toast.error(<Trans>Não foi possível renovar a subscrição.</Trans>);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className={classes.form}>
      <div>
        <button
          className={classnames('button', 'is-warning', classes.button, {
            'is-loading': loading && periodLoading === 1,
          })}
          disabled={loading}
          onClick={() => {
            createOrder(1);
          }}
        >
          <span className="icon">
            <i className="fa fa-paypal"></i>
          </span>
          <span>
            <Trans>1 mês (3€)</Trans>
          </span>
        </button>
      </div>
      <div>
        <button
          className={classnames('button', 'is-warning', classes.button, {
            'is-loading': loading && periodLoading === 3,
          })}
          disabled={loading}
          onClick={() => {
            createOrder(3);
          }}
        >
          <span className="icon">
            <i className="fa fa-paypal"></i>
          </span>
          <span>
            <Trans>3 meses (8.5€)</Trans>
          </span>
        </button>
      </div>
      <div>
        <button
          className={classnames('button', 'is-warning', classes.button, {
            'is-loading': loading && periodLoading === 6,
          })}
          disabled={loading}
          onClick={() => {
            createOrder(6);
          }}
        >
          <span className="icon">
            <i className="fa fa-paypal"></i>
          </span>
          <span>
            <Trans>6 meses (16€)</Trans>
          </span>
        </button>
      </div>
      <div>
        <button
          className={classnames('button', 'is-warning', classes.button, {
            'is-loading': loading && periodLoading === 12,
          })}
          name="period"
          disabled={loading}
          onClick={() => {
            createOrder(12);
          }}
        >
          <span className="icon">
            <i className="fa fa-paypal"></i>
          </span>
          <span>
            <Trans>12 meses (30€)</Trans>
          </span>
        </button>
      </div>
    </div>
  );
};

export default PayPal;
