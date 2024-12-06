// src/router/index.js
import { createRouter, createWebHistory } from "vue-router";
import routes from "./routes";
import { useAuthStore } from "../stores/auth";
import { createPinia } from "pinia";

const pinia = createPinia();

// Crear el enrutador
const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Registrar Pinia
import { createApp } from "vue";
const app = createApp(/* tu componente raíz */);
app.use(pinia);
app.use(router);
app.mount("#app");

// Guardia de navegación global
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  // Inicializar el estado de autenticación si aún no lo está
  if (authStore.isLoading) {
    authStore.initialize().then(() => {
      verificarAutenticacion(to, authStore, next);
    });
  } else {
    verificarAutenticacion(to, authStore, next);
  }
});

/**
 * Función para verificar la autenticación y redirigir según sea necesario.
 */
function verificarAutenticacion(to, authStore, next) {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const isAuthenticated = authStore.isAuthenticated;

  if (requiresAuth && !isAuthenticated) {
    next({ name: "login" });
  } else if (to.name === "login" && isAuthenticated) {
    next({ name: "dashboard" });
  } else {
    next();
  }
}

export default router;
