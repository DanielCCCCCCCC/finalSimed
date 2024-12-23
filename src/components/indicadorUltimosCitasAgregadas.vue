<template>
  <div class="card title custom-card">
    <label class="main-content-label mb-1 pt-1">CITAS PROGRAMADAS</label>
    <span class="d-block fs-12 mb-1 text-muted">Últimas 5 citas agregadas</span>
  </div>

  <div class="subir">
    <q-list dense bordered class="citas-list">
      <q-item
        v-for="(appointment, index) in mappedAppointments"
        :key="index"
        clickable
        class="custom-card"
      >
        <q-item-section avatar>
          <q-avatar
            rounded
            color="primary"
            text-color="white"
            class="rounded-circle center"
          >
            <q-icon name="event" />
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label class="fs-13 fw-semibold">
            {{ appointment.tipoCita }}
          </q-item-label>
          <q-item-label caption class="text-muted fs-12">
            Paciente: {{ appointment.nombre }}<br />
            Médico: {{ appointment.medico }}
          </q-item-label>
        </q-item-section>

        <q-item-section side class="text-end separarderecho">
          <q-item-label class="fs-15 fw-semibold">
            {{ formatDate(appointment.startDate) }}
          </q-item-label>
          <q-item-label caption class="text-muted fs-12">
            Fecha de cita
          </q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useAppointmentsStore } from "../stores/AppointmentsStore";
import { useMedicoStore } from "../stores/MedicoStores";
import { useFichaIdentificacionStore } from "../stores/fichaIdentificacionStores";
import { useTiposCitasStore } from "../stores/ConfiMedicasStores";

import { QAvatar, QIcon, QList, QItem, QItemSection, QItemLabel } from "quasar";

const AppointmentsStore = useAppointmentsStore();
const MedicoStore = useMedicoStore();
const FichaIdentificacionStore = useFichaIdentificacionStore();
const TiposCitasStore = useTiposCitasStore();

onMounted(() => {
  AppointmentsStore.fetchAppointments();
  MedicoStore.cargarMedicos();
  FichaIdentificacionStore.cargarDatos();
  TiposCitasStore.cargarCitas();
});

const getCita = (id) => {
  const tipoCita = TiposCitasStore.citas.find((p) => p.id == id);
  return tipoCita ? tipoCita.descripcion : "Desconocido";
};

const getPacienteName = (id) => {
  const paciente = FichaIdentificacionStore.formIdentificacion.find(
    (p) => p.id == id
  );
  return paciente ? `${paciente.nombres} ${paciente.apellidos}` : "Desconocido";
};

const getMedicoName = (id) => {
  const medico = MedicoStore.medicos.find((m) => m.id == id);
  return medico ? medico.nombre : "Desconocido";
};

const lastTenAppointments = computed(() => {
  const sortedAsc = [...AppointmentsStore.appointments].sort((a, b) => {
    const dateA = new Date(a.startDate);
    const dateB = new Date(b.startDate);

    if (isNaN(dateA) && isNaN(dateB)) return 0;
    if (isNaN(dateA)) return -1;
    if (isNaN(dateB)) return 1;

    return dateA - dateB;
  });

  return sortedAsc.slice(sortedAsc.length > 5 ? -5 : 0);
});

const mappedAppointments = computed(() => {
  return lastTenAppointments.value.map((appointment) => ({
    ...appointment,
    tipoCita: getCita(appointment.tipoCita),
    nombre: getPacienteName(appointment.nombre),
    medico: getMedicoName(appointment.medico),
  }));
});

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  if (isNaN(date)) return "Fecha Inválida";
  return date.toLocaleDateString();
};

console.log("Sorted Ascending Appointments:", lastTenAppointments.value);
console.log("Mapped Appointments:", mappedAppointments.value);
</script>

<style scoped>
.card-dashboard-calendar {
  box-shadow: 0 2px 10px #0000001a;
  border-radius: 8px;
}

.card-header {
  border-bottom: 1px solid #ffffff;
  padding: 15px;
  background-color: #f8f9fa;
  border: none;
}

.citas-list {
  background-color: white;
}

.cita-item {
  padding: 10px 15px;
}

.cita-item:last-child {
  border-bottom: none;
}

.q-avatar {
  width: 40px;
  height: 40px;
}
.center {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 36px;
  width: 36px;
  margin-bottom: 10px;
  margin-top: 5px;
}
.q-icon {
  font-size: 20px;
}
.separarderecho {
  position: relative;
  margin-left: -15px;
}
.subir {
  position: relative;
  top: -15px;
}
.card {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  position: relative;
  top: 10px;
  border: none;
}
.title {
  position: relative;

  display: flex;
  justify-content: center;
}
</style>
