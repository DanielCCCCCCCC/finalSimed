// src/stores/crearUsuarios.js
import { defineStore } from "pinia";
import { supabase } from "../supabaseClient"; // Ajusta la ruta si es necesario
import { ref } from "vue";
import { useAuthStore } from "./auth";
import axios from "axios"; // Para eliminar usuarios en Auth vía backend
import { Notify } from "quasar";
export const useCrearUsuariosStore = defineStore("crearUsuarios", () => {
  const authStore = useAuthStore();

  // Estados
  const loading = ref(false);
  const error = ref(null);
  const success = ref(null);
  const users = ref([]);
  // --- Nuevas variables de configuración de Scheduler ---
  // const cellDurationConfig = ref(15);
  // const startDayHourConfig = ref(12);
  // const endDayHourConfig = ref(18);
  const horariosAtencion = ref([]);

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
          especialidadMedica: extraData.especialidadMedica || null,
          esMarcado: extraData.esMarcado,
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
      if (payload.especialidadMedica !== undefined) {
        updates.especialidadMedica = payload.especialidadMedica;
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
  function convertirHoraANumero(horaStr) {
    if (!horaStr) return null;
    const [horas, minutos, segundos] = horaStr.split(":").map(Number);
    return horas + minutos / 60 + segundos / 3600;
  }

  const startDayHourConfig = ref(1);
  const cellDurationConfig = ref(10);
  const endDayHourConfig = ref(2);

  const cargarHorariosAtencion = async () => {
    const userId = authStore.userId;
    if (!userId) {
      console.error("Error: userId es inválido.");
      Notify.create({
        message: "Error: userId es inválido.",
        color: "negative",
      });
      return;
    }

    loading.value = true;
    error.value = null;
    try {
      const { data, error: fetchError } = await supabase
        .from("horarios_atencion")
        .select("*")
        .eq("userId", userId)
        .order("dia_semana", { ascending: true });

      if (fetchError) throw fetchError;

      horariosAtencion.value = data;
      console.log("Horarios de Atención Cargados:", horariosAtencion.value);

      if (data && data.length > 0) {
        const primerHorario = data[0];

        if (primerHorario.intervalo_min) {
          cellDurationConfig.value = primerHorario.intervalo_min;
          console.log(
            "cellDurationConfig actualizado a:",
            cellDurationConfig.value
          );
        }
        if (primerHorario.hora_inicio) {
          const horaInicioNum = convertirHoraANumero(primerHorario.hora_inicio);
          startDayHourConfig.value = horaInicioNum;
          console.log(
            "startDayHourConfig actualizado a:",
            startDayHourConfig.value
          );
        }
        if (primerHorario.hora_fin) {
          const horaFinNum = convertirHoraANumero(primerHorario.hora_fin);
          endDayHourConfig.value = horaFinNum;
          console.log(
            "endDayHourConfig actualizado a:",
            endDayHourConfig.value
          );
        }
      } else {
        console.log("No se encontraron horarios de atención para el usuario.");
      }
    } catch (err) {
      error.value = err.message || "Error al cargar horarios de atención.";
      console.error("Error:", error.value);
      Notify.create({ message: error.value, color: "negative" });
    } finally {
      loading.value = false;
    }
  };

  const crearHorarioAtencion = async (nuevoHorario) => {
    const userId = authStore.userId;
    if (!nuevoHorario) {
      console.error("Error: nuevoHorario es inválido.");
      Notify.create({
        message: "Error: datos del horario son inválidos.",
        color: "negative",
        position: "top-right",
      });
      return;
    }
    if (!userId) {
      console.error("Error: userId es inválido.");
      Notify.create({
        message: "Error: userId es inválido.",
        color: "negative",
        position: "top-right",
      });
      return;
    }

    // Asociar el horario al userId
    nuevoHorario.userId = userId;

    loading.value = true;
    error.value = null;
    try {
      const { data, error: insertError } = await supabase
        .from("horarios_atencion")
        .insert([nuevoHorario])
        .select()
        .single();
      if (insertError) throw insertError;
      horariosAtencion.value.push(data);
      console.log("Horario de Atención Creado:", data);
    } catch (err) {
      console.error("Error al crear horario de atención:", err);
      error.value = err.message || "Error al crear horario de atención.";
      Notify.create({
        message: error.value,
        color: "negative",
        position: "top-right",
      });
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const actualizarHorarioAtencion = async (id, horarioActualizado) => {
    try {
      const { data, error: updateError } = await supabase
        .from("horarios_atencion")
        .update(horarioActualizado)
        .eq("id", id)
        .select()
        .single();
      if (updateError) throw updateError;
      const index = horariosAtencion.value.findIndex((h) => h.id === id);
      if (index !== -1) {
        horariosAtencion.value[index] = data;
      }
      Notify.create({
        message: "Horario de atención actualizado exitosamente.",
        color: "positive",
        position: "top-right",
      });
    } catch (err) {
      console.error("Error al actualizar horario de atención:", err);
      Notify.create({
        message: `Error al actualizar horario de atención: ${err.message}`,
        color: "negative",
        position: "top-right",
      });
      throw err;
    }
  };

  const eliminarHorarioAtencion = async (id) => {
    try {
      const { error: deleteError } = await supabase
        .from("horarios_atencion")
        .delete()
        .eq("id", id);
      if (deleteError) throw deleteError;
      horariosAtencion.value = horariosAtencion.value.filter(
        (h) => h.id !== id
      );
      Notify.create({
        message: "Horario de atención eliminado exitosamente.",
        color: "positive",
        position: "top-right",
      });
    } catch (err) {
      console.error("Error al eliminar horario de atención:", err);
      Notify.create({
        message: `Error al eliminar horario de atención: ${err.message}`,
        color: "negative",
        position: "top-right",
      });
      throw err;
    }
  };
  return {
    loading,
    error,
    success,
    users,
    horariosAtencion, // Exponer horarios
    cargarUsuarios,
    cargarUsuarioPerfil,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario,
    cellDurationConfig,
    startDayHourConfig,
    endDayHourConfig,
    // Nuevas funciones de horarios:
    cargarHorariosAtencion,
    crearHorarioAtencion,
    actualizarHorarioAtencion,
    eliminarHorarioAtencion,
  };
});
