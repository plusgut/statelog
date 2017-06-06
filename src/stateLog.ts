import Tracker from './Tracker';
import ArrayTracker from './ArrayTracker';
import ObjectTracker from './ObjectTracker';

class StateLog {
  public idCount: number;
  private stateLogContainer: Tracker[];

  constructor() {
    this.idCount = 0;
  }

  public create(target: any) {
    let proxyHandler;
    let proxy;
    const id: number = this.incrementIdCount();
    if (Array.isArray(target)) {
      proxyHandler =  new ArrayTracker(target, id);
      proxy = new (<any>window).Proxy(target, proxyHandler);
    } else if (typeof target === 'object' && target !== null) {
      proxyHandler =  new ObjectTracker(target, id);
      proxy = new (<any>window).Proxy(target, proxyHandler);
    } else {
      proxy = target;
    }

    return proxy;
  }

  public incrementIdCount() {
    this.idCount += 1;
    return this.idCount;
  }
}

const stateLog = new StateLog();
export default stateLog;

(<any>window).stateLog = stateLog;
