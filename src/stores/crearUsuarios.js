// src/stores/crearUsuarios.js
import { defineStore } from "pinia";
import { supabase } from "../supabaseClient"; // Ajusta la ruta si es necesario
import { ref, watch } from "vue";
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

  const horariosAtencion = ref([]);
  const permitirSuperposicion = ref(false);
  const configuracionId = ref(null); // Para almacenar el ID del registro de configuración

  const startDayHourConfig = ref(8);
  const cellDurationConfig = ref(15);
  const endDayHourConfig = ref(18);

  // --------------------------------------------------
  // Helpers
  // --------------------------------------------------
  function convertirHoraANumero(horaStr) {
    if (!horaStr) return null;
    const [horas, minutos, segundos] = horaStr.split(":").map(Number);
    return horas + minutos / 60 + (segundos || 0) / 3600;
  }

  // --------------------------------------------------
  // Métodos asíncronos con loading y retorno de Promesas
  // --------------------------------------------------

  /**
   * Carga la lista de usuarios desde la tabla `users`, filtrando por tenant_id.
   */
  const cargarUsuarios = () => {
    loading.value = true;
    error.value = null;
    success.value = null;

    return new Promise(async (resolve, reject) => {
      try {
        const { data, error: fetchError } = await supabase
          .from("users")
          .select("*")
          .eq("tenant_id", authStore.tenant_id);

        if (fetchError) {
          throw fetchError;
        }

        users.value = data || [];
        console.log("Usuarios en la tabla 'users':", users.value);

        resolve(data);
      } catch (err) {
        console.error("Error al obtener usuarios:", err.message);
        error.value = err.message;
        reject(err);
      } finally {
        loading.value = false;
      }
    });
  };

  /**
   * Carga el perfil del usuario (los datos del `users` donde id = authStore.userId).
   */
  const cargarUsuarioPerfil = () => {
    loading.value = true;
    error.value = null;
    success.value = null;

    return new Promise(async (resolve, reject) => {
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

        resolve(data);
      } catch (err) {
        console.error("Error al obtener usuarios:", err.message);
        error.value = err.message;
        reject(err);
      } finally {
        loading.value = false;
      }
    });
  };

  /**
   * Crea un usuario tanto en Supabase Auth como en la tabla `users`.
   * Retorna el nuevo usuario insertado en la tabla `users`.
   */
  const crearUsuario = (email, password, extraData = {}) => {
    loading.value = true;
    error.value = null;
    success.value = null;

    return new Promise(async (resolve, reject) => {
      try {
        if (
          !email ||
          !password ||
          !extraData.role ||
          !extraData.nombreCompleto
        ) {
          throw new Error("Email, contraseña y role son obligatorios.");
        }

        const tenant_id = authStore.tenant_id;
        if (!tenant_id) {
          throw new Error(
            "No se pudo obtener el tenant_id del usuario autenticado."
          );
        }
        console.log("PARA EL DISPLAY NAME: ", extraData.nombreCompleto);

        // 1) Crear usuario en Auth
        const { data: authData, error: signUpError } =
          await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                display_name: extraData.nombreCompleto,
              },
              emailRedirectTo: "http://localhost:9000/set-password",
            },
          });
        if (signUpError) {
          throw signUpError;
        }

        const userId = authData.user.id;

        // 2) Insertar en la tabla `users`
        const { data, error: insertError } = await supabase
          .from("users")
          .insert([
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
              EsMedico: extraData.EsMedico,
            },
          ]);

        if (insertError) {
          // Rollback: eliminar de Auth
          await supabase.auth.admin.deleteUser(userId);
          throw insertError;
        }

        success.value = "Usuario creado exitosamente.";
        users.value.push(data[0]);
        resolve(data[0]);
      } catch (err) {
        console.error("Error al crear usuario:", err.message);
        error.value = err.message;
        reject(err);
      } finally {
        loading.value = false;
      }
    });
  };

  /**
   * Actualiza un usuario (tanto en la tabla `users` como en Auth si cambia email/password).
   */
  const actualizarUsuario = (payload) => {
    loading.value = true;
    error.value = null;
    success.value = null;

    return new Promise(async (resolve, reject) => {
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
          updates.email = payload?.email;
        }
        if (payload.role) {
          updates.role = payload?.role;
        }
        if (payload.nombreCompleto !== undefined) {
          updates.nombreCompleto = payload?.nombreCompleto;
        }
        if (payload.direccion !== undefined) {
          updates.direccion = payload?.direccion;
        }
        if (payload.telefono !== undefined) {
          updates.telefono = payload?.telefono;
        }
        if (payload.observaciones !== undefined) {
          updates.observaciones = payload?.observaciones;
        }
        if (payload.especialidadMedica !== undefined) {
          updates.especialidadMedica = payload?.especialidadMedica;
        }
        if (payload.EsMedico !== undefined) {
          updates.EsMedico = payload?.EsMedico;
        }
        console.log("ESMEDICO DESDE STORE DE USUARIOS: ", payload.EsMedico);
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
          const { error: updateAuthEmailError } =
            await supabase.auth.updateUser({
              email: payload.email,
            });
          if (updateAuthEmailError) {
            throw updateAuthEmailError;
          }
        }

        // 3) Actualizar en Auth si cambió password
        if (payload.password) {
          if (payload.password.length < 8) {
            throw new Error("La contraseña debe tener al menos 8 caracteres.");
          }
          const { error: updateAuthPassError } = await supabase.auth.updateUser(
            {
              password: payload.password,
            }
          );
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

        resolve(userData?.[0] || null);
      } catch (err) {
        console.error("Error al actualizar usuario:", err.message);
        error.value = err.message;
        reject(err);
      } finally {
        loading.value = false;
      }
    });
  };

  /**
   * Eliminar usuario de la tabla `users` + Auth (vía backend).
   */
  const eliminarUsuario = (id) => {
    loading.value = true;
    error.value = null;
    success.value = null;

    return new Promise(async (resolve, reject) => {
      try {
        if (!id) {
          throw new Error("ID del usuario es obligatorio.");
        }

        // 1) Eliminar de la tabla `users`
        const { data, error: deleteError } = await supabase
          .from("users")
          .delete()
          .eq("id", id);
        if (deleteError) {
          throw deleteError;
        }

        // 2) Eliminar en Auth (requiere service key => tu backend)
        const response = await axios.delete(
          `http://localhost:3000/delete-user/${id}`
        );
        if (response.data?.error) {
          throw new Error(response.data.error);
        }

        success.value = "Usuario eliminado exitosamente.";
        users.value = users.value.filter((u) => u.id !== id);

        resolve();
      } catch (err) {
        console.error("Error al eliminar usuario:", err.message);
        error.value = err.message;
        reject(err);
      } finally {
        loading.value = false;
      }
    });
  };

  /**
   * Carga los horarios de la tabla `configuraciones`.
   */
  const cargarConfiguraciones = () => {
    loading.value = true;
    error.value = null;
    success.value = null;

    return new Promise(async (resolve, reject) => {
      try {
        const userId = authStore.userId;
        if (!userId) {
          console.error("Error: userId es inválido.");
          Notify.create({
            message: "Error: userId es inválido.",
            color: "negative",
          });
          loading.value = false;
          return resolve(null);
        }

        const { data, error: fetchError } = await supabase
          .from("SAConfiguraciones")
          .select("*")
          .eq("userId", userId);

        if (fetchError) {
          throw fetchError;
        }

        horariosAtencion.value = data;
        console.log("Horarios de Atención Cargados:", horariosAtencion.value);

        if (data && data.length > 0) {
          const primerHorario = data[0];
          if (primerHorario.intervalo_min) {
            cellDurationConfig.value = primerHorario.intervalo_min;
          }
          if (primerHorario.hora_inicio) {
            startDayHourConfig.value = convertirHoraANumero(
              primerHorario.hora_inicio
            );
          }
          if (primerHorario.hora_fin) {
            endDayHourConfig.value = convertirHoraANumero(
              primerHorario.hora_fin
            );
          }
          permitirSuperposicion.value = primerHorario.autoSuperPosicion;
          configuracionId.value = primerHorario.ConfiguracionesId;

          console.log(
            "PERMITIR SUPERPOSICION STORE ",
            permitirSuperposicion.value
          );
        } else {
          console.log(
            "No se encontraron horarios de atención para el usuario."
          );
        }

        resolve(data);
      } catch (err) {
        error.value = err.message || "Error al cargar horarios de atención.";
        console.error("Error:", error.value);
        Notify.create({ message: error.value, color: "negative" });
        reject(err);
      } finally {
        loading.value = false;
      }
    });
  };

  /**
   * Crea un nuevo registro en `configuraciones`.
   */
  const crearConfiguraciones = (nuevoHorario) => {
    loading.value = true;
    error.value = null;
    success.value = null;

    return new Promise(async (resolve, reject) => {
      try {
        const userId = authStore.userId;
        if (!nuevoHorario) {
          console.error("Error: datos del horario son inválidos.");
          Notify.create({
            message: "Error: datos del horario son inválidos.",
            color: "negative",
            position: "top-right",
          });
          loading.value = false;
          return resolve(null);
        }
        if (!userId) {
          console.error("Error: userId es inválido.");
          Notify.create({
            message: "Error: userId es inválido.",
            color: "negative",
            position: "top-right",
          });
          loading.value = false;
          return resolve(null);
        }

        // Verificar si ya existe algún horario:
        if (horariosAtencion.value.length >= 1) {
          console.error("Ya existe un horario. Solo se permite crear uno.");
          error.value = "Solo se puede crear un horario. Ya existe uno.";
          Notify.create({
            message: error.value,
            color: "negative",
            position: "top-right",
          });
          loading.value = false;
          return resolve(null);
        }

        // Asociar el horario al userId
        nuevoHorario.userId = userId;

        const { data, error: insertError } = await supabase
          .from("SAConfiguraciones")
          .insert([nuevoHorario])
          .select()
          .single();

        if (insertError) {
          throw insertError;
        }

        horariosAtencion.value.push(data);
        console.log("Horario de Atención Creado:", data);

        resolve(data);
      } catch (err) {
        console.error("Error al crear horario de atención:", err);
        error.value = err.message || "Error al crear horario de atención.";
        Notify.create({
          message: error.value,
          color: "negative",
          position: "top-right",
        });
        reject(err);
      } finally {
        loading.value = false;
      }
    });
  };

  /**
   * Actualiza un registro de `configuraciones` (un horario) por su ID.
   */
  const actualizarConfiguraciones = (id, horarioActualizado) => {
    loading.value = true;
    error.value = null;
    success.value = null;
    if (!id) {
      throw new Error("El ID de configuración es indefinido.");
    }
    return new Promise(async (resolve, reject) => {
      try {
        const { data, error: updateError } = await supabase
          .from("SAConfiguraciones")
          .update(horarioActualizado)
          .eq("ConfiguracionesId", id)
          .select()
          .single();

        if (updateError) {
          throw updateError;
        }

        const index = horariosAtencion.value.findIndex(
          (h) => h.ConfiguracionesId === id
        );
        if (index !== -1) {
          horariosAtencion.value[index] = data;
        }
        Notify.create({
          message: "Horario de atención actualizado exitosamente.",
          color: "positive",
          position: "top-right",
        });

        resolve(data);
      } catch (err) {
        console.error("Error al actualizar horario de atención:", err);
        Notify.create({
          message: `Error al actualizar horario de atención: ${err.message}`,
          color: "negative",
          position: "top-right",
        });
        reject(err);
      } finally {
        loading.value = false;
      }
    });
  };

  /**
   * Elimina un registro de `configuraciones` (un horario) por su ID.
   */
  const eliminarConfiguraciones = (id) => {
    loading.value = true;
    error.value = null;
    success.value = null;

    return new Promise(async (resolve, reject) => {
      try {
        const { error: deleteError } = await supabase
          .from("SAConfiguraciones")
          .delete()
          .eq("ConfiguracionesId", id);
        if (deleteError) {
          throw deleteError;
        }

        horariosAtencion.value = horariosAtencion.value.filter(
          (h) => h.ConfiguracionesId !== id
        );

        Notify.create({
          message: "Horario de atención eliminado exitosamente.",
          color: "positive",
          position: "top-right",
        });

        resolve();
      } catch (err) {
        console.error("Error al eliminar horario de atención:", err);
        Notify.create({
          message: `Error al eliminar horario de atención: ${err.message}`,
          color: "negative",
          position: "top-right",
        });
        reject(err);
      } finally {
        loading.value = false;
      }
    });
  };

  // --------------------------------------------------
  // Watch para permitirSuperposicion => actualiza en BD
  // --------------------------------------------------
  watch(permitirSuperposicion, async (nuevoValor) => {
    try {
      if (configuracionId.value === null) {
        console.warn("ID de configuración no definido, no se actualiza.");
        return;
      }
      const { error: supaError } = await supabase
        .from("SAConfiguraciones")
        .update({ autoSuperPosicion: nuevoValor })
        .eq("ConfiguracionesId", configuracionId.value);

      if (supaError) {
        console.error("Error al actualizar autoSuperPosicion:", supaError);
        Notify.create({
          message: "Error al actualizar la configuración de superposición.",
          color: "negative",
          position: "top-right",
        });
      } else {
        Notify.create({
          message: "Configuración de superposición actualizada.",
          color: "positive",
          position: "top-right",
        });
      }
    } catch (err) {
      console.error("Excepción al actualizar configuración:", err);
    }
  });

  // --------------------------------------------------
  // Retorno de estados y métodos
  // --------------------------------------------------
  return {
    // States
    loading,
    error,
    success,
    users,
    horariosAtencion,
    permitirSuperposicion,
    configuracionId,
    cellDurationConfig,
    startDayHourConfig,
    endDayHourConfig,

    // Métodos
    cargarUsuarios,
    cargarUsuarioPerfil,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario,

    cargarConfiguraciones,
    crearConfiguraciones,
    actualizarConfiguraciones,
    eliminarConfiguraciones,
  };
});
