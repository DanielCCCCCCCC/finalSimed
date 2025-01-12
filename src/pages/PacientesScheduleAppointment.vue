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
              </div>

              <!-- Información del Médico -->
              <div class="col-md-6 mb-4">
                <h5>Dr(a). {{ doctorData.nombreCompleto }}</h5>

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
              <!-- Campo de Identificación (DNI) -->
              <div class="row">
                <!-- Campo de Identificación (DNI) -->
                <div class="col-md-6 mb-3">
                  <label for="identificacion" class="form-label">
                    Identificación<span class="required">*</span>
                  </label>
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

                <!-- Nombre del Paciente (UI) -->
                <div class="col-md-6 mb-3">
                  <label for="patientNameUI" class="form-label">
                    Nombre del Paciente<span class="required">*</span>
                  </label>
                  <div class="input-group">
                    <span class="input-group-text">
                      <i class="ri-user-line"></i>
                    </span>
                    <input
                      type="text"
                      id="patientNameUI"
                      v-model="form.patientNameUI"
                      class="form-control"
                      placeholder="Nombre real del paciente"
                      required
                    />
                  </div>
                  <!-- Opcional: Mensaje de error para Nombre del Paciente -->
                  <div
                    v-if="errors.patientNameUI"
                    class="text-danger fs-13 mt-1"
                  >
                    {{ errors.patientNameUI }}
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
import { storeToRefs } from "pinia";
import { useOrganizacionStore } from "../stores/organizacionStore";
import { useCrearUsuariosStore } from "../stores/crearUsuarios";
import { useAuthStore } from "../stores/auth";
import { Notify } from "quasar";

const route = useRoute();
const doctorId = ref(route.params.userId);

// Store de fichaIdentificacion
const fichaIdentificacionStore = useFichaIdentificacionStore();
// Asegúrate de que 'buscarPacientePorDni' en tu store realice la consulta eq("dni", dni)
const { buscarPacientePorDni } = fichaIdentificacionStore;

// Store de organización
const organizacionStore = useOrganizacionStore();
const { cargarHorariosAtencion } = organizacionStore;
const crearUsuariosStore = useCrearUsuariosStore();
const { users, loading, error, horariosAtencion, permitirSuperposicion } =
  storeToRefs(crearUsuariosStore);
// Store de autenticación
const authStore = useAuthStore();
const { tenant_id, user } = storeToRefs(authStore);

// Datos del médico
const doctorData = ref(null);
const organization = ref(null);

// const loading = ref(true);
const success = ref(false);
const errorMsg = ref("");

const dayOfWeekNames = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
  "Domingo",
];

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

/**
 * form.patientName => Guardar el ID del paciente (para la BD en la columna 'nombre')
 * form.patientNameUI => Mostrar en el input el nombre real del paciente.
 */
const form = ref({
  identificacion: "",
  patientName: "", // ID del paciente
  patientNameUI: "", // Nombre real
  date: "",
  time: "",
  description: "",
  phone: "",
});

// Errores
const errors = ref({
  identificacion: "",
  date: "",
  time: "",
  phone: "",
});

const endTime = ref("");
// Horarios disponibles
const availableTimes = ref([]);

