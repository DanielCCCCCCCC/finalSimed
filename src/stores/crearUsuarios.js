// src/stores/crearUsuarios.js
import { defineStore } from "pinia";
import { supabase } from "../supabaseClient"; // Ajusta la ruta si es necesario
import { ref } from "vue";
import { useAuthStore } from "./auth";
import axios from "axios"; // Para eliminar usuarios en Auth vía backend

export const useCrearUsuariosStore = defineStore("crearUsuarios", () => {
  const authStore = useAuthStore();

  // Estados
  const loading = ref(false);
  const error = ref(null);
  const success = ref(null);
  const users = ref([]);

  /**
   * Carga la lista de usuarios desde la tabla `users`, filtrando por tenant_id.
   */
  const cargarUsuarios = async () => {
    loading.value = true;
    error.value = null;
    try {
      const { data, error: fetchError } = await supabase
        .from("users")
        .select("*")
        .eq("tenant_id", authStore.tenant_id);

      if (fetchError) throw fetchError;

      users.value = data || [];
      console.log("Usuarios en la tabla 'users':", users.value);
    } catch (err) {
      console.error("Error al obtener usuarios:", err.message);
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };
  const cargarUsuarioPerfil = async () => {
    loading.value = true;
    error.value = null;
    try {
      const { data, error: fetchError } = await supabase
        .from("users")
        .select("*")
        .eq("id", authStore.userId);

      if (fetchError) {
        throw fetchError;
      }

      users.value = data || [];
      console.log("Usuarios PERFIL: ", users.value);
    } catch (err) {
      console.error("Error al obtener usuarios:", err.message);
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Crea un usuario tanto en Supabase Auth como en la tabla `users`.
   * Usa `signUp` con `emailRedirectTo` para que el correo de confirmación
   * apunte a "http://localhost:9000/reset-password".
   * Luego inserta en `users` (tenant_id, role, etc.).
   *
   * @param {string} email
   * @param {string} password
   * @param {object} extraData - { role, nombreCompleto?, direccion?, etc. }
   */
  const crearUsuario = async (email, password, extraData = {}) => {
    loading.value = true;
    error.value = null;
    success.value = null;

    try {
      // Validaciones
      if (!email || !password || !extraData.role) {
        throw new Error("Email, contraseña y role son obligatorios.");
      }
      if (password.length < 6) {
        throw new Error("La contraseña debe tener al menos 6 caracteres.");
      }

      const tenant_id = authStore.tenant_id;
      if (!tenant_id) {
        throw new Error(
          "No se pudo obtener el tenant_id del usuario autenticado."
        );
      }

      // 1) Crear usuario en Auth
      const { data: authData, error: signUpError } = await supabase.auth.signUp(
        {
          email,
          password,
          options: {
            emailRedirectTo: "http://localhost:9000/reset-password",
          },
        }
      );
      if (signUpError) {
        throw signUpError;
      }

      // El userId que da Supabase Auth
      const userId = authData.user.id;

      // 2) Insertar en la tabla `users`
      const { data, error: insertError } = await supabase.from("users").insert([
        {
          id: userId,
          email,
          role: extraData.role,
          tenant_id,
          nombreCompleto: extraData.nombreCompleto || null,
          direccion: extraData.direccion || null,
          telefono: extraData.telefono || null,
          observaciones: extraData.observaciones || null,
        },
      ]);

      if (insertError) {
        // Rollback: eliminar de Auth
        await supabase.auth.admin.deleteUser(userId);
        throw insertError;
      }

      success.value = "Usuario creado exitosamente.";
      users.value.push(data[0]);
      return data[0];
    } catch (err) {
      console.error("Error al crear usuario:", err.message);
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Actualizar usuario (tabla `users`) y en Supabase Auth si cambian email/password.
   * payload = { id, email?, password?, role?, ... }
   */
  const actualizarUsuario = async (payload) => {
    loading.value = true;
    error.value = null;
    success.value = null;

    try {
      if (!payload.id) {
        throw new Error("ID del usuario es obligatorio.");
      }

      // Construir updates para la tabla `users`
      const updates = {};
      if (payload.email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(payload.email)) {
          throw new Error("Formato de email inválido.");
        }
        updates.email = payload.email;
      }
      if (payload.role) {
        updates.role = payload.role;
      }
      if (payload.nombreCompleto !== undefined) {
        updates.nombreCompleto = payload.nombreCompleto;
      }
      if (payload.direccion !== undefined) {
        updates.direccion = payload.direccion;
      }
      if (payload.telefono !== undefined) {
        updates.telefono = payload.telefono;
      }
      if (payload.observaciones !== undefined) {
        updates.observaciones = payload.observaciones;
      }

      // 1) Actualizar en la tabla `users`
      const { data: userData, error: updateError } = await supabase
        .from("users")
        .update(updates)
        .eq("id", payload.id);
      if (updateError) {
        throw updateError;
      }

      // 2) Actualizar en Auth si cambió email
      if (payload.email) {
        const { error: updateAuthEmailError } = await supabase.auth.updateUser({
          email: payload.email,
        });
        if (updateAuthEmailError) {
          throw updateAuthEmailError;
        }
      }

      // 3) Actualizar en Auth si cambió password
      if (payload.password) {
        if (payload.password.length < 6) {
          throw new Error("La contraseña debe tener al menos 6 caracteres.");
        }
        const { error: updateAuthPassError } = await supabase.auth.updateUser({
          password: payload.password,
        });
        if (updateAuthPassError) {
          throw updateAuthPassError;
        }
      }

      success.value = "Usuario actualizado exitosamente.";

      // Actualizar la lista local
      const index = users.value.findIndex((u) => u.id === payload.id);
      if (index !== -1) {
        users.value[index] = { ...users.value[index], ...updates };
      }
    } catch (err) {
      console.error("Error al actualizar usuario:", err.message);
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Eliminar usuario de la tabla `users` + Auth (vía backend).
   */
  const eliminarUsuario = async (id) => {
    loading.value = true;
    error.value = null;
    success.value = null;

    try {
      if (!id) {
        throw new Error("ID del usuario es obligatorio.");
      }

      // 1) Eliminar de la tabla `users`
      const { data, error: deleteError } = await supabase
        .from("users")
        .delete()
        .eq("id", id);
      if (deleteError) throw deleteError;

      // 2) Eliminar en Auth (requiere service key => tu backend)
      const response = await axios.delete(
        `http://localhost:3000/delete-user/${id}`
      );
      if (response.data?.error) {
        throw new Error(response.data.error);
      }

      success.value = "Usuario eliminado exitosamente.";
      users.value = users.value.filter((u) => u.id !== id);
    } catch (err) {
      console.error("Error al eliminar usuario:", err.message);
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    loading,
    error,
    success,
    users,
    cargarUsuarios,
    cargarUsuarioPerfil,
    // Método principal para crear usuario (Auth + tabla `users`)
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario,
  };
});
