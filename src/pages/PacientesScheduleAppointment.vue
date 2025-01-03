<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-10">
        <!-- Si encontramos la organización, mostramos el formulario -->
        <div v-if="organization" class="card shadow-sm p-4">
          <div class="card-header bg-secondary text-white">
            <h5 class="card-title mb-0">Agendar Nueva Cita Médica</h5>
          </div>

          <div class="card-body">
            <!-- Sección de Información de la Organización y del Médico -->
            <div class="row">
              <!-- Información de la Organización -->
              <div class="col-md-6 mb-4">
                <h5>{{ organization.name }}</h5>
                <p>
                  <i class="ri-map-pin-line"></i>
                  {{ organization.address }}
                </p>
                <p>
                  <i class="ri-phone-line"></i>
                  {{ organization.phone }}
                </p>
                <p v-if="organization.email">
                  <i class="ri-mail-line"></i>
                  {{ organization.email }}
                </p>
              </div>

              <!-- Información del Médico -->
              <div class="col-md-6 mb-4">
                <h5>Dr(a). {{ doctorData.nombreCompleto }}</h5>
                <p>
                  <i class="ri-mail-line"></i>
                  {{ doctorData.email }}
                </p>
                <p>
                  <i class="ri-phone-line"></i>
                  {{ doctorData.telefono }}
                </p>
                <p v-if="doctorData.direccion">
                  <i class="ri-map-pin-line"></i>
                  {{ doctorData.direccion }}
                </p>
              </div>
            </div>

            <!-- FORMULARIO -->
            <form @submit.prevent="handleSubmit">
              <!-- Campo de Identificación -->
              <div class="row">
                <div class="col-md-12 mb-3">
                  <label for="identificacion" class="form-label"
                    >Identificación</label
                  >
                  <div class="input-group">
                    <span class="input-group-text">
                      <i class="ri-id-card-line"></i>
                    </span>
                    <input
                      type="text"
                      id="identificacion"
                      v-model="form.identificacion"
                      class="form-control"
                      placeholder="Ingrese su identificación (DNI)"
                      required
                    />
                  </div>
                  <div
                    v-if="errors.identificacion"
                    class="text-danger fs-13 mt-1"
                  >
                    {{ errors.identificacion }}
                  </div>
                </div>
              </div>

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
                    :disabled="availableTimes.length === 0"
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
                <!-- Hora Final de la Cita (Solo Lectura) -->
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label for="endTime" class="form-label">Hora Final</label>
                    <input
                      type="time"
                      id="endTime"
                      v-model="endTime"
                      class="form-control"
                      readonly
                      placeholder="Hora Final"
                      required
                    />
                  </div>
                </div>
              </div>

              <!-- Teléfono -->
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label for="phone" class="form-label"
                    >Número de Teléfono</label
                  >
                  <div class="input-group">
                    <span class="input-group-text">
                      <i class="ri-phone-line"></i>
                    </span>
                    <input
                      type="tel"
                      id="phone"
                      v-model="form.phone"
                      class="form-control"
                      placeholder="Ingrese su teléfono"
                    />
                  </div>
                  <div v-if="errors.phone" class="text-danger fs-13 mt-1">
                    {{ errors.phone }}
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
                  placeholder="Detalles adicionales (opcional)"
                  rows="3"
                ></textarea>
              </div>

              <!-- Botón de Envío -->
              <div class="d-grid mb-3">
                <button
                  type="submit"
                  class="btn btn-primary"
                  :disabled="loading"
                >
                  Agendar Cita
                </button>
              </div>
            </form>

            <!-- Mensaje de Éxito -->
            <div v-if="success" class="alert alert-success mt-3" role="alert">
              La cita ha sido enviada para su aprobación, se le notificará por
              medio de Whatsapp.
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

        <!-- Mensaje de Cargando o No encontrada -->
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

