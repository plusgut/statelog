type Tracker = {
  // getNestedObjectById: () => void;
};

type Callback = any;

import ArrayTracker from './ArrayTracker';
import ObjectTracker from './ObjectTracker';

class StateLog {
  public proxyHandler: Tracker;
  public proxy: any;
  private callbacks: {callback: Callback, type: string}[];

  constructor(target: any) {
    this.callbacks = [];
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
    this.callbacks.push({ type, callback });
  }

  private trigger(type: string, changedIds:number[], changedIndexes:number[]) {
    for (let i = 0; i < this.callbacks.length; i += 1) {
      if (type === this.callbacks[i].type) {
        if (changedIds && changedIndexes) {
          this.callbacks[i].callback(changedIds, changedIndexes, this);
        } else {
          this.callbacks[i].callback(this);
        }
      }
    }
  }
}

export default StateLog;

(<any>window).StateLog = StateLog;
