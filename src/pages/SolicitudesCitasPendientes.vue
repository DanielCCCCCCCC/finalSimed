<template>
  <div class="row justify-center espaciadoLateral q-py-md">
    <div id="app-container" class="q-mb-xl q-px-xl q-pa-xs">
      <div class="q-pb-md">
        <div class="row items-center">
          <div class="header-container">
            <h4 class="header-title">Solicitudes de Citas Automáticas</h4>
            <p class="parrafo">Citas agendadas automáticamente por pacientes</p>
          </div>
        </div>
      </div>

      <!-- DataGrid para mostrar citas automáticas -->
      <DxDataGrid
        :data-source="pendingAppointments"
        :row-alternation-enabled="true"
        :show-borders="true"
        key-expr="id"
        :column-auto-width="false"
        :column-min-width="50"
        :width="responsiveWidth"
      >
        <!-- Columna de Identificación (opcional) -->
        <DxColumn
          data-field="identificacion"
          caption="Identificación"
          :allow-sorting="true"
          width="150px"
        />

        <DxColumn
          data-field="id"
          caption="ID Cita"
          :allow-sorting="true"
          width="100px"
        />
        <DxColumn
          data-field="title"
          caption="Título"
          :allow-sorting="true"
          width="250px "
        />
        <DxColumn
          data-field="nombre"
          caption="Nombre Paciente (ID)"
          :allow-sorting="true"
          :calculate-cell-value="lookupPatientName"
        />
        <DxColumn
          data-field="startDate"
          caption="Fecha/Hora Inicio"
          :allow-sorting="true"
        />
        <DxColumn
          data-field="description"
          caption="Descripción"
          :allow-sorting="true"
          min-width="200"
          width="300"
        />
        <DxColumn
          data-field="patientphone"
          caption="Teléfono de Contacto"
          :allow-sorting="true"
        />
        <DxColumn
          data-field="status"
          caption="Estado"
          :allow-sorting="true"
          width="120px"
        />

        <!-- Columna de botones (Aceptar, Editar, Rechazar) -->
        <DxColumn type="buttons" width="180">
          <!-- Botón Aceptar -->
          <DxButton
            icon="check"
            hint="Aceptar"
            @click="(e) => acceptAppointmentAndRefresh(e.row.data.id)"
          />
          <!-- Botón Editar -->
          <DxButton
            icon="edit"
            hint="Editar"
            @click="(e) => openEditModal(e.row.data)"
          />
          <!-- Botón Rechazar -->
          <DxButton
            icon="delete"
            hint="Rechazar"
            class="q-mx-xs"
            @click="() => rejectAppointmentAndRefresh(data.id)"
          />
        </DxColumn>

        <DxPaging :enabled="true" :page-size="10" />
        <DxFilterRow :visible="true" />
        <DxHeaderFilter :visible="true" />
      </DxDataGrid>

      <!-- MODAL DE EDICIÓN DE LA CITA (HTML BÁSICO) -->
      <div class="modal-backdrop" v-if="showEditModal" @click.self="cancelEdit">
        <div class="modal-container">
          <h3>Editar Cita</h3>

          <!-- Campos en HTML básico -->

          <!-- 1. Asunto de la Cita (title) -->
          <label class="form-label" for="titleInput">Asunto de la Cita</label>
          <input
            id="titleInput"
            class="form-input"
            type="text"
            v-model="editingAppointment.title"
          />

          <!-- 2. Todo el día (allDay) -->
          <div class="checkbox-container">
            <input
              id="allDayCheck"
              class="form-checkbox"
              type="checkbox"
              v-model="editingAppointment.allDay"
            />
            <label class="checkbox-label" for="allDayCheck">Todo el día</label>
          </div>

          <!-- 3. Fecha/Hora Inicio -->
          <label class="form-label" for="startInput">Fecha/Hora Inicio</label>
          <input
            id="startInput"
            class="form-input"
            type="datetime-local"
            :disabled="editingAppointment.allDay"
            v-model="editingAppointment.startDate"
            @input="handleStartDateChange"
          />

          <!-- 4. Fecha/Hora Fin -->
          <label class="form-label" for="endInput">Fecha/Hora Fin</label>
          <input
            id="endInput"
            class="form-input"
            type="datetime-local"
            :disabled="editingAppointment.allDay"
            v-model="editingAppointment.endDate"
          />

          <!-- 5. Tipo de Cita (Select) -->
          <label class="form-label" for="tipoCitaSelect">Tipo de Cita</label>
          <select
            id="tipoCitaSelect"
            class="form-select"
            v-model="editingAppointment.tipoCita"
          >
            <option
              v-for="option in tipoCitaOptions"
              :key="option.id"
              :value="option.id"
            >
              {{ option.descripcion }}
            </option>
          </select>

          <!-- 6. Paciente (ID) -->
          <label class="form-label" for="pacienteInput">Paciente (ID)</label>
          <input
            id="pacienteInput"
            class="form-input"
            type="text"
            v-model="editingAppointment.nombre"
            readonly
          />
          <button class="btn-select" @click="openPatientModal">
            Seleccionar Paciente
          </button>

          <!-- 7. Médico (ID) -->
          <label class="form-label" for="medicoInput">Médico (ID)</label>
          <input
            id="medicoInput"
            class="form-input"
            type="text"
            v-model="editingAppointment.medico"
            readonly
          />
          <button class="btn-select" @click="openDoctorModal">
            Seleccionar Médico
          </button>

          <!-- 8. Descripción -->
          <label class="form-label" for="descriptionInput">Descripción</label>
          <textarea
            id="descriptionInput"
            class="form-textarea"
            v-model="editingAppointment.description"
          ></textarea>

          <!-- Botones de Acción -->
          <div class="modal-actions">
            <button class="btn-cancel" @click="cancelEdit">Cancelar</button>
            <button class="btn-save" @click="saveChanges">Guardar</button>
          </div>
        </div>
      </div>
      <!-- FIN MODAL -->
    </div>
  </div>
