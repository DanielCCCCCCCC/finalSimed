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

        <!-- Estructura "Static Pills" -->
        <div class="col-xl-6">
          <div class="custom-card">
            <div class="card-body">
              <ul class="nav nav-pills">
                <!-- Pestaña 1 -->
                <li class="nav-item">
                  <a
                    class="nav-link"
                    :class="{ active: tab === 'info' }"
                    href="javascript:void(0);"
                    @click="tab = 'info'"
                  >
                    Información del médico
                  </a>
                </li>
                <!-- Pestaña 2 -->
                <li class="nav-item">
                  <a
                    class="nav-link"
                    :class="{ active: tab === 'qr' }"
                    href="javascript:void(0);"
                    @click="tab = 'qr'"
                  >
                    Código QR
                  </a>
                </li>
                <!-- Pestaña 3 -->
                <li class="nav-item">
                  <a
                    class="nav-link"
                    :class="{ active: tab === 'configuraciones' }"
                    href="javascript:void(0);"
                    @click="tab = 'configuraciones'"
                  >
                    Configuraciones del perfil
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- Contenido de las Pestañas -->
      <q-card class="custom-card main-content-body-profile">
        <!-- Tab INFO -->
        <div v-show="tab === 'info'">
          <q-card-section class="doctor-info">
            <h4 class="fs-15 text-uppercase mb-3">Información del Médico</h4>
            <div v-if="loading">
              <q-spinner size="50px" color="primary" />
              <p>Cargando información del médico...</p>
            </div>
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
                    <q-item-label>{{ users[0]?.nombreCompleto }}</q-item-label>
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
        </div>

        <!-- Tab QR -->
        <div v-show="tab === 'qr'">
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
        </div>

        <!-- Tab CONFIGURACIONES -->
        <div v-show="tab === 'configuraciones'">
          <div class="borderBton">
            <q-card-section>
              <div class="horarios-container">
                <div class="horarios-header">
                  <h4 class="fs-15 text-uppercase mb-3">
                    Horarios de Atención
                  </h4>
                  <q-btn
                    label="Agregar Horario"
                    color="primary"
                    icon="add"
                    @click="abrirModalcrearConfiguraciones()"
                    flat
                  />
                </div>

                <!-- DataGrid con eventos @editingStart y @rowRemoving -->
                <DxDataGrid
                  :data-source="horariosAtencion"
                  keyExpr="ConfiguracionesId"
                  show-borders
                  @editingStart="onEditingStart"
                  @rowRemoving="onRowRemoving"
                  width="96%"
                >
                  <!-- Config Edición/Eliminación -->
                  <DxEditing
                    :allow-updating="true"
                    :allow-deleting="true"
                    mode="row"
                  />

                  <DxColumn dataField="hora_inicio" caption="Hora de Inicio" />
                  <DxColumn dataField="hora_fin" caption="Hora de Fin" />
                  <DxColumn
                    dataField="intervalo_min"
                    caption="Intervalo (min)"
                  />

                  <!-- Botones de editar y eliminar -->
                  <DxColumn type="buttons" :width="100">
                    <DxButton name="edit" icon="edit" />
                    <DxButton name="delete" icon="trash" />
                  </DxColumn>
                </DxDataGrid>
              </div>
            </q-card-section>
          </div>

          <div class="borderBton">
            <q-card-section>
              <div class="horarios-container">
                <span class="checkbox-label">Subir foto de perfil médico</span>
                <i
                  class="fas fa-upload checkRight upload-icon"
                  @click="subirFoto"
                  title="Subir foto"
                ></i>
              </div>
            </q-card-section>
          </div>
          <div class="borderBton">
            <q-card-section>
              <div class="horarios-container">
                <span class="checkbox-label"
                  >Permitir superposición de Auto-citas</span
                >
                <input
                  type="checkbox"
                  class="checkRight"
                  v-model="permitirSuperposicion"
                />
              </div>
            </q-card-section>
          </div>
          <!-- Modal: Editar/Crear Horario -->
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
                    esEditar ? actualizarHorario() : crearConfiguraciones()
                  "
                >
                  <div class="q-gutter-md">
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
                  @click="
                    esEditar ? actualizarHorario() : crearConfiguraciones()
                  "
                />
              </q-card-actions>
            </q-card>
          </q-dialog>
        </div>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, watch, reactive } from "vue";
