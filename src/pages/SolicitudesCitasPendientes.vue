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
<!--
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

      <q-table
        :rows="filteredAppointments"
        :columns="columns"
        row-key="id"
        :pagination.sync="pagination"
        :loading="loading"
        :rows-per-page-options="[5, 10, 15, 20]"
        flat
        bordered
        square
      >
        <template v-slot:top>
          <div class="q-pa-sm">
            <q-input
              filled
              debounce="300"
              v-model="filter"
              placeholder="Buscar..."
              prepend-icon="search"
            />
          </div>
        </template>

        <template v-slot:body-cell-actions="props">
          <q-td :props="props">
            <q-btn
              flat
              icon="check"
              color="positive"
              round
              dense
              class="q-mr-sm"
              @click="acceptAppointmentAndRefresh(props.row.id)"
              tooltip="Aceptar"
            />
            <q-btn
              flat
              icon="delete"
              color="negative"
              round
              dense
              @click="rejectAppointmentAndRefresh(props.row.id)"
              tooltip="Rechazar"
            />
          </q-td>
        </template>

        <template v-slot:loading>
          <q-tr>
            <q-td colspan="100%">
              <div class="q-pa-md flex flex-center">
                <q-spinner-dots color="primary" size="50px" />
              </div>
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useQuasar } from "quasar";
import { storeToRefs } from "pinia";
import { useAppointmentsStore } from "../stores/AppointmentsStore";
const $q = useQuasar();
const appointmentsStore = useAppointmentsStore();

const { appointments, loading, error } = storeToRefs(appointmentsStore);

const filter = ref("");

const pagination = ref({
  page: 1,
  rowsPerPage: 10,
});

const columns = [
  {
    name: "id",
    required: true,
    label: "ID Cita",
    align: "left",
    field: "id",
    sortable: true,
    style: "min-width: 100px;",
  },
  {
    name: "title",
    label: "Título",
    align: "left",
    field: "title",
    sortable: true,
  },
  {
    name: "nombre",
    label: "Nombre Paciente",
    align: "left",
    field: "nombre",
    sortable: true,
  },
  {
    name: "startDate",
    label: "Fecha/Hora Inicio",
    align: "left",
    field: "startDate",
    sortable: true,
    format: (val) => new Date(val).toLocaleString(),
  },
  {
    name: "description",
    label: "Descripción",
    align: "left",
    field: "description",
    sortable: true,
  },
  {
    name: "patientphone",
    label: "Teléfono de Contacto",
    align: "left",
    field: "patientphone",
    sortable: true,
  },
  {
    name: "status",
    label: "Estado",
    align: "left",
    field: "status",
    sortable: true,
    style: "min-width: 120px;",
  },
  {
    name: "actions",
    label: "Acciones",
    align: "center",
    field: "actions",
    sortable: false,
  },
];

const pendingAppointments = computed(() => appointments.value);

const filteredAppointments = computed(() => {
  if (!filter.value) {
    return pendingAppointments.value;
  }
  const lowerFilter = filter.value.toLowerCase();

  return pendingAppointments.value.filter((appointment) => {
    return Object.keys(appointment).some((key) => {
      if (key === "actions") return false;
      const value = appointment[key];
      return String(value).toLowerCase().includes(lowerFilter);
    });
  });
});

onMounted(async () => {
  try {
    console.log("Cargando citas automáticas...");
    await appointmentsStore.fetchAutoAppointments();
    console.log("Citas automáticas cargadas:", appointments.value);
  } catch (err) {
    console.error("Error al cargar citas automáticas:", err);
    $q.notify({
      color: "negative",
      message: "Error al cargar citas automáticas.",
    });
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

.q-td .q-btn {
  margin-right: 5px;
}
</style> -->
