type Callback = (type: string) => void;

import StateLog from './StateLog';

class ObjectTracker {
  private target: any;
  private callback: Callback;
  private stateLogContainer: {[key: string]: StateLog};

  constructor(target: any, callback: Callback) {
    this.target = target;
    this.callback = callback;
    this.stateLogContainer = {};
  }

  private get(target: any, index: string, proxy: any) {
    if (this.stateLogContainer.hasOwnProperty(index)) {
      return this.stateLogContainer[index].proxy;
    } else {
      return this.target[index];
    }
  }

  private set(target: any, index: string, value: any) {
    if (this.target[index] !== value) {
      this.target[index] = value;
      if (typeof value === 'object' && value !== null) {
        this.stateLogContainer[index] = new StateLog(value);
      } else if (this.stateLogContainer.hasOwnProperty(index)) {
        delete this.stateLogContainer[index];
      }
      this.callback('set.' + index);
    }
    
  }

  public getStateLogByIndex(index: string): StateLog {
    return this.stateLogContainer[index];
  }
}

export default ObjectTracker;
