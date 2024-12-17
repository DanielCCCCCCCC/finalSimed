import { createRouter, createWebHistory } from "vue-router";
import routes from "./routes"; // Importar las rutas definidas en routes.js
import { useAuthStore } from "../stores/auth"; // Ajusta la ruta según tu estructura
import { storeToRefs } from "pinia";

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Guardia de Navegación Global
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  const { isLoading, isAuthenticated, role } = storeToRefs(authStore);

  // Espera a que la autenticación se cargue si está en proceso
  if (isLoading.value) {
    await authStore.initialize();
  }

  if (to.meta.requiresAuth) {
    if (!isAuthenticated.value) {
      // Redirigir al login si no está autenticado
      return next({ name: "login" });
    }

    if (to.meta.roles && !to.meta.roles.includes(role.value)) {
      // Redirigir a una página de no autorizado si el rol no coincide
      return next({ name: "NotAuthorized" });
    }
  }

  next();
});

export default router;
