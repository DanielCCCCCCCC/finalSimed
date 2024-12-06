import { createApp } from "vue";
import App from "./App.vue";
import { Quasar } from "quasar";
import { createPinia } from "pinia";
import "devextreme/dist/css/dx.light.css";
import router from "./router"; // Asegúrate de que la ruta es correcta
import "../src/css/styles.css";
import { loadMessages, locale } from "devextreme/localization";
import esMessages from "devextreme/localization/messages/es.json";
import VueApexCharts from "vue3-apexcharts";

loadMessages(esMessages);
locale("es");

const app = createApp(App);
app.use(Quasar);
app.use(createPinia());
app.use(VueApexCharts);

app.mount("#app");
