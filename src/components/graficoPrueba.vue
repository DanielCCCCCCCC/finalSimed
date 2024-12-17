<template>
  <div class="card custom-card">
    <!-- Título del gráfico -->
    <div class="card-header">
      <div class="card-title">Tendencia de Citas por Semana</div>
    </div>

    <!-- Gráfico de ApexCharts -->
    <div class="card-body">
      <ApexCharts
        height="210"
        type="area"
        :options="splineChartOptions"
        :series="splineSeries"
      ></ApexCharts>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useAppointmentsStore } from "../stores/AppointmentsStore"; // Importar tu store
import ApexCharts from "vue3-apexcharts";

// Store
const appointmentsStore = useAppointmentsStore();

// Llamada inicial para obtener citas
onMounted(() => {
  appointmentsStore.fetchAppointments(); // Cargar citas al montar el componente
});

// Series: Datos del gráfico
const splineSeries = computed(() => [
  {
    name: "Citas Agendadas",
    data: appointmentsStore.appointmentsTrend.map((item) => item.count),
  },
]);

// Opciones del gráfico
const splineChartOptions = {
  chart: {
    type: "area",
    height: 350,
    zoom: {
      enabled: false,
    },
    toolbar: {
      show: false,
    },
  },
  colors: ["#df0f9d"], // Color principal del área
  dataLabels: {
    enabled: false, // Deshabilitar etiquetas sobre el área
  },
  stroke: {
    curve: "smooth", // Hace que el área tenga una curva suave
  },
  xaxis: {
    categories: appointmentsStore.appointmentsTrend.map((item) => item.period), // Fechas
    title: {
      text: "Semanas del Mes",
    },
  },
  yaxis: {
    title: {
      text: "Número de Citas",
    },
    min: 0,
  },
  tooltip: {
    x: {
      format: "dd/MM/yyyy",
    },
  },
};
</script>

<style scoped>
.card {
  border: none;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}

.card-header {
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
}
</style>
