type Callback = () => void;

class EventHandler {
  private callbacks: {[key: string]: Callback[]};

  constructor() {
    this.callbacks = {};
  }

  public on(eventName: string, callback: Callback) {
    if (!this.callbacks[eventName]) {
      this.callbacks[eventName] = [];
    }
    this.callbacks[eventName].push(callback);
  }

  public trigger(eventName: string, ...args: any[]) {
    if (this.callbacks[eventName])
      for (let i = 0; i < this.callbacks[eventName].length; i += 1) {
        this.callbacks[eventName][i].apply(null, args);
      }
  }
}

export default EventHandler;
