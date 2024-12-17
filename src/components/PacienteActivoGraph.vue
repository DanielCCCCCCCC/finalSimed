<template>
  <div>
    <h3 class="main-content-label title">Estado de pacientes</h3>
    <div class="card">
      <ApexCharts
        v-if="datosCargados"
        type="donut"
        :options="chartOptions"
        :series="series"
      />
    </div>
  </div>
</template>

<script setup>
import { useFichaIdentificacionStore } from "../stores/fichaIdentificacionStores";
import { onMounted, ref, computed } from "vue";
import ApexCharts from "vue3-apexcharts";
import { storeToRefs } from "pinia";
import { projectOptions } from "../dahboardData"; // Importa colores desde dashboardData

// Instancia de la tienda
const FichaIdentificacionStore = useFichaIdentificacionStore();
const { dataGraficoPacientes } = storeToRefs(FichaIdentificacionStore);

const datosCargados = ref(false);

onMounted(async () => {
  await FichaIdentificacionStore.cargarDatos();
  datosCargados.value = true; // Establece datosCargados a true cuando la carga está completa
});

/**
 * Computed property para transformar los datos en series y labels para ApexCharts
 */
const series = computed(() => {
  return dataGraficoPacientes.value.map((item) => item.cantidad);
});

const labels = computed(() => {
  return dataGraficoPacientes.value.map((item) => item.estado);
});

/**
 * Opciones de configuración para el gráfico de ApexCharts
 */
const chartOptions = computed(() => ({
  chart: {
    type: "donut",
    width: 350,
    height: 220,
  },
  labels: labels.value,
  dataLabels: {
    enabled: true,
    style: {
      fontSize: "16px", // Tamaño de la fuente
      fontWeight: "normal", // Peso de la fuente
      colors: ["#365456"], // Color del texto
    },
  },

  colors: projectOptions.colors, // Colores dinámicos desde dashboardData
  title: {
    // text: "Estado de pacientes",
    align: "center",
    style: {
      fontWeight: "bold",
      fontSize: "16px",
    },
  },
  legend: {
    position: "top",
    horizontalAlign: "right",
  },
  tooltip: {
    y: {
      formatter: function (val, opts) {
        const percentage =
          (val / series.value.reduce((a, b) => a + b, 0)) * 100;
        return `${val} pacientes (${percentage.toFixed(2)}%)`;
      },
    },
  },
  plotOptions: {
    pie: {
      donut: {
        size: "45%",
      },
    },
  },
}));
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
</style>