// --- VALIDACIONES ---
const validateIdentificacion = () => {
  const id = form.value.identificacion;
  if (!id) {
    errors.value.identificacion = "Identificación es requerida";
  } else if (!/^\d{8,20}$/.test(id)) {
    errors.value.identificacion = "Identificación inválida (8 a 20 dígitos)";
  } else {
    errors.value.identificacion = "";
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
  const phoneRegex = /^\+?\d{7,15}$/;
  if (phone && !phoneRegex.test(phone)) {
    errors.value.phone = "Número de teléfono inválido";
  } else {
    errors.value.phone = "";
  }
};

/**
 * Buscar Paciente por DNI.
 * - Si se encuentra, llenamos form.patientName (ID), form.patientNameUI (nombres) .
 * - Si no se encuentra, reseteamos campos.
 */
async function buscarPaciente(dni) {
  if (!dni) {
    console.log("[buscarPaciente] DNI está vacío, no se busca");
    return;
  }

  // Log para ver qué valor llega
  console.log(`[buscarPaciente] Iniciando búsqueda para DNI = ${dni}`);

  try {
    // Consulta a la store
    const paciente = await buscarPacientePorDni(dni);

    // Log de resultado
    console.log("[buscarPaciente] Resultado de la store:", paciente);

    if (paciente) {
      form.value.patientName = paciente.id || "";
      form.value.patientNameUI = paciente.nombres || "";
      console.log(
        `[buscarPaciente] Paciente encontrado => ID: ${paciente.id}, Nombres: ${paciente.nombres}`
      );
    } else {
      console.log(`[buscarPaciente] No se encontró paciente con DNI => ${dni}`);
      form.value.patientName = "";
      form.value.patientNameUI = "";
    }
  } catch (err) {
    console.error("[buscarPaciente] Error al buscar paciente por DNI:", err);
    // Reset en caso de error
    form.value.patientName = "";
    form.value.patientNameUI = "";
  }
}

// --- DEBOUNCE al ingresar DNI ---
let lookupTimeout;
watch(
  () => form.value.identificacion,
  (newDni) => {
    // Log para ver cada cambio del DNI
    console.log(`[watch identificacion] newDni => ${newDni}`);

    clearTimeout(lookupTimeout);
    validateIdentificacion();

    if (/^\d{8,20}$/.test(newDni)) {
      lookupTimeout = setTimeout(() => {
        console.log("[watch identificacion] Llamando buscarPaciente...");
        buscarPaciente(newDni);
      }, 500);
    } else {
      console.log(
        "[watch identificacion] DNI inválido o vacío, reseteando campos"
      );
      form.value.patientName = "";
      form.value.patientNameUI = "";
    }
  }
);

// --- Cargar datos del médico ---
async function fetchDoctorData() {
  if (!doctorId.value) {
    doctorData.value = null;
    return;
  }
  const { data, error } = await supabase
    .from("users")
    .select("nombreCompleto, direccion, telefono")
    .eq("id", doctorId.value)
    .single();

  if (error) {
    doctorData.value = null;
    Notify.create({
      message: `Error al obtener datos del médico: ${error.message}`,
      color: "negative",
      position: "top-right",
    });
  } else {
    doctorData.value = data;
  }
}

// --- Cargar datos de la organización ---
async function fetchOrganizationInfo() {
  if (!tenant_id.value) {
    organization.value = null;
    Notify.create({
      message: "Error: tenant_id no está definido o es inválido.",
      color: "negative",
      position: "top-right",
    });
    loading.value = false;
    return;
  }

  try {
    const { data, error } = await supabase
      .from("organizacion")
      .select("*")
      .eq("id", tenant_id.value)
      .single();

    if (error || !data) {
      organization.value = null;
    } else {
      organization.value = {
        id: data.id,
        name: data.nombre,
        address: data.direccion,
        phone: data.numero_telefono,
      };
    }
  } catch (err) {
    organization.value = null;
  } finally {
    loading.value = false;
  }
}

// --- Funciones de horarios ---
function getDayOfWeek(dateStr) {
  const date = new Date(dateStr);
  return date.getDay(); // 0: Domingo, 1: Lunes, etc.
}

function generateAvailableTimes(horaInicio, horaFin, intervaloMin) {
  const times = [];
  const [startHour, startMinute] = horaInicio.split(":").map(Number);
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
  return times;
}

const allTimes = ref([]);
async function fetchOccupiedTimes() {
  console.log("Iniciando fetchOccupiedTimes");

  // Validar que la fecha y el doctorId estén definidos
  if (!form.value.date || !doctorId.value) {
    console.log(
      "Fecha o doctorId no definidos:",
      form.value.date,
      doctorId.value
    );
    availableTimes.value = [];
    return;
  }

  const selectedDate = form.value.date;
  console.log("Fecha seleccionada:", selectedDate);

  // Obtener la primera configuración de horarios disponible
  const primeraConfiguracion = horariosAtencion.value[0];
  if (!primeraConfiguracion) {
    console.error("No se encontraron configuraciones de horarios.");
    errorMsg.value = "No se encontraron configuraciones de horarios.";
    availableTimes.value = [];
    return;
  }

  const { hora_inicio, hora_fin, intervalo_min, autoSuperPosicion } =
    primeraConfiguracion;
  console.log("Configuración obtenida:", hora_inicio, hora_fin, intervalo_min);

  // Actualizar la variable permitirSuperposicion desde la configuración
  permitirSuperposicion.value = autoSuperPosicion;

  // Generar todos los tiempos disponibles según la configuración dinámica
  allTimes.value = generateAvailableTimes(hora_inicio, hora_fin, intervalo_min);
  console.log("Todos los tiempos generados:", allTimes.value);

  // Si no se permite superposición, asignar todos los tiempos disponibles sin filtrado
  console.log("permitirSuperposicion:", permitirSuperposicion.value);
  if (permitirSuperposicion.value) {
    console.log("Superposición no permitida, no se filtrarán horas ocupadas.");
    availableTimes.value = allTimes.value;
    errorMsg.value = "";
    console.log("Horas disponibles:", availableTimes.value);
    return;
  }

  // Preparar rango de fechas para consultar citas en Supabase
  const nextDate = new Date(selectedDate);
  nextDate.setDate(nextDate.getDate() + 1);
  const nextDateStr = nextDate.toISOString().split("T")[0];
  console.log("Próxima fecha:", nextDateStr);

  // Consultar citas existentes en la base de datos para el doctor en la fecha seleccionada
  const { data, error } = await supabase
    .from("appointments")
    .select("startDate")
    .eq("userId", doctorId.value)
    .eq("tenant_id", tenant_id.value)
    .gte("startDate", `${selectedDate}T00:00:00`)
    .lt("startDate", `${nextDateStr}T00:00:00`);

  if (error) {
    console.error("Error al obtener citas existentes:", error);
    errorMsg.value = "Error al obtener las citas existentes.";
    return;
  }

  // Extraer las horas ocupadas de las citas existentes
  const occupiedTimes = data.map((appt) => {
    const date = new Date(appt.startDate);
    const hh = String(date.getHours()).padStart(2, "0");
    const mm = String(date.getMinutes()).padStart(2, "0");
    return `${hh}:${mm}`;
  });
  console.log("Horas ocupadas:", occupiedTimes);

  // Filtrar las horas disponibles eliminando las que ya están ocupadas
  availableTimes.value = allTimes.value.filter(
    (t) => !occupiedTimes.includes(t)
  );
  console.log("Horas disponibles después del filtrado:", availableTimes.value);

  // Actualizar mensaje de error si no hay horas disponibles
  if (availableTimes.value.length === 0) {
    errorMsg.value = "No hay horarios disponibles para la fecha seleccionada.";
  } else {
    errorMsg.value = "";
  }
}

function calculateEndTime(startTime) {
  const [hour, minute] = startTime.split(":").map(Number);
  const startDate = new Date();
  startDate.setHours(hour, minute, 0, 0);
  startDate.setMinutes(startDate.getMinutes() + 30); // 30 minutos extra

  const endHour = String(startDate.getHours()).padStart(2, "0");
  const endMinute = String(startDate.getMinutes()).padStart(2, "0");
  endTime.value = `${endHour}:${endMinute}`;
}

// --- Manejo del Submit ---
async function handleSubmit() {
  validateIdentificacion();
  validateDate();
  validateTime();
  validatePhone();

  if (
    errors.value.identificacion ||
    errors.value.date ||
    errors.value.time ||
    errors.value.phone
  ) {
    Notify.create({
      message: "Por favor, corrige los errores en el formulario.",
      color: "negative",
      position: "top-right",
    });
    return;
  }

  // En lugar de buscar el horario por día, obtenemos la primera configuración disponible.
  const primeraConfiguracion = horariosAtencion.value[0];
  if (!primeraConfiguracion) {
    errorMsg.value = "No se encontraron configuraciones de horarios.";
    return;
  }
  const { intervalo_min } = primeraConfiguracion;

  const startDateStr = `${form.value.date}T${form.value.time}:00`;
  const endDate = new Date(`${form.value.date}T${form.value.time}:00`);
  endDate.setMinutes(endDate.getMinutes() + intervalo_min);

  const endDateStr = endDate.toISOString().slice(0, 19);

  const newAppointment = {
    title: `AutoCita con: ${form.value?.patientNameUI}`,
    startDate: startDateStr,
    endDate: endDateStr,
    allDay: false,
    repeat: false,
    description: form.value.description,
    nombre: form.value.patientName, // Guardamos en 'nombre' el ID del paciente
    tipoCita: "Consulta",
    userId: doctorId.value,
    tenant_id: tenant_id.value,
    patientphone: form.value.phone,
    identificacion: form.value.identificacion,
    status: "Pendiente",
    autoCita: true,
  };

  try {
    const { error: insertError } = await supabase
      .from("appointments")
      .insert([newAppointment]);

    if (insertError) {
      errorMsg.value =
        insertError.message || "Error al agendar la cita. Inténtalo de nuevo.";
      success.value = false;
    } else {
      success.value = true;
      errorMsg.value = "";
      Notify.create({
        message: "Cita agendada correctamente.",
        color: "positive",
        position: "top-right",
      });
      // Reset form
      form.value = {
        identificacion: "",
        patientName: "",
        patientNameUI: "",
        date: "",
        time: "",
        description: "",
        phone: "",
      };
      availableTimes.value = [];
      errors.value = {
        identificacion: "",
        date: "",
        time: "",
        phone: "",
      };
    }
  } catch (err) {
    errorMsg.value = "Error al agendar la cita. Inténtalo de nuevo.";
    success.value = false;
  }
}

// --- WATCHERS de date, time,  etc. ---
watch(
  () => form.value.date,
  async () => {
    validateDate();
    if (form.value.date) {
      await fetchOccupiedTimes();
      if (form.value.time && !availableTimes.value.includes(form.value.time)) {
        form.value.time = "";
        errors.value.time = "Hora ya ocupada";
        endTime.value = "";
      }
    }
  }
);

watch(
  () => form.value.time,
  (newTime) => {
    validateTime();
    if (newTime) {
      calculateEndTime(newTime);
    } else {
      endTime.value = "";
    }
  }
);

// --- Cambios en la ruta (doctorId) ---
watch(
  () => route.params.userId,
  async (newDoctorId) => {
    doctorId.value = newDoctorId;
    await reloadData();
  }
);

async function reloadData() {
  form.value = {
    identificacion: "",
    patientName: "",
    patientNameUI: "",
    date: "",
    time: "",
    description: "",
    phone: "",
  };
  success.value = false;
  errorMsg.value = "";
  availableTimes.value = [];
  errors.value = {
    identificacion: "",
    date: "",
    time: "",
    phone: "",
  };
  loading.value = true;

  await fetchOrganizationInfo();
  await fetchDoctorData();
  await crearUsuariosStore.cargarConfiguraciones();
  await fichaIdentificacionStore.cargarDatosPorDoctor(
    tenant_id.value,
    doctorId.value
  );
  await cargarConfiguraciones(tenant_id.value);
  loading.value = false;

  // Asignar fecha de hoy
  const today = new Date().toISOString().split("T")[0];
  form.value.date = today;
  await fetchOccupiedTimes();
}

// --- onMounted ---
onMounted(async () => {
  await fetchOrganizationInfo();
  await fetchDoctorData();
  await crearUsuariosStore.cargarConfiguraciones();

  await fichaIdentificacionStore.cargarDatosPorDoctor(
    tenant_id.value,
    doctorId.value
  );
  console.log("PACIENTES SUPERPOSICION : ", permitirSuperposicion.value);
  // await cargarConfiguraciones(tenant_id.value);

  loading.value = false;
  const today = new Date().toISOString().split("T")[0];
  form.value.date = today;
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
.text-danger {
  color: #dc3545 !important;
}
</style>