import QRCode from "qrcode";
import { useAuthStore } from "../stores/auth";
import { useCrearUsuariosStore } from "../stores/crearUsuarios";
import { useQuasar, Notify } from "quasar";
import { storeToRefs } from "pinia";

import {
  DxDataGrid,
  DxEditing,
  DxColumn,
  DxButton,
  // ... (otros componentes de devextreme-vue/data-grid si los necesitas)
} from "devextreme-vue/data-grid";

import { supabase } from "../supabaseClient";

// Store
const crearUsuariosStore = useCrearUsuariosStore();
const { users, loading, error, horariosAtencion, permitirSuperposicion } =
  storeToRefs(crearUsuariosStore);

// Quasar
const $q = useQuasar();

// Pestaña activa
const tab = ref("info");

// Auth
const authStore = useAuthStore();
const organizationId = ref(authStore.tenant_id || "defaultOrgId");
const doctorId = ref(authStore.userId || "defaultDoctorId");
const { tenant_id } = storeToRefs(authStore);

// QR
const qrCodeUrl = ref("");
const loadingQR = ref(true);
const errorMsgQR = ref("");
const copySuccess = ref(false);
const fullUrl = ref("");

// Formulario del Horario
const formHorario = reactive({
  ConfiguracionesId: null,
  dia_semana: "",
  hora_inicio: "",
  hora_fin: "",
  intervalo_min: 15,
  autoSuperPosicion: false,
});
const esEditar = ref(false);
const abrirModalHorario = ref(false);

