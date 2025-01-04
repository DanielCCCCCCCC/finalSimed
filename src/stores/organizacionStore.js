import { defineStore } from "pinia";
import { supabase } from "../supabaseClient";
import { useAuthStore } from "./auth";
import { ref, watch } from "vue";
import { Notify } from "quasar";

export const useOrganizacionStore = defineStore("organizacion", () => {
  const cargando = ref(false);
  const error = ref(null);
  const mensajeExito = ref(null);
  const organizaciones = ref([]);
  const horariosAtencion = ref([]);
  const authStore = useAuthStore();

  async function cargarOrganizaciones() {
    const tenant_id = authStore.tenant_id;
    try {
      if (!tenant_id) {
        throw new Error("No se pudo obtener el tenant_id del usuario.");
      }

      const { data, error: fetchError } = await supabase
        .from("organizacion")
        .select("*")
        .eq("id", tenant_id);
      console.log("ORGANIZACIONES: ", organizaciones.value);
      if (fetchError) {
        throw new Error(
          `Error al cargar organizaciones: ${fetchError.message}`
        );
      } else {
        organizaciones.value = data.map((org) => ({ ...org }));
      }
    } catch (err) {
      console.error("Error al conectar con Supabase:", err);
    }
  }

  /**
   * Registra una nueva organización y su usuario administrador.
   * Ahora solo:
   * 1. Crea el usuario en Supabase Auth
   * 2. Inserta la organización (incluyendo campos para el trigger)
   * El trigger se encarga de crear el tenant y el usuario en la tabla 'users'.
   */
  const registrarOrganizacion = async (datosOrganizacion, datosAdmin) => {
    cargando.value = true;
    error.value = null;
    mensajeExito.value = null;

    try {
      // Paso 1: Crear el usuario en Supabase Auth
      const { data: authUser, error: authError } = await supabase.auth.signUp({
        email: datosAdmin.email,
        password: datosAdmin.password,
      });

      if (authError) {
        throw new Error(`Error al crear usuario: ${authError.message}`);
      }

      // Paso 2: Insertar la organización (el trigger hará el resto)
      const { data: orgData, error: orgError } = await supabase
        .from("organizacion")
        .insert([
          {
            nombre: datosOrganizacion.nombre,
            direccion: datosOrganizacion.direccion,
            email_contacto: datosOrganizacion.email_contacto,
            numero_telefono: datosOrganizacion.numero_telefono || null,
            admin_user_id: authUser.user.id,
            admin_email: datosAdmin.email,
            admin_password: datosAdmin.password,
          },
        ])
        .select()
        .single();

      if (orgError) {
        throw new Error(`Error al crear organización: ${orgError.message}`);
      }

      mensajeExito.value =
        "Organización y usuario administrador registrados exitosamente.";

      // Opción: cargar las organizaciones si lo requieres.
      await cargarOrganizaciones();

      return { tenant_id: orgData.id };
    } catch (err) {
      console.error("Error al registrar la organización:", err);
      error.value = err.message || "Ocurrió un error inesperado.";
      throw err;
    } finally {
      cargando.value = false;
    }
  };
  /**
   * Actualizar una organización existente
   * @param {Object} datosOrganizacion - Nuevos datos de la organización
   */
  const actualizarOrganizacion = async (datosOrganizacion) => {
    cargando.value = true;
    error.value = null;
    mensajeExito.value = null;

    try {
      const { data, error: updateError } = await supabase
        .from("organizacion")
        .update(datosOrganizacion)
        .eq("id", authStore.tenant_id)
        .select()
        .single();

      if (updateError) {
        throw new Error(
          `Error al actualizar organización: ${updateError.message}`
        );
      }

      mensajeExito.value = "Organización actualizada exitosamente.";
      Notify.create({
        message: mensajeExito.value,
        color: "positive",
        position: "top-right",
      });

      // Actualizar el estado local
      organizaciones.value = [data];
    } catch (err) {
      console.error("Error al actualizar la organización:", err);
      error.value = err.message || "Error al actualizar organización.";
      Notify.create({
        message: error.value,
        color: "negative",
        position: "top-right",
      });
      throw err;
    } finally {
      cargando.value = false;
    }
  };
  // const cargarOrganizaciones = async () => {
  //   cargando.value = true;
  //   error.value = null;
  //   try {
  //     const { data, error: fetchError } = await supabase
  //       .from("organizacion")
  //       .select("*");
  //     if (fetchError) throw fetchError;
  //     organizaciones.value = data;
  //   } catch (err) {
  //     console.error("Error al cargar organizaciones:", err);
  //     error.value = err.message || "Error al cargar organizaciones.";
  //     Notify.create({
  //       message: error.value,
  //       color: "negative",
  //       position: "top-right",
  //     });
  //   } finally {
  //     cargando.value = false;
  //   }
  // };
  /**
 /**
 * Cargar Horarios de Atención
 * @param {string} tenantId - ID del tenant
 */
  const cargarHorariosAtencion = async (tenantId) => {
    if (!tenantId) {
      console.error("Error: tenantId es inválido:", tenantId);
      Notify.create({
        message: "Error: tenantId es inválido.",
        color: "negative",
        position: "top-right",
      });
      return;
    }

    cargando.value = true;
    error.value = null;
    try {
      const { data, error: fetchError } = await supabase
        .from("horarios_atencion")
        .select("*")
        .eq("tenant_id", tenantId)
        .order("dia_semana", { ascending: true });

      if (fetchError) throw fetchError;

      horariosAtencion.value = data;
      console.log("Horarios de Atención Cargados:", data); // Log para depuración
    } catch (err) {
      console.error("Error al cargar horarios de atención:", err);
      error.value = err.message || "Error al cargar horarios de atención.";
      Notify.create({
        message: error.value,
        color: "negative",
        position: "top-right",
      });
    } finally {
      cargando.value = false;
    }
  };

  /**
   * Crear un nuevo Horario de Atención
   * @param {Object} nuevoHorario - Objeto con los campos del horario (incluye tenant_id)
   */
  const crearHorarioAtencion = async (nuevoHorario) => {
    if (!nuevoHorario || !nuevoHorario.tenant_id) {
      console.error("Error: tenant_id es inválido:", nuevoHorario?.tenant_id);
      Notify.create({
        message: "Error: tenant_id es inválido.",
        color: "negative",
        position: "top-right",
      });
      return;
    }

    cargando.value = true;
    error.value = null;
    try {
      // Inserta el nuevo horario en la tabla
      const { data, error: insertError } = await supabase
        .from("horarios_atencion")
        .insert([nuevoHorario])
        .select()
        .single();

      if (insertError) throw insertError;

      // Agrega el nuevo registro al estado local
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
      throw err; // Importante si quieres manejarlo en el componente
    } finally {
      cargando.value = false;
    }
  };

  /**
   * Actualizar un Horario de Atención existente
   * @param {string} id - ID del horario a actualizar
   * @param {Object} horarioActualizado - Objeto con campos actualizados
   */
  const actualizarHorarioAtencion = async (id, horarioActualizado) => {
    try {
      const { data, error: updateError } = await supabase
        .from("horarios_atencion")
        .update(horarioActualizado)
        .eq("id", id)
        .select()
        .single();

      if (updateError) throw updateError;

      // Reemplaza en el array local el horario actualizado
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

  /**
   * Eliminar un Horario de Atención existente
   * @param {string} id - ID del horario a eliminar
   */
  const eliminarHorarioAtencion = async (id) => {
    try {
      const { error: deleteError } = await supabase
        .from("horarios_atencion")
        .delete()
        .eq("id", id);

      if (deleteError) throw deleteError;

      // Quita del array local el horario eliminado
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

  watch(
    () => authStore.tenant_id,
    async (newTenantId) => {
      if (newTenantId) {
        await cargarOrganizaciones();
        await cargarHorariosAtencion(newTenantId);
      } else {
        organizaciones.value = [];
        horariosAtencion.value = [];
      }
    },
    { immediate: true }
  );

  return {
    cargando,
    error,
    mensajeExito,
    organizaciones,
    horariosAtencion, // Exponer los horarios de atención
    registrarOrganizacion,
    cargarOrganizaciones,
    cargarHorariosAtencion, // Nuevas funciones
    crearHorarioAtencion,
    actualizarHorarioAtencion,
    eliminarHorarioAtencion,
    actualizarOrganizacion, // Si deseas actualizar la organización
  };
});
