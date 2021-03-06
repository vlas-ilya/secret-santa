import axios, { AxiosRequestConfig } from 'axios';

import { ActionCreatorWithPayload } from '@reduxjs/toolkit';
import { Dispatch } from 'redux';
import { LoadingState } from '../../../backend/src/model/LoadingState';
import { RootState } from '../store';

export interface Options extends AxiosRequestConfig {
  password?: string | null;
}

const _fetch = (url: string, options: Options = {}) => {
  axios.defaults.withCredentials = true;
  const headers = options.headers || {};
  if (options.password) {
    headers['password'] = options.password;
  }
  const requestOptions = {
    ...options,
    headers,
    url: url,
  };
  return axios(requestOptions);
};

const fetch = (url: string) => ({
  get: (options: Options = {}) => _fetch(url, { ...options, method: 'GET' }),
  post: (options: Options = {}) => _fetch(url, { ...options, method: 'POST' }),
  put: (options: Options = {}) => _fetch(url, { ...options, method: 'PUT' }),
  delete: (options: Options = {}) => _fetch(url, { ...options, method: 'DELETE' }),
});

export const fetchAction = (
  changeLoadingState: ActionCreatorWithPayload<LoadingState>,
  action: (dispatch: Dispatch, state: RootState) => Promise<void>,
) => async (dispatch: Dispatch, getState: Function) => {
  try {
    changeLoadingState && dispatch(changeLoadingState('LOADING'));
    await action(dispatch, getState());
    changeLoadingState && dispatch(changeLoadingState('SUCCESS'));
  } catch (e) {
    changeLoadingState && dispatch(changeLoadingState(['ERROR', e.response?.data?.message]));
  }
};

export default fetch;
