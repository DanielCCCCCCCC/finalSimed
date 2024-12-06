<template>
  <div class="grafico-container">
    <!-- Botón "Ir" en la esquina superior derecha -->
    <div>
      <button class="go-button" @click="goToScheduler">Ir</button>
    </div>

    <!-- Gráfico de área con ApexCharts -->
    <ApexCharts
      type="area"
      :options="chartOptions"
      :series="series"
      height="230"
    ></ApexCharts>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useFichaIdentificacionStore } from "../stores/fichaIdentificacionStores";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import ApexCharts from "vue3-apexcharts";

// Instancia de la tienda
const fichaIdentificacionStore = useFichaIdentificacionStore();
const { registrosPorDia } = storeToRefs(fichaIdentificacionStore);

// Acceder al router de Vue
const router = useRouter();

// Función para redirigir al scheduler
const goToScheduler = () => {
  router.push("/directoriopacientes");
};

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
    type: "area",
    toolbar: {
      show: false,
    },
    animations: {
      enabled: true,
    },
    zoom: {
      enabled: false,
    },
  },
  colors: ["#229954"],
  fill: {
    type: "gradient",
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.9,
      opacityTo: 0.5,
      stops: [0, 90, 100],
    },
  },
  stroke: {
    curve: "smooth",
    width: 2,
  },
  markers: {
    size: 5,
    colors: ["#d4ac0d"],
    strokeColors: "#fff",
    strokeWidth: 2,
    hover: {
      size: 7,
    },
  },
  dataLabels: {
    enabled: true,
    formatter: (val) => val,
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
        fontSize: "12px",
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
    },
  },
  yaxis: {
    show: true,
    title: {
      text: "Cantidad de Registros",
    },
  },
  legend: {
    show: false, // Cambia a true si tienes múltiples series y quieres mostrar la leyenda
  },
  tooltip: {
    enabled: true,
    theme: "light",
    y: {
      formatter: (val) => `${val} registros`,
    },
  },
  // Opcional: Añadir anotaciones
  annotations: {
    points: [
      // Ejemplo de anotación
      // {
      //   x: 'jueves',
      //   y: 40,
      //   marker: {
      //     size: 8,
      //     fillColor: "#fff",
      //     strokeColor: "#FF4560",
      //     radius: 2,
      //   },
      //   label: {
      //     borderColor: "#FF4560",
      //     offsetY: 0,
      //     style: {
      //       color: "#fff",
      //       background: "#FF4560",
      //     },
      //     text: "Evento Importante",
      //   },
      // },
    ],
  },
  // Opcional: Añadir configuración responsiva
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

watch(
  registrosPorDia,
  (newVal) => {
    chartOptions.value.xaxis.categories = newVal.map((item) => item.day);
    series.value = [
      {
        name: "Registros",
        data: newVal.map((item) => item.registros),
      },
    ];
  },
  { deep: true }
);
</script>

<style scoped>
.grafico-container {
  position: relative; /* Para posicionar el botón de forma absoluta dentro del contenedor */
  width: 100%;
  max-width: 600px; /* Ajusta según tus necesidades */
  padding: 16px;
  border-radius: 8px;
  background-color: #fff;
  margin: 0 auto; /* Centrar el contenedor si es necesario */
}

.go-button {
  position: absolute;
  top: -60px;
  right: 16px;
  background-color: rgba(0, 0, 0, 0.05); /* Casi transparente */
  border: none;
  color: #333;
  padding: 6px 10px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s, color 0.3s;
}

.go-button:hover {
  background-color: rgba(0, 0, 0, 0.1);
  color: #000;
}

/* Ajusta el tamaño del gráfico */
.apexcharts-canvas {
  margin-top: 20px;
  margin-left: auto;
  margin-right: auto;
}
</style>
