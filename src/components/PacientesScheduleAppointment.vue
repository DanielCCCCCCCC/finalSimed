<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-8">
        <div v-if="organization" class="card shadow-sm p-4">
          <div class="card-header bg-secondary text-white">
            <h5 class="card-title mb-0">Agendar Nueva Cita Médica</h5>
          </div>
          <div class="card-body">
            <!-- Información de la Organización -->
            <div class="mb-4">
              <h5>{{ organization.name }}</h5>
              <p><i class="ri-map-pin-line"></i> {{ organization.address }}</p>
              <p><i class="ri-phone-line"></i> {{ organization.phone }}</p>
              <p v-if="organization.email">
                <i class="ri-mail-line"></i> {{ organization.email }}
              </p>
            </div>

            <form @submit.prevent="handleSubmit">
              <div class="row">
                <!-- Nombre del Paciente -->
                <div class="col-md-6 mb-3">
                  <label for="patientName" class="form-label"
                    >Nombre del Paciente</label
                  >
                  <div class="input-group">
                    <span class="input-group-text">
                      <i class="ri-user-line"></i>
                    </span>
                    <input
                      type="text"
                      id="patientName"
                      v-model="form.patientName"
                      class="form-control"
                      placeholder="Ingrese el nombre completo"
                      required
                    />
                  </div>
                </div>

                <!-- Correo Electrónico -->
                <div class="col-md-6 mb-3">
                  <label for="email" class="form-label"
                    >Correo Electrónico</label
                  >
                  <div class="input-group">
                    <span class="input-group-text">
                      <i class="ri-mail-line"></i>
                    </span>
                    <input
                      type="email"
                      id="email"
                      v-model="form.email"
                      class="form-control"
                      placeholder="Ingrese el correo electrónico"
                      required
                    />
                  </div>
                  <div v-if="errors.email" class="text-danger fs-13 mt-1">
                    {{ errors.email }}
                  </div>
                </div>
              </div>

              <div class="row">
                <!-- Fecha de la Cita -->
                <div class="col-md-6 mb-3">
                  <label for="date" class="form-label">Fecha de la Cita</label>
                  <input
                    type="date"
                    id="date"
                    v-model="form.date"
                    class="form-control"
                    @change="fetchOccupiedTimes"
                    required
                  />
                  <div v-if="errors.date" class="text-danger fs-13 mt-1">
                    {{ errors.date }}
                  </div>
                </div>

                <!-- Hora de la Cita -->
                <div class="col-md-6 mb-3">
                  <label for="time" class="form-label">Hora de la Cita</label>
                  <select
                    id="time"
                    v-model="form.time"
                    class="form-select"
                    required
                  >
                    <option value="" disabled>Seleccione una hora</option>
                    <option
                      v-for="time in availableTimes"
                      :key="time"
                      :value="time"
                    >
                      {{ formatTime(time) }}
                    </option>
                  </select>
                  <div v-if="errors.time" class="text-danger fs-13 mt-1">
                    {{ errors.time }}
                  </div>
                </div>
              </div>

              <!-- Descripción -->
              <div class="mb-3">
                <label for="description" class="form-label">Descripción</label>
                <textarea
                  id="description"
                  v-model="form.description"
                  class="form-control"
                  placeholder="Ingrese detalles adicionales (opcional)"
                  rows="3"
                ></textarea>
              </div>

              <!-- Botón de Envío -->
              <div class="d-grid mb-3">
                <button type="submit" class="btn btn-primary">
                  Agendar Cita
                </button>
              </div>
            </form>

            <!-- Mensaje de Éxito -->
            <div v-if="success" class="alert alert-success mt-3" role="alert">
              La cita ha sido agendada exitosamente.
            </div>

            <!-- Mensaje de Error -->
            <div v-if="errorMsg" class="alert alert-danger mt-3" role="alert">
              {{ errorMsg }}
            </div>
          </div>
          <div class="card-footer text-muted">
            Asegúrate de proporcionar toda la información necesaria para una
            mejor atención.
          </div>
        </div>

        <!-- Mensaje de Cargando o Organización No Encontrada -->
        <div v-else-if="loading" class="text-center">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Cargando...</span>
          </div>
        </div>
        <div v-else class="alert alert-danger" role="alert">
          Organización no encontrada o inválida.
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch, onMounted } from "vue";
import { useRoute } from "vue-router";
import { supabase } from "../supabaseClient";

