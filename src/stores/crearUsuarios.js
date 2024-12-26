// src/stores/crearUsuarios.js

import { defineStore } from "pinia";
import { supabase } from "../supabaseClient"; // Asegúrate de que la ruta sea correcta
import { ref } from "vue";
import { useAuthStore } from "./auth"; // Importa la store de autenticación
import axios from "axios"; // Para llamadas al backend (para operaciones admin)

export const useCrearUsuariosStore = defineStore("crearUsuarios", () => {
  // Accede a la store de autenticación para obtener el tenant_id
  const authStore = useAuthStore();

  // Estados reactivos
  const loading = ref(false);
  const error = ref(null);
  const success = ref(null);
  const users = ref([]);

  /**
   * Obtiene la lista de usuarios desde la tabla `users`.
   */
  const cargarUsuarios = async () => {
    loading.value = true;
    error.value = null;

    try {
      const { data, error: fetchError } = await supabase
        .from("users") // Asegúrate de que la tabla sea 'users'
        .select("*")
        .eq("tenant_id", authStore.tenant_id); // Filtra por tenant_id

      if (fetchError) {
        throw fetchError;
      }

      users.value = data;
      console.log("Usuarios: ", users.value);
    } catch (err) {
      console.error("Error al obtener usuarios:", err.message);
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Crea un nuevo usuario utilizando Supabase Auth y sincroniza en la tabla `users`.
   * @param {Object} payload - Datos del nuevo usuario.
   * @param {string} payload.email - Correo electrónico del usuario.
   * @param {string} payload.password - Contraseña del usuario.
   * @param {string} payload.role - Rol del usuario.
   * @returns {Object} - Datos del usuario creado.
   */
  const crearUsuario = async ({ email, password, role }) => {
    loading.value = true;
    error.value = null;
    success.value = null;

    try {
      // Validaciones básicas
      if (!email || !password || !role) {
        throw new Error("Email, contraseña y rol son obligatorios.");
      }

      // Validar formato de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error("Formato de email inválido.");
      }

      // Validar longitud de contraseña
      if (password.length < 8) {
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

      // Insertar la información adicional en la tabla `users`
      const { data, error: insertError } = await supabase.from("users").insert([
        {
          id: userId, // Sincronizar el ID con Supabase Auth
          email,
          role,
          tenant_id,
        },
      ]);

      if (insertError) {
        // Si falla la inserción en `users`, elimina el usuario de Auth para mantener la consistencia
        await supabase.auth.admin.deleteUser(userId);
        throw insertError;
      }

      success.value = "Usuario creado exitosamente.";
      users.value.push(data[0]); // Agrega el nuevo usuario a la lista
      return data;
    } catch (err) {
      console.error("Error al crear el usuario:", err.message);
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Actualiza un usuario existente en la tabla `users` y en Supabase Auth si es necesario.
   * @param {Object} payload - Datos del usuario a actualizar.
   * @param {string} payload.id - ID del usuario (UUID).
   * @param {string} [payload.email] - Nuevo correo electrónico.
   * @param {string} [payload.password] - Nueva contraseña.
   * @param {string} [payload.role] - Nuevo rol.
   */
  const actualizarUsuario = async ({ id, email, password, role }) => {
    loading.value = true;
    error.value = null;
    success.value = null;

    try {
      // Validaciones básicas
      if (!id) {
        throw new Error("ID del usuario es obligatorio.");
      }

      // Construir objeto de actualización para la tabla `users`
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

      // Actualizar la tabla `users`
      const { data: userData, error: updateError } = await supabase
        .from("users")
        .update(updates)
        .eq("id", id);

      if (updateError) {
        throw updateError;
      }

      // Actualizar el correo electrónico en Supabase Auth si se proporcionó
      if (email) {
        const { data: updateAuthData, error: updateAuthError } =
          await supabase.auth.updateUser({
            id,
            email,
          });

        if (updateAuthError) {
          throw updateAuthError;
        }
      }

      // Actualizar la contraseña en Supabase Auth si se proporcionó
      if (password) {
        const { data: updateAuthData, error: updateAuthError } =
          await supabase.auth.updateUser({
            id,
            password,
          });

        if (updateAuthError) {
          throw updateAuthError;
        }
      }

      success.value = "Usuario actualizado exitosamente.";
      // Actualizar la lista local
      const index = users.value.findIndex((u) => u.id === id);
      if (index !== -1) {
        users.value[index] = { ...users.value[index], ...updates };
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
   * Elimina un usuario de Supabase Auth y de la tabla `users`.
   * @param {string} id - ID del usuario a eliminar (UUID).
   */
  const eliminarUsuario = async (id) => {
    loading.value = true;
    error.value = null;
    success.value = null;

    try {
      if (!id) {
        throw new Error("ID del usuario es obligatorio.");
      }

      // Eliminar el usuario de la tabla `users`
      const { data, error: deleteError } = await supabase
        .from("users")
        .delete()
        .eq("id", id);

      if (deleteError) {
        throw deleteError;
      }

      // Eliminar el usuario de Supabase Auth
      // **Este método requiere privilegios administrativos que no deben usarse en el frontend**
      // Por lo tanto, debes implementar esta operación en un backend seguro.

      // Aquí, en lugar de llamar directamente, llamaremos a un endpoint de tu backend.
      // Supongamos que tienes un backend corriendo en 'http://localhost:3000'

      const response = await axios.delete(
        `http://localhost:3000/delete-user/${id}`
      );

      if (response.data.error) {
        throw new Error(response.data.error);
      }

      success.value = "Usuario eliminado exitosamente.";
      // Eliminar el usuario de la lista local
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
