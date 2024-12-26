// src/stores/auth.js

import { defineStore } from "pinia";
import { supabase } from "../supabaseClient"; // Ajusta la ruta si es necesario
import { ref, watch, computed } from "vue";

export const useAuthStore = defineStore("auth", () => {
  // Estados reactivos
  const user = ref(null);
  const session = ref(null);
  const tenant_id = ref(null);
  const role = ref(null);
  const isAuthenticated = ref(false);
  const loading = ref(false);
  const error = ref(null);
  const isLoading = ref(true);

  /**
   * Obtiene los detalles adicionales del usuario desde la tabla `users`.
   * @param {string} userId - ID del usuario autenticado.
   * @returns {Object|null} - Detalles del usuario o null si no se encuentra.
   */
  const fetchUserDetails = async (userId) => {
    try {
      const { data, error: fetchError } = await supabase
        .from("users")
        .select("tenant_id, role")
        .eq("id", userId)
        .maybeSingle(); // Permite devolver una fila o null

      if (fetchError) {
        console.error(
          "Error al obtener detalles del usuario:",
          fetchError.message
        );
        return null;
      }

      if (!data) {
        console.log("No se encontraron detalles para el usuario.");
        return null;
      }

      return data;
    } catch (err) {
      console.error(
        "Error inesperado al obtener detalles del usuario:",
        err.message
      );
      return null;
    }
  };

  /**
   * Restablece el estado de autenticación (usado en errores o al cerrar sesión).
   */
  const resetAuthState = () => {
    user.value = null;
    session.value = null;
    tenant_id.value = null;
    role.value = null;
    isAuthenticated.value = false;
    error.value = null;
  };

  /**
   * Inicializa el estado de autenticación, verificando si hay una sesión activa.
   */
  const initialize = async () => {
    try {
      // Obtener ambos tokens del localStorage
      const storedAccessToken = localStorage.getItem("access_token");
      const storedRefreshToken = localStorage.getItem("refresh_token");

      if (storedAccessToken && storedRefreshToken) {
        const { data: sessionData, error: sessionError } =
          await supabase.auth.setSession({
            access_token: storedAccessToken,
            refresh_token: storedRefreshToken,
          });

        if (sessionError) throw sessionError;

        const currentSession = sessionData.session;

        if (!currentSession) {
          console.log(
            "No se pudo restablecer la sesión con los tokens almacenados."
          );
          return;
        }

        const userId = currentSession.user.id;
        console.log("Sesión activa, ID del usuario:", userId);

        const userDetails = await fetchUserDetails(userId);
        if (userDetails) {
          tenant_id.value = userDetails.tenant_id;
          role.value = userDetails.role;
          console.log("Estado de autenticación actualizado:", {
            tenant_id: tenant_id.value,
            role: role.value,
            userId: userId,
          });
          isAuthenticated.value = true;
          user.value = currentSession.user;
          session.value = currentSession;
          console.log(
            "Autenticación inicializada correctamente. userId:",
            userId
          );
        } else {
          console.log(
            "No se encontraron detalles del usuario en la tabla 'users'."
          );
          resetAuthState();
        }
      } else {
        // Si no hay tokens almacenados, no hay sesión activa
        console.log("No hay tokens almacenados.");
      }
    } catch (err) {
      console.error("Error al inicializar la autenticación:", err.message);
    } finally {
      isLoading.value = false;
      console.log(
        "Autenticación inicializada. isAuthenticated:",
        isAuthenticated.value
      );
    }
  };

  /**
   * Getter para obtener el userId
   */
  const userId = computed(() => (user.value ? user.value.id : null));

  /**
   * Inicia sesión con email y contraseña.
   * @param {string} email
   * @param {string} password
   */
  const signIn = async (email, password) => {
    loading.value = true;
    error.value = null;
    console.log(`Iniciando sesión para el email: ${email}`);
    try {
      const { data, error: signInError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (signInError) {
        console.error("Error al iniciar sesión:", signInError.message);
        throw signInError;
      }

      console.log("Sesión iniciada exitosamente:", data.session);
      session.value = data.session;
      user.value = data.user;
      isAuthenticated.value = true;

      // Guardar el access_token y refresh_token en localStorage
      if (
        data.session &&
        data.session.access_token &&
        data.session.refresh_token
      ) {
        localStorage.setItem("access_token", data.session.access_token);
        localStorage.setItem("refresh_token", data.session.refresh_token);
      }

      const userDetails = await fetchUserDetails(data.user.id);
      if (userDetails) {
        tenant_id.value = userDetails.tenant_id; // Asegúrate de usar tenant_id en minúsculas
        role.value = userDetails.role;
        isAuthenticated.value = true;
        user.value = data.user;
        session.value = data.session;
      } else {
        console.warn("El usuario no tiene una entrada en la tabla 'users'.");
        resetAuthState();
      }
    } catch (err) {
      console.error("Error al iniciar sesión:", err.message);
      error.value = err.message;
      resetAuthState();
      throw err;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Cierra la sesión del usuario.
   */
  const signOut = async () => {
    loading.value = true;
    try {
      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) {
        console.error("Error al cerrar sesión:", signOutError.message);
        throw signOutError;
      }

      // console.log("Sesión cerrada exitosamente.");
      resetAuthState();

      // Eliminar ambos tokens del localStorage
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
    } catch (err) {
      throw err;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Maneja los cambios en el estado de autenticación.
   * @param {string} event - Evento de autenticación.
   * @param {Object} sessionData - Datos de la sesión.
   */
  const handleAuthStateChange = (event, sessionData) => {
    // console.log("Evento de autenticación recibido:", event);

    if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
      const newSession = sessionData;
      session.value = newSession;
      user.value = newSession.user;
      isAuthenticated.value = true;

      if (newSession.access_token && newSession.refresh_token) {
        localStorage.setItem("access_token", newSession.access_token);
        localStorage.setItem("refresh_token", newSession.refresh_token);
      }

      fetchUserDetails(newSession.user.id).then((userDetails) => {
        if (userDetails) {
          tenant_id.value = userDetails.tenant_id;
          role.value = userDetails.role;
          console.log(
            "Tenant ID y Rol asignados:",
            tenant_id.value,
            role.value
          );
        } else {
          console.warn("El usuario no tiene una entrada en la tabla 'users'.");
          resetAuthState();
        }
      });
    } else if (event === "SIGNED_OUT") {
      resetAuthState();
      localStorage.removeItem("access_token"); // Eliminar tokens al cerrar sesión
      localStorage.removeItem("refresh_token");
    }
  };

  /**
   * Suscribe a los cambios en el estado de autenticación.
   */
  const subscribeToAuthChanges = () => {
    supabase.auth.onAuthStateChange(handleAuthStateChange);
  };

  // Inicializar la autenticación y suscribirse a los cambios
  initialize();
  subscribeToAuthChanges();

  // Agregar log para verificar userId
  watch(userId, (newId) => {
    console.log("userId actualizado en authStore:", newId);
  });

  return {
    user,
    session,
    tenant_id,
    role,
    userId,
    isAuthenticated,
    loading,
    error,
    isLoading,
    initialize,
    signIn,
    signOut,
    fetchUserDetails,
  };
});
