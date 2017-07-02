import Dispatcher from './dispatcher'
import axios from 'axios'
import _ from 'lodash'

const ID_SITE    = 3;
const AUTH_TOKEN = 'fc57ccac9c12a6aea0b40ae398572a9c';
const API_URL    = 'http://localhost:8000';
const DEF_PARAMS = {
  idSite: ID_SITE,
  module: 'API',
  format: 'JSON',
  token_auth: AUTH_TOKEN,
  filter_limit: -1,
  expanded: 1,
  period: 'range', // day, week, month, year, range
  date: '2017-06-06,2017-06-14', // range, today, june, yesterday
}
const REQ = axios.create({
  baseURL: API_URL,
  method: 'get',
  params: DEF_PARAMS,
});
function query(params) {
  return new Promise((resolve, reject) => {
    REQ.get('/index.php', { params })
      .then(({ data }) => {
        console.log('DONE', data);
        resolve(data);
      })
      .catch((error) => {
        console.error('ERROR', error);
        reject(error);
      });
  });
}

export function getInitialData() {
  query({
    method: 'Actions.getPageUrls',
    flat: 1,
    period: 'range',
    date: '2017-01-01,today',
  }).then((data) => {
    setTimeout(function () {
      Dispatcher.dispatch({
        type: 'GET_PAGES',
        pages: data
      });
    }, 4000);
  });
  query({
    method: 'Live.getLastVisitsDetails',
    doNotFetchActions: 1,
    flat: 0,
    period: 'range',
    date: '2017-01-01,today',
  }).then((data) => {
    setTimeout(function () {
      Dispatcher.dispatch({
        type: 'GET_VISITS',
        visits: data
      });
    }, 6000);
  });
}

export function getVisits(filters) {
}
export function getPages() {
}
export function getPageViews(filters) {
}
