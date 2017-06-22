import _ from 'utils'
import { defineReactive} from 'observer'
import Watcher from 'watcher'
import Dep from 'observer/dep'

exports.initComputed = function (vm) {
  let computed = vm.$options.computed;

  if (!computed || typeof computed !== 'object') return;
  Object.keys(computed).forEach(key => {
    let userDef = computed[key];
    let getter = typeof userDef === 'function' ? userDef : userDef.get;

    if (getter === undefined) {
      warn(
        ("No getter function has been defined for computed property \"" + key + "\"."),
        vm
      );
      getter = _.noop;
    }

    Object.defineProperty(vm._data, key, {
      enumerable: true,
      configurable: true,
      get:  getter,
      set: _.noop
    })
  });
}

exports.initWatch = function (vm, options) {
  let watch = vm.$options.watch;
  for (let key in watch) {
    let handler = watch[key];
    new Watcher(vm, key, handler);
  }
}

exports.set = function (target, key, val) {
  if (Array.isArray(target) && typeof key === 'number') {
    target.length = Math.max(target.length, key);
    target.splice(key, 1, val);
    return val;
  }
  if (_.hasOwn(target, key)) {
    target[key] = val;
    return val;
  }
  let ob = (target).__ob__;
  if (!ob) {
    target[key] = val;
    return val;
  }
  defineReactive(ob.value, key, val);
  ob.dep.notify();
  return val;
}

exports.del = function (target, key) {
  if (Array.isArray(target) && typeof key === 'number') {
    target.splice(key, 1);
    return;
  }
  let ob = (target).__ob__;
  if (!_.hasOwn(target, key)) {
    return;
  }
  delete target[key];
  if (!ob) {
    return;
  }
  ob.dep.notify();
}

