<template>
  <div class="card-container">
    <ApexCharts
      v-if="appointmentsTrend.length > 0"
      type="bar"
      :options="projectOptions"
      :series="projectData"
      width="810"
      height="480"
    />
  </div>
</template>

<script setup>
import { onMounted, computed } from "vue";
import { useAppointmentsStore } from "../stores/AppointmentsStore"; // Asegúrate de que la ruta es correcta
import { projectOptions, projectData } from "../dahboardData"; // Asegúrate de importar correctamente
import ApexCharts from "vue3-apexcharts";

// Instancia del store
const store = useAppointmentsStore();

// Cargar las citas al montar el componente
onMounted(async () => {
  await store.fetchAppointments();
});

// Definir appointmentsTrend correctamente
const appointmentsTrend = computed(() => store.appointmentsTrend);

// Series del gráfico (los valores que se grafican)
const series = computed(() => [
  {
    name: "Citas",
    data: appointmentsTrend.value.map((item) => item.count),
  },
]);

// Opciones del gráfico ApexCharts
const chartOptions = computed(() => ({
  chart: {
    type: "area",
    toolbar: {
      show: false,
    },
  },
  xaxis: {
    categories: appointmentsTrend.value.map((item) => item.period),
    labels: {
      // rotate: -90,
    },
    title: {
      text: "Semana",
      style: {
        fontWeight: "bold",
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
  },
  dataLabels: {
    enabled: true,
    formatter: (val) => `${val} citas`,
  },
  plotOptions: {
    bar: {
      borderRadius: 4,
      horizontal: false,
    },
  },
  title: {
    text: "Tendencia de Citas por Semana (Mes Actual)",
    align: "left",
    style: {
      fontWeight: "bold",
      fontSize: "16px",
    },
  },
  // Aquí necesitas incluir los colores dinámicos
}));
</script>
<!--
<style scoped>
.card-container {
  width: 700px;
  height: auto;
  padding: 16px;
  border-radius: 8px;
  /* box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2); */
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
  /* margin-left: 10px; */
  margin-bottom: 0px;
}

.info {
  text-align: center;
  margin-top: 8px;
}

.amount {
  margin-top: -14px;
  font-size: 14px;
  font-weight: bold;
  color: #333;
}

.label {
  font-size: 12px;
  color: #888;
}
</style> -->
