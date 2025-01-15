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
                <h5>Dr(a). {{ doctorData?.nombreCompleto }}</h5>
                <p>
                  <i class="ri-phone-line"></i>
                  {{ doctorData?.telefono }}
                </p>
                <p v-if="doctorData?.direccion">
                  <i class="ri-map-pin-line"></i>
                  {{ doctorData?.direccion }}
                </p>
              </div>
            </div>

            <!-- FORMULARIO -->
            <form @submit.prevent="handleSubmit">
              <!-- Campo de Identificación (DNI) -->
              <div class="row">
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
import { useDirPacientesStore } from "../stores/fichaIdentificacionStores";
import { storeToRefs } from "pinia";
import { useCrearUsuariosStore } from "../stores/crearUsuarios";
import { useAuthStore } from "../stores/auth";
import { Notify } from "quasar";

const route = useRoute();
// ID del médico (vía parámetro en la URL)
const doctorId = ref(route.params.userId);

// ------------------------------
// Store de FichaIdentificacion
// ------------------------------
const dirPacientesStore = useDirPacientesStore();
const { buscarPacientePorDni } = dirPacientesStore;

// ------------------------------
// Store de crearUsuarios (Horarios)
// ------------------------------
const crearUsuariosStore = useCrearUsuariosStore();
const { users, loading, error, horariosAtencion, permitirSuperposicion } =
  storeToRefs(crearUsuariosStore);

// ------------------------------
// Store de autenticación
// ------------------------------
const authStore = useAuthStore();
const { tenant_id, user } = storeToRefs(authStore);

// ------------------------------
// Datos del médico y org
// ------------------------------
const doctorData = ref(null);
const organization = ref(null);

// Flags y estados
const success = ref(false);
const errorMsg = ref("");
// El "loading" ya está referenciado desde la store (crearUsuariosStore)

// Para formatear horas
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

// ------------------------------
// form: datos de la nueva cita
// ------------------------------
const form = ref({
  identificacion: "", // PacienteIdentificacion
  patientName: "", // ID del paciente (columna PacienteNombreId)
  patientNameUI: "", // Nombre real del paciente (no se guarda en BD)
  date: "",
  time: "",
  description: "",
  phone: "",
});

// Errores del formulario
const errors = ref({
  identificacion: "",
  date: "",
  time: "",
  phone: "",
});

const endTime = ref("");
const availableTimes = ref([]);

// ------------------------------
// Validaciones
// ------------------------------
// const validateIdentificacion = () => {
//   const id = form.value.identificacion;
//   if (!id) {
//     errors.value.identificacion = "Identificación es requerida";
//     return;
//   }

//   const patrones = [
//     /^\d{4}\d{4}\d{5}$/,
//     /^(\d{1,3}\.){3}\d{1,3}$/,
//     /^[A-Z]\d{8}$/,
//     /^[XYZ]\d{7}[A-Z]$/,
//     /^[A-Z]{3}\d{10}$/,
//     /^\d{3}-\d{2}-\d{4}$/,
//     /^STU\d{9}$/,
//     /^CID-\d{9}$/,
//   ];

//   // Verificar si el ID coincide con alguno de los patrones
//   const esValido = patrones.some((patron) => patron.test(id));

