import { EventEmitter } from 'events'
import axios from 'axios'
import _ from 'lodash'
import Dispatcher from '../dispatcher'


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
        this.emit('change');
        break;
      default:
        console.log(`UNHANDLED ACTION ${action}`);
    }
  }
}

const store = new VisitStore;
Dispatcher.register(store.handleAction.bind(store));

export default store;