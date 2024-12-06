<template>
  <q-layout view="hHh lpR fFf">
    <!-- Header -->
    <q-header elevated>
      <q-toolbar>
        <!-- Botón para toggle del Drawer en dispositivos pequeños -->
        <q-btn
          flat
          dense
          icon="menu"
          class="q-mr-sm"
          @click="toggleDrawer"
          v-if="$q.screen.lt.md"
        />

        <!-- Título de la Aplicación con Nombre de la Organización -->
        <q-toolbar-title class="text-bold">
          Centro Médico
          <span v-if="organizaciones.length">
            - {{ obtenerNombresOrganizaciones }}
          </span>
        </q-toolbar-title>

        <!-- Spacer para empujar el botón de logout al final -->
        <q-space />

        <!-- Botón de Cerrar Sesión -->
        <q-btn
          flat
          dense
          icon="logout"
          label="Cerrar Sesión"
          color="negative"
          @click="logout"
        />
      </q-toolbar>
    </q-header>

    <!-- Menú Lateral -->
    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      :width="drawerWidth"
      class="bg-grey-2"
    >
      <Sidebar />
    </q-drawer>

    <!-- Contenido Principal -->
    <q-page-container class="bg-grey-1">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import {
  QLayout,
  QDrawer,
  QPageContainer,
  QHeader,
  QToolbar,
  QToolbarTitle,
  QBtn,
  QSpace,
} from "quasar";
import Sidebar from "../components/sidebar/sidebar.vue";
import { useAuthStore } from "../stores/auth";
import { useRouter } from "vue-router";
import { Notify } from "quasar";
import { useOrganizacionStore } from "../stores/organizacionStore"; // Asegúrate de que esta ruta es correcta

const leftDrawerOpen = ref(true);
const drawerWidth = ref(240);

const authStore = useAuthStore();
const organizacionStore = useOrganizacionStore(); // Importar la store de organizaciones
const router = useRouter();

// Computed property para acceder a las organizaciones desde el store
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

/**
 * Cargar la información de las organizaciones al montar el componente
 * Nota: Si el store ya está observando tenantId con `watch` y `{ immediate: true }`,
 * esta llamada puede ser redundante. Sin embargo, se incluye para asegurarse.
 */
onMounted(async () => {
  try {
    // Opcional: Puedes comentar esta línea si el store ya está cargando las organizaciones automáticamente
    await organizacionStore.cargarOrganizaciones(); // Cargar las organizaciones
  } catch (error) {
    console.error("Error al obtener las organizaciones:", error);
  }
});
</script>

<style scoped>
/* Estilos personalizados */

/* Estilo para el header */
.q-header {
  background-color: #547ca3;
  color: white;
}

/* Estilo para el título en el header */
.q-toolbar-title {
  font-size: 1.5rem;
}

/* Estilo para el botón de logout */
.q-btn[label="Cerrar Sesión"] {
  font-weight: bold;
}

/* Estilo para el contenedor principal */
.bg-grey-1 {
  padding: 20px;
}
</style>
