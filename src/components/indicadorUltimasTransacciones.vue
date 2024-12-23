<template>
  <div class="custom-card card-dashboard-calendar">
    <label class="main-content-label mb-2 center title"
      >CITAS PROGRAMADAS</label
    >
    <span class="fs-12 mt-1 text-muted title">
      Resumen de citas agendadas y su estatus
    </span>
    <div>
      <table class="table m-b-0 transcations mt-2">
        <tbody>
          <tr v-for="(appointment, index) in appointments" :key="index">
            <td class="wd-5p">
              <div class="main-img-user avatar-md">
                <q-avatar
                  rounded
                  :color="appointment.avatarColor"
                  class="rounded-circle me-3"
                  text-color="white"
                >
                  <q-icon class="icon" :name="appointment.icon" />
                </q-avatar>
              </div>
            </td>
            <td>
              <div class="d-flex align-middle ms-3">
                <div class="d-inline-block">
                  <h6 class="mb-1">{{ appointment.title }}</h6>
                  <p class="mb-0 fs-13 text-muted">
                    {{ appointment.description }}
                  </p>
                </div>
              </div>
            </td>
            <td class="text-end">
              <div class="d-inline-block">
                <h6
                  class="mb-2 fs-15 fw-semibold"
                  :class="{
                    'text-success': appointment.status === 'positive',
                    'text-danger': appointment.status === 'negative',
                  }"
                >
                  {{ appointment.value }}
                  <i
                    :class="[
                      appointment.statusIcon,
                      'ms-2',
                      appointment.status === 'positive'
                        ? 'text-success'
                        : 'text-danger',
                      'm-l-10',
                    ]"
                  ></i>
                </h6>
                <p class="mb-0 text-muted">{{ appointment.date }}</p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { QAvatar, QIcon } from "quasar";

const appointments = ref([
  {
    title: "Cita con el Dr. Pérez",
    description: "Consulta de seguimiento",
    avatarColor: "primary",
    icon: "event",
    value: "$50.00",
    status: "positive",
    statusIcon: "fas fa-level-up-alt",
    date: "12 Dic 2023",
  },
  {
    title: "Cita cancelada",
    description: "Paciente: Juan García",
    avatarColor: "secondary",
    icon: "event_busy",
    value: "Cancelada",
    status: "negative",
    statusIcon: "fas fa-level-down-alt",
    date: "10 Dic 2023",
  },
  {
    title: "Cita de urgencias",
    description: "Paciente: María López",
    avatarColor: "accent",
    icon: "local_hospital",
    value: "$75.00",
    status: "positive",
    statusIcon: "fas fa-level-up-alt",
    date: "09 Dic 2023",
  },
]);
</script>
<style scoped>
.card {
  display: flex;
  justify-content: center; /* Centra horizontalmente */
  align-items: center; /* Centra verticalmente */
  height: 100%; /* Asegura que ocupe toda la altura del contenedor */
  position: relative;
  top: 10px;
  border: none;
}
.title {
  position: relative;
  top: 10px;
  display: flex;
  justify-content: center; /* Centra horizontalmente */
}
.icon {
  position: relative;
  left: 100px;
}
</style>