//   if (!esValido) {
//     errors.value.identificacion =
//       "Identificación inválida según los formatos permitidos";
//   } else {
//     errors.value.identificacion = "";
//   }
// };

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
      form.value.patientName = paciente.PacienteId || "";
      form.value.patientNameUI = paciente.Nombre || "";
      console.log(
        `[buscarPaciente] Paciente encontrado => ID: ${paciente.PacienteId}, Nombres: ${paciente.Nombre}`
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

// Debounce para el DNI
let lookupTimeout;
watch(
  () => form.value.identificacion,
  (newDni) => {
    clearTimeout(lookupTimeout);
    // validateIdentificacion();

    if (/^\d{8,20}$/.test(newDni)) {
      lookupTimeout = setTimeout(() => {
        buscarPaciente(newDni);
      }, 500);
    } else {
      form.value.patientName = "";
      form.value.patientNameUI = "";
    }
  }
);

// ------------------------------
// Cargar datos del médico
// ------------------------------
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

// ------------------------------
// Cargar datos de la organización
// ------------------------------
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

// ------------------------------
// Generar horarios disponibles
// ------------------------------
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

// ------------------------------
// Obtener horas ocupadas y filtrar
// ------------------------------
const allTimes = ref([]);
async function fetchOccupiedTimes() {
  if (!form.value.date || !doctorId.value) {
    availableTimes.value = [];
    return;
  }

  const selectedDate = form.value.date;

  // Obtenemos la primera configuración de horarios
  const primeraConfiguracion = horariosAtencion.value[0];
  if (!primeraConfiguracion) {
    console.error("No se encontraron configuraciones de horarios.");
    errorMsg.value = "No se encontraron configuraciones de horarios.";
    availableTimes.value = [];
    return;
  }

  const { hora_inicio, hora_fin, intervalo_min, autoSuperPosicion } =
    primeraConfiguracion;

  permitirSuperposicion.value = autoSuperPosicion;

  // Generar todas las horas posibles
  allTimes.value = generateAvailableTimes(hora_inicio, hora_fin, intervalo_min);

  // Si se permite superposición, no filtramos
  if (permitirSuperposicion.value) {
    availableTimes.value = allTimes.value;
    errorMsg.value = "";
    return;
  }

  // Caso: sin superposición => Filtrar horas ocupadas
  const nextDate = new Date(selectedDate);
  nextDate.setDate(nextDate.getDate() + 1);
  const nextDateStr = nextDate.toISOString().split("T")[0];

  // Importante: ahora usamos CitaFechaInicio en lugar de startDate
  const { data, error } = await supabase
    .from("appointments")
    .select("CitaFechaInicio")
    .eq("UsuarioMedicoId", doctorId.value)
    .eq("tenant_id", tenant_id.value)
    .gte("CitaFechaInicio", `${selectedDate}T00:00:00`)
    .lt("CitaFechaInicio", `${nextDateStr}T00:00:00`);

  if (error) {
    console.error("Error al obtener citas existentes:", error);
    errorMsg.value = "Error al obtener las citas existentes.";
    return;
  }

  // Extraer horas ocupadas
  const occupiedTimes = data.map((appt) => {
    const date = new Date(appt.CitaFechaInicio);
    const hh = String(date.getHours()).padStart(2, "0");
    const mm = String(date.getMinutes()).padStart(2, "0");
    return `${hh}:${mm}`;
  });

  // Filtramos
  availableTimes.value = allTimes.value.filter(
    (t) => !occupiedTimes.includes(t)
  );

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
  // Sumar 30 minutos (o intervalo) para el fin de la cita
  startDate.setMinutes(startDate.getMinutes() + 30);

  const endHour = String(startDate.getHours()).padStart(2, "0");
  const endMinute = String(startDate.getMinutes()).padStart(2, "0");
  endTime.value = `${endHour}:${endMinute}`;
}

// ------------------------------
// Manejo del submit (INSERT)
// ------------------------------
async function handleSubmit() {
  // validateIdentificacion();
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

  // Obtenemos la primera configuración de horarios
  const primeraConfiguracion = horariosAtencion.value[0];
  if (!primeraConfiguracion) {
    errorMsg.value = "No se encontraron configuraciones de horarios.";
    return;
  }
  const { intervalo_min } = primeraConfiguracion;

  const startDateStr = `${form.value.date}T${form.value.time}:00`;
  const endDate = new Date(startDateStr);
  endDate.setMinutes(endDate.getMinutes() + intervalo_min);
  const endDateStr = endDate.toISOString().slice(0, 19);

  // NOTA: Aquí cambiamos a las columnas nuevas:
  const newAppointment = {
    CitaTitulo: `AutoCita con: ${form.value?.patientNameUI}`,
    // Ahora usamos CitaFechaInicio y CitaFechaFinal
    CitaFechaInicio: startDateStr,
    CitaFechaFinal: endDateStr,
    // Y CitaTodoElDia, CitaRepetir
    CitaTodoElDia: false,
    CitaRepetir: false,

    CitaDescripcion: form.value.description,
    PacienteNombreId: form.value.patientName, //No guarda el nombre en el campo del id

    // PacienteNombreId: form.value.patientName || form.value.patientNameUI,

    UsuarioMedicoId: doctorId.value,
    tenant_id: tenant_id.value,
    userId: user.value?.id || "",
    PacienteTel: form.value.phone,
    // PacienteIdentificacion
    PacienteIdentificacion: form.value.identificacion,
    // Cambiamos a CitaStatus
    CitaStatus: "Pendiente",
    AutoCita: true,
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

// ------------------------------
// WATCHERS de date / time / route
// ------------------------------
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

watch(
  () => route.params.userId,
  async (newDoctorId) => {
    doctorId.value = newDoctorId;
    await reloadData();
  }
);

// ------------------------------
// Recarga de datos general
// ------------------------------
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
  await dirPacientesStore.cargarDatosPorDoctor(tenant_id.value, doctorId.value);

  loading.value = false;
  // Asignar fecha de hoy
  const today = new Date().toISOString().split("T")[0];
  form.value.date = today;
  await fetchOccupiedTimes();
}

// ------------------------------
// onMounted
// ------------------------------
onMounted(async () => {
  await fetchOrganizationInfo();
  await fetchDoctorData();
  await crearUsuariosStore.cargarConfiguraciones();

  await dirPacientesStore.cargarDatosPorDoctor(tenant_id.value, doctorId.value);

  loading.value = false;
  // Asignar fecha de hoy
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
