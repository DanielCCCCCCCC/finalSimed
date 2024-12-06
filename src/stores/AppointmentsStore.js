// src/stores/appointments.js

import { defineStore } from "pinia";
import { supabase } from "../supabaseClient";
import { useAuthStore } from "./auth"; // Importar el store de autenticación
import { ref, watch } from "vue";

export const useAppointmentsStore = defineStore("appointments", () => {
  // Estados reactivos
  const appointments = ref([]);
  const appointmentsTrend = ref([]);
  const loading = ref(false);
  const error = ref(null);

  const authStore = useAuthStore();
  // const userId = authStore.userId;

  /**
   * Calcula la tendencia de citas por semana en el mes actual.
   */
  const calculateAppointmentsTrend = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const groupedData = [];

    // Obtiene el primer día del mes actual
    const startOfMonth = new Date(currentYear, currentMonth, 1);

    for (let i = 0; i < 5; i++) {
      const startOfWeek = new Date(currentYear, currentMonth, 1 + i * 7);
      const endOfWeek = new Date(currentYear, currentMonth, 1 + i * 7 + 6);

      groupedData.push({
        start: startOfWeek,
        end: endOfWeek,
        count: 0,
      });
    }

    appointments.value.forEach((appointment) => {
      const date = new Date(appointment.startDate);

      // Filtra por el mes y año actual
      if (
        date.getMonth() === currentMonth &&
        date.getFullYear() === currentYear
      ) {
        for (const week of groupedData) {
          if (date >= week.start && date <= week.end) {
            week.count++;
            break; // Rompe el bucle si ya encontramos la semana correspondiente
          }
        }
      }
    });

    // Ahora, en lugar de 'period' como string, puedes crear un texto a partir de las fechas
    appointmentsTrend.value = groupedData.map((week) => ({
      period: `${week.start.toLocaleDateString()} - ${week.end.toLocaleDateString()}`, // Comillas invertidas corregidas
      count: week.count,
    }));

    console.log("Tendencia de citas:", appointmentsTrend.value);
  };

  /**
   * Obtiene las citas del usuario autenticado desde la tabla appointments.
   */
  const fetchAppointments = async () => {
    const userId = authStore?.userId;
    const tenantId = authStore?.tenantId;

    if (!userId) {
      console.warn("No hay un usuario autenticado. No se cargarán citas.");
      appointments.value = [];
      appointmentsTrend.value = [];
      return;
    }

    console.log("Buscando citas para userId:", userId, "y tenantId:", tenantId);

    loading.value = true;
    error.value = null;

    try {
      const { data, error: fetchError } = await supabase
        .from("appointments")
        .select(
          "id, title, startDate, endDate, allDay, repeat, description, nombre, medico, tipoCita, userId"
        )
        .eq("userId", userId);

      console.log("Data fetched from Supabase:", data);

      if (fetchError) {
        console.error("Error al obtener las citas:", fetchError);
        error.value = fetchError.message;
      } else {
        appointments.value = data || [];
        console.log("Appointments cargadas:", appointments.value);
        calculateAppointmentsTrend();
      }
    } catch (err) {
      console.error("Error al obtener las citas:", err.message);
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };

  // Watch for changes in userId and fetch appointments when userId is set
  watch(
    () => authStore.userId,
    (newUserId) => {
      if (newUserId) {
        fetchAppointments();
      } else {
        appointments.value = [];
        appointmentsTrend.value = [];
      }
    },
    { immediate: true }
  );

  /**
   * Agrega una nueva cita al usuario autenticado.
   * @param {Object} appointment - Datos de la cita a agregar.
   * @returns {Object} - La cita agregada.
   */
  const addAppointment = async (appointment) => {
    // const userId = authStore.userId;
    const tenantId = authStore.tenantId;
    const userId = authStore.userId;

    // console.log("UserId LN136: ", authStore.userId);
    // console.log("Fetching appointments for userId:", userId);
    console.log("Estado de autenticación actualizado:", {
      tenantId: tenantId.value,
      role: role.value,
      userId: userId,
    });

    if (!userId) {
      console.error(
        "No hay un usuario autenticado. No se puede agregar la cita."
      );
      error.value = "Usuario no autenticado.";
      return;
    }

    // Asociar la cita con el usuario y el tenant
    const appointmentWithUser = {
      ...appointment,
      // userId: userId, // Asegurarse de que el campo es 'userId' en Supabase
      // tenantId: tenantId, // Asegurarse de que el campo es 'tenantId' en Supabase
    };

    console.log("Adding appointment:", appointmentWithUser);

    loading.value = true;
    error.value = null;

    try {
      const { data, error: insertError } = await supabase
        .from("appointments")
        .insert([appointmentWithUser])
        .select(); // Incluir .select() para obtener los datos insertados

      console.log("Inserted appointment data:", data);

      if (insertError) {
        console.error("Error inserting appointment:", insertError);
        error.value = insertError.message;
        throw insertError;
      }

      if (data && data.length > 0) {
        // Cita agregada exitosamente
        appointments.value.push(data[0]);
        calculateAppointmentsTrend();
        console.log("Appointment added:", data[0]);
        return data[0];
      } else {
        console.error(
          "No se recibieron datos de Supabase después de insertar la cita."
        );
        error.value = "No data returned from Supabase.";
        throw new Error("No data returned from Supabase.");
      }
    } catch (err) {
      console.error("Error en addAppointment:", err);
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Actualiza una cita específica del usuario autenticado.
   * @param {string} id - ID de la cita a actualizar.
   * @param {Object} updates - Datos de actualización.
   */
  const updateAppointment = async (id, updates) => {
    const userId = authStore.userId;

    if (!userId) {
      console.error(
        "No hay un usuario autenticado. No se puede actualizar la cita."
      );
      error.value = "Usuario no autenticado.";
      return;
    }

    console.log("Actualizando cita con ID:", id, "y datos:", updates);

    loading.value = true;
    error.value = null;

    try {
      const { data, error: updateError } = await supabase
        .from("appointments")
        .update(updates)
        .eq("id", id)
        .eq("userId", userId); // Asegurar que la cita pertenece al usuario

      console.log("Updated appointment data:", data);

      if (updateError) {
        console.error("Error al actualizar la cita en Supabase:", updateError);
        error.value = updateError.message;
      } else if (data && data.length > 0) {
        // Actualiza los datos localmente en el estado
        const index = appointments.value.findIndex((app) => app.id === id);
        if (index !== -1) {
          appointments.value[index] = {
            ...appointments.value[index],
            ...updates,
          };
          console.log(
            "Appointment updated locally:",
            appointments.value[index]
          );
        }
        calculateAppointmentsTrend();
      }
    } catch (err) {
      console.error("Error al actualizar la cita:", err.message);
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Elimina una cita específica del usuario autenticado.
   * @param {string} id - ID de la cita a eliminar.
   */
  const deleteAppointment = async (id) => {
    const userId = authStore.userId;

    if (!userId) {
      console.error(
        "No hay un usuario autenticado. No se puede eliminar la cita."
      );
      error.value = "Usuario no autenticado.";
      return;
    }

    console.log("Eliminando cita con ID:", id);

    loading.value = true;
    error.value = null;

    try {
      const { error: deleteError } = await supabase
        .from("appointments")
        .delete()
        .eq("id", id)
        .eq("userId", userId); // Asegurar que la cita pertenece al usuario

      if (deleteError) {
        console.error("Error al eliminar la cita en Supabase:", deleteError);
        error.value = deleteError.message;
      } else {
        appointments.value = appointments.value.filter((app) => app.id !== id);
        calculateAppointmentsTrend();
        console.log("Appointment deleted locally. ID:", id);
      }
    } catch (err) {
      console.error("Error al eliminar la cita:", err.message);
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };

  return {
    appointments,
    appointmentsTrend,
    loading,
    error,
    fetchAppointments,
    addAppointment,
    updateAppointment,
    deleteAppointment,
    calculateAppointmentsTrend,
  };
});
