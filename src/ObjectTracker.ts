type Callback = (type: string) => void;

import StateLog from './StateLog';

class ObjectTracker {
  private target: any;
  private callback: Callback;
  private stateLogs: StateLog[];

  constructor(target: any, callback: Callback) {
    this.target = target;
    this.callback = callback;
    this.stateLogs = [];
  }

  private get(target: any, index: string, proxy: any) {
    if (this.stateLogs.hasOwnProperty(index)) {
      return this.stateLogs[index].proxy;
    } else {
      return this.target[index];
    }
  }

  private set(target: any, index: string, value: any) {
    if (this.target[index] !== value) {
      this.target[index] = value;
      if (typeof value === 'object' && value !== null) {
        this.stateLogs[index] = new StateLog(value);
      } else if (this.stateLogs.hasOwnProperty(index)) {
        delete this.stateLogs[index];
      }
      this.callback('set.' + index);
    }
    
  }

  public getStateLogByIndex(index: string) {
    return this.stateLogs[index];
  }
}

export default ObjectTracker;
