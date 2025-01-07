<template>
  <div>
    <!-- Gráfico Radial Bar de ApexCharts -->
    <ApexCharts
      height="195"
      width="410"
      type="radialBar"
      :series="strokedseries"
      :options="strokedoptions"
    ></ApexCharts>

    <!-- Tarjeta de Estadísticas -->
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
          <label class="main-content-label mb-1 pt-1">
            TOTAL CITAS AGENDADAS
          </label>
          <span class="d-block fs-12 mb-2 text-muted">
            Mes anterior vs fecha actual
          </span>

          <p class="mb-0 fs-24 mt-2">
            <b
              :class="{
                'text-primary': diffPercentage >= 0,
                'text-danger': diffPercentage < 0,
              }"
            >
              {{ currentMonthCount }}
              <span style="color: black; font-size: 14px; font-weight: 400"
                >citas del mes actual</span
              >
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
  </div>
</template>

<script setup>
/* -------------------------------------
   Imports y librerías
------------------------------------- */
import { computed, onMounted, ref } from "vue";
import { useAppointmentsStore } from "../stores/AppointmentsStore";
import { Notify } from "quasar";
import ApexCharts from "vue3-apexcharts"; // Asegúrate de importar ApexCharts si lo usas localmente
import { storeToRefs } from "pinia";

/* -------------------------------------
   Datos y Estados Reactivos
------------------------------------- */
const store = useAppointmentsStore();
const cargando = ref(true);
const { appointments } = storeToRefs(store);
onMounted(async () => {
  try {
    await store?.fetchAppointments();
  } catch (error) {
    Notify.create({
      message: "Error al cargar las citas.",
      color: "negative",
      position: "top-right",
    });
    console.error("Error al cargar citas:", error);
  } finally {
    cargando.value = false;
  }
});

const monthlyStats = computed(() => store.calculateMonthlyStats());

const currentMonthCount = computed(() => monthlyStats.value.currentMonthCount);
const prevMonthCount = computed(() => monthlyStats.value.prevMonthCount);
const diffPercentage = computed(() => monthlyStats.value.diffPercentage);

const formatPorcentaje = (value) => {
  return `${Math.abs(value).toFixed(1)}%`;
};

/* -------------------------------------
   Configuración del Gráfico Radial Bar
------------------------------------- */
const strokedseries = computed(() => {
  // Aquí puedes ajustar qué serie quieres mostrar.
  // Por ejemplo, usando 'diffPercentage' directamente.
  return [diffPercentage.value];
});

const strokedoptions = computed(() => ({
  chart: {
    type: "radialBar",
    height: 345, // Ajusta la altura del gráfico
    offsetY: -10, // Mueve el gráfico ligeramente hacia arriba
  },
  plotOptions: {
    radialBar: {
      startAngle: -135, // Ángulo inicial
      endAngle: 135, // Ángulo final
      hollow: {
        margin: 0,
        size: "70%", // Tamaño del círculo interno hueco
        background: "transparent", // Sin fondo
      },
      track: {
        background: "#e7e7e7", // Color de fondo del track
        strokeWidth: "100%", // Grosor del track
        margin: 0, // Sin márgenes
      },
      dataLabels: {
        show: true,
        name: {
          fontSize: "16px", // Tamaño del texto del nombre
          color: "#888", // Color del texto
          offsetY: 120, // Posición vertical del nombre
        },
        value: {
          offsetY: 76, // Posición vertical del valor
          fontSize: "22px", // Tamaño del texto del valor
          color: "#111", // Color del texto
          formatter: function (val) {
            return val + "%"; // Formato del valor mostrado
          },
        },
      },
    },
  },
  fill: {
    type: "gradient", // Tipo de relleno
    gradient: {
      shade: "dark",
      shadeIntensity: 0.15, // Intensidad del sombreado
      inverseColors: false,
      opacityFrom: 1,
      opacityTo: 1,
      stops: [0, 50, 65, 91], // Paradas del gradiente
    },
  },
  stroke: {
    dashArray: 4, // Efecto de guion en el borde
  },
  labels: ["Diferencia mensual"], // Etiqueta del gráfico
}));
</script>

<style scoped>
.card {
  border: none; /* Elimina todos los bordes */
  height: 33%; /* Mantiene la altura al 50% */
  width: 90%;
  position: relative;
  left: 20px;
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

/* Ajustes para el gráfico para que sea responsivo */
@media (max-width: 768px) {
  apexchart {
    height: 300px !important;
  }
}
</style>
