import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { add, query, remove, update } from './service';

import { TableListData } from './data.d';

export interface StateType {
  data: TableListData;
}

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: StateType) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    fetch: Effect;
    add: Effect;
    remove: Effect;
    update: Effect;
  };
  reducers: {
    save: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'userroleDepartment',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(query, payload);
      console.log(response.data)
      let data:Partial<TableListData> = {}
      data.list = response.data
      data.pagination = {}
      yield put({
        type: 'save',
        payload: data,
      });
    },
    *add({ payload, callback }, { call }) {
      const response = yield call(add, payload);
      if (response.code == '0') {
        if (callback) callback();
      }
    },
    *remove({ payload, callback }, { call }) {
      const response = yield call(remove, payload);
      if (response.code == '0') {
        if (callback) callback();
      }
    },
    *update({ payload, callback }, { call, put }) {
      const response = yield call(update, payload);
      if (response.code == '0') {
        if (callback) callback();
      }
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
  },
};

export default Model;
