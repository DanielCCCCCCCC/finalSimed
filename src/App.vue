<template>
  <router-view />
</template>

<script setup>
import "devextreme/dist/css/dx.light.css";
import { useThemeStore } from "./stores/themeStore";
import { onMounted, ref } from "vue";

import { useAppointmentsStore } from "./stores/AppointmentsStore";
import { Notify } from "quasar";

/* -------------------------------------
   Datos y Estados Reactivos
------------------------------------- */
const store = useAppointmentsStore();
const cargando = ref(true);

onMounted(async () => {
  try {
    await store?.fetchAppointments();
  } catch (error) {
    Notify.create({
      message: "Error al cargar las citas.",
      color: "negative",
      position: "top-right",
    });
    console.error("Error al cargar citas:", error);
  } finally {
    cargando.value = false;
  }
});

const themeStore = useThemeStore();
onMounted(async () => {
  try {
    console.log("Aplicación montada correctamente");

    themeStore.colorThemeFn("light");
    themeStore.layoutStylesFn("icon-overlay");

    document.documentElement.style.setProperty("--primary-rgb", "223, 90, 90"); // RGB para naranja
  } catch (error) {
    console.error(
      "Error al obtener las organizaciones o aplicar el tema:",
      error
    );
  }
});
defineOptions({
  name: "App",
});
</script>

<style>
/* Estilos globales opcionales */
</style>
