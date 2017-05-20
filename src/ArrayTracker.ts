type Callback = (type: string, changedIds: number[], changedIndexes: number[]) => void

class ArrayTracker {
  _idIncrement: number
  _target: any
  _shell: Array<number>
  _changes: any
  _callback: Callback

  constructor(target: any[], callback: Callback) {
    this._target = target;
    this._callback = callback;
    this._shell = [];
    this.clearChanges();

    for(this._idIncrement = 0; this._idIncrement < target.length; this._idIncrement++) {
      this._shell.push(this._idIncrement);
    }
  }

  clearChanges() {
    this._changes = {};
  }

  get(target: any, property: string, proxy: any) {
    switch(property) {
      case 'push': 
        return this._push.bind(this);
      case 'unshift': 
        return this._unshift.bind(this);
      case 'splice': 
        return this._splice.bind(this);
      default:
        if(this._target.hasOwnProperty(property)) {
          // @TODO add proxy for nesting
          // @TODO add caching
          return this._target[property];
        } else {
          return this._target[property];
        }
    }
  }

  set() {
    throw new Error('Setting values is not yet possible');
  }

  _push(...entities: any[]) {
    var changedIds     = [];
    var changedIndexes = [];
    for(var i = 0; i < entities.length; i++) {
      this._shell.push(++this._idIncrement);
      changedIds.push(this._idIncrement);
      changedIndexes.push(this._target.length + 1);
    }
    var result = this._target.push.apply(this._target, entities);
    this._callback('create', changedIds, changedIndexes);

    return result;
  }

  _unshift(...entities: any[]) {
    var changedIds = [];
    var changedIndexes = [];
    for(var i = 0; i < entities.length; i++) {
      this._shell.unshift(++this._idIncrement);
      changedIds.push(this._idIncrement);
      changedIndexes.push(i);
    }
    var result = this._target.unshift.apply(this._target, entities);
    this._callback("create", changedIds, changedIndexes);

    return result;
  }

  _splice(start: number, deleteCount: number, ...entities: any[]) {
    var createIndexes = [];
    var createIds     = []
    var deleteIndexes = [];

    var shellArgs = [start, deleteCount];

    for(var deleteIndex = start; deleteIndex <= deleteCount; deleteIndex++) {
      deleteIndexes.push(deleteIndex);
    }

    for(var createIndex = 0; createIndex < entities.length; createIndex++) {
      shellArgs.push(++this._idIncrement);
      createIds.push(this._idIncrement);
      createIndexes.push(start + createIndex);
    }

    var deleteIds = this._shell.splice.apply(this._shell, shellArgs);

    var result = this._target.splice.apply(this._target, arguments);
    this._callback("delete", deleteIds, deleteIndexes);
    this._callback("create", createIds, createIndexes);
    return result;
  }

  _pop() {

  }

  _addChanges(type: string) {

  }
}

export default ArrayTracker;
