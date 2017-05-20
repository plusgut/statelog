type Callback = (
  changedIds: number[],
  changedIndexes: number[],
  stateLog: StateLog,
) => void;

import ArrayTracker from './ArrayTracker';

class StateLog {
  proxyHandler: ArrayTracker;
  proxy: any;
  _callbacks: {callback: Callback, type: string}[];

  constructor(target: any) {
    this._callbacks = [];
    if (Array.isArray) {
      this.proxyHandler =  new ArrayTracker(target, this._trigger.bind(this));
      this.proxy = new (<any>window).Proxy(target, this.proxyHandler);
    } else {
      throw new Error('Only arrays are implemented yet');
    }
  }

  on(type: string, callback: Callback) {
    this._callbacks.push({ type, callback });
  }

  _trigger(type: string, changedIds:number[], changedIndexes:number[]) {
    for (let i = 0; i < this._callbacks.length; i += 1) {
      if (type === this._callbacks[i].type) {
        this._callbacks[i].callback(changedIds, changedIndexes, this);
      }
    }
  }
}

(<any>window).StateLog = StateLog;
