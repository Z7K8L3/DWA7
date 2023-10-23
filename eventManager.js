class EventManager {
    constructor() {
      this.listeners = {};
    }
  
    addEventListener(element, event, callback) {
      if (!this.listeners[element]) {
        this.listeners[element] = {};
      }
      this.listeners[element][event] = callback;
      element.addEventListener(event, callback);
    }
  
    removeEventListener(element, event) {
      if (this.listeners[element] && this.listeners[element][event]) {
        element.removeEventListener(event, this.listeners[element][event]);
        delete this.listeners[element][event];
      }
    }
  }
  
  export default EventManager;
  