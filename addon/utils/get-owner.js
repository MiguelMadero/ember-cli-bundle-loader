import Ember from 'ember';
const { getOwner } = Ember;

export function getContainer (context) {
  return context.container ? context.container : getOwner(context);
}
export function getFactory (context, factoryName){
  var container = getContainer(context);
  var factory = typeof container.lookupFactory === "function" ? container.lookupFactory(factoryName) : container._lookupFactory(factoryName);
  return factory;
}
export function registerFactory (context, fullName, factory) {
  var container = getContainer(context);
  var registry = container._registry || container.registry;
  if (registry) {
    // For 1.13 without using getOwner's "FakeContainer"
    registry.register(fullName, factory);
  } else {
    container.base.register(fullName, factory);
  }
}
