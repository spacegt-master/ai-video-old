/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";
import spacegt from "spacegt";

const { en, zhHans } = spacegt.locales;

// Composables
import { createVuetify } from "vuetify";
import { VFileUpload } from "vuetify/labs/VFileUpload";

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    // defaultTheme: 'dark',
  },
  locale: {
    locale: "en",
    messages: { en, zhHans },
  },
  components: {
    VFileUpload,
  },
});
