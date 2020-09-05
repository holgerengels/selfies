import {createModel} from "@captaincodeman/rdx";

import {urls} from "../urls";
import {endpoint, fetchjson} from "../endpoint";
import {Store} from "../store";

export interface Error {
  code: number,
  message: string,
}

export interface Login {
  userid: string,
  username: string,
  roles: string[],
}

export interface Credentials {
  userid: string,
  password: string,
}

export interface ShellState {
  userid?: string,
  username?: string,
  roles: string[],
  messages: string[],
  authenticating: boolean,
  error: string,
  loginResponse: string,}

export default createModel({
  state: <ShellState>{
    roles: [],
    messages: [],
    authenticating: false,
    error: "",
    loginResponse: "",
  },
  reducers: {
    requestLogin(state) {
      return { ...state, authenticating: true, loginResponse: "" };
    },
    receivedLogin(state, payload: Login) {
      return { ...state,
        userid: payload.userid,
        username: payload.username,
        roles: payload.roles,
        authenticating: false,
      };
    },
    requestLogout(state) {
      return { ...state, authenticating: true, error: "" };
    },
    receivedLogout(state) {
      return { ...state,
        userid: '',
        username: undefined,
        roles: [],
        authenticating: false,
      };
    },
    logout(state) {
      return { ...state, userid: "", roles: [] };
    },
    error(state, message) {
      return { ...state,
        authenticating: false,
        error: message,
      }
    },
    loginResponse(state, message) {
      return { ...state, authenticating: false, loginResponse: message }
    },
    clearLoginResponse(state) {
      return { ...state, loginResponse: "" }
    },
    addMessage(state, message: string) {
      return { ...state, messages: [...state.messages, message] }
    },
    removeMessage(state, message: string) {
      return { ...state, messages: state.messages.filter(m => m !== message) }
    },
    clearMessages(state) {
      return { ...state, messages: [] }
    },
  },

  effects(store: Store) {
    return {
      showMessage(payload: string) {
        const dispatch = store.getDispatch();
        window.setTimeout(() => dispatch.shell.removeMessage(payload), 3000);
        dispatch.shell.addMessage(payload);
      },
      async login(payload: Credentials) {
        const dispatch = store.getDispatch();

        dispatch.shell.requestLogin();
        fetchjson(`${urls.server}selfies?login=${payload.userid}`, {
            ...endpoint.post(),
            body: JSON.stringify(payload)
          },
          (json) => {
            const roles = json.filter(r => !r.startsWith("displayName:"));
            const username = roles.length != json.length ? json.filter(r => r.startsWith("displayName:"))[0].substr("displayName:".length) : payload.userid;
            dispatch.shell.receivedLogin({userid: payload.userid, roles: roles, username: username});
          },
          dispatch.shell.handleError,
          dispatch.shell.loginResponse);
      },
      async logout() {
        const dispatch = store.getDispatch();
        const state = store.getState();

        dispatch.shell.requestLogout();
        fetchjson(`${urls.server}selfies?logout=${state.shell.userid}`, {
            ...endpoint.post(),
            body: JSON.stringify({userid: state.shell.userid})
          },
          () => {
            dispatch.shell.receivedLogout();
          },
          dispatch.shell.handleError,
          dispatch.shell.error);
      },

      handleError(error: Error) {
        const dispatch = store.getDispatch();
        switch (error.code) {
          case 401:
            dispatch.shell.showMessage(error.message);
            dispatch.shell.logout();
            break;
          case 500:
            dispatch.shell.showMessage(error.message);
            break;
        }
      },
    }
  }
});
