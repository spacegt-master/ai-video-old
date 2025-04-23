/**
 * plugins/index.ts
 *
 * Automatically included in `./src/main.ts`
 */

// Plugins
import vuetify from "./vuetify";
import router from "../router";
import pinia from "./pinia";
import spacegt from "spacegt";
import { ElementPlus, ElementPlusIconsVue } from "./element-plus";

// Types
import type { App } from "vue";

export function registerPlugins(app: App) {
  app.use(vuetify).use(router).use(pinia).use(spacegt).use(ElementPlus);

  for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component);
  }
}
