<template>
  <router-view />
</template>

<script setup>
import "devextreme/dist/css/dx.light.css";
import { useThemeStore } from "./stores/themeStore";
import { onMounted } from "vue";

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
