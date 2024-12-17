<template>
  <div class="grafico-container">
    <!-- Gráfico de barras con ApexCharts -->
    <h3 class="main-content-label mb-5 title">Registro de pacientes</h3>
    <ApexCharts
      v-if="registrosPorDia.length > 0"
      type="bar"
      :options="chartOptions"
      :series="series"
      height="300px"
      width="350px"
      class="apex-chart"
    ></ApexCharts>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { useFichaIdentificacionStore } from "../stores/fichaIdentificacionStores";
import { storeToRefs } from "pinia";
import ApexCharts from "vue3-apexcharts";
import { projectOptions } from "../dahboardData"; // Importa colores desde dashboardData

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
    type: "bar",
    toolbar: {
      show: false,
    },
    animations: {
      enabled: true,
      easing: "easeinout",
      speed: 800,
      animateGradually: {
        enabled: true,
        delay: 150,
      },
      dynamicAnimation: {
        enabled: true,
        speed: 350,
      },
    },
    zoom: {
      enabled: false,
    },
  },
  colors: projectOptions.colors, // Colores dinámicos desde dashboardData
  fill: {
    type: "bar",
    gradient: {
      shade: "light",
      type: "vertical",
      shadeIntensity: 1,
      gradientToColors: projectOptions.colors.map((color) =>
        color.replace("rgba(", "rgba(").replace(")", ", 0.7)")
      ), // Aplica un degradado transparente dinámico
      inverseColors: false,
      opacityFrom: 1,
      opacityTo: 0.7,
      stops: [0, 100],
    },
  },
  plotOptions: {
    bar: {
      borderRadius: 6,
      horizontal: false,
      columnWidth: "90%",
    },
  },
  dataLabels: {
    enabled: true,
    formatter: (val) => `${val}`,
    style: {
      fontSize: "12px",
      colors: ["#333"],
    },
  },
  xaxis: {
    categories: registrosPorDia.value.map((item) => item.day),
    position: "bottom",
    labels: {
      style: {
        colors: "#333",
        fontSize: "14px",
      },
    },
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
    title: {
      text: "Días de la Semana",
      style: {
        fontWeight: "bold",
        fontSize: "14px",
      },
    },
  },
  yaxis: {
    title: {
      text: "Cantidad de Registros",
      style: {
        fontWeight: "bold",
        fontSize: "14px",
      },
    },
    labels: {
      style: {
        fontSize: "12px",
      },
    },
  },
  tooltip: {
    enabled: true,
    theme: "light",
    y: {
      formatter: (val) => `${val} registros`,
    },
  },
  title: {
    // text: "Registros por Día (Semana Actual)",
    align: "left",
    style: {
      fontWeight: "bold",
      fontSize: "16px",
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
          title: {
            text: "Días",
            style: {
              fontSize: "10px",
            },
          },
        },
        yaxis: {
          title: {
            text: "Cantidad",
            style: {
              fontSize: "10px",
            },
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
</style>
