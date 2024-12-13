<template>
  <div>
    <h3 class="main-content-label mb-2 center title">Tendencia de Citas</h3>
    <span class="d-block fs-12 mt-1 text-muted"
      >Citas por Semana (Mes Actual)</span
    >
  </div>
  <div class="card-body p-4 card">
    <ApexCharts
      v-if="appointmentsTrend.length > 0"
      type="area"
      :options="chartOptions"
      :series="series"
      class="apex-chart"
      width="710"
      height="280"
    />
  </div>
</template>

<script setup>
import { onMounted, computed } from "vue";
import { useAppointmentsStore } from "../stores/AppointmentsStore";
import ApexCharts from "vue3-apexcharts";
import { projectOptions } from "../dahboardData";

const store = useAppointmentsStore();

onMounted(async () => {
  await store.fetchAppointments();
});

const appointmentsTrend = computed(() => store.appointmentsTrend);

const series = computed(() => [
  {
    name: "Citas",
    data: appointmentsTrend.value.map((item) => item.count),
  },
]);

const chartOptions = computed(() => ({
  chart: {
    type: "area",
    toolbar: {
      show: false,
    },
    zoom: {
      enabled: false,
    },
    animations: {
      enabled: true,
      easing: "easeinout",
      speed: 800,
    },
  },
  xaxis: {
    categories: appointmentsTrend.value.map((item) => item.period),
    title: {
      text: "Semana",
      style: {
        fontWeight: "bold",
      },
    },
    labels: {
      style: {
        fontSize: "12px",
      },
    },
  },
  yaxis: {
    title: {
      text: "Número de Citas",
      style: {
        fontWeight: "bold",
      },
    },
    labels: {
      style: {
        fontSize: "12px",
      },
    },
  },
  dataLabels: {
    enabled: true,
    formatter: (val) => `${val} citas`,
    style: {
      fontSize: "12px",
    },
  },
  colors: projectOptions.colors,
  title: {
    // text: "Tendencia de Citas por Semana (Mes Actual)",
    align: "left",
    style: {
      fontWeight: "bold",
      fontSize: "16px",
    },
  },
  tooltip: {
    x: {
      format: "dd/MM/yy",
    },
  },
}));
</script>

<style scoped>
.apex-chart {
  width: 100%;
  height: 280px;
}
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
</style>
