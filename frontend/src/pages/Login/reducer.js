import { fromJS } from "immutable";
import dayjs from "dayjs";
import "dayjs/locale/de";
import "dayjs/locale/fr";
import "dayjs/locale/pt";
import strings from "../../localizeStrings";

import {
  LOGIN_SUCCESS,
  STORE_USERNAME,
  STORE_PASSWORD,
  SHOW_LOGIN_ERROR,
  STORE_ENVIRONMENT_SUCCESS,
  SET_LANGUAGE,
  LOGOUT_SUCCESS,
  FETCH_USER_SUCCESS,
  ADMIN_LOGIN_SUCCESS,
  FETCH_ADMIN_USER_SUCCESS,
  SHOW_ADMIN_LOGIN_ERROR,
  FETCH_ENVIRONMENT_SUCCESS,
  ADMIN_LOGOUT_SUCCESS,
  INIT_LANGUAGE
} from "./actions";

export const defaultState = fromJS({
  username: "",
  password: "",
  id: "",
  displayName: "",
  organization: "",
  allowedIntents: [],
  groups: [],
  avatarBackground: "/avatar_back.jpeg",
  avatar: "/lego_avatar_female2.jpg",
  environment: "Test",
  loginErrorMessage: "",
  showLoginError: false,
  jwt: "",
  adminLoginFailed: false,
  language: "en-gb",
  user: [],
  userDisplayNameMap: {}
});

const setTimeLocale = language => {
  switch (language) {
    // daysjs excpects en instead of en-gb.
    // Changing the language preset would break existing clients because it it saved in the clients local storage
    case "en-gb":
      dayjs.locale("en");
      break;
    default:
      dayjs.locale(language);
      break;
  }
};

export const changeLanguage = state => {
  const language = state.get("language");
  setTimeLocale(language);
  strings.setLanguage(language);
};

export default function loginReducer(state = defaultState, action) {
  switch (action.type) {
    case STORE_USERNAME:
      return state.set("username", action.username);
    case STORE_PASSWORD:
      return state.set("password", action.password);
    case FETCH_USER_SUCCESS:
      const userMap = {};
      action.user.forEach(user => {
        userMap[user.id] = user.displayName;
      });
      return state.merge({ user: fromJS(action.user), userDisplayNameMap: fromJS(userMap) });
    case FETCH_ADMIN_USER_SUCCESS:
      return state.merge({
        loggedInAdminUser: action.user,
        jwt: action.jwt
      });

    case LOGIN_SUCCESS:
      const user = action.user;
      return state.merge({
        jwt: user.token,
        id: user.id,
        displayName: user.displayName,
        organization: user.organization,
        allowedIntents: fromJS(user.allowedIntents),
        groups: fromJS(user.groups),
        username: defaultState.get("username"),
        password: defaultState.get("password")
      });
    case ADMIN_LOGIN_SUCCESS:
      return state.merge({
        adminLoggedIn: true
      });
    case SHOW_LOGIN_ERROR:
      return state.set("loginUnsuccessful", action.show);
    case SHOW_ADMIN_LOGIN_ERROR:
      return state.set("adminLoginFailed", action.show);
    case STORE_ENVIRONMENT_SUCCESS:
    case FETCH_ENVIRONMENT_SUCCESS:
      return state.merge({
        environment: action.environment,
        productionActive: action.productionActive
      });
    case INIT_LANGUAGE:
      changeLanguage(state);
      return state;
    case SET_LANGUAGE:
      const newState = state.set("language", action.language);
      changeLanguage(newState);
      return newState;
    case ADMIN_LOGOUT_SUCCESS:
    case LOGOUT_SUCCESS:
      return state.merge({
        password: defaultState.get("password"),
        jwt: defaultState.get("jwt")
      });
    default:
      return state;
  }
}
