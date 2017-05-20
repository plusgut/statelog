type Callback = (
  changedIds: number[],
  changedIndexes: number[],
  stateLog: StateLog,
) => void;

import ArrayTracker from './ArrayTracker';

class StateLog {
  public proxyHandler: ArrayTracker;
  public proxy: any;
  private callbacks: {callback: Callback, type: string}[];

  constructor(target: any) {
    this.callbacks = [];
    if (Array.isArray) {
      this.proxyHandler =  new ArrayTracker(target, this.trigger.bind(this));
      this.proxy = new (<any>window).Proxy(target, this.proxyHandler);
    } else {
      throw new Error('Only arrays are implemented yet');
    }
  }

  public on(type: string, callback: Callback) {
    this.callbacks.push({ type, callback });
  }

  private trigger(type: string, changedIds:number[], changedIndexes:number[]) {
    for (let i = 0; i < this.callbacks.length; i += 1) {
      if (type === this.callbacks[i].type) {
        this.callbacks[i].callback(changedIds, changedIndexes, this);
      }
    }
  }
}

(<any>window).StateLog = StateLog;
