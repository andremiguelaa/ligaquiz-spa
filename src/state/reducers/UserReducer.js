export const userInitialState = null;

export const userReducer = (state, { type, payload }) => {
  switch (type) {
    case 'user.login':
      return payload;

    default:
      return state;
  }
};
