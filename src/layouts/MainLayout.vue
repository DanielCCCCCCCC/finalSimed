<template>
  <q-layout class="app-container" view="hHh lpR fFf">
    <Header />
    <div class="sb">
      <Sidebar />
    </div>

    <q-page-container class="main-content">
      <div>
        <!-- <router-view /> -->

        <!-- Botón flotante en la esquina inferior derecha -->
        <q-btn
          fab
          color="primary"
          class="floating-btn"
          icon="notifications"
          @click="goToSolicitudesCitasPendientes"
        >
          <q-badge
            v-if="pendingAppointmentsCount > 0"
            color="negative"
            floating
          >
            {{ pendingAppointmentsCount }}
          </q-badge>
        </q-btn>
      </div>
    </q-page-container>
  </q-layout>
</template>
<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { QLayout, QDrawer, QPageContainer, QBtn, QBadge } from "quasar";
import Sidebar from "../components/sidebar/sidebar.vue";
import Header from "../components/sidebar/header.vue";
import { useAuthStore } from "../stores/auth";
import { useRouter } from "vue-router";
import { Notify } from "quasar";
import { useOrganizacionStore } from "../stores/organizacionStore";
import { useThemeStore } from "../stores/themeStore";
import { useAppointmentsStore } from "../stores/AppointmentsStore"; // Asegúrate de que exista este store y exporte lo necesario

// Referencias reactivas para el Drawer
const leftDrawerOpen = ref(false);
const drawerWidth = ref(2);

// Instancias de los stores y router
const authStore = useAuthStore();
const organizacionStore = useOrganizacionStore();
const themeStore = useThemeStore();
const appointmentsStore = useAppointmentsStore(); // Aquí obtendremos la cantidad de citas pendientes
const router = useRouter();

// Computed para las organizaciones
const organizaciones = computed(() => organizacionStore.organizaciones);
const obtenerNombresOrganizaciones = computed(() =>
  organizaciones.value.map((org) => org.nombre).join(", ")
);

// Computed para la cantidad de citas pendientes (cambia según tu lógica interna)
const pendingAppointmentsCount = computed(() => {
  // En tu store, asegurarte de tener algún array o propiedad
  // Ejemplo: appointmentsStore.solicitudesPendientes
  return appointmentsStore.solicitudesPendientes?.length || 0;
});

// Alternar Drawer
const toggleDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};

// Función para navegar a solicitudesCitasPendientes
const goToSolicitudesCitasPendientes = () => {
  router.push({ name: "solicitudesCitasPendientes" });
};

// Logout
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

    // Establecer color (ejemplo: rojo)
    document.documentElement.style.setProperty("--primary-rgb", "223, 90, 90");
  } catch (error) {
    console.error(
      "Error al obtener las organizaciones o aplicar el tema:",
      error
    );
  }
});

// Watchers para cambios en el themeStore
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
.bg-dark {
  background-color: #220404 !important;
}

.app-container {
  background-color: #eaedf7;
}

/* Estilo para el botón flotante */
.floating-btn {
  position: fixed;
  right: 20px;
  bottom: 20px;
  z-index: 9999;
}
</style>