<script setup>
import { ref, watch, onMounted } from "vue";
import { useRoute } from "vue-router";
import { supabase } from "../supabaseClient";
import { useFichaIdentificacionStore } from "../stores/fichaIdentificacionStores";
import {
  DxDataGrid,
  DxColumn,
  DxPaging,
  DxSorting,
  DxFilterRow,
  DxHeaderFilter,
  DxSearchPanel,
} from "devextreme-vue/data-grid";
import { storeToRefs } from "pinia";
import { useOrganizacionStore } from "../stores/organizacionStore"; // Importa la store
import { useAuthStore } from "../stores/auth"; // Importa authStore
import { Notify } from "quasar"; // Asegúrate de tener Quasar configurado

// Obtener parámetros de la ruta
const route = useRoute();
const doctorId = ref(route.params.userId); // Obtener doctorId desde la ruta
console.log("Doctor ID:", doctorId.value);

// Inicializar la store de identificación de pacientes
const fichaIdentificacionStore = useFichaIdentificacionStore();
const { formIdentificacion, buscarPacientePorDni } = storeToRefs(
  fichaIdentificacionStore
);

// Inicializar la store de organización
const organizacionStore = useOrganizacionStore();
const { horariosAtencion } = storeToRefs(organizacionStore);
const { cargarHorariosAtencion } = organizacionStore;

// Inicializar la store de autenticación
const authStore = useAuthStore();
const { tenant_id, user } = storeToRefs(authStore);
console.log("Tenant ID:", tenant_id.value);
console.log("Usuario:", user.value);

// Estado del formulario
const form = ref({
  identificacion: "",
  patientName: "",
  email: "",
  date: "",
  time: "",
  description: "",
  phone: "",
});

// Errores de validación
const errors = ref({
  identificacion: "",
  email: "",
  date: "",
  time: "",
  phone: "",
});

// Hora Final de la Cita (solo para mostrar en el input de "Hora Final")
const endTime = ref("");

// Bandera de éxito para controlar validaciones en watchers
const success = ref(false);

// Para mostrar error de servidor
const errorMsg = ref("");

// Horarios disponibles
const availableTimes = ref([]);
const allTimes = ref([]); // Horarios generados según el día e intervalo

// Información de la Organización
const organization = ref(null);

// Información del Médico
const doctorData = ref(null);

// Estado de carga general
const loading = ref(true);

// Array de nombres de días en español
const dayOfWeekNames = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
  "Domingo",
];

