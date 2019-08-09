import { userInitialState, userReducer } from 'state/reducers/UserReducer';

export const initialState = {
  user: userInitialState
};

export const MainReducer = (state, action) => ({
  user: userReducer(state.user, action)
});