export default {
  name: "PublicScheduleAppointment",
  setup() {
    const route = useRoute();
    const tenantId = ref(
      route.params.tenant_id.startsWith(":")
        ? route.params.tenant_id.slice(1)
        : route.params.tenant_id
    );

    // Estado del formulario
    const form = ref({
      patientName: "",
      email: "",
      date: "",
      time: "",
      description: "",
    });

    // Errores de validación
    const errors = ref({
      email: "",
      date: "",
      time: "",
    });

    // Mensajes de éxito y error
    const success = ref(false);
    const errorMsg = ref("");

    // Horarios disponibles
    const availableTimes = ref([]);

    // Información de la Organización
    const organization = ref(null);
    const loading = ref(true);

    // Definir horarios posibles
    const allTimes = [
      "08:00",
      "08:30",
      "09:00",
      "09:30",
      "10:00",
      "10:30",
      "11:00",
      "11:30",
      "12:00",
      "12:30",
      "13:00",
      "13:30",
      "14:00",
      "14:30",
      "15:00",
      "15:30",
      "16:00",
      "16:30",
      "17:00",
    ];

    // Formatear hora para mostrar en formato AM/PM
    const formatTime = (time) => {
      const [hour, minute] = time.split(":").map(Number);
      const period = hour >= 12 ? "PM" : "AM";
      const formattedHour = hour % 12 || 12;
      return `${formattedHour}:${minute.toString().padStart(2, "0")} ${period}`;
    };

    // Validaciones
    const validateEmail = () => {
      const email = form.value.email;
      if (!email) {
        errors.value.email = "Correo es requerido";
      } else if (!/.+@.+\..+/.test(email)) {
        errors.value.email = "Correo inválido";
      } else {
        errors.value.email = "";
      }
    };

    const validateDate = () => {
      const date = form.value.date;
      if (!date) {
        errors.value.date = "Fecha es requerida";
      } else {
        errors.value.date = "";
      }
    };

    const validateTime = () => {
      const time = form.value.time;
      if (!time) {
        errors.value.time = "Hora es requerida";
      } else {
        errors.value.time = "";
      }
    };

    // Obtener información de la organización
    const fetchOrganizationInfo = async () => {
      try {
        console.log("Fetching organization info for tenantId:", tenantId.value);
        const { data, error } = await supabase
          .from("organizacion")
          .select("*")
          .eq("id", tenantId.value)
          .single();

        console.log("Organization fetch response:", data, error);

        if (error) {
          console.error("Error fetching organization info:", error);
          organization.value = null;
        } else {
          // Mapear los campos de la organización a nombres en inglés
          organization.value = {
            id: data.id,
            name: data.nombre,
            address: data.direccion,
            phone: data.numero_telefono,
            email: data.email || "", // Asegúrate de manejar si el email no existe
            // Agrega otros campos si es necesario
          };
          console.log("Organization fetched:", organization.value);
        }
      } catch (err) {
        console.error("Error fetching organization info:", err);
        organization.value = null;
      } finally {
        loading.value = false;
      }
    };

    // Obtener horas ocupadas
    const fetchOccupiedTimes = async () => {
      if (!form.value.date) {
        availableTimes.value = [];
        return;
      }

      const selectedDate = form.value.date;
      const nextDate = new Date(selectedDate);
      nextDate.setDate(nextDate.getDate() + 1);
      const nextDateStr = nextDate.toISOString().split("T")[0];

      console.log(
        "Fetching appointments for Tenant ID:",
        tenantId.value,
        selectedDate
      );

      try {
        const { data, error: fetchError } = await supabase
          .from("appointments")
          .select("startDate")
          .eq("tenant_id", tenantId.value)
          .gte("startDate", `${selectedDate}T00:00:00`)
          .lt("startDate", `${nextDateStr}T00:00:00`);

        console.log("Fetched data:", data);

        if (fetchError) {
          console.error("Error fetching appointments:", fetchError);
          errorMsg.value = "Error al obtener las citas existentes.";
          return;
        }

        // Obtener las horas ocupadas
        const occupiedTimes = data.map((appt) => appt.startDate.slice(11, 16));

        console.log("Occupied times:", occupiedTimes);

        // Determinar las horas disponibles excluyendo las ocupadas
        availableTimes.value = allTimes.filter(
          (time) => !occupiedTimes.includes(time)
        );

        console.log("Available times after filtering:", availableTimes.value);

        // Si no hay horarios disponibles
        if (availableTimes.value.length === 0) {
          errorMsg.value =
            "No hay horarios disponibles para la fecha seleccionada.";
        } else {
          errorMsg.value = "";
        }
      } catch (err) {
        console.error("Error al obtener las citas:", err);
        errorMsg.value = "Error al obtener las citas existentes.";
      }
    };

    // Observadores
    watch(
      () => form.value.date,
      () => {
        fetchOccupiedTimes();
        validateDate();
        // Resetear la hora seleccionada si ya no está disponible
        if (
          form.value.time &&
          !availableTimes.value.includes(form.value.time)
        ) {
          form.value.time = "";
          errors.value.time = "Hora ya ocupada";
        }
      }
    );

    watch(
      () => form.value.email,
      () => {
        validateEmail();
      }
    );

    watch(
      () => form.value.time,
      () => {
        validateTime();
      }
    );

    watch(
      () => route.params.tenant_id, // Usar 'tenant_id' según la definición de la ruta
      async (newId) => {
        tenantId.value = newId.startsWith(":") ? newId.slice(1) : newId;
        console.log("New tenantId received:", tenantId.value);
        // Resetear el formulario y estados
        form.value = {
          patientName: "",
          email: "",
          date: "",
          time: "",
          description: "",
        };
        availableTimes.value = [];
        errors.value = {
          email: "",
          date: "",
          time: "",
        };
        success.value = false;
        errorMsg.value = "";
        organization.value = null;
        loading.value = true;
        await fetchOrganizationInfo();
        await fetchOccupiedTimes();
      },
      { immediate: true }
    );

    // Manejar el envío del formulario
    const handleSubmit = async () => {
      // Validar todos los campos antes de enviar
      validateEmail();
      validateDate();
      validateTime();

      if (errors.value.email || errors.value.date || errors.value.time) {
        console.log("Validation errors:", errors.value);
        return;
      }

      // Preparar los datos de la cita
      const newAppointment = {
        title: `Cita con ${form.value.patientName}`,
        startDate: `${form.value.date}T${form.value.time}:00`,
        endDate: calculateEndDate(form.value.date, form.value.time, 30), // Duración de 30 minutos
        allDay: false, // Ajusta según sea necesario
        repeat: false, // Ajusta según sea necesario
        description: form.value.description,
        nombre: form.value.patientName,
        tipoCita: "Consulta",
        userId: "65b48afb-8543-4939-b2e4-77f4daa6d03e", // ID proporcionado
        tenant_id: tenantId.value, // Usar 'tenant_id' dinámicamente
        patientemail: form.value.email, // Nombre correcto del campo
      };

      console.log("Inserting new appointment:", newAppointment);

      try {
        const { data, error: insertError } = await supabase
          .from("appointments")
          .insert([newAppointment]);

        console.log("Insert response:", data, insertError);

        if (insertError) {
          console.error("Error inserting appointment:", insertError);
          errorMsg.value =
            insertError.message ||
            "Error al agendar la cita. Inténtalo de nuevo.";
          success.value = false;
        } else {
          success.value = true;
          errorMsg.value = "";
          // Resetear el formulario
          form.value = {
            patientName: "",
            email: "",
            date: "",
            time: "",
            description: "",
          };
          availableTimes.value = [];
          // Resetear los errores
          errors.value = {
            email: "",
            date: "",
            time: "",
          };
        }
      } catch (err) {
        console.error("Error al agendar la cita:", err);
        errorMsg.value = "Error al agendar la cita. Inténtalo de nuevo.";
        success.value = false;
      }
    };

    // Calcular la fecha de fin basada en la fecha de inicio y la duración en minutos
    const calculateEndDate = (date, time, durationMinutes) => {
      const [hour, minute] = time.split(":").map(Number);
      const start = new Date(`${date}T${time}:00`);
      start.setMinutes(start.getMinutes() + durationMinutes);
      const end = start.toISOString().slice(0, 16);
      return end;
    };

    // Cargar la información de la organización al montar el componente
    onMounted(() => {
      fetchOrganizationInfo();
    });

    return {
      form,
      errors,
      success,
      error: errorMsg,
      availableTimes,
      formatTime,
      handleSubmit,
      organization,
      loading,
    };
  },
};
</script>

<style scoped>
.container {
  max-width: 900px;
}
.card {
  border: none;
  border-radius: 10px;
}
.card-header {
  border-bottom: none;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}
.card-footer {
  background-color: #f8f9fa;
  border-top: none;
}
.input-group-text {
  background-color: #e9ecef;
  border: none;
}
.form-control:focus {
  box-shadow: none;
  border-color: #86b7fe;
}
.form-label {
  font-size: 14px;
  color: #212529;
}
.fs-13 {
  font-size: 0.875rem;
}
.fs-14 {
  font-size: 0.875rem;
}
.text-dark {
  color: #212529;
}
</style>
