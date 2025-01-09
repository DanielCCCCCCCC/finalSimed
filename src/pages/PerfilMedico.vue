<template>
  <q-page class="profile-page">
    <div class="profile-container">
      <!-- Sección principal del perfil -->
      <div class="profile-main">
        <!-- Avatar y nombre -->
        <div class="profile-header">
          <q-avatar size="150px" class="profile-avatar">
            <img src="../assets/icons/profileMedico.jpg" alt="Doctor" />
          </q-avatar>
          <h3 class="profile-name">Dr. {{ users[0]?.nombreCompleto }}</h3>
        </div>

        <!-- Pestañas debajo de la foto de perfil -->
        <div class="q-pa-md flex justify-center">
          <q-tabs
            v-model="tab"
            class="bg-primary profile-nav-line tabs-menu custom-tabs"
            dense
            align="justify"
            active-color="white"
          >
            <q-tab name="info" label="Información del médico" />
            <q-tab name="qr" label="Código QR" />
            <q-tab name="horarios" label="Horarios de Atención" />
          </q-tabs>
        </div>
      </div>

      <!-- Contenido de las Pestañas -->
      <q-card class="custom-card main-content-body-profile">
        <q-tab-panels animated v-model="tab">
          <!-- Pestaña de Información del Médico -->
          <q-tab-panel name="info">
            <q-card-section class="doctor-info">
              <h4 class="fs-15 text-uppercase mb-3">Información del Médico</h4>

              <!-- Estado de carga -->
              <div v-if="loading">
                <q-spinner size="50px" color="primary" />
                <p>Cargando información del médico...</p>
              </div>

              <!-- Tabla con la información del usuario -->
              <div v-else-if="users[0]" class="table-responsive">
                <q-list dense bordered separator>
                  <q-item>
                    <q-item-section>
                      <q-item-label><strong>ID:</strong></q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-item-label>{{ users[0]?.id }}</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section>
                      <q-item-label
                        ><strong>Nombre Completo:</strong></q-item-label
                      >
                    </q-item-section>
                    <q-item-section side>
                      <q-item-label>{{
                        users[0]?.nombreCompleto
                      }}</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section>
                      <q-item-label><strong>Rol:</strong></q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-item-label>{{ users[0]?.role }}</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section>
                      <q-item-label><strong>Email:</strong></q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-item-label>{{ users[0]?.email }}</q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-item>
                    <q-item-section>
                      <q-item-label><strong>Dirección:</strong></q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-item-label>{{ users[0]?.direccion }}</q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-item>
                    <q-item-section>
                      <q-item-label><strong>Observación:</strong></q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-item-label>{{
                        users[0]?.observaciones || "Sin observaciones."
                      }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </div>

              <!-- Manejo de errores -->
              <div v-else-if="error">
                <q-banner class="bg-red text-white" dense>
                  {{ error }}
                </q-banner>
              </div>
            </q-card-section>
          </q-tab-panel>

          <!-- Pestaña de Código QR -->
          <q-tab-panel name="qr">
            <q-card-section class="q-pa-md flex flex-center">
              <div class="qr-container">
                <h2>Código QR de Agenda</h2>

                <div v-if="loadingQR" class="spinner">
                  <q-spinner size="50px" color="primary" />
                  <p>Cargando código QR...</p>
                </div>

                <div v-else-if="qrCodeUrl">
                  <img
                    :src="qrCodeUrl"
                    alt="Código QR"
                    width="200"
                    height="200"
                  />
                  <p>Escanea el código QR para agendar una cita.</p>

                  <!-- Contenedor para el campo de URL y botones -->
                  <div class="url-container">
                    <q-input
                      filled
                      v-model="fullUrl"
                      readonly
                      class="url-input"
                      label="URL de Agenda"
                    />
                    <div class="buttons-container">
                      <q-btn
                        icon="content_copy"
                        label="Copiar URL"
                        color="primary"
                        class="anchoBotonesQR"
                        @click="copyToClipboard"
                      />
                      <q-btn
                        icon="download"
                        label="Descargar QR"
                        color="info"
                        class="anchoBotonesQR"
                        @click="downloadQRCode"
                      />
                    </div>
                  </div>

                  <!-- Mensaje de Éxito al Copiar -->
                  <q-banner
                    v-if="copySuccess"
                    class="bg-green text-white"
                    dense
                    inline-actions
                  >
                    URL copiada al portapapeles.
                    <template v-slot:action>
                      <q-btn
                        flat
                        dense
                        icon="close"
                        @click="copySuccess = false"
                      />
                    </template>
                  </q-banner>
                </div>

                <div v-else-if="errorMsgQR" class="alert alert-danger">
                  {{ errorMsgQR }}
                </div>
              </div>
            </q-card-section>
          </q-tab-panel>
          <!-- Nueva Pestaña: Horarios de Atención -->
          <q-tab-panel name="horarios">
            <q-card-section>
              <div class="horarios-container">
                <!-- Contenedor flex para título y botón -->
                <div class="horarios-header">
                  <h4 class="fs-15 text-uppercase mb-3">
                    Horarios de Atención
                  </h4>
                  <q-btn
                    label="Agregar Horario"
                    color="primary"
                    icon="add"
                    @click="abrirModalCrearHorario()"
                    flat
                  />
                </div>
                <!-- DxDataGrid para Horarios de Atención -->
                <DxDataGrid
                  :data-source="horariosAtencion"
                  :allow-column-reordering="true"
                  :row-alternation-enabled="true"
                  :show-borders="true"
                  key-expr="id"
                  :column-auto-width="true"
                  :column-min-width="90"
                  class="custom-data-grid"
                >
                  <DxEditing
                    :allow-updating="false"
                    :allow-adding="false"
                    :allow-deleting="false"
                    mode="row"
                  />
                  <DxPaging :enabled="true" :page-size="7" />
                  <DxColumn
                    data-field="dia_semana"
                    caption="Día de la Semana"
                    data-type="string"
                    min-width="150"
                  />
                  <DxColumn
                    data-field="hora_inicio"
                    caption="Hora de Inicio"
                    data-type="time"
                    min-width="120"
                  />
                  <DxColumn
                    data-field="hora_fin"
                    caption="Hora de Fin"
                    data-type="time"
                    min-width="120"
                  />
                  <DxColumn
                    data-field="intervalo_min"
                    caption="Intervalo (min)"
                    data-type="number"
                    min-width="120"
                  />
                  <DxColumn type="buttons" width="150">
                    <DxButton
                      name="edit"
                      icon="edit"
                      hint="Editar Horario"
                      @click="editarHorarioAtencion(row)"
                    />
                    <DxButton
                      name="delete"
                      icon="delete"
                      hint="Eliminar Horario"
                      @click="eliminarHorarioAtencion(row)"
                    />
                  </DxColumn>
                </DxDataGrid>
              </div>
            </q-card-section>

            <!-- Modal para Agregar/Editar Horario -->
            <!-- Dentro de la pestaña "Horarios de Atención" -->
            <q-dialog v-model="abrirModalHorario" persistent>
              <q-card class="form-container widthModalHorarios">
                <q-card-section>
                  <div class="text-h6">
                    {{ esEditar ? "Editar" : "Agregar" }} Horario de Atención
                  </div>
                </q-card-section>
                <q-card-section>
                  <q-form
                    @submit.prevent="
                      esEditar ? actualizarHorario() : crearHorario()
                    "
                  >
                    <div class="q-gutter-md">
                      <!-- Día de la Semana -->
                      <div>
                        <label for="dia_semana">Día de la Semana</label>
                        <select
                          id="dia_semana"
                          name="dia_semana"
                          v-model="formHorario.dia_semana"
                          required
                          class="form-select custom-select-height"
                        >
                          <option value="" disabled>Seleccionar un día</option>
                          <option
                            v-for="dia in diasSemana"
                            :key="dia"
                            :value="dia"
                          >
                            {{ dia }}
                          </option>
                        </select>
                      </div>
                      <!-- Hora de Inicio y Hora de Fin -->
                      <div class="row-horizontal">
                        <div class="time-picker">
                          <label for="hora_inicio">Hora de Inicio</label>
                          <input
                            type="time"
                            id="hora_inicio"
                            v-model="formHorario.hora_inicio"
                            required
                          />
                        </div>
                        <div class="time-picker">
                          <label for="hora_fin">Hora de Fin</label>
                          <input
                            type="time"
                            id="hora_fin"
                            v-model="formHorario.hora_fin"
                            required
                          />
                        </div>
                      </div>
                      <!-- Intervalo entre Citas -->
                      <div>
                        <label for="intervalo_min">Intervalo (minutos)</label>
                        <input
                          id="intervalo_min"
                          name="intervalo_min"
                          type="number"
                          min="5"
                          v-model.number="formHorario.intervalo_min"
                          class="form-control"
                          required
                          placeholder="Intervalo entre Citas (minutos)"
                        />
                      </div>
                    </div>
                  </q-form>
                </q-card-section>
                <q-card-actions align="right">
                  <q-btn flat label="Cancelar" @click="cerrarModalHorario" />
                  <q-btn
                    label="Guardar"
                    color="primary"
                    @click="esEditar ? actualizarHorario() : crearHorario()"
                  />
                </q-card-actions>
              </q-card>
            </q-dialog>
          </q-tab-panel>
        </q-tab-panels>
      </q-card>
    </div>
  </q-page>
</template>
<script setup>
import { ref, onMounted, watch, reactive } from "vue";
import QRCode from "qrcode";
import { useAuthStore } from "../stores/auth";
import { useCrearUsuariosStore } from "../stores/crearUsuarios";
import { useQuasar } from "quasar";
import { storeToRefs } from "pinia";
import {
  DxDataGrid,
  DxEditing,
  DxPaging,
  DxColumn,
  DxButton,
  DxRequiredRule,
  DxEmailRule,
  DxLookup,
} from "devextreme-vue/data-grid";

const crearUsuariosStore = useCrearUsuariosStore();
const { users, loading, error, horariosAtencion } =
  storeToRefs(crearUsuariosStore);

const $q = useQuasar();

const tab = ref("info");

// Acceder a la store de autenticación
const authStore = useAuthStore();
const organizationId = ref(authStore.tenant_id || "defaultOrgId");
const doctorId = ref(authStore.userId || "defaultDoctorId");
const { tenant_id } = storeToRefs(authStore);

// Estado para el código QR
const qrCodeUrl = ref("");
const loadingQR = ref(true);
const errorMsgQR = ref("");

// Estado para la copia del URL
const copySuccess = ref(false);
const formHorario = reactive({
  id: null,
  dia_semana: "",
  hora_inicio: "",
  hora_fin: "",
  intervalo_min: 15,
});
const esEditar = ref(false);
const diasSemana = ref([
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
  "Domingo",
]);
const abrirModalHorario = ref(false);
// Definir la base URL
const baseUrl =
  import.meta.env.VITE_BASE_URL || "http://localhost:9000/schedule";

// URL completa: /schedule/:organizationId/:doctorId
const fullUrl = ref(`${baseUrl}/${organizationId.value}/${doctorId.value}`);

// Genera el QR
async function generateQRCode() {
  try {
    const urlString = fullUrl.value;
    console.log("Generando QR para:", urlString);

    qrCodeUrl.value = await QRCode.toDataURL(urlString, {
      width: 300,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#ffffff",
      },
    });
  } catch (err) {
    console.error("Error al generar el código QR:", err);
    errorMsgQR.value = "No se pudo generar el código QR. Inténtalo de nuevo.";
  } finally {
    loadingQR.value = false;
  }
}

