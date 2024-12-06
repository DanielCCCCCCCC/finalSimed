<template>
  <div class="grafico-container">
    <!-- Botón "Ir" en la esquina superior derecha -->
    <button class="go-button" @click="goToScheduler">Ir</button>

    <!-- Muestra el gráfico solo cuando los datos están listos -->
    <ApexCharts
      v-if="datosCargados"
      type="donut"
      :options="chartOptions"
      :series="series"
    />
  </div>
</template>

<script setup>
import { useFichaIdentificacionStore } from "../stores/fichaIdentificacionStores";
import { onMounted, ref, computed } from "vue";
import ApexCharts from "vue3-apexcharts";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";

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
    height: 230,
  },
  labels: labels.value,
  colors: ["#26A69A", "#FF9800", "#FF5252", "#42A5F5", "#AB47BC"], // Personaliza los colores según tus necesidades
  legend: {
    position: "top",
    horizontalAlign: "left",
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
        size: "60%",
      },
    },
  },
}));

// Acceder al router de Vue
const router = useRouter();

// Función para redirigir al scheduler
const goToScheduler = () => {
  router.push("/controlCitasv2");
};
</script>

<style scoped>
.grafico-container {
  position: relative;
  top: 10px;
  width: 100%;
  max-width: 360px;
  padding: 16px;
  border-radius: 8px;
  height: 300px;
  background-color: #ffffff;
  margin: 0 auto;
}

.go-button {
  position: absolute;
  top: -70px;
  right: -5px;
  background-color: rgba(0, 0, 0, 0.05);
  border: none;
  color: #333;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s, color 0.3s;
}

.go-button:hover {
  background-color: rgba(0, 0, 0, 0.1);
  color: #000;
}

.titulo {
  margin-top: 10px;
  font-family: "Segoe UI Light", "Helvetica Neue", "Trebuchet MS", "Verdana",
    "sans-serif";
  text-align: center;
}

/* Estilos adicionales si es necesario */
/* .dashboard {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
  padding: 16px;
} */

/* Estilo base para las tarjetas
.card {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin-top: 10px;
  background: #9e2929;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(175, 7, 7, 0.1);
  padding: 16px;
  min-height: 300px;
  transition: all 0.3s ease;
} */

/* Centrar específicamente los gráficos internos */
.apexcharts-canvas {
  width: 100% !important;
  height: auto !important;
}

/* Centrar la leyenda y otros elementos dentro del gráfico */
.apexcharts-legend {
  text-align: center;
  margin-top: 16px;
  align-self: center;
}
</style>
