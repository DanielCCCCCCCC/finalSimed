<template>
  <div class="grafico-container">
    <!-- Gráfico de radar con ApexCharts -->
    <h3 class="main-content-label title">Registro de pacientes</h3>
    <ApexCharts
      v-if="registrosPorDia.length > 0"
      type="radar"
      :options="chartOptions"
      :series="series"
      height="350px"
      width="350px"
      class="apex-chart"
    ></ApexCharts>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useFichaIdentificacionStore } from "../stores/fichaIdentificacionStores";
import { storeToRefs } from "pinia";
import ApexCharts from "vue3-apexcharts";

// Instancia de la tienda
const fichaIdentificacionStore = useFichaIdentificacionStore();
const { registrosPorDia } = storeToRefs(fichaIdentificacionStore);

// Configuración de las series del gráfico (reactivo)
const series = computed(() => [
  {
    name: "Registros",
    data: registrosPorDia.value.map((item) => item.registros),
  },
]);

// Configuración de las opciones del gráfico (reactivo)
const chartOptions = ref({
  chart: {
    type: "radar",
    toolbar: {
      show: false,
    },
    animations: {
      enabled: true,
      easing: "easeinout",
      speed: 800,
      dynamicAnimation: {
        enabled: true,
        speed: 350,
      },
    },
  },
  colors: ["#6A5ACD"], // Color base para el gráfico
  fill: {
    type: "solid", // Relleno sólido
    opacity: 0.4, // Transparencia del área rellena
  },
  stroke: {
    show: true,
    width: 2, // Grosor del borde del gráfico
    colors: ["#6A5ACD"], // Color del borde
  },
  markers: {
    size: 4, // Tamaño de los puntos en cada vértice
    colors: ["#FFFFFF"], // Color interno de los puntos
    strokeColors: "#6A5ACD", // Color del borde de los puntos
    strokeWidth: 2,
  },
  xaxis: {
    categories: registrosPorDia.value.map((item) => item.day), // Días de la semana como categorías
  },
  tooltip: {
    enabled: true,
    theme: "light",
    y: {
      formatter: (val) => `${val} registros`,
    },
  },
  responsive: [
    {
      breakpoint: 600,
      options: {
        chart: {
          height: 200,
        },
        xaxis: {
          labels: {
            fontSize: "10px",
          },
        },
      },
    },
  ],
});

// Actualizar las opciones del gráfico cuando los datos cambien
watch(
  registrosPorDia,
  (newVal) => {
    if (newVal.length > 0) {
      chartOptions.value.xaxis.categories = newVal.map((item) => item.day);
      series.value = [
        {
          name: "Registros",
          data: newVal.map((item) => item.registros),
        },
      ];
    }
  },
  { deep: true }
);
</script>

<style scoped>
.title {
  position: relative;
  top: 20px;
  display: flex;
  justify-content: center; /* Centra horizontalmente */
}

.grafico-container {
  position: relative;
  top: 1%;
}
</style>
