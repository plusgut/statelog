type Callback = (type: string) => void;

import stateLog from './stateLog';
import EventHandler from './EventHandler';
import Tracker from './Tracker';

class ObjectTracker extends Tracker{
  private target: any;
  private stateLogContainer: {[key: string]: any};

  constructor(target: any) {
    super();
    this.target = target;
    this.stateLogContainer = {};
  }

  private get(target: any, index: string, proxy: any) {
    if (index === '__stateLog__') {
      return this;
    } else if (this.stateLogContainer.hasOwnProperty(index)) {
      return this.stateLogContainer[index];
    } else {
      const result = this.target[index];
      if (typeof result === 'object' && result !== null && !result.__stateLog__) {
        this.stateLogContainer[index] = stateLog(result);
        return this.stateLogContainer[index];
      } else {
        return result;
      }
    }
  }

  private set(target: any, index: string, value: any) {
    if (this.target[index] !== value) {
      this.target[index] = value;
      if (this.stateLogContainer.hasOwnProperty(index)) {
        delete this.stateLogContainer[index];
      }
      this.eventHandler.trigger('set.' + index);
    }
    
  }

  public getStateLogByIndex(index: string): any {
    return this.stateLogContainer[index];
  }
}

export default ObjectTracker;
