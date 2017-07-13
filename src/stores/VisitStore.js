import { EventEmitter } from 'events'
import _ from 'lodash'
import Dispatcher from '../dispatcher'

const OBJETIVES = {
  "http://nicmirror.dynu.net/jsf/auth/login/login.html": true,
  "http://nicmirror.dynu.net/jsf/static_content/contactb64c.html": true,
  "http://nicmirror.dynu.net/jsf/static_content/domain_management.html": true,
  "http://nicmirror.dynu.net/jsf/static_content/payment_rates.html?pageId=ALL_PAYMENT_RATES_INFO": true,
  "http://nicmirror.dynu.net/jsf/careers/career_opportunities.html": true,
  "http://nicmirror.dynu.net/": true,
};


class VisitStore extends EventEmitter {
  constructor() {
    super()
    this.pages     = [];
    this.visits    = [];
    this.pageviews = [];
  }

  handleAction(action) {
    switch (action.type) {
      case 'GET_PAGES':
        this.pages = action.pages;
        for (var i = 0, l = this.pages.length; i < l; i++) {
          var p = this.pages[i];
          p.objective = this.isObjective(p.url) ? true : false;
        }
        this.emit('change');
        break;
      case 'GET_VISITS':
        this.visits = action.visits;
        this.emit('change');
        break;
      default:
        console.log(`UNHANDLED ACTION ${action}`);
    }
  }
  isObjective(page) { return OBJETIVES[page] }
  getPages()  { return this.pages }
  getVisits() { return this.visits }
  getAll() {
    return _.concat(this.pages, this.visits, this.pageviews);
  }
}

const store = new VisitStore();
Dispatcher.register(store.handleAction.bind(store));

export default store;
