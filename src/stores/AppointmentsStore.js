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
      period: `${week.start.toLocaleDateString()} - ${week.end.toLocaleDateString()}`,
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
    const tenantId = authStore.tenantId;
    const userId = authStore.userId;

    console.log("Estado de autenticación actualizado:", {
      tenantId: tenantId.value,
      role: role.value, // Asegúrate de que 'role' esté definido en tu auth store
      userId: userId,
    });

    if (!userId) {
      console.error(
        "No hay un usuario autenticado. No se puede agregar la cita."
      );
      error.value = "Usuario no autenticado.";
      return;
    }

    const appointmentWithUser = {
      ...appointment,
    };

    console.log("Adding appointment:", appointmentWithUser);

    loading.value = true;
    error.value = null;

    try {
      const { data, error: insertError } = await supabase
        .from("appointments")
        .insert([appointmentWithUser])
        .select();

      console.log("Inserted appointment data:", data);

      if (insertError) {
        console.error("Error inserting appointment:", insertError);
        error.value = insertError.message;
        throw insertError;
      }

      if (data && data.length > 0) {
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
        .eq("userId", userId);

      console.log("Updated appointment data:", data);

      if (updateError) {
        console.error("Error al actualizar la cita en Supabase:", updateError);
        error.value = updateError.message;
      } else if (data && data.length > 0) {
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
        .eq("userId", userId);

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

  /**
   * Calcula la cantidad de citas del mes actual hasta la fecha actual,
   * la cantidad de citas del mes anterior y la diferencia porcentual.
   */
  const calculateMonthlyStats = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Inicio de mes actual
    const startCurrentMonth = new Date(currentYear, currentMonth, 1);

    // Citas del mes actual hasta hoy
    const currentMonthAppointments = appointments.value.filter((appt) => {
      const apptDate = new Date(appt.startDate);
      return apptDate >= startCurrentMonth && apptDate <= now;
    });
    const currentMonthCount = currentMonthAppointments.length;

    // Mes anterior
    let prevMonth = currentMonth - 1;
    let prevYear = currentYear;
    if (prevMonth < 0) {
      prevMonth = 11;
      prevYear = currentYear - 1;
    }
    const startPrevMonth = new Date(prevYear, prevMonth, 1);
    const endPrevMonth = new Date(prevYear, prevMonth + 1, 0); // último día del mes anterior

    // Citas del mes anterior completo
    const prevMonthAppointments = appointments.value.filter((appt) => {
      const apptDate = new Date(appt.startDate);
      return apptDate >= startPrevMonth && apptDate <= endPrevMonth;
    });
    const prevMonthCount = prevMonthAppointments.length;

    // Diferencia porcentual
    let diffPercentage = 0;
    if (prevMonthCount > 0) {
      diffPercentage =
        ((currentMonthCount - prevMonthCount) / prevMonthCount) * 100;
    }
    console.log("% MES ANTERIOR: ", prevMonthCount);
    console.log("% MES ACTUAL: ", currentMonthCount);
    console.log("% de diferencia ", diffPercentage);
    return { currentMonthCount, prevMonthCount, diffPercentage };
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
    calculateMonthlyStats, // Exportamos la nueva función
  };
});
