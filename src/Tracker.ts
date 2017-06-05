import EventHandler from './EventHandler';

type Callback = () => void;

abstract class Tracker {
  public eventHandler: EventHandler;

  constructor() {
    this.eventHandler = new EventHandler();
  }

  public on(eventName: string, callback: Callback) {
    this.eventHandler.on(eventName, callback);
  }
}

export default Tracker;
