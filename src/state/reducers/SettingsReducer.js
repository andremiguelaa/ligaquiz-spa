import Cookies from "js-cookie";

export const settingsInitialState = {
  language: Cookies.get("language") ? Cookies.get("language") : "pt"
};

export const settingsReducer = (state, { type, payload }) => {
  switch (type) {
    case "settings.language":
      return {
        ...state,
        language: payload
      };

    default:
      return state;
  }
};
