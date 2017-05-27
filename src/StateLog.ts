type Tracker = {
  // getStateLogByIndex(index: string): StateLog;
};

type Callback = (
  stateLog: StateLog,
  changedIds?: number[],
  changedIndexes?: number[],
) => void;

import ArrayTracker from './ArrayTracker';
import ObjectTracker from './ObjectTracker';

class StateLog {
  public proxyHandler: Tracker;
  public proxy: any;
  private callbacks: {
    [key: string]: Callback[];
  };

  constructor(target: any) {
    this.callbacks = {};
    if (Array.isArray(target)) {
      this.proxyHandler =  new ArrayTracker(target, this.trigger.bind(this));
      this.proxy = new (<any>window).Proxy(target, this.proxyHandler);
    } else if (typeof target === 'object' && target !== null) {
      this.proxyHandler =  new ObjectTracker(target, this.trigger.bind(this));
      this.proxy = new (<any>window).Proxy(target, this.proxyHandler);
    } else {
      throw new TypeError('Given value is not referencable');
    }
  }

  public on(type: string, callback: Callback) {
    if (!this.callbacks[type]) {
      this.callbacks[type] = [];
    }
    this.callbacks[type].push(callback);
  }

  private trigger(type: string, changedIds:number[], changedIndexes:number[]) {
    if (this.callbacks[type]) {
      for (let i = 0; i < this.callbacks[type].length; i += 1) {
        if (type === 'create' || type === 'delete') {
          this.callbacks[type][i](this, changedIds, changedIndexes);
        } else {
          this.callbacks[type][i](this);
        }
      }
    }
  }
}

export default StateLog;

(<any>window).StateLog = StateLog;
