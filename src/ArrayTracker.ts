type Callback = (type: string, changedIds: number[], changedIndexes: number[]) => void;

import stateLog from './stateLog';
import Tracker from './Tracker';

class ArrayTracker extends Tracker{
  private target: any;
  private shell: number[];

  constructor(target: any[], id: number) {
    super(id);
    this.target = target;
    this.shell = [];
    target.map((entity: any, index: number) => {
      this.shell.push(stateLog.idCount + 1);
      target[index] = stateLog.create(entity);
    });
  }

  private get(target: any, property: string, proxy: any) {
    switch (property) {
      case 'push': 
        return this.push.bind(this);
      case 'unshift': 
        return this.unshift.bind(this);
      case 'splice': 
        return this.splice.bind(this);
      case '__stateLog__':
        return this;
      default:
        if (this.target.hasOwnProperty(property)) {
          return this.target[property];
        } else {
          return this.target[property];
        }
    }
  }

  private set() {
    throw new Error('Setting values is not yet possible');
  }

  private push(...entities: any[]) {
    const changedIds     = [];
    const changedIndexes = [];
    const stateLogs      = [];
    for (let i = 0; i < entities.length; i += 1) {
      const id = stateLog.idCount + 1;
      const stateLogObj = stateLog.create(entities[i]);
      this.shell.push(id);
      changedIds.push(id);
      changedIndexes.push(this.target.length + 1);
      stateLogs.push(stateLogObj);
    }
    const result = this.target.push.apply(this.target, stateLogs);
    this.eventHandler.trigger('create', changedIds, changedIndexes);

    return result;
  }

  private unshift(...entities: any[]) {
    const changedIds = [];
    const changedIndexes = [];
    const stateLogs      = [];
    for (let i = 0; i < entities.length; i += 1) {
      const id = stateLog.idCount + 1;
      const stateLogRes = stateLog.create(entities[i]);
      this.shell.unshift(id);
      changedIds.push(id);
      changedIndexes.push(i);
      stateLogs.push(stateLogRes);
    }
    const result = this.target.unshift.apply(this.target, stateLogs);
    this.eventHandler.trigger('create', changedIds, changedIndexes);

    return result;
  }

  private splice(start: number, deleteCount: number, ...entities: any[]) {
    const createIndexes = [];
    const createIds     = [];
    const deleteIndexes = [];

    const shellArgs = [start, deleteCount];
    const targetArgs = [start, deleteCount];

    for (let deleteIndex = start; deleteIndex <= deleteCount; deleteIndex += 1) {
      deleteIndexes.push(deleteIndex);
    }

    for (let createIndex = 0; createIndex < entities.length; createIndex += 1) {
      const id = stateLog.idCount + 1;
      const stateLogObj = stateLog.create(entities[createIndex]);
      shellArgs.push(id);
      createIds.push(id);
      createIndexes.push(start + createIndex);
      targetArgs.push(stateLogObj);
    }

    const deleteIds = this.shell.splice.apply(this.shell, shellArgs);

    const result = this.target.splice.apply(this.target, targetArgs);
    this.eventHandler.trigger('delete', deleteIds, deleteIndexes);
    this.eventHandler.trigger('create', createIds, createIndexes);
    return result;
  }

  private pop() {

  }

  // public getStateLogByIndex(index: string): StateLog {
    
  // }
}

export default ArrayTracker;