</template>

<script setup>
/* --- IMPORTS --- */
import { ref, onMounted, computed } from "vue";
import { storeToRefs } from "pinia";

// Importar DataGrid de DevExtreme
import {
  DxDataGrid,
  DxColumn,
  DxPaging,
  DxFilterRow,
  DxHeaderFilter,
  DxButton,
} from "devextreme-vue/data-grid";

// Store de citas
import { useAppointmentsStore } from "../stores/AppointmentsStore";
import { useTiposCitasStore } from "../stores/ConfiMedicasStores";
import { useFichaIdentificacionStore } from "../stores/fichaIdentificacionStores";
// Para notificaciones (opcional: si usas Quasar)
import { useQuasar } from "quasar";

/* --- SETUP --- */
const appointmentsStore = useAppointmentsStore();
const tiposCitasStore = useTiposCitasStore();
const fichaIdentificacionStore = useFichaIdentificacionStore();

const $q = useQuasar(); // si quieres notificar con Quasar

const { formIdentificacion } = storeToRefs(fichaIdentificacionStore);
const { getPatientNameById } = fichaIdentificacionStore;

const { citas } = storeToRefs(tiposCitasStore);
const { appointments } = storeToRefs(appointmentsStore);

/**
 * Filtra o muestra todas las citas automáticas.
 * Ajusta según tu caso (p.ej. si quieres solo las "Pendientes",
 * filtra appointments.value.filter(a => a.status === "Pendiente") ).
 */
const pendingAppointments = computed(() => {
  return appointments.value;
});

// Ancho responsivo para el DataGrid
const responsiveWidth = ref(1600);

/* --- ESTADOS PARA EDITAR CITA --- */
const showEditModal = ref(false);

const editingAppointment = ref({
  id: null,
  title: "",
  description: "",
  allDay: false,
  startDate: "",
  endDate: "",
  tipoCita: null,
  nombre: null, // Paciente
  medico: null, // Médico
});

// Opciones para tipo de cita (ahora dinámicas)
const tipoCitaOptions = computed(() => citas.value);

// Opciones para tipo de cita
// const tipoCitaOptions = ref([
//   { id: 1, descripcion: "Primera vez" },
//   { id: 2, descripcion: "Seguimiento" },
//   { id: 3, descripcion: "Consulta" },
// ]);

// Al montar, cargar las citas automáticas
onMounted(async () => {
  try {
    console.log("Cargando citas automáticas...");
    await appointmentsStore.fetchAutoAppointments();
    await tiposCitasStore.cargarCitas();
    await fichaIdentificacionStore.cargarDatos();
    console.log(
      "PACIENTES DESDE Solicitudes de citas pacientes: ",
      formIdentificacion.value
    );
    console.log("Citas automáticas cargadas:", appointments.value);
  } catch (err) {
    console.error("Error al cargar citas automáticas:", err);
    if ($q) {
      $q.notify({ color: "negative", message: "Error al cargar citas." });
    }
  }
});
// Función local para la columna "nombre"
function lookupPatientName(rowData) {
  if (!rowData || !rowData.nombre) return "";
  // rowData.nombre = ID del paciente (almacenado en la DB)
  return getPatientNameById(rowData.nombre);
}
/* --- MÉTODOS: Aceptar / Rechazar / Editar / Guardar Cita --- */
async function acceptAppointmentAndRefresh(appointmentId) {
  try {
    await appointmentsStore.acceptAppointment(appointmentId);
    await appointmentsStore.fetchAutoAppointments();
    if ($q) {
      $q.notify({ color: "positive", message: "Cita aceptada." });
    }
  } catch (err) {
    if ($q) {
      $q.notify({
        color: "negative",
        message: err.message || "Error al aceptar",
      });
    }
  }
}

