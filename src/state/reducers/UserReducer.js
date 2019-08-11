export const userInitialState = null;

export const userReducer = (state, { type, payload }) => {
  switch (type) {
    case "user.login":
      return payload;

    case "user.logout":
      return userInitialState;

    default:
      return state;
  }
};
