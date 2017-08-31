import EventHandler from './EventHandler';
import Tracker from './Tracker';
import stateLog from './stateLog';

class ObjectTracker extends Tracker{
  private target: any;
  private stateLogContainer: {[key: string]: any};

  constructor(target: any, id: number) {
    super(id);
    this.target = target;
    this.stateLogContainer = {};
  }

  public get(target: any, index: string) {
    if (index === '__stateLog__') {
      return this;
    } else if (this.stateLogContainer.hasOwnProperty(index)) {
      return this.stateLogContainer[index];
    } else {
      const result = target[index];
      if (typeof result === 'object' && result !== null && !result.__stateLog__) {
        this.stateLogContainer[index] = stateLog.create(result);
        return this.stateLogContainer[index];
      } else {
        return result;
      }
    }
  }

  public set(target: any, index: string, value: any) {
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
