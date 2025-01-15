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

  // ------------------------
  // Helpers internos
  // ------------------------
  const calculateAppointmentsTrend = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const groupedData = [];

    for (let i = 0; i < 5; i++) {
      const startOfWeek = new Date(currentYear, currentMonth, 1 + i * 7);
      const endOfWeek = new Date(currentYear, currentMonth, 1 + i * 7 + 6);

      groupedData.push({
        start: startOfWeek,
        end: endOfWeek,
        count: 0,
      });
    }

    appointments.value.forEach((appt) => {
      const date = new Date(appt.CitaFechaInicio);
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

  const calculateMonthlyStats = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const startCurrentMonth = new Date(currentYear, currentMonth, 1);

    const currentMonthAppointments = appointments.value.filter((appt) => {
      const apptDate = new Date(appt.CitaFechaInicio);
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
      const apptDate = new Date(appt.CitaFechaInicio);
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

  // ------------------------
  // Métodos asíncronos con "loading"
  // ------------------------

  /**
   * Obtiene TODAS las citas del usuario autenticado
   * Retorna una Promesa que se resuelve cuando ha cargado.
   */
  const fetchAppointments = () => {
    loading.value = true;
    error.value = null;

    return new Promise(async (resolve, reject) => {
      console.group("fetchAppointments");
      console.log("[fetchAppointments] Inicio de la función");

      const userId = authStore?.userId;
      if (!userId) {
        console.warn("[fetchAppointments] No hay un usuario autenticado.");
        appointments.value = [];
        appointmentsTrend.value = [];
        console.groupEnd();
        loading.value = false;
        return resolve(); // resolvemos aunque no haya datos
      }

      try {
        console.log(
          `[fetchAppointments] Consultando citas para userId: ${userId}`
        );
        const { data, error: fetchError } = await supabase
          .from("Appointments")
          .select("*")
          .eq("userId", userId);

        if (fetchError) {
          console.error(
            "[fetchAppointments] Error al obtener las citas desde Supabase:",
            fetchError
          );
          error.value = fetchError.message;
          reject(fetchError);
        } else {
          console.log(
            "[fetchAppointments] Citas obtenidas exitosamente:",
            data
          );
          appointments.value = data || [];

          console.log("[fetchAppointments] Calculando tendencias...");
          calculateAppointmentsTrend();
          console.log(
            "[fetchAppointments] Tendencias calculadas:",
            appointmentsTrend.value
          );
          resolve(data);
        }
      } catch (err) {
        console.error("[fetchAppointments] Excepción capturada:", err.message);
        error.value = err.message;
        reject(err);
      } finally {
        loading.value = false;
        console.log(
          "[fetchAppointments] Finalizando ejecución, loading:",
          loading.value
        );
        console.groupEnd();
      }
    });
  };

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
   * Agrega una nueva cita (retorna la cita insertada).
   */
  const addAppointment = (appointment) => {
    loading.value = true;
    error.value = null;

    return new Promise(async (resolve, reject) => {
      try {
        const userId = authStore.userId;

        if (!userId) {
          console.error(
            "No hay un usuario autenticado. No se puede agregar la cita."
          );
          error.value = "Usuario no autenticado.";
          loading.value = false;
          return reject(new Error("Usuario no autenticado."));
        }

        // Asignar userId (médico actual)
        const appointmentWithUser = {
          ...appointment,
          userId,
        };

        const { data, error: insertError } = await supabase
          .from("Appointments")
          .insert([appointmentWithUser])
          .select();

        if (insertError) {
          console.error("Error inserting appointment:", insertError);
          error.value = insertError.message;
          return reject(insertError);
        }

        if (data && data.length > 0) {
          appointments.value.push(data[0]);
          calculateAppointmentsTrend();
          resolve(data[0]);
        } else {
          const msg = "No data returned from Supabase after insertion.";
          console.error(msg);
          error.value = msg;
          reject(new Error(msg));
        }
      } catch (err) {
        console.error("Error en addAppointment:", err);
        error.value = err.message;
        reject(err);
      } finally {
        loading.value = false;
      }
    });
  };

  /**
   * Actualiza una cita específica.
   */
  const updateAppointment = (id, updates) => {
    loading.value = true;
    error.value = null;

    return new Promise(async (resolve, reject) => {
      try {
        const userId = authStore.userId;

        if (!userId) {
          console.error(
            "No hay un usuario autenticado. No se puede actualizar."
          );
          error.value = "Usuario no autenticado.";
          loading.value = false;
          return reject(new Error("Usuario no autenticado."));
        }

        const { data, error: updateError } = await supabase
          .from("Appointments")
          .update(updates)
          .eq("id", id)
          .eq("userId", userId);

        if (updateError) {
          console.error(
            "Error al actualizar la cita en Supabase:",
            updateError
          );
          error.value = updateError.message;
          return reject(updateError);
        }

        if (data && data.length > 0) {
          const index = appointments.value.findIndex((app) => app.id === id);
          if (index !== -1) {
            appointments.value[index] = {
              ...appointments.value[index],
              ...updates,
            };
          }
          calculateAppointmentsTrend();
          resolve(data[0]);
        } else {
          // Si data está vacío, probablemente no había cita
          // o la RLS impidió actualizar nada
          resolve(null);
        }
      } catch (err) {
        console.error("Error al actualizar la cita:", err.message);
        error.value = err.message;
        reject(err);
      } finally {
        loading.value = false;
      }
    });
  };

  /**
   * Elimina una cita específica.
   */
  const deleteAppointment = (id) => {
    loading.value = true;
    error.value = null;

    return new Promise(async (resolve, reject) => {
      try {
        const userId = authStore.userId;
        if (!userId) {
          error.value = "Usuario no autenticado.";
          loading.value = false;
          return reject(new Error("Usuario no autenticado."));
        }

        const { error: deleteError } = await supabase
          .from("Appointments")
          .delete()
          .eq("id", id)
          .eq("userId", userId);

        if (deleteError) {
          console.error("Error al eliminar la cita en Supabase:", deleteError);
          error.value = deleteError.message;
          return reject(deleteError);
        }

        appointments.value = appointments.value.filter((app) => app.id !== id);
        calculateAppointmentsTrend();
        resolve();
      } catch (err) {
        console.error("Error al eliminar la cita:", err.message);
        error.value = err.message;
        reject(err);
      } finally {
        loading.value = false;
      }
    });
  };

  /**
   * Trae solo las citas con AutoCita=true (ejemplo).
   */
  const pendingAppointmentsCount = ref(0);

  const fetchAutoAppointments = () => {
    loading.value = true;
    error.value = null;

    return new Promise(async (resolve, reject) => {
      try {
        const userId = authStore.userId;
        if (!userId) {
          console.warn("[fetchAutoAppointments] No hay usuario autenticado.");
          appointments.value = [];
          pendingAppointmentsCount.value = 0;
          loading.value = false;
          return resolve([]);
        }

        const { data, error: fetchError } = await supabase
          .from("Appointments")
          .select("*")
          .eq("userId", userId)
          .eq("AutoCita", true);

        if (fetchError) {
          console.error("[fetchAutoAppointments] Error:", fetchError);
          error.value = fetchError.message;
          reject(fetchError);
        } else {
          appointments.value = data || [];
          pendingAppointmentsCount.value = appointments.value.filter(
            (a) => a.CitaStatus === "Pendiente"
          ).length;
          resolve(data);
        }
      } catch (err) {
        console.error("[fetchAutoAppointments] Excepción:", err);
        error.value = err.message;
        reject(err);
      } finally {
        loading.value = false;
      }
    });
  };

  // ------------------------
  // Notificaciones por WhatsApp (ejemplo)
  // ------------------------
  async function sendWhatsAppNotification(appointmentId, CitaStatus) {
    try {
      const { data, error } = await supabase
        .from("Appointments")
        .select("PacienteTel, CitaTitulo, CitaFechaInicio, PacienteNombreId")
        .eq("id", appointmentId)
        .single();
      if (error || !data) {
        console.error("Error al obtener cita:", error);
        return;
      }

      const { PacienteTel, CitaTitulo, CitaFechaInicio, PacienteNombreId } =
        data;

      const response = await fetch("http://localhost:9000/sendwhatsapp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: PacienteTel,
          message: `Hola, la cita "${CitaTitulo}" para ${PacienteNombreId} a las ${CitaFechaInicio} ha sido ${CitaStatus}.`,
        }),
      });
      const result = await response.json();
      console.log("WhatsApp result:", result);
    } catch (err) {
      console.error("Error al enviar notificación por WhatsApp:", err);
    }
  }

  const acceptAppointment = (id) => {
    loading.value = true;
    error.value = null;

    return new Promise(async (resolve, reject) => {
      try {
        const userId = authStore.userId;
        if (!userId) {
          throw new Error("Usuario no autenticado.");
        }

        const { error: updateError } = await supabase
          .from("Appointments")
          .update({ CitaStatus: "Aceptada" })
          .eq("id", id)
          .eq("userId", userId);

        if (updateError) {
          throw updateError;
        }

        await sendWhatsAppNotification(id, "APROBADA");
        await fetchAutoAppointments(); // refresca las citas AutoCita
        resolve();
      } catch (err) {
        error.value = err.message;
        reject(err);
      } finally {
        loading.value = false;
      }
    });
  };

  const rejectAppointment = (id) => {
    loading.value = true;
    error.value = null;

    return new Promise(async (resolve, reject) => {
      try {
        const userId = authStore.userId;
        if (!userId) {
          throw new Error("Usuario no autenticado.");
        }

        const { error: updateError } = await supabase
          .from("Appointments")
          .update({ CitaStatus: "Rechazada" })
          .eq("id", id)
          .eq("userId", userId);

        if (updateError) {
          throw updateError;
        }

        await sendWhatsAppNotification(id, "RECHAZADA");
        await fetchAutoAppointments();
        resolve();
      } catch (err) {
        error.value = err.message;
        reject(err);
      } finally {
        loading.value = false;
      }
    });
  };

  // ------------------------
  // Últimas 8 citas AutoCita
  // ------------------------
  const last8AutoAppointments = ref([]);

  const fetchLast8AutoAppointmentsByCitaStatus = (
    CitaStatus = "Todas",
    limit = 8
  ) => {
    loading.value = true;
    error.value = null;

    return new Promise(async (resolve, reject) => {
      try {
        const userId = authStore.userId;
        if (!userId) {
          console.warn("[fetchLast8AutoAppointments] No hay userId.");
          last8AutoAppointments.value = [];
          loading.value = false;
          return resolve([]);
        }

        let query = supabase
          .from("Appointments")
          .select("*")
          .eq("AutoCita", true)
          .eq("userId", userId)
          .order("created_at", { ascending: false })
          .limit(limit);

        if (CitaStatus !== "Todas") {
          query = query.eq("CitaStatus", CitaStatus);
        }

        const { data, error: fetchError } = await query;
        if (fetchError) {
          throw fetchError;
        }
        last8AutoAppointments.value = data || [];
        resolve(data);
      } catch (err) {
        console.error("[fetchLast8AutoAppointments] Error:", err.message);
        error.value = err.message;
        reject(err);
      } finally {
        loading.value = false;
      }
    });
  };

  // ------------------------
  // Búsqueda por DNI (ejemplo)
  // ------------------------
  const buscarPacientePorDni = async (dni) => {
    try {
      const { data, error: fetchError } = await supabase
        .from("fichaIdentificacion")
        .select("*")
        .eq("dni", dni)
        .single();

      if (fetchError) {
        throw fetchError;
      }
      return data;
    } catch (err) {
      console.error("Error al buscar paciente por DNI:", err);
      return null;
    }
  };

  // ------------------------
  // Retornamos estado y métodos
  // ------------------------
  return {
    // State
    appointments,
    appointmentsTrend,
    loading,
    error,
    last8AutoAppointments,
    pendingAppointmentsCount,

    // Métodos de carga
    fetchAppointments,
    fetchAutoAppointments,
    fetchLast8AutoAppointmentsByCitaStatus,

    // CRUD
    addAppointment,
    updateAppointment,
    deleteAppointment,
    acceptAppointment,
    rejectAppointment,

    // Helpers
    calculateAppointmentsTrend,
    calculateMonthlyStats,

    // Búsqueda
    buscarPacientePorDni,
  };
});
