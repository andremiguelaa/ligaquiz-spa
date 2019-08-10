import { userInitialState, userReducer } from "state/reducers/UserReducer";

export const initialState = {
  user: userInitialState
};

export const MainReducer = ({ user }, action) => ({
  user: userReducer(user, action)
});
