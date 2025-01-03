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

      <DxDataGrid
        :data-source="pendingAppointments"
        :row-alternation-enabled="true"
        :show-borders="true"
        key-expr="id"
        :column-auto-width="false"
        :column-min-width="50"
        :width="responsiveWidth"
      >
        <!-- Nueva Columna para Identificación -->
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
        <DxColumn data-field="title" caption="Título" :allow-sorting="true" />
        <DxColumn
          data-field="nombre"
          caption="Nombre Paciente"
          :allow-sorting="true"
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
          width="500"
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

        <DxColumn type="buttons" width="120">
          <DxButton
            icon="check"
            hint="Aceptar"
            @click="(e) => acceptAppointmentAndRefresh(e.row.data.id)"
          />
          <DxButton
            icon="trash"
            hint="Rechazar"
            @click="(e) => rejectAppointmentAndRefresh(e.row.data.id)"
          />
        </DxColumn>

        <DxPaging :enabled="true" :page-size="10" />
        <DxFilterRow :visible="true" />
        <DxHeaderFilter :visible="true" />
      </DxDataGrid>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import {
  DxDataGrid,
  DxColumn,
  DxPaging,
  DxFilterRow,
  DxHeaderFilter,
  DxButton,
} from "devextreme-vue/data-grid";
import { useQuasar } from "quasar";
import { storeToRefs } from "pinia";
import { useAppointmentsStore } from "../stores/AppointmentsStore";

const $q = useQuasar();
const appointmentsStore = useAppointmentsStore();

const { appointments, loading, error } = storeToRefs(appointmentsStore);

const pendingAppointments = computed(() => appointments.value);

const responsiveWidth = ref(1690);

onMounted(async () => {
  try {
    console.log("Cargando citas automáticas...");
    await appointmentsStore.fetchAutoAppointments();
    console.log("Citas automáticas cargadas:", appointments.value);
  } catch (err) {
    console.error("Error al cargar citas automáticas:", err);
  }
});

async function acceptAppointmentAndRefresh(appointmentId) {
  try {
    await appointmentsStore.acceptAppointment(appointmentId);
    await appointmentsStore.fetchAutoAppointments();
    $q.notify({ color: "positive", message: "Cita aceptada." });
  } catch (err) {
    $q.notify({
      color: "negative",
      message: err.message || "Error al aceptar",
    });
  }
}

async function rejectAppointmentAndRefresh(appointmentId) {
  try {
    await appointmentsStore.rejectAppointment(appointmentId);
    await appointmentsStore.fetchAutoAppointments();
    $q.notify({ color: "warning", message: "Cita rechazada." });
  } catch (err) {
    $q.notify({
      color: "negative",
      message: err.message || "Error al rechazar",
    });
  }
}
</script>

<style scoped>
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
</style>
