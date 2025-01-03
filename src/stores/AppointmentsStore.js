// /src/stores/AppointmentsStore.js
import { defineStore } from "pinia";
import { supabase } from "../supabaseClient";
import { useAuthStore } from "./auth";
import { ref, watch } from "vue";

export const useAppointmentsStore = defineStore("appointments", () => {
  const appointments = ref([]);
  const appointmentsTrend = ref([]);
  const loading = ref(false);
  const error = ref(null);

  const authStore = useAuthStore();
  const role = ref(null); // si lo necesitas para algo extra

  /**
   * Calcula la tendencia de citas por semana en el mes actual.
   */
  const calculateAppointmentsTrend = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const groupedData = [];

    // Obtener el primer día del mes actual para cada semana (máx. 5)
    for (let i = 0; i < 5; i++) {
      const startOfWeek = new Date(currentYear, currentMonth, 1 + i * 7);
      const endOfWeek = new Date(currentYear, currentMonth, 1 + i * 7 + 6);

      groupedData.push({
        start: startOfWeek,
        end: endOfWeek,
        count: 0,
      });
    }

    // Contar cuántas citas caen en cada rango semanal
    appointments.value.forEach((appt) => {
      const date = new Date(appt.startDate);
      if (
        date.getMonth() === currentMonth &&
        date.getFullYear() === currentYear
      ) {
        for (const week of groupedData) {
          if (date >= week.start && date <= week.end) {
            week.count++;
            break;
          }
        }
      }
    });

    appointmentsTrend.value = groupedData.map((week) => ({
      period: `${week.start.toLocaleDateString()} - ${week.end.toLocaleDateString()}`,
      count: week.count,
    }));
  };

  /**
   * Calcula estadísticas mensuales (para tu dashboard).
   */
  const calculateMonthlyStats = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const startCurrentMonth = new Date(currentYear, currentMonth, 1);

    const currentMonthAppointments = appointments.value.filter((appt) => {
      const apptDate = new Date(appt.startDate);
      return apptDate >= startCurrentMonth && apptDate <= now;
    });
    const currentMonthCount = currentMonthAppointments.length;

    let prevMonth = currentMonth - 1;
    let prevYear = currentYear;
    if (prevMonth < 0) {
      prevMonth = 11;
      prevYear = currentYear - 1;
    }
    const startPrevMonth = new Date(prevYear, prevMonth, 1);
    const endPrevMonth = new Date(prevYear, prevMonth + 1, 0);

    const prevMonthAppointments = appointments.value.filter((appt) => {
      const apptDate = new Date(appt.startDate);
      return apptDate >= startPrevMonth && apptDate <= endPrevMonth;
    });
    const prevMonthCount = prevMonthAppointments.length;

    let diffPercentage = 0;
    if (prevMonthCount > 0) {
      diffPercentage =
        ((currentMonthCount - prevMonthCount) / prevMonthCount) * 100;
    }
    return { currentMonthCount, prevMonthCount, diffPercentage };
  };

  /**
   * Obtiene TODAS las citas del usuario autenticado (independientemente de su status).
   * Verás 'Pendiente', 'Aceptada', 'Rechazada', etc., siempre y cuando userId = authStore.userId.
   */
  const fetchAppointments = async () => {
    const userId = authStore?.userId;
    console.group("fetchAppointments");
    console.log("[fetchAppointments] Inicio de la función");

    if (!userId) {
      console.warn(
        "[fetchAppointments] No hay un usuario autenticado. No se cargarán citas."
      );
      appointments.value = [];
      appointmentsTrend.value = [];
      console.groupEnd();
      return;
    }

    loading.value = true;
    error.value = null;

    try {
      console.log(
        `[fetchAppointments] Consultando citas para userId: ${userId}`
      );

      const { data, error: fetchError } = await supabase
        .from("appointments")
        .select("*")
        .eq("userId", userId);

      if (fetchError) {
        console.error(
          "[fetchAppointments] Error al obtener las citas desde Supabase:",
          fetchError
        );
        error.value = fetchError.message;
      } else {
        console.log("[fetchAppointments] Citas obtenidas exitosamente:", data);
        appointments.value = data || [];

        console.log("[fetchAppointments] Calculando tendencias de citas...");
        calculateAppointmentsTrend();
        console.log(
          "[fetchAppointments] Tendencias calculadas:",
          appointmentsTrend.value
        );
      }
    } catch (err) {
      console.error(
        "[fetchAppointments] Excepción capturada durante la ejecución:",
        err.message
      );
      error.value = err.message;
    } finally {
      loading.value = false;
      console.log(
        "[fetchAppointments] Finalizando ejecución, loading:",
        loading.value
      );
      console.groupEnd();
    }
  };

  // Si el userId cambia (login/logout), recargamos las citas
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
   * Agrega una nueva cita. (MÉTODO 2: El médico la agenda desde el Scheduler)
   */
  const addAppointment = async (appointment) => {
    const userId = authStore.userId;

    if (!userId) {
      console.error(
        "No hay un usuario autenticado. No se puede agregar la cita."
      );
      error.value = "Usuario no autenticado.";
      return;
    }

    // Asignar userId (el ID del médico actual)
    const appointmentWithUser = {
      ...appointment,
      userId: userId,
    };

    loading.value = true;
    error.value = null;

    try {
      const { data, error: insertError } = await supabase
        .from("appointments")
        .insert([appointmentWithUser])
        .select(); // Retorna la fila insertada (Supabase v2)

      if (insertError) {
        console.error("Error inserting appointment:", insertError);
        error.value = insertError.message;
        throw insertError;
      }

      if (data && data.length > 0) {
        // Añadimos localmente
        appointments.value.push(data[0]);
        calculateAppointmentsTrend();
        return data[0];
      } else {
        console.error("No data returned from Supabase after insertion.");
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
   * Actualiza una cita específica.
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

    loading.value = true;
    error.value = null;

    try {
      const { data, error: updateError } = await supabase
        .from("appointments")
        .update(updates)
        .eq("id", id)
        .eq("userId", userId); // Por RLS, si userId no coincide, no actualizará nada

      if (updateError) {
        console.error("Error al actualizar la cita en Supabase:", updateError);
        error.value = updateError.message;
      } else if (data && data.length > 0) {
        // Actualizamos localmente
        const index = appointments.value.findIndex((app) => app.id === id);
        if (index !== -1) {
          appointments.value[index] = {
            ...appointments.value[index],
            ...updates,
          };
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
   * Elimina una cita específica.
   */
  const deleteAppointment = async (id) => {
    const userId = authStore.userId;

    if (!userId) {
      error.value = "Usuario no autenticado.";
      return;
    }

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
      }
    } catch (err) {
      console.error("Error al eliminar la cita:", err.message);
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };

  /**
   * (OPCIONAL) Trae solo las pendientes, por si en otra vista quieres mostrar 'Pendiente'.
   */
  const pendingAppointmentsCount = ref(0);

  const fetchAutoAppointments = async () => {
    loading.value = true;
    error.value = null;

    try {
      const userId = authStore.userId;

      if (!userId) {
        console.warn("[fetchAutoAppointments] No hay un usuario autenticado.");
        appointments.value = [];
        pendingAppointmentsCount.value = 0; // Reiniciar el conteo
        return;
      }

      const { data, error: fetchError } = await supabase
        .from("appointments")
        .select("*")
        .eq("userId", userId)
        .eq("autoCita", true);

      if (fetchError) {
        console.error(
          "[fetchAutoAppointments] Error al realizar la consulta:",
          fetchError
        );
        error.value = fetchError.message;
      } else {
        appointments.value = data || [];
        // Actualizar el conteo de citas pendientes
        pendingAppointmentsCount.value = appointments.value.filter(
          (a) => a.status === "Pendiente"
        ).length;
        console.log(
          "Cantidad de citas pendientes: ",
          pendingAppointmentsCount.value
        );
      }
    } catch (err) {
      console.error("[fetchAutoAppointments] Excepción capturada:", err);
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };

  // NUEVO: Función para enviar correo
  async function sendWhatsAppNotification(appointmentId, status) {
    try {
      // 1. Obtener la cita para ver el 'patientphone' u otros datos
      const { data, error } = await supabase
        .from("appointments")
        .select("patientphone, title, startDate, nombre")
        .eq("id", appointmentId)
        .single();
      if (error || !data) {
        console.error("Error al obtener cita:", error);
        return;
      }

      const { patientphone, title, startDate, nombre } = data;

      // 2. Llamar a tu API / servicio de WhatsApp
      //    Por ejemplo: 'http://localhost:9000/sendwhatsapp'
      //    donde tengas la lógica de Twilio, WhatsApp Cloud API, etc.
      const response = await fetch("http://localhost:9000/sendwhatsapp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: patientphone, // número del paciente
          message: `Hola, la cita "${title}" para ${nombre} a las ${startDate} ha sido ${status}.`,
        }),
      });
      const result = await response.json();
      console.log("WhatsApp result:", result);
    } catch (err) {
      console.error("Error al enviar notificación por WhatsApp:", err);
    }
  }

  /**
   * Aceptar cita (status = 'Aceptada').
   */
  const acceptAppointment = async (id) => {
    loading.value = true;
    error.value = null;
    try {
      const userId = authStore.userId;
      if (!userId) {
        throw new Error("Usuario no autenticado.");
      }

      const { error: updateError } = await supabase
        .from("appointments")
        .update({ status: "Aceptada" })
        .eq("id", id)
        .eq("userId", userId);

      if (updateError) {
        throw updateError;
      }
      // Llamada a tu función de envío de WhatsApp
      await sendWhatsAppNotification(id, "APROBADA");
      await fetchAutoAppointments();
    } catch (err) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Rechazar cita (status = 'Rechazada').
   */
  const rejectAppointment = async (id) => {
    loading.value = true;
    error.value = null;
    try {
      const userId = authStore.userId;
      if (!userId) {
        throw new Error("Usuario no autenticado.");
      }

      const { error: updateError } = await supabase
        .from("appointments")
        .update({ status: "Rechazada" })
        .eq("id", id)
        .eq("userId", userId);

      if (updateError) {
        throw updateError;
      }
      // Llamada a tu función de envío de WhatsApp
      await sendWhatsAppNotification(id, "RECHAZADA");
      await fetchAutoAppointments();
    } catch (err) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };
  const last8AutoAppointments = ref([]);
  /**
   * Obtiene las últimas 8 citas (ordenadas por fecha de creación o startDate)
   * que sean `autoCita = true`, con un filtro opcional de status.
   *
   * @param {string} status - "Pendiente", "Aceptada", "Rechazada", o "Todas".
   * @param {number} limit - Por defecto 8 (las últimas 8).
   */
  const fetchLast8AutoAppointmentsByStatus = async (
    status = "Todas",
    limit = 8
  ) => {
    loading.value = true;
    error.value = null;

    try {
      // userId del médico autenticado:
      const userId = authStore.userId;
      if (!userId) {
        console.warn(
          "[fetchLast8AutoAppointmentsByStatus] No hay userId. Retornando vacío."
        );
        last8AutoAppointments.value = [];
        return;
      }

      let query = supabase
        .from("appointments")
        .select("*")
        .eq("autoCita", true) // Solo las citas solicitadas por pacientes
        .eq("userId", userId) // Solo las del médico actual
        .order("created_at", { ascending: false }) // Ordena desde las más recientes
        .limit(limit);

      if (status !== "Todas") {
        query = query.eq("status", status);
      }

      const { data, error: fetchError } = await query;
      if (fetchError) {
        throw fetchError;
      } else {
        last8AutoAppointments.value = data || [];
        console.log("Nuevos datossss:", last8AutoAppointments.value);
      }
    } catch (err) {
      console.error("[fetchLast8AutoAppointmentsByStatus] Error:", err.message);
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };

  return {
    // State
    appointments,
    appointmentsTrend,
    loading,
    error,

    // Actions / getters
    fetchAppointments,
    fetchAutoAppointments,
    addAppointment,
    updateAppointment,
    deleteAppointment,
    acceptAppointment,
    rejectAppointment,

    // Utils / stats
    calculateAppointmentsTrend,
    calculateMonthlyStats,
    last8AutoAppointments,
    fetchLast8AutoAppointmentsByStatus,
  };
});
