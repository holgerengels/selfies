import {createModel} from '@captaincodeman/rdx';
import {Store} from "../store";
import {endpoint, fetchjson} from "../endpoint";
import {urls} from "../urls";

export interface SelfieState {
  step: number,
  sending: boolean,
  sent: boolean,
  error?: string,
}


export default createModel({
  state: <SelfieState>{
    step: 0,
    sending: false,
    sent: false,
  },
  reducers: {
    selectStep(state, step: number) {
      return {...state, step};
    },

    requestSend(state) {
      return { ...state, sending: true };
    },
    receivedSend(state) {
      return { ...state, sending: false, sent: true };
    },
    forgetSend(state) {
      return { ...state, sending: false, sent: false };
    },

    error(state, message) {
      return { ...state,
        sending: false,
        error: message,
      }
    },
  },

  effects(store: Store) {
    return {
      async send(image: string) {
        const dispatch = store.getDispatch();
        const state = store.getState();

        var formData = new FormData();
        formData.append("image", image);

        dispatch.selfie.requestSend();
        fetchjson(`${urls.server}selfies?image=${state.shell.userid}`, {
            ...endpoint.postFormData(),
            body: formData
          },
          () => {
            dispatch.selfie.receivedSend();
          },
          dispatch.shell.handleError,
          dispatch.shell.loginResponse);
      },

      'shell/receivedLogin': async function () {
        const dispatch = store.getDispatch();
        dispatch.selfie.selectStep(1);
      },
      'selfie/receivedSend': async function () {
        const dispatch = store.getDispatch();
        dispatch.selfie.selectStep(2);
      },
      'shell/receivedLogout': async function () {
        const dispatch = store.getDispatch();
        dispatch.selfie.selectStep(0);
      },
    }
  }
})
