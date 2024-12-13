<template>
  <q-layout class="app-container" view="hHh lpR fFf">
    <Header />
    <div class="sb">
      <Sidebar />
    </div>

    <q-page-container class="main-content">
      <div>
        <router-view />
      </div>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { QLayout, QDrawer, QPageContainer } from "quasar";
import Sidebar from "../components/sidebar/sidebar.vue";
import Header from "../components/sidebar/header.vue";
import { useAuthStore } from "../stores/auth";
import { useRouter } from "vue-router";
import { Notify } from "quasar";
import { useOrganizacionStore } from "../stores/organizacionStore";
import { useThemeStore } from "../stores/themeStore"; // Importar el themeStore

// Referencias reactivas para el Drawer
const leftDrawerOpen = ref(false);
const drawerWidth = ref(2);

// Instancias de los stores y router
const authStore = useAuthStore();
const organizacionStore = useOrganizacionStore();
const themeStore = useThemeStore(); // Obtener la instancia del themeStore
const router = useRouter();

// Computed properties para acceder a las organizaciones
const organizaciones = computed(() => organizacionStore.organizaciones);

// Computed property para obtener los nombres de las organizaciones
const obtenerNombresOrganizaciones = computed(() => {
  return organizaciones.value.map((org) => org.nombre).join(", ");
});

/**
 * Función para alternar el Drawer en dispositivos pequeños
 */
const toggleDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};

/**
 * Función para cerrar sesión
 */
const logout = async () => {
  try {
    await authStore.signOut();
    Notify.create({
      message: "Sesión cerrada exitosamente",
      color: "positive",
      position: "top-right",
    });
    router.push({ name: "login" });
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
    Notify.create({
      message: "Error al cerrar sesión",
      color: "negative",
      position: "top-right",
    });
  }
};

onMounted(async () => {
  try {
    // Cargar las organizaciones
    await organizacionStore.cargarOrganizaciones();

    // Definir el tema light
    themeStore.colorThemeFn("light");
    themeStore.layoutStylesFn("icon-overlay");

    // Establecer el color naranja para --primary-rgb
    document.documentElement.style.setProperty("--primary-rgb", "223, 90, 90"); // RGB para naranja
  } catch (error) {
    console.error(
      "Error al obtener las organizaciones o aplicar el tema:",
      error
    );
  }
});

/**
 * (Opcional) Observar cambios en el tema y aplicar dinámicamente
 */
watch(
  () => themeStore.colortheme,
  (newTheme) => {
    themeStore.colorThemeFn(newTheme);
  }
);

watch(
  () => themeStore.layoutStyles,
  (newLayout) => {
    themeStore.layoutStylesFn(newLayout);
  }
);
</script>

<style scoped>
/* Puedes agregar estilos adicionales aquí si es necesario */
.bg-dark {
  background-color: #220404 !important;
}

.app-container {
  /* padding: 20px; */
  background-color: #eaedf7;
  /* margin: 0 0px; */
  /* border: none; */

  /* position: relative;
  margin-left: 20px;
  margin-right: 20px;
  margin-top: 1.2%;
  width: 99%;
  height: 100%; */
}
</style>
