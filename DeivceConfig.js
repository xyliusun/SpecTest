
class SpecModel {
  constructor(data) {
    Object.assign(this, data);
  }

  get isProp() {
    return this.specType === 'prop';
  }

  get isEvent() {
    return this.specType === 'event';
  }

  /**
   * @return {bool} can spec read
   */
  get isReadable() {
    return Array.isArray(this.access) && this.access.findIndex((element) => {
        return element === 'read';
      }) !== -1;
  }

  /**
   * @return {bool} can spec write
   */
  get isWriteable() {
    return Array.isArray(this.access) && this.access.findIndex((element) => {
      return element === 'write';
    }) !== -1;
  }

  /**
   * @return {bool} if spec is subscribable
   */
  get isNotifiable() {
    return Array.isArray(this.access) && this.access.findIndex((element) => {
      return element === 'notify';
    }) !== -1;
  }

  /**
   * @return {string} return string with format: 2.1
   */
  get rawKey() {
    return this.siid + '.' + this.piid;
  }

  /**
   * @return {string} return string with format: prop.2.1 or event.2.1
   */
  get subscribeKey() {
    return this.specType + '.' + this.siid + '.' + this.piid;
  }

  /**
   * @return {object} return object with format: { siid: 2, piid: 1 }
   */
  get pair() {
    const {siid, piid} = this;
    return {siid, piid};
  }
}


class SpecJsonHandler {
  constructor(params) {
    this.jsonData = params;
  }

  specModel(model) {
    const { service, prop, event, action } = model;
    const services = this.jsonData && this.jsonData.services;
    if (Array.isArray(services)) {
      // 找到对应的spec数据
      for (let index = 0; index < services.length; index++) {
        const item = services[index];
        const {type, iid: siid, properties, events, actions} = item;
        if (type.indexOf('service:'+ service + ':') === -1) continue;
        // prop
        if (Array.isArray(properties)) {
          for (let i = 0; i < properties.length; i++) {
            const propItem = properties[i];
            const { type, iid: piid } = propItem;
            if (type.indexOf('property:'+ prop + ':') != -1) {
              return new SpecModel(Object.assign({},
                { siid, piid, ...model, specType:'prop' }, propItem))
            }
          }
        }
        // event
        if (Array.isArray(events)) {
          for (let i = 0; i < events.length; i++) {
            const eventItem = events[i];
            const { type, iid: piid } = eventItem;
            if (type.indexOf('event:'+ event + ':') != -1) {
              return new SpecModel(Object.assign({},
                { siid, piid, ...model, specType:'event' }, eventItem))
            }
          }
        }
        // action
        if (Array.isArray(actions)) {
          for (let i = 0; i < actions.length; i++) {
            const actionItem = actions[i];
            const { type, iid: piid } = actionItem;
            if (type.indexOf('action:'+ action + ':') != -1) {
              return new SpecModel(Object.assign({},
                { siid, piid, ...model, specType:'action' }, actionItem))
            }
          }
        }
      }
    }
    return null;
  }
}

class LHSpecSheet {
  static create(json, config) {
    const SpecHandler = new SpecJsonHandler(json);
    const sheet = {};
    for (const key in config) {
      const element = config[key];
      const model = SpecHandler.specModel(element);
      if (model) {
        sheet[key] = Object.assign({ valueKey: key }, model);
      } else {
        sheet[key] = null;
      }
    }
    return sheet
  }
}

const deviceKey = LHSpecSheet.create(require('./Spec.json'), {
  PowerOffMemory: {service: 'electric-cfg', prop:'poweroff-memory'},
  Password: {service: 'password', prop:'set-password'}
});

export { deviceKey };