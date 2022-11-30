module.exports = class AsyncHandler {

  constructor() {
    this.listeners = {};
  }

  on(event, listener) {
    this.listeners[event] ||= [];
    this.listeners[event].push(listener);
    return this;
  }

  addListener(event, listener) {
    return this.on(event, listener);
  }

  once(event, listener) {
    const trigger = async (...params) => {
      this.off(event, trigger);
      return await listener(...params);
    };
    return this.on(event, trigger);
  }

  off(event, listener) {
    if (this.listeners[event] === undefined) return this;
    const index = this.listeners[event].indexOf(listener);
    this.listeners[event].splice(index, 1);
    return this;
  }

  removeListener(event, listener) {
    return this.off(event, listener);
  }

  removeAllListeners(event = null) {
    if (event) {
      delete this.listeners[event];
    } else {
      this.listeners = {};
    }
    return this;
  }

  async emit(event, ...params) {
    for (const listener of this.listeners[event] || []) {
      await listener(...params);
    }
  }

}