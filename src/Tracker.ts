import EventHandler from './EventHandler';

type Callback = () => void;

abstract class Tracker {
  public eventHandler: EventHandler;
  private stateLogId: number;

  constructor(id: number) {
    this.stateLogId = id;
    this.eventHandler = new EventHandler();
  }

  public on(eventName: string, callback: Callback) {
    this.eventHandler.on(eventName, callback);
  }
}

export default Tracker;