// Copiar al portapapeles
async function copyToClipboard() {
  try {
    await navigator.clipboard.writeText(fullUrl.value);
    copySuccess.value = true;
    setTimeout(() => {
      copySuccess.value = false;
    }, 3000);
  } catch (err) {
    console.error("Error al copiar:", err);
    $q.notify({
      type: "negative",
      message: "No se pudo copiar el URL. Inténtalo de nuevo.",
    });
  }
}

// Descargar QR
function downloadQRCode() {
  if (!qrCodeUrl.value) {
    $q.notify({
      type: "negative",
      message: "No hay código QR para descargar.",
    });
    return;
  }
  const link = document.createElement("a");
  link.href = qrCodeUrl.value;
  link.download = `codigo_qr_${doctorId.value}.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
// Horarios

/** Abrir el modal de nuevo horario */
const abrirModalCrearHorario = () => {
  esEditar.value = false;
  formHorario.id = null;
  formHorario.dia_semana = "";
  formHorario.hora_inicio = "";
  formHorario.hora_fin = "";
  formHorario.intervalo_min = 15;
  abrirModalHorario.value = true;
};

/** Editar horario existente */
const editarHorarioAtencion = (row) => {
  esEditar.value = true;
  formHorario.id = row.data.id;
  formHorario.dia_semana = row.data.dia_semana;
  formHorario.hora_inicio = row.data.hora_inicio;
  formHorario.hora_fin = row.data.hora_fin;
  formHorario.intervalo_min = row.data.intervalo_min;
  abrirModalHorario.value = true;
};

/** Cerrar modal */
const cerrarModalHorario = () => {
  abrirModalHorario.value = false;
};

/** Crear horario */
const crearHorario = async () => {
  if (
    !formHorario.dia_semana ||
    !formHorario.hora_inicio ||
    !formHorario.hora_fin ||
    !formHorario.intervalo_min
  ) {
    $q.notify({
      type: "negative",
      message: "Por favor, completa todos los campos.",
      position: "top-right",
    });
    return;
  }
  if (formHorario.hora_fin <= formHorario.hora_inicio) {
    $q.notify({
      type: "negative",
      message: "La hora de fin debe ser mayor que la hora de inicio.",
      position: "top-right",
    });
    return;
  }
  if (!tenant_id.value) {
    $q.notify({
      type: "negative",
      message: "Error: La organización no está definida o es inválida.",
      position: "top-right",
    });
    return;
  }

  const nuevoHorario = {
    dia_semana: formHorario.dia_semana,
    hora_inicio: formHorario.hora_inicio,
    hora_fin: formHorario.hora_fin,
    intervalo_min: formHorario.intervalo_min,
    tenant_id: tenant_id.value,
  };

  try {
    await crearUsuariosStore.crearHorarioAtencion(nuevoHorario);
    cerrarModalHorario();
    await crearUsuariosStore.cargarHorariosAtencion(tenant_id.value);
    $q.notify({
      type: "positive",
      message: "Horario de atención creado exitosamente.",
      position: "top-right",
    });
  } catch (error) {
    console.error("Error creando horario:", error);
    $q.notify({
      type: "negative",
      message: "Error al crear el horario de atención.",
      position: "top-right",
    });
  }
};

/** Actualizar horario */
const actualizarHorario = async () => {
  if (
    !formHorario.dia_semana ||
    !formHorario.hora_inicio ||
    !formHorario.hora_fin ||
    !formHorario.intervalo_min
  ) {
    $q.notify({
      type: "negative",
      message: "Por favor, completa todos los campos.",
      position: "top-right",
    });
    return;
  }
  if (formHorario.hora_fin <= formHorario.hora_inicio) {
    $q.notify({
      type: "negative",
      message: "La hora de fin debe ser mayor que la hora de inicio.",
      position: "top-right",
    });
    return;
  }
  if (!tenant_id.value) {
    $q.notify({
      type: "negative",
      message: "Error: La organización no está definida o es inválida.",
      position: "top-right",
    });
    return;
  }

  const horarioActualizado = {
    dia_semana: formHorario.dia_semana,
    hora_inicio: formHorario.hora_inicio,
    hora_fin: formHorario.hora_fin,
    intervalo_min: formHorario.intervalo_min,
    tenant_id: tenant_id.value,
  };

  try {
    await crearUsuariosStore.actualizarHorarioAtencion(
      formHorario.id,
      horarioActualizado
    );
    cerrarModalHorario();
    await crearUsuariosStore.cargarHorariosAtencion(tenant_id.value);
    $q.notify({
      type: "positive",
      message: "Horario de atención actualizado exitosamente.",
      position: "top-right",
    });
  } catch (error) {
    console.error("Error actualizando horario:", error);
    $q.notify({
      type: "negative",
      message: "Error al actualizar el horario de atención.",
      position: "top-right",
    });
  }
};

/** Eliminar horario */
const eliminarHorarioAtencion = async (row) => {
  const horario = row.data;
  if (
    confirm(
      `¿Estás seguro de eliminar el horario de ${
        horario.dia_semana
      } de ${formatTime(horario.hora_inicio)} a ${formatTime(
        horario.hora_fin
      )}?`
    )
  ) {
    try {
      await organizacionStore.eliminarHorarioAtencion(horario.id);
      await crearUsuariosStore.cargarHorariosAtencion(tenant_id.value);
      $q.notify({
        type: "positive",
        message: "Horario de atención eliminado exitosamente.",
        position: "top-right",
      });
    } catch (error) {
      console.error("Error eliminando horario:", error);
      $q.notify({
        type: "negative",
        message: "Error al eliminar el horario de atención.",
        position: "top-right",
      });
    }
  }
};

/** Formatea la hora HH:mm a AM/PM */
const formatTime = (timeStr) => {
  try {
    const [hour, minute] = timeStr.split(":").map(Number);
    const suffix = hour >= 12 ? "PM" : "AM";
    const adjHour = hour % 12 || 12;
    return `${adjHour}:${minute.toString().padStart(2, "0")} ${suffix}`;
  } catch {
    return timeStr;
  }
};

// Obtener el usuario actual y generar QR al montar el componente
onMounted(async () => {
  // Verificar si userId está disponible
  if (authStore.userId) {
    await crearUsuariosStore.cargarUsuarioPerfil();
    await crearUsuariosStore.cargarHorariosAtencion();

    await generateQRCode();
    console.log("Nombr completo del medico: ", users[0]?.nombreCompleto);
    console.log("USER DE PERFIL MEDICO: ", crearUsuariosStore.users.value);
  } else {
    console.warn(
      "userId no está disponible en authStore al montar el componente."
    );
  }
});

// Si cambia tenant_id o userId en la store, regeneramos el QR
watch(
  () => authStore.tenant_id,
  (newOrg) => {
    organizationId.value = newOrg;
    fullUrl.value = `${baseUrl}/${organizationId.value}/${doctorId.value}`;
    generateQRCode();
  }
);

watch(
  () => authStore.userId,
  async (newDoc) => {
    doctorId.value = newDoc;
    fullUrl.value = `${baseUrl}/${organizationId.value}/${doctorId.value}`;
    if (newDoc) {
      await crearUsuariosStore.cargarUsuarioPerfil();
      generateQRCode();
    }
  }
);
</script>

<style scoped>
.profile-container {
  position: relative;
  top: -40px;
  max-width: 1900px;
  margin: 0 auto;
  background-color: #ffffff;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.profile-main {
  text-align: center;
  padding: 30px;
}

.profile-avatar {
  margin-top: -35px; /* Para superponer el avatar al banner */
  border: 5px solid #ffffff;
}

.profile-name {
  margin-top: 10px;
  font-size: 1.8rem;
  font-weight: bold;
}

.profile-buttons {
  margin-top: 15px;
}
.form-container {
  border-radius: 8px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
}
.widthModalHorarios {
  width: 40%;
  height: auto;
  max-width: 1400px;
}

.horarios-container {
  margin-top: 10px;
}

.horarios-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  /* margin-bottom: 20px; */
}

.horarios-header h6 {
  font-size: 18px;
  color: #2c3e50;
}

.horarios-header .q-btn {
  min-width: 150px;
}
.custom-data-grid {
  height: 300px;
  margin-top: 10px;
}
.time-picker {
  display: flex;
  flex-direction: column;
  flex: 1;
}
@media (max-width: 768px) {
  .row-horizontal {
    flex-direction: column;
    gap: 10px;
  }
  .time-picker input[type="time"] {
    width: 100%;
  }
  .horarios-header {
    flex-direction: column;
    align-items: flex-start;
  }
  .horarios-header .q-btn {
    width: 100%;
    margin-top: 10px;
  }
  .custom-data-grid {
    min-height: 300px;
  }
}

/* .profile-stats {
  display: flex;
  justify-content: center;
  gap: 30px;
  margin-top: 20px;
} */
/*
.profile-stats div {
  text-align: center;
}

.profile-stats strong {
  display: block;
  font-size: 1.2rem;
} */

.tabs-menu {
  margin-top: 20px;
  padding-top: 10px;
  width: 100%;
  border: #ffffff;
}

.custom-tabs {
  border-radius: 8px;
}

.q-tab--active .q-tab__content {
  font-weight: bold;
  color: #ffffff;
}

.q-tab {
  color: rgba(255, 255, 255, 0.75);
  transition: color 0.3s;
}

.q-tab:hover .q-tab__content {
  color: #ffffff;
}

.q-tab__indicator {
  height: 3px;
}

.qr-container {
  text-align: center;
  max-width: 350px;
  width: 100%;
}
/*
.spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 250px;
} */

.url-container {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 15px;
  flex-wrap: wrap;
  gap: 10px;
}

.url-input {
  flex: 1;
  min-width: 200px;
}

.buttons-container {
  display: flex;
  gap: 10px;
  /* width: 100%; */
}
.anchoBotonesQR {
  width: 150px;
}
.doctor-info {
  width: 100%;
}

.table-responsive {
  width: 100%;
  overflow-x: auto;
}

/* .info-table {
  width: 100%;
  border-collapse: collapse;
} */

.info-table th,
.info-table td {
  padding: 12px 15px;
  text-align: left;
}

.info-table th {
  background-color: #1976d2;
  color: #ffffff;
  width: 20%;
}

.info-table tr:nth-child(even) {
  background-color: #f2f2f2;
}

.info-table tr:hover {
  background-color: #e6f7ff;
}

/* Responsividad */
@media (min-width: 600px) {
  .url-container {
    flex-wrap: nowrap;
    width: auto;
  }

  .url-input {
    margin-bottom: 0;
    min-width: 300px;
  }
}

.bg-green {
  background-color: #4caf50 !important;
}

.bg-red {
  background-color: #f44336 !important;
}

.q-item-section label {
  font-weight: bold;
  color: #555555;
}

.q-item-section q-item-label:last-child {
  color: #333333;
}

.menu-container {
  background: #f8f9fa;
  border-radius: 8px;
  height: 86vh;
  width: 200px;
}

.vertical-tabs .nav-link {
  font-size: 14px;
  padding: 10px;
  margin-bottom: 5px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.vertical-tabs .nav-link.active {
  background: #e74c3c;
  color: #fff;
}

.content-container {
  padding: 20px;
}

.form-container {
  border-radius: 8px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
}

.header {
  border-radius: 8px 8px 0 0;
}

.custom-data-grid {
  height: 250px;
  width: 100%;
  /* margin-top: 10px; */
}

.hsize {
  height: 600px;
  position: relative;
  top: -10px;
}

.q-btn {
  width: 100%;
}

.widthModalHorarios {
  width: 40%;
  height: auto;
  max-width: 1400px;
}

.row-horizontal {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}

.time-picker {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.time-picker label {
  margin-bottom: 4px;
  font-weight: bold;
}

.time-picker input[type="time"] {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
}

.horarios-container {
  margin-top: 10px;
}

.horarios-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.horarios-header h6 {
  font-size: 18px;
  color: #2c3e50;
}

.horarios-header .q-btn {
  min-width: 150px;
}

@media (max-width: 768px) {
  .row-horizontal {
    flex-direction: column;
    gap: 10px;
  }
  .time-picker input[type="time"] {
    width: 100%;
  }
  .horarios-header {
    flex-direction: column;
    align-items: flex-start;
  }
  .horarios-header .q-btn {
    width: 100%;
    margin-top: 10px;
  }
  .custom-data-grid {
    min-height: 400px;
  }
}

.required {
  color: red;
  margin-left: 4px;
}

.text-h6 {
  font-size: 1.25rem;
}
</style>
