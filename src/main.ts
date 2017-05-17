type Callback = (changedIds: Array<number>, arrayTracker: ArrayTracker) => void

import ArrayTracker from './ArrayTracker';

class StateLog {
  proxyHandler: ArrayTracker
  proxy: any
  _callbacks: {callback: Callback, type: string}[]

  constructor(target: any) {
    this._callbacks = [];
    if(Array.isArray) {
      this.proxyHandler =  new ArrayTracker(target, this._trigger.bind(this));
      this.proxy = new (<any>window).Proxy(target, this.proxyHandler);
    } else {
      throw new Error('Only arrays are implemented yet');
    }
  }

  on(type: string, callback: Callback) {
    this._callbacks.push({type, callback});
  }

  _trigger(type: string, changedIds:number[], arrayTracker: ArrayTracker) {
    for(var i = 0; i < this._callbacks.length; i++) {
      if(type === this._callbacks[i].type) {
        this._callbacks[i].callback(changedIds, arrayTracker);
      }
    }
  }
}

(<any>window).StateLog = StateLog;
