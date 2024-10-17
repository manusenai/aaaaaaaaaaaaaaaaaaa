/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/(groups)` | `/(groups)/professorweb` | `/_sitemap` | `/professorweb`;
      DynamicRoutes: never;
      DynamicRouteTemplate: never;
    }
  }
}
