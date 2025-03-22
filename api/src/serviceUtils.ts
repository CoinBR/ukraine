import {
  ServiceCollection,
  ServiceGroup,
  Service,
  SanitizedService,
  ServiceItem
} from './types';

export const isServiceGroup = (item: ServiceItem): item is ServiceGroup =>
  'nested' in item && Array.isArray(item.nested);

export const isAuthenticatedService = (service: Service): boolean =>
  service.totpSecret !== undefined;

export const sanitizeServices = (
  items: ServiceItem[]
): SanitizedService[] =>
  items.map(item => {
    if (isServiceGroup(item)) {
      return {
        title: item.title,
        requiresAuth: item.nested.some(isAuthenticatedService),
        nested: item.nested.map(service => ({
          title: service.title,
          requiresAuth: isAuthenticatedService(service)
        }))
      };
    }

    // It's a regular Service
    return {
      title: item.title,
      requiresAuth: isAuthenticatedService(item)
    };
  });

export const findServiceByName = (
  collection: ServiceCollection,
  serviceName: string
): Service | undefined => {
  for (const item of collection.services) {
    if (!isServiceGroup(item) && item.title === serviceName) {
      return item;
    }

    if (isServiceGroup(item)) {
      const service = item.nested.find(s => s.title === serviceName);
      if (service) {
        return service;
      }
    }
  }

  return undefined;
};

