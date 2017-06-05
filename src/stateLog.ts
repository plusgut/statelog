type Tracker = {
  // getStateLogByIndex(index: string): StateLog;
};

import ArrayTracker from './ArrayTracker';
import ObjectTracker from './ObjectTracker';

function stateLog(target: any) {
  let proxyHandler;
  let proxy;
  if (Array.isArray(target)) {
    proxyHandler =  new ArrayTracker(target);
    proxy = new (<any>window).Proxy(target, proxyHandler);
  } else if (typeof target === 'object' && target !== null) {
    proxyHandler =  new ObjectTracker(target);
    proxy = new (<any>window).Proxy(target, proxyHandler);
  } else {
    throw new TypeError('Given value is not referencable');
  }

  return proxy;
}

export default stateLog;

(<any>window).stateLog = stateLog;