// -----------------------------------------------------------------------------
// 1. Función para formatear los horarios en AM/PM en la UI
// -----------------------------------------------------------------------------
const formatTime = (time) => {
  try {
    const [hour, minute] = time.split(":").map(Number);
    const period = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minute.toString().padStart(2, "0")} ${period}`;
  } catch {
    return "Hora no válida";
  }
};

// -----------------------------------------------------------------------------
// 2. Funciones de Validación
// -----------------------------------------------------------------------------
const validateIdentificacion = () => {
  const id = form.value.identificacion;
  if (!id) {
    errors.value.identificacion = "Identificación es requerida";
  } else if (!/^\d{8,13}$/.test(id)) {
    errors.value.identificacion = "Identificación inválida";
  } else {
    errors.value.identificacion = "";
  }
};

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
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      errors.value.date = "La fecha no puede ser en el pasado";
    } else {
      errors.value.date = "";
    }
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

const validatePhone = () => {
  const phone = form.value.phone;
  const phoneRegex = /^\+?\d{7,15}$/; // Ejemplo de regex para internacional
  if (phone && !phoneRegex.test(phone)) {
    errors.value.phone = "Número de teléfono inválido";
  } else {
    errors.value.phone = "";
  }
};

// -----------------------------------------------------------------------------
// 3. Buscar Paciente por DNI (auto-completar)
// -----------------------------------------------------------------------------
const buscarPaciente = async (dni) => {
  if (!dni) return;

  console.log(`Buscando paciente con DNI: ${dni}`);
  const paciente = await fichaIdentificacionStore.buscarPacientePorDni(dni);
  if (paciente) {
    console.log("Paciente encontrado:", paciente);
    form.value.patientName = paciente.nombres;
    form.value.email = paciente.email;
  } else {
    console.log("Paciente no encontrado.");
    form.value.patientName = "";
    form.value.email = "";
  }
};

// Implementar debounce para evitar múltiples llamadas
let lookupTimeout;
watch(
  () => form.value.identificacion,
  (newDni) => {
    clearTimeout(lookupTimeout);
    validateIdentificacion();
    if (/^\d{8,13}$/.test(newDni)) {
      lookupTimeout = setTimeout(() => {
        buscarPaciente(newDni);
      }, 500);
    } else {
      form.value.patientName = "";
      form.value.email = "";
    }
  }
);

// -----------------------------------------------------------------------------
// 4. Obtener datos del médico y de la organización
// -----------------------------------------------------------------------------
const fetchDoctorData = async () => {
  if (!doctorId.value) {
    console.warn("No hay doctorId disponible");
    doctorData.value = null;
    return;
  }

  console.log(`Obteniendo datos del médico con ID: ${doctorId.value}`);
  const { data, error } = await supabase
    .from("users")
    .select("nombreCompleto, email, direccion, telefono")
    .eq("id", doctorId.value)
    .single();

  if (error) {
    console.error("Error al obtener datos del médico:", error);
    Notify.create({
      message: `Error al obtener datos del médico: ${error.message}`,
      color: "negative",
      position: "top-right",
    });
    doctorData.value = null;
  } else {
    console.log("Datos del Médico:", data);
    doctorData.value = data;
  }
};

const fetchOrganizationInfo = async () => {
  if (!tenant_id.value) {
    console.log("tenant_id no está definido o es inválido:", tenant_id.value);
    organization.value = null;
    Notify.create({
      message: "Error: tenant_id no está definido o es inválido.",
      color: "negative",
      position: "top-right",
    });
    loading.value = false;
    return;
  }

  console.log(
    `Obteniendo información de la organización con tenant_id: ${tenant_id.value}`
  );
  try {
    const { data, error } = await supabase
      .from("organizacion")
      .select("*")
      .eq("id", tenant_id.value)
      .single();

    if (error || !data) {
      console.log("Error al obtener la organización:", error);
      organization.value = null;
    } else {
      console.log("Información de la Organización:", data);
      organization.value = {
        id: data.id,
        name: data.nombre,
        address: data.direccion,
        phone: data.numero_telefono,
        email: data.email || "",
      };
    }
  } catch (err) {
    console.error("Error en fetchOrganizationInfo:", err);
    organization.value = null;
  } finally {
    loading.value = false;
  }
};

// -----------------------------------------------------------------------------
// 5. Utilidades para generar y filtrar horarios disponibles
// -----------------------------------------------------------------------------
const getDayOfWeek = (dateStr) => {
  const date = new Date(dateStr);
  // getDay() → 0 (Domingo), 1 (Lunes), ...
  const day = date.getDay();
  console.log(`Día de la Semana para ${dateStr}: ${day}`);
  return day;
};

const generateAvailableTimes = (horaInicio, horaFin, intervaloMin) => {
  console.log(
    `Generando horarios desde ${horaInicio} hasta ${horaFin} con intervalos de ${intervaloMin} minutos`
  );
  const times = [];
  let [startHour, startMinute] = horaInicio.split(":").map(Number);
  const [endHour, endMinute] = horaFin.split(":").map(Number);

  let current = new Date();
  current.setHours(startHour, startMinute, 0, 0);

  const end = new Date();
  end.setHours(endHour, endMinute, 0, 0);

  while (current < end) {
    const hh = String(current.getHours()).padStart(2, "0");
    const mm = String(current.getMinutes()).padStart(2, "0");
    times.push(`${hh}:${mm}`);
    current.setMinutes(current.getMinutes() + intervaloMin);
  }

  console.log("Horarios Generados:", times);
  return times;
};

// -----------------------------------------------------------------------------
// 6. Nueva Función para calcular Fecha/Hora local (sin UTC)
// -----------------------------------------------------------------------------
/**
 * Retorna "YYYY-MM-DDTHH:mm:ss" sin convertir a UTC, guardando la hora local.
 * @param {string} date - Fecha en formato YYYY-MM-DD
 * @param {string} time - Hora en formato HH:mm (24h)
 * @param {number} offsetMin - Minutos a sumar (ej. 30 para media hora)
 */
const calculateDateTimeLocal = (date, time, offsetMin = 0) => {
  // Separar la hora y los minutos
  const [hour, minute] = time.split(":").map(Number);

  // Crear un objeto Date usando la zona horaria local
  // Usamos espacio en vez de "T" para forzar la interpretación local
  const localDate = new Date(`${date} ${hour}:${minute}:00`);

  // Agregar el offset de minutos (intervalo)
  localDate.setMinutes(localDate.getMinutes() + offsetMin);

  // Formatear manualmente sin conversión a UTC
  const year = localDate.getFullYear();
  const month = String(localDate.getMonth() + 1).padStart(2, "0");
  const day = String(localDate.getDate()).padStart(2, "0");
  const hours = String(localDate.getHours()).padStart(2, "0");
  const minutesString = String(localDate.getMinutes()).padStart(2, "0");
  const seconds = String(localDate.getSeconds()).padStart(2, "0");

  // Retornamos con la "T" como separador, pero es hora local
  return `${year}-${month}-${day}T${hours}:${minutesString}:${seconds}`;
};

// -----------------------------------------------------------------------------
// 7. Obtener los horarios ocupados para la fecha seleccionada
// -----------------------------------------------------------------------------
const fetchOccupiedTimes = async () => {
  console.log("Llamando a fetchOccupiedTimes");
  if (!form.value.date || !doctorId.value) {
    console.log("Fecha o doctorId no definidos. Limpiando availableTimes.");
    availableTimes.value = [];
    return;
  }

  const selectedDate = form.value.date;
  const dayOfWeek = getDayOfWeek(selectedDate);
  const dayName = dayOfWeekNames[dayOfWeek];
  console.log(
    `Fecha Seleccionada: ${selectedDate}, Día de la Semana: ${dayName}`
  );

  // Obtener el horario de atención correspondiente
  const horario = horariosAtencion.value.find(
    (h) => h.dia_semana.toLowerCase() === dayName.toLowerCase()
  );

  if (!horario) {
    console.log("No hay horarios de atención para el día seleccionado.");
    availableTimes.value = [];
    errorMsg.value = "No hay horarios de atención para el día seleccionado.";
    return;
  }

  console.log("Horario de Atención Encontrado:", horario);
  const { hora_inicio, hora_fin, intervalo_min } = horario;

  // Generar todos los horarios
  allTimes.value = generateAvailableTimes(hora_inicio, hora_fin, intervalo_min);
  console.log("Todos los Horarios Disponibles:", allTimes.value);

  // Buscar citas ocupadas en Supabase para esa fecha
  const nextDate = new Date(selectedDate);
  nextDate.setDate(nextDate.getDate() + 1);
  const nextDateStr = nextDate.toISOString().split("T")[0];
  console.log(`Buscando citas desde ${selectedDate} hasta ${nextDateStr}`);

  try {
    const { data, error } = await supabase
      .from("appointments")
      .select("startDate")
      .eq("userId", doctorId.value)
      .eq("tenant_id", tenant_id.value)
      .gte("startDate", `${selectedDate}T00:00:00`)
      .lt("startDate", `${nextDateStr}T00:00:00`);

    if (error) {
      console.error("Error al obtener las citas existentes:", error);
      errorMsg.value = "Error al obtener las citas existentes.";
      return;
    }

    console.log("Citas Obtenidas:", data);
    const occupiedTimes = data.map((appt) => {
      // Extraemos la hora local del startDate guardado
      const dateObj = new Date(appt.startDate);
      const hours = String(dateObj.getHours()).padStart(2, "0");
      const minutes = String(dateObj.getMinutes()).padStart(2, "0");
      return `${hours}:${minutes}`;
    });
    console.log("Horarios Ocupados:", occupiedTimes);

    // Filtramos los horarios que NO estén ocupados
    availableTimes.value = allTimes.value.filter(
      (t) => !occupiedTimes.includes(t)
    );
    console.log(
      "Horarios Disponibles Después del Filtrado:",
      availableTimes.value
    );

    if (availableTimes.value.length === 0) {
      console.log("No hay horarios disponibles para la fecha seleccionada.");
      errorMsg.value =
        "No hay horarios disponibles para la fecha seleccionada.";
    } else {
      errorMsg.value = "";
    }
  } catch (err) {
    console.error("Error en fetchOccupiedTimes:", err);
    errorMsg.value = "Error al obtener las citas existentes.";
  }
};

// -----------------------------------------------------------------------------
// 8. Calcular la hora final para mostrar en el input "Hora Final" (UI)
// -----------------------------------------------------------------------------
const calculateEndTime = (startTime) => {
  // Suponiendo que por defecto usas un intervalo de 30 min en la UI
  const [hour, minute] = startTime.split(":").map(Number);
  const startDate = new Date();
  startDate.setHours(hour, minute, 0, 0);
  startDate.setMinutes(startDate.getMinutes() + 30);

  const endHour = String(startDate.getHours()).padStart(2, "0");
  const endMinute = String(startDate.getMinutes()).padStart(2, "0");
  endTime.value = `${endHour}:${endMinute}`;
};

// -----------------------------------------------------------------------------
// 9. Manejar el envío del formulario
// -----------------------------------------------------------------------------
const handleSubmit = async () => {
  // Forzar validaciones
  validateIdentificacion();
  validateEmail();
  validateDate();
  validateTime();
  validatePhone();

  console.log("Enviando formulario:", form.value);

  // Si hay errores, no continuar
  if (
    errors.value.identificacion ||
    errors.value.email ||
    errors.value.date ||
    errors.value.time ||
    errors.value.phone
  ) {
    console.log("Errores de Validación:", errors.value);
    Notify.create({
      message: "Por favor, corrige los errores en el formulario.",
      color: "negative",
      position: "top-right",
    });
    return;
  }

  // Verificar horario de atención
  const dayOfWeek = getDayOfWeek(form.value.date);
  const horario = horariosAtencion.value.find(
    (h) =>
      h.dia_semana.toLowerCase() === dayOfWeekNames[dayOfWeek].toLowerCase()
  );

  if (!horario) {
    console.log("No hay horarios de atención para el día seleccionado.");
    errorMsg.value = "No hay horarios de atención para el día seleccionado.";
    return;
  }

  const { intervalo_min } = horario;

  // Creamos las fechas de inicio y final en hora local
  const startDateLocal = calculateDateTimeLocal(
    form.value.date,
    form.value.time,
    0 // sin sumar minutos extras
  );
  const endDateLocal = calculateDateTimeLocal(
    form.value.date,
    form.value.time,
    intervalo_min
  );

  const newAppointment = {
    title: `Cita con ${form.value.patientName}`,
    startDate: startDateLocal,
    endDate: endDateLocal,
    allDay: false,
    repeat: false,
    description: form.value.description,
    nombre: form.value.patientName,
    tipoCita: "Consulta",
    userId: doctorId.value, // El ID del médico
    tenant_id: tenant_id.value,
    patientemail: form.value.email,
    patientphone: form.value.phone,
    identificacion: form.value.identificacion,
    status: "Pendiente",
    autoCita: true,
  };

  console.log("Nueva Cita a Insertar:", newAppointment);

  try {
    const { error: insertError } = await supabase
      .from("appointments")
      .insert([newAppointment]);

    if (insertError) {
      console.error("Error al insertar la cita:", insertError);
      errorMsg.value =
        insertError.message || "Error al agendar la cita. Inténtalo de nuevo.";
      success.value = false;
    } else {
      console.log("Cita Agendada Correctamente.");
      success.value = true;
      errorMsg.value = "";

      // Resetear el formulario
      form.value = {
        identificacion: "",
        patientName: "",
        email: "",
        date: "",
        time: "",
        description: "",
        phone: "",
      };
      availableTimes.value = [];
      errors.value = {
        identificacion: "",
        email: "",
        date: "",
        time: "",
        phone: "",
      };
    }
  } catch (err) {
    console.error("Error en handleSubmit:", err);
    errorMsg.value = "Error al agendar la cita. Inténtalo de nuevo.";
    success.value = false;
  }
};

// -----------------------------------------------------------------------------
// 10. Watchers para manejar cambios en fecha, hora, etc.
// -----------------------------------------------------------------------------
watch(
  () => form.value.identificacion,
  () => {
    if (!success.value) {
      validateIdentificacion();
    }
  }
);

watch(
  () => form.value.date,
  () => {
    if (!success.value) {
      fetchOccupiedTimes();
      validateDate();
      // Si la hora actual no está disponible, resetear
      if (form.value.time && !availableTimes.value.includes(form.value.time)) {
        form.value.time = "";
        errors.value.time = "Hora ya ocupada";
        endTime.value = "";
      }
    }
  }
);

watch(
  () => form.value.email,
  () => {
    if (!success.value) {
      validateEmail();
    }
  }
);

watch(
  () => form.value.time,
  (newTime) => {
    if (!success.value) {
      validateTime();
      if (newTime) {
        calculateEndTime(newTime);
      } else {
        endTime.value = "";
      }
    }
  }
);

// -----------------------------------------------------------------------------
// 11. Reaccionar a cambios en la ruta (cuando cambie el doctorId en params)
// -----------------------------------------------------------------------------
watch(
  () => route.params,
  async (params) => {
    doctorId.value = params.userId;
    console.log("Ruta Actualizada. Nuevo Doctor ID:", doctorId.value);

    // Resetear el formulario y estados
    form.value = {
      identificacion: "",
      patientName: "",
      email: "",
      date: "",
      time: "",
      description: "",
      phone: "",
    };
    availableTimes.value = [];
    errors.value = {
      identificacion: "",
      email: "",
      date: "",
      time: "",
      phone: "",
    };
    success.value = false;
    errorMsg.value = "";
    organization.value = null;
    doctorData.value = null;
    loading.value = true;

    console.log("Cargando nueva organización y datos del médico...");
    await fetchOrganizationInfo();
    await fetchDoctorData();
    await fichaIdentificacionStore.cargarDatosPorDoctor(
      tenant_id.value,
      doctorId.value
    );
    await cargarHorariosAtencion(tenant_id.value);

    // Asignar fecha por defecto a hoy
    const today = new Date().toISOString().split("T")[0];
    form.value.date = today;
    console.log("Fecha Predeterminada Asignada:", today);
    await fetchOccupiedTimes();
  },
  { immediate: true }
);

// -----------------------------------------------------------------------------
// 12. onMounted para cargar datos iniciales
// -----------------------------------------------------------------------------
onMounted(async () => {
  console.log("Component Mounted. Iniciando carga de datos...");
  await fetchOrganizationInfo();
  await fetchDoctorData();
  await fichaIdentificacionStore.cargarDatosPorDoctor(
    tenant_id.value,
    doctorId.value
  );
  await cargarHorariosAtencion(tenant_id.value);
  console.log("Horarios de Atención en onMounted:", horariosAtencion.value);
  console.log("PACIENTES Cargados:", formIdentificacion.value);

  // Fecha predeterminada = hoy
  const today = new Date().toISOString().split("T")[0];
  form.value.date = today;
  console.log("Fecha Predeterminada Asignada en onMounted:", today);
  await fetchOccupiedTimes();
});
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