// Generar QR
async function generateQRCode() {
  try {
    const baseUrl =
      import.meta.env.VITE_BASE_URL || "http://localhost:9000/schedule";
    fullUrl.value = `${baseUrl}/${organizationId.value}/${doctorId.value}`;

    qrCodeUrl.value = await QRCode.toDataURL(fullUrl.value, {
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

// Copiar URL
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

/** Abrir Modal para Crear */
function abrirModalcrearConfiguraciones() {
  esEditar.value = false;
  formHorario.ConfiguracionesId = null;
  formHorario.hora_inicio = "";
  formHorario.hora_fin = "";
  formHorario.intervalo_min = 15;
  abrirModalHorario.value = true;
}

/** Cerrar Modal */
function cerrarModalHorario() {
  abrirModalHorario.value = false;
}

/** Crear */
async function crearConfiguraciones() {
  if (
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
    hora_inicio: formHorario.hora_inicio,
    hora_fin: formHorario.hora_fin,
    intervalo_min: formHorario.intervalo_min,
    autoSuperPosicion: false,
    tenant_id: tenant_id.value,
  };

  try {
    await crearUsuariosStore.crearConfiguraciones(nuevoHorario);
    cerrarModalHorario();
    await crearUsuariosStore.cargarConfiguraciones(tenant_id.value);
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
}

/** Actualizar */
async function actualizarHorario() {
  if (
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
    hora_inicio: formHorario.hora_inicio,
    hora_fin: formHorario.hora_fin,
    intervalo_min: formHorario.intervalo_min,
    autoSuperPosicion: formHorario.autoSuperPosicion,
    tenant_id: tenant_id.value,
  };

  try {
    console.log("EL id del horario es: ", formHorario.ConfiguracionesId);
    await crearUsuariosStore.actualizarConfiguraciones(
      formHorario.ConfiguracionesId,
      horarioActualizado
    );
    cerrarModalHorario();
    await crearUsuariosStore.cargarConfiguraciones(tenant_id.value);
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
}

/**
 * Evento: Editar
 * - Se dispara cuando el DataGrid detecta que el usuario hace clic en "Editar"
 */
function onEditingStart(e) {
  // Cancelamos la edición nativa de DevExtreme
  e.cancel = true;

  // Llenamos nuestro formHorario con los datos del row
  esEditar.value = true;
  formHorario.ConfiguracionesId = e.data.ConfiguracionesId;
  formHorario.hora_inicio = e.data.hora_inicio;
  formHorario.hora_fin = e.data.hora_fin;
  formHorario.intervalo_min = e.data.intervalo_min;
  formHorario.autoSuperPosicion = e.data.autoSuperPosicion || false;

  // Abrimos el modal para edición
  abrirModalHorario.value = true;
}

/**
 * Evento: Eliminar
 * - Se dispara cuando el DataGrid detecta que el usuario hace clic en "Eliminar"
 */
function onRowRemoving(e) {
  // Cancelamos la eliminación nativa de DevExtreme
  e.cancel = true;

  // Mostramos diálogo de confirmación con Quasar
  $q.dialog({
    title: "Confirmar",
    message: "¿Deseas eliminar este horario?",
    cancel: true,
    persistent: true,
  })
    .onOk(async () => {
      try {
        await crearUsuariosStore.eliminarConfiguraciones(e.data.id);
        await crearUsuariosStore.cargarConfiguraciones(tenant_id.value);
        $q.notify({
          type: "positive",
          message: "Horario de atención eliminado correctamente.",
        });
      } catch (error) {
        console.error("Error al eliminar horario:", error);
      }
    })
    .onCancel(() => {
      // Si el usuario cancela, no hacemos nada
      console.log("Eliminación cancelada.");
    });
}

// onMounted
onMounted(async () => {
  if (authStore.userId) {
    await crearUsuariosStore.cargarUsuarioPerfil();
    await crearUsuariosStore.cargarConfiguraciones();
    // Forzar leer valor de permitirSuperposicion
    await crearUsuariosStore.permitirSuperposicion;
    await generateQRCode();
    console.log("Nombre completo del médico: ", users.value[0]?.nombreCompleto);
  } else {
    console.warn("userId no disponible en authStore al montar el componente.");
  }
});

// Watch tenant_id
watch(
  () => authStore.tenant_id,
  (newOrg) => {
    organizationId.value = newOrg;
    generateQRCode();
  }
);

// Watch userId
watch(
  () => authStore.userId,
  async (newDoc) => {
    doctorId.value = newDoc;
    if (newDoc) {
      await crearUsuariosStore.cargarUsuarioPerfil();
      generateQRCode();
    }
  }
);
</script>

<style scoped>
/* ------------------------- Estilos Principales ------------------------- */
.profile-container {
  position: relative;
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

/* Estructura "Static Pills" (Bootstrap) */
.nav-pills .nav-link {
  border-radius: 0.25rem;
}

.nav-pills .nav-link.active {
  color: #fff;
  background-color: bg-prmary; /* Azul estilo Bootstrap */
}

/* ------------------------- Contenidos QR ------------------------- */
.qr-container {
  text-align: center;
  max-width: 350px;
  width: 100%;
}

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
}

.anchoBotonesQR {
  width: 150px;
}

/* ------------------------- Banners Éxito/Error ------------------------- */
.bg-green {
  background-color: #4caf50 !important;
}
.bg-red {
  background-color: #f44336 !important;
}

/* ------------------------- Info del Doctor ------------------------- */
.doctor-info {
  width: 100%;
}

.table-responsive {
  width: 100%;
  overflow-x: auto;
}

/* ------------------------- Horarios ------------------------- */
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
  margin-bottom: 20px;
}

.horarios-header h6 {
  font-size: 18px;
  color: #2c3e50;
}

.horarios-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

.horarios-table th,
.horarios-table td {
  border: 1px solid #f5f2f2;
  padding: 8px;
  text-align: center;
}
.upload-icon {
  font-size: 24px;
  color: #007bff;
  cursor: pointer;
  margin-left: 10px;
}

.upload-icon:hover {
  color: #0056b3;
}

.horarios-table th {
  background-color: #f2f2f2;
  font-weight: bold;
}

.horarios-table tr:nth-child(even) {
  background-color: #f9f9f9;
}

.horarios-table tr:hover {
  background-color: #ddd;
}

.horarios-table button {
  margin: 0 4px;
  padding: 4px 8px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.horarios-table button:first-of-type {
  background-color: #1976d2;
  color: white;
}

.horarios-table button:last-of-type {
  background-color: #d32f2f;
  color: white;
}

/* ------------------------- Checkboxes y Superposición ------------------------- */
.checkbox-label {
  font-size: 16px;
  color: #333;
}
.checkRight {
  position: relative;
  left: -7%;
  float: right;
}
.borderBton {
  border-bottom: 1px solid #e2dbdb;
  /* height: 120%; */
  margin-top: 10px;
  padding-bottom: 15px;
}

/* ------------------------- Layout y Form ------------------------- */
.form-container {
  border-radius: 8px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
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

/* ------------------------- Responsividad ------------------------- */
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
}
</style>
