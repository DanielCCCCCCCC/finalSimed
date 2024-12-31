// src/stores/crearUsuarios.js

import { defineStore } from "pinia";
import { supabase } from "../supabaseClient"; // Ajusta la ruta a tu configuración de Supabase
import { ref } from "vue";
import { useAuthStore } from "./auth";
import axios from "axios"; // Para llamadas a tu backend en la eliminación

export const useCrearUsuariosStore = defineStore("crearUsuarios", () => {
  // Accede a la store de autenticación para obtener el tenant_id
  const authStore = useAuthStore();

  // Estados reactivos
  const loading = ref(false);
  const error = ref(null);
  const success = ref(null);
  const users = ref([]);

  /**
   * Obtiene la lista de usuarios desde la tabla `users`, filtrando por tenant_id.
   */
  const cargarUsuarios = async () => {
    loading.value = true;
    error.value = null;
    try {
      const { data, error: fetchError } = await supabase
        .from("users")
        .select("*")
        .eq("tenant_id", authStore.tenant_id);

      if (fetchError) {
        throw fetchError;
      }

      users.value = data || [];
      console.log("Usuarios: ", users.value);
    } catch (err) {
      console.error("Error al obtener usuarios:", err.message);
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Crea un nuevo usuario con Supabase Auth + inserción en tabla `users`.
   * payload: { email, password, role, nombreCompleto?, direccion?, telefono?, observaciones? }
   */
  const crearUsuario = async (payload) => {
    loading.value = true;
    error.value = null;
    success.value = null;

    const {
      email,
      password,
      role,
      nombreCompleto,
      direccion,
      telefono,
      observaciones,
    } = payload;

    try {
      // Validaciones básicas
      if (!email || !password || !role) {
        throw new Error("Email, contraseña y rol son obligatorios.");
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error("Formato de email inválido.");
      }
      if (password.length < 6) {
        throw new Error("La contraseña debe tener al menos 6 caracteres.");
      }

      // Obtener tenant_id del usuario autenticado
      const tenant_id = authStore.tenant_id;
      if (!tenant_id) {
        throw new Error(
          "No se pudo obtener el tenant_id del usuario autenticado."
        );
      }

      // Crear el usuario en Supabase Auth
      const { data: authData, error: signUpError } = await supabase.auth.signUp(
        {
          email,
          password,
        }
      );
      if (signUpError) {
        throw signUpError;
      }

      const userId = authData.user.id;

      // Insertar en tabla `users`
      const { data, error: insertError } = await supabase.from("users").insert([
        {
          id: userId,
          email,
          role,
          tenant_id,
          nombreCompleto: nombreCompleto || null,
          direccion: direccion || null,
          telefono: telefono || null,
          observaciones: observaciones || null,
        },
      ]);

      if (insertError) {
        // Si falla la inserción, eliminamos el usuario de Supabase Auth (rollback)
        await supabase.auth.admin.deleteUser(userId);
        throw insertError;
      }

      success.value = "Usuario creado exitosamente.";
      users.value.push(data[0]);
      return data[0];
    } catch (err) {
      console.error("Error al crear el usuario:", err.message);
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Actualiza un usuario en la tabla `users` (y en Supabase Auth si cambia email/password).
   * payload: { id, email?, password?, role?, nombreCompleto?, direccion?, telefono?, observaciones? }
   */
  const actualizarUsuario = async (payload) => {
    loading.value = true;
    error.value = null;
    success.value = null;

    const {
      id,
      email,
      password,
      role,
      nombreCompleto,
      direccion,
      telefono,
      observaciones,
    } = payload;

    try {
      if (!id) {
        throw new Error("ID del usuario es obligatorio.");
      }

      // Construir el objeto de actualización para la tabla `users`
      const updates = {};
      if (email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          throw new Error("Formato de email inválido.");
        }
        updates.email = email;
      }
      if (role) {
        updates.role = role;
      }
      if (nombreCompleto !== undefined) {
        updates.nombreCompleto = nombreCompleto;
      }
      if (direccion !== undefined) {
        updates.direccion = direccion;
      }
      if (telefono !== undefined) {
        updates.telefono = telefono;
      }
      if (observaciones !== undefined) {
        updates.observaciones = observaciones;
      }

      // Actualizar en la tabla `users`
      const { data: userData, error: updateError } = await supabase
        .from("users")
        .update(updates)
        .eq("id", id);

      if (updateError) {
        throw updateError;
      }

      // Actualizar en Supabase Auth si se proporcionó email
      if (email) {
        const { error: updateAuthError } = await supabase.auth.updateUser({
          email,
        });
        if (updateAuthError) {
          throw updateAuthError;
        }
      }

      // Actualizar la contraseña en Supabase Auth si se proporcionó
      if (password) {
        const { error: updateAuthError } = await supabase.auth.updateUser({
          password,
        });
        if (updateAuthError) {
          throw updateAuthError;
        }
      }

      success.value = "Usuario actualizado exitosamente.";

      // Refrescar localmente la lista "users"
      const idx = users.value.findIndex((u) => u.id === id);
      if (idx !== -1) {
        users.value[idx] = { ...users.value[idx], ...updates };
      }
    } catch (err) {
      console.error("Error al actualizar el usuario:", err.message);
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Elimina un usuario de Supabase Auth (vía backend) y de la tabla `users`.
   * @param {string} id - ID del usuario (UUID).
   */
  const eliminarUsuario = async (id) => {
    loading.value = true;
    error.value = null;
    success.value = null;

    try {
      if (!id) {
        throw new Error("ID del usuario es obligatorio.");
      }

      // Eliminar primero de la tabla `users`
      const { data, error: deleteError } = await supabase
        .from("users")
        .delete()
        .eq("id", id);

      if (deleteError) {
        throw deleteError;
      }

      // Eliminar el usuario de Supabase Auth
      // IMPORTANTE: requiere privilegios admin => hazlo a través de tu backend
      const response = await axios.delete(
        `http://localhost:3000/delete-user/${id}`
      );
      if (response.data?.error) {
        throw new Error(response.data.error);
      }

      success.value = "Usuario eliminado exitosamente.";
      // Remover localmente
      users.value = users.value.filter((u) => u.id !== id);
    } catch (err) {
      console.error("Error al eliminar el usuario:", err.message);
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
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario,
  };
});
