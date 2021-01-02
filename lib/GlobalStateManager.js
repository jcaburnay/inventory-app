import React from "react";
import { createContext, useContext, useState } from "react";

class EventBus {
  constructor() {
    this.subscriptions = {};
  }
  /**
   * Add a listener for the 'eventType' events.
   *
   * Note that the 'owner' of this event can be anything, but will more likely
   * be a component or a class. The idea is that the callback will be called with
   * the proper owner bound.
   *
   * Also, the owner should be kind of unique. This will be used to remove the
   * listener.
   */
  on(eventType, owner, callback) {
    if (!callback) {
      throw new Error("Missing callback");
    }
    if (!this.subscriptions[eventType]) {
      this.subscriptions[eventType] = [];
    }
    this.subscriptions[eventType].push({
      owner,
      callback
    });
  }
  /**
   * Remove a listener
   */
  off(eventType, owner) {
    const subs = this.subscriptions[eventType];
    if (subs) {
      this.subscriptions[eventType] = subs.filter((s) => s.owner !== owner);
    }
  }
  /**
   * Emit an event of type 'eventType'.  Any extra arguments will be passed to
   * the listeners callback.
   */
  trigger(eventType, ...args) {
    const subs = this.subscriptions[eventType] || [];
    for (let i = 0, iLen = subs.length; i < iLen; i++) {
      const sub = subs[i];
      sub.callback.call(sub.owner, ...args);
    }
  }
  /**
   * Remove all subscriptions.
   */
  clear() {
    this.subscriptions = {};
  }
}

export function setUpGlobalState(state, actions, getters) {
  const bus = new EventBus();

  const dispatch = async (name, ...args) => {
    const action = actions[name];
    if (!action) {
      console.error(`Unknown action: ${name}`);
      return;
    }
    const result = await action({ state, dispatch, get }, ...args);
    bus.trigger("ACTION_DONE", { name, state });
    return result;
  };

  const get = (getterName, ...args) => {
    const getter = getters[getterName];
    return getter({ state, get }, ...args);
  };

  const context = createContext();

  const useGlobalState = () => {
    const [x, setX] = useContext(context);
    const dispatchR = async (actionName, ...args) => {
      await dispatch(actionName, ...args);
      setX(x + 1);
    };
    return [dispatchR, get];
  };

  const GlobalStateProvider = ({ children }) => {
    const [x, setx] = useState(0);
    return <context.Provider value={[x, setx]}>{children}</context.Provider>;
  };

  return {
    useGlobalState,
    GlobalStateProvider,
    bus,
    dispatch,
    get
  };
}
