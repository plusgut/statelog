class ArrayTracker {
  _idIncrement: number
  _target: any
  _shell: Array<number>
  _changes: any
  _callback: (type: string, handler: ArrayTracker) => void

  constructor(target: Array<any>, callback: (type: string, handler: ArrayTracker) => void) {
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

  _push(...enities: Array<any>) {
    for(var i = 0; i < enities.length; i++) {
      this._shell.push(++this._idIncrement);
    }
    var result = this._target.push.apply(this._target, enities);
    this._callback('push', this);

    return result;
  }

  _unshift(...enities: Array<any>) {
    for(var i = 0; i < enities.length; i++) {
      this._shell.unshift(++this._idIncrement);
    }
    var result = this._target.unshift.apply(this._target, enities);
    this._callback("unshift", this);

    return result;
  }

  _pop() {

  }

  _addChanges(type: string) {

  }
}

export default ArrayTracker;
