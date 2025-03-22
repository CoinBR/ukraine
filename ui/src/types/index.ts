export interface ServiceBase {
  title: string;
  requiresAuth: boolean;
}

export interface Service extends ServiceBase {
  url: string;
}

export interface ServiceGroup extends ServiceBase {
  nested: Service[];
}

export type ServiceItem = Service | ServiceGroup;

export interface SanitizedService {
  title: string;
  requiresAuth: boolean;
  nested?: SanitizedService[];
}

export interface ServiceResponse {
  services: SanitizedService[];
}

export interface AccessRequest {
  serviceName: string;
  code: string | null;
}

export interface AccessResponse {
  success: boolean;
  url?: string;
  message?: string;
}

