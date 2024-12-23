<template>
  <div class="card custom-card">
    <!-- Mostrar mensaje de carga si está cargando -->
    <div v-if="cargando" class="card-body">
      <p class="text-center">Cargando...</p>
    </div>

    <!-- Contenido principal de la tarjeta cuando ya no está cargando -->
    <div
      v-else
      class="card-body d-flex align-items-center w-100 justify-content-between"
    >
      <!-- Sección de texto -->
      <div class="title">
        <label class="main-content-label mb-1 pt-1"
          >TOTAL CITAS AGENDADAS</label
        >
        <span class="d-block fs-12 mb-2 text-muted"
          >Mes anterior vs fecha actual</span
        >

        <p class="mb-0 fs-24 mt-2">
          <b
            :class="{
              'text-primary': diffPercentage >= 0,
              'text-danger': diffPercentage < 0,
            }"
          >
            {{ currentMonthCount }}
          </b>
        </p>

        <a
          href="#"
          :class="{
            'text-success': diffPercentage >= 0,
            'text-danger': diffPercentage < 0,
          }"
          class="d-block fs-14 fw-semibold"
        >
          {{ formatPorcentaje(diffPercentage) }}
          {{ diffPercentage >= 0 ? "Mayor" : "Menor" }}
        </a>

        <span class="fs-12 text-muted">Actualmente</span>
      </div>

      <!-- Sección del icono -->
      <q-icon
        name="event_note"
        size="36px"
        class="rounded-circle bg-light text-danger d-inline-block title"
      />
    </div>
  </div>
</template>
<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { useAppointmentsStore } from "../stores/AppointmentsStore";

const store = useAppointmentsStore();
const cargando = ref(true);

onMounted(async () => {
  await store.fetchAppointments();
  cargando.value = false;
});

const monthlyStats = computed(() => store.calculateMonthlyStats());

watch(monthlyStats, (newVal) => {
  console.log("Monthly stats changed:", newVal);
});

const currentMonthCount = computed(() => monthlyStats.value.currentMonthCount);
const prevMonthCount = computed(() => monthlyStats.value.prevMonthCount);
const diffPercentage = computed(() => monthlyStats.value.diffPercentage);

const formatPorcentaje = (value) => {
  return `${Math.abs(value).toFixed(1)}%`;
};
</script>
<style scoped>
.card {
  border: none; /* Elimina todos los bordes */
  height: 46%; /* Mantiene la altura al 50% */
  border-bottom: 10px solid #ff000087; /* Solo el borde inferior, con un ancho de 10px y color negro */
}

.title {
  position: relative;
  top: -20px;
}

/* Opcional: Ajustes adicionales para el icono */
.q-icon {
  /* Asegura que el icono mantenga el tamaño y estilo deseado */
  width: 36px;
  height: 36px;
}
</style>
