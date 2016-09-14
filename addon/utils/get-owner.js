import Ember from 'ember';
const { getOwner } = Ember;

export function getContainer (context) {
  var hasGetOwner = typeof getOwner === "function";
  var container = hasGetOwner ? getOwner(context) : context.container;
  return container;
}
export function getFactory (context, factoryName){
  var container = getContainer(context);
  var factory = typeof container.lookupFactory === "function" ? container.lookupFactory(factoryName) : container._lookupFactory(factoryName);
  return factory;
}
export function registerFactory (context, fullName, factory) {
  var container = getContainer(context);
  var hasGetOwner = typeof getOwner === "function";
  if (hasGetOwner) {
    container.base.register(fullName, factory);
    return;
  }
  var registry = container._registry || container.registry;
  registry.register(fullName, factory);
}
