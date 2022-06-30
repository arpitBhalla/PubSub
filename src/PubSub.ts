type Callback = (data: any) => unknown;

export class PubSub {
  private _topics = {};
  private _callbacks: Callback[] = [];
  constructor() {}

  subscribe(topic: string, callback: Callback): number {
    const id = this._callbacks.push(callback) - 1;
    if (!this._topics[topic]) this._topics[topic] = [];
    this._topics[topic].push(id);
    return id;
  }

  subscribeOnce(topic: string, callback: Callback): void {
    const event = this.subscribeWithUnSubs(topic, (data) => {
      callback?.(data);
      event.unsubscribe();
    });
  }

  subscribeWithUnSubs(topic: string, callback: Callback) {
    const id = this.subscribe(topic, callback);
    const unsubscribe = () => this.unsubscribe(id);
    return { unsubscribe };
  }

  unsubscribe(id: number) {
    delete this._callbacks[id];
  }

  publish(topic: string, data: any) {
    this._topics[topic]?.forEach((id: string | number) => {
      this._callbacks[id]?.(data);
    });
  }
}

