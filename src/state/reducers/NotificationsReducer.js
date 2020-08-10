export const notificationsInitialState = {
  loading: false,
  loaded: false,
  data: [],
  quiz: false,
  special_quiz: false,
};

export const notificationsReducer = (state, { type, payload }) => {
  switch (type) {
    case 'notifications.set':
      return {
        ...state,
        ...payload,
      };

    default:
      return state;
  }
};
