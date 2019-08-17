import {
  settingsInitialState,
  settingsReducer
} from 'state/reducers/SettingsReducer';
import { userInitialState, userReducer } from 'state/reducers/UserReducer';

export const initialState = {
  settings: settingsInitialState,
  user: userInitialState
};

export const MainReducer = ({ settings, user }, action) => ({
  settings: settingsReducer(settings, action),
  user: userReducer(user, action)
});