async function rejectAppointmentAndRefresh(appointmentId) {
  try {
    await appointmentsStore.rejectAppointment(appointmentId);
    await appointmentsStore.fetchAutoAppointments();
    if ($q) {
      $q.notify({ color: "warning", message: "Cita rechazada." });
    }
  } catch (err) {
    if ($q) {
      $q.notify({
        color: "negative",
        message: err.message || "Error al rechazar",
      });
    }
  }
}

// Abrir modal y cargar datos de la cita en editingAppointment
function openEditModal(appointmentData) {
  editingAppointment.value = { ...appointmentData };

  // Si 'startDate' y 'endDate' vienen como Date en vez de string,
  // podrías formatearlos a "YYYY-MM-DDTHH:mm"
  // p.ej. editingAppointment.value.startDate = formatDate(appointmentData.startDate);

  showEditModal.value = true;
}

// Guardar cambios
async function saveChanges() {
  try {
    const { id, ...updates } = editingAppointment.value;

    // Si manejas las fechas como strings con "datetime-local" en HTML,
    // y en la BD se guardan como Date, conviértelas aquí si hace falta:
    // updates.startDate = new Date(updates.startDate);
    // updates.endDate = new Date(updates.endDate);

    await appointmentsStore.updateAppointment(id, updates);

    if ($q) {
      $q.notify({ color: "positive", message: "Cita actualizada con éxito." });
    }
  } catch (err) {
    if ($q) {
      $q.notify({
        color: "negative",
        message: err.message || "Error al actualizar la cita.",
      });
    }
  } finally {
    // Cerrar modal y refrescar
    showEditModal.value = false;
    await appointmentsStore.fetchAutoAppointments();
  }
}

// Cancelar edición (cerrar modal)
function cancelEdit() {
  showEditModal.value = false;
}

/* --- OPCIONALES: Seleccionar Paciente / Médico --- */
function openPatientModal() {
  // Aquí podrías abrir un segundo modal con un DataGrid de pacientes
  // y al seleccionar, set editingAppointment.value.nombre = selectedPatientId
  if ($q) {
    $q.notify({
      color: "info",
      message: "Abrir modal para seleccionar Paciente",
    });
  }
}

function openDoctorModal() {
  // Aquí podrías abrir un segundo modal con un DataGrid de médicos
  // y al seleccionar, set editingAppointment.value.medico = selectedDoctorId
  if ($q) {
    $q.notify({
      color: "info",
      message: "Abrir modal para seleccionar Médico",
    });
  }
}

/** Manejo de la fecha/hora inicio (opcional) */
function handleStartDateChange(value) {
  // 'value' es un string "2025-01-31T10:00"
  editingAppointment.value.startDate = value;
}
</script>

<style scoped>
/* CONTENEDOR PRINCIPAL */
#app-container {
  padding: 20px;
  background-color: #f9f9f9;
  margin: 0 20px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 93%;
}

.espaciadoLateral {
  margin-left: 70px;
}

/* ENCABEZADO */
.header-container {
  margin-bottom: 10px;
}
.header-title {
  font-size: 1.25rem;
  margin: 0;
}
.parrafo {
  margin: 0;
  color: #666;
}

/* MODAL (HTML BÁSICO) */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.modal-container {
  background-color: #ffffff;
  padding: 20px;
  border-radius: 8px;
  width: 600px;
  max-width: 90%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  position: relative;
}

.modal-container h3 {
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 1.25rem;
}

/* Etiquetas e inputs */
.form-label {
  display: block;
  font-weight: 600;
  margin-bottom: 6px;
  margin-top: 16px;
  color: #333;
}
.form-input {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
  border-radius: 4px;
  border: 1px solid #ccc;
}

.form-select {
  width: 100%;
  padding: 8px;
  border-radius: 4px;
  margin-bottom: 8px;
  border: 1px solid #ccc;
}

.form-textarea {
  width: 100%;
  min-height: 80px;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
  box-sizing: border-box;
}

.checkbox-container {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}
.form-checkbox {
  margin-right: 8px;
}
.checkbox-label {
  font-weight: 500;
}

/* Botones en el modal */
.btn-select {
  background-color: #2196f3;
  color: #fff;
  border: none;
  margin-bottom: 8px;
  cursor: pointer;
  padding: 8px 14px;
  border-radius: 4px;
}
.btn-select:hover {
  background-color: #1976d2;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
  gap: 12px;
}

.btn-cancel,
.btn-save {
  border: none;
  padding: 8px 14px;
  border-radius: 4px;
  cursor: pointer;
}

.btn-cancel {
  background-color: #999;
  color: #fff;
}
.btn-cancel:hover {
  background-color: #777;
}

.btn-save {
  background-color: #4caf50;
  color: #fff;
}
.btn-save:hover {
  background-color: #43a047;
}
</style>
