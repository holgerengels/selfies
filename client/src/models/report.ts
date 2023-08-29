import {createModel, RoutingState} from '@captaincodeman/rdx';
import {Store} from '../store';


export interface ReportState {
  ids: number[]
  selected: number
  loading: boolean
}


export default createModel({
  state: <ReportState>{
    ids: [],
    selected: 0,
    loading: false,
  },
  reducers: {
    select(state, payload: number) {
      return {...state, selected: payload}
    },

    request(state) {
      return {...state, loading: true};
    },
  },

  effects(store: Store) {
    return {
      'routing/change': async function (payload: RoutingState<string>) {
        // @ts-ignore
        const dispatch = store.getDispatch();
        switch (payload.page) {
        }
      }
    }
  }
})
