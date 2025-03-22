export interface ServiceBase {
  title: string;
  url: string;
  totpSecret?: string;
}

export type Service = ServiceBase;

export interface ServiceGroup {
  title: string;
  nested: Service[];
}

export type ServiceItem = Service | ServiceGroup;

export interface ServiceCollection {
  services: ServiceItem[];
}

export interface SanitizedService {
  title: string;
  requiresAuth: boolean;
  nested?: SanitizedService[];
}

export interface AccessRequest {
  serviceName: string;
  code?: string;
}

export interface AccessResponse {
  success: boolean;
  url?: string;
  message?: string;
}

