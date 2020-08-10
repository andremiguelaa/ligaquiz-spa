import {
  settingsInitialState,
  settingsReducer,
} from 'state/reducers/SettingsReducer';
import { userInitialState, userReducer } from 'state/reducers/UserReducer';
import {
  notificationsInitialState,
  notificationsReducer,
} from 'state/reducers/NotificationsReducer';

export const initialState = {
  settings: settingsInitialState,
  user: userInitialState,
  notifications: notificationsInitialState,
};

export const MainReducer = ({ settings, user, notifications }, action) => ({
  settings: settingsReducer(settings, action),
  user: userReducer(user, action),
  notifications: notificationsReducer(notifications, action),
});
