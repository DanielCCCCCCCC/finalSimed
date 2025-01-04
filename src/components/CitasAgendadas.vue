<template>
  <div>
    <h3 class="main-content-label mb-2 center title">Tendencia de Citas</h3>
    <span class="d-block fs-12 mt-4 text-muted"
      >Citas por Semana (Mes Actual)</span
    >
  </div>
  <div class="card-body p-1">
    <div v-if="appointmentsTrend && appointmentsTrend.length > 0">
      <ApexCharts
        type="area"
        :options="chartOptions"
        :series="series"
        class="apex-chart"
        width="790"
        height="300"
      />
    </div>
    <div v-else>
      <p>No hay citas para mostrar.</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed } from "vue";
import { useAppointmentsStore } from "../stores/AppointmentsStore";
import ApexCharts from "vue3-apexcharts";

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
  colors: ["#df5a5a"],
  title: {
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
  top: 20px;
  display: flex;
  justify-content: center;
}
</style>
