type Callback = (type: string, changedIds: number[], changedIndexes: number[]) => void;

import StateLog from './StateLog';

class ArrayTracker {
  private idIncrement: number;
  private target: any;
  private shell: number[];
  private callback: Callback;

  constructor(target: any[], callback: Callback) {
    this.target = target;
    this.callback = callback;
    this.shell = [];

    for (this.idIncrement = 0; this.idIncrement < target.length; this.idIncrement += 1) {
      this.shell.push(this.idIncrement);
    }
  }

  private get(target: any, property: string, proxy: any) {
    switch (property) {
      case 'push': 
        return this.push.bind(this);
      case 'unshift': 
        return this.unshift.bind(this);
      case 'splice': 
        return this.splice.bind(this);
      default:
        if (this.target.hasOwnProperty(property)) {
          // @TODO add proxy for nesting
          // @TODO add caching
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
    for (let i = 0; i < entities.length; i += 1) {
      this.idIncrement += 1;
      this.shell.push(this.idIncrement);
      changedIds.push(this.idIncrement);
      changedIndexes.push(this.target.length + 1);
    }
    const result = this.target.push.apply(this.target, entities);
    this.callback('create', changedIds, changedIndexes);

    return result;
  }

  private unshift(...entities: any[]) {
    const changedIds = [];
    const changedIndexes = [];
    for (let i = 0; i < entities.length; i += 1) {
      this.idIncrement += 1;
      this.shell.unshift(this.idIncrement);
      changedIds.push(this.idIncrement);
      changedIndexes.push(i);
    }
    const result = this.target.unshift.apply(this.target, entities);
    this.callback('create', changedIds, changedIndexes);

    return result;
  }

  private splice(start: number, deleteCount: number, ...entities: any[]) {
    const createIndexes = [];
    const createIds     = [];
    const deleteIndexes = [];

    const shellArgs = [start, deleteCount];

    for (let deleteIndex = start; deleteIndex <= deleteCount; deleteIndex += 1) {
      deleteIndexes.push(deleteIndex);
    }

    for (let createIndex = 0; createIndex < entities.length; createIndex += 1) {
      this.idIncrement += 1;
      shellArgs.push(this.idIncrement);
      createIds.push(this.idIncrement);
      createIndexes.push(start + createIndex);
    }

    const deleteIds = this.shell.splice.apply(this.shell, shellArgs);

    const result = this.target.splice.apply(this.target, arguments);
    this.callback('delete', deleteIds, deleteIndexes);
    this.callback('create', createIds, createIndexes);
    return result;
  }

  private pop() {

  }

  // public getStateLogByIndex(index: string): StateLog {
    
  // }
}

export default ArrayTracker;
