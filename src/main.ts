import ArrayTracker from './ArrayTracker';

class StateLog {
  proxy: ArrayTracker
  _callbacks: Array<(handler: ArrayTracker, property: string) => void>
  constructor(target: any) {
    this._callbacks = [];
    if(Array.isArray) {
      this.proxy = new (<any>window).Proxy([], new ArrayTracker(target, this._trigger.bind(this)));
    } else {
      throw new Error('Only arrays are implemented yet');
    }
  }
  on(callback: (handler: ArrayTracker, property: string) => void) {
    this._callbacks.push(callback);
  }
  _trigger(arrayTracker: ArrayTracker, property: string) {
    for(var i = 0; i < this._callbacks.length; i++) {
      this._callbacks[i](arrayTracker, property);
    }
  }
}

(<any>window).StateLog = StateLog;
