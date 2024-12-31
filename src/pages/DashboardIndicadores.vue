<!-- src/views/Dashboard.vue -->
<template>
  <div :style="{ backgroundColor: backgroundColor }" class="container-fluid">
    <div class="dashboard">
      <div class="card citasAgendadas">
        <CitasAgendadas />
      </div>

      <!-- Tarjeta de Estado de Pacientes -->
      <div class="card pacienteActivoGraph">
        <PacienteActivoGraph />
      </div>

      <!-- Tarjeta de Indicador Últimas Transacciones -->
      <div class="card ultimasTransacciones">
        <IndicadorUltimasTransacciones />
      </div>

      <!-- Tarjeta de Pacientes Agregados Mensualmente -->
      <div class="card aggMensualmente">
        <PacientesAggMensualmente />
      </div>

      <!-- Tarjeta de Diferencia de Citas del Mes -->
      <div class="card difCitasMes">
        <IndicadorDifCitasMes />
      </div>

      <!-- Tarjeta de Últimas Citas Agregadas -->
      <div class="card ultimosCitasAgregadas">
        <IndicadorUltimosCitasAgregadas />
        <!-- <ProximasCincoCitas /> -->
      </div>
      <!-- <div class="card">
        <graficoPrueba />
      </div> -->
    </div>
  </div>
</template>

<script setup>
import { computed, watch, onMounted } from "vue";
import { useThemeStore } from "../stores/themeStore";

import CitasAgendadas from "src/components/CitasAgendadas.vue";
import PacienteActivoGraph from "src/components/PacienteActivoGraph.vue";
import PacientesAggMensualmente from "src/components/PacientesAggMensualmente.vue";
import IndicadorDifCitasMes from "src/components/IndicadorDifCitasMes.vue";
import IndicadorUltimasTransacciones from "src/components/IndicadorUltimasTransacciones.vue";
import IndicadorUltimosCitasAgregadas from "../components/indicadorUltimosCitasAgregadas.vue";
import graficoPrueba from "../components/graficoPrueba.vue";
import ProximasCincoCitas from "../components/ProximasCincoCitas.vue";
const themeStore = useThemeStore();

// Computed property para obtener el color de fondo desde el themeStore
const backgroundColor = computed(() => themeStore.backgroundColor);

// Opcional: Actualizar una variable CSS global si lo prefieres
// watch(backgroundColor, (newColor) => {
//   document.documentElement.style.setProperty(
//     "--default-body-bg-color",
//     newColor
//   );
// });

onMounted(() => {
  // Inicializar la variable CSS al montar el componente
  document.documentElement.style.setProperty(
    "--default-body-bg-color",
    "223, 90, 90",
    themeStore.backgroundColor
  );
});
</script>

<style scoped>
.dashboard {
  display: grid;
  gap: 16px;
  margin-left: 90px;
  /* Usar la variable CSS para el fondo si prefieres */
  background-color: var(--default-body-bg-color);
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: auto auto;
  grid-template-areas:
    "citasAgendadas citasAgendadas pacienteActivo ultimosCitas"
    "ultimasTransacciones difCitasMes aggMensualmente ultimosCitas";
}

.citasAgendadas {
  grid-area: citasAgendadas;
}

.pacienteActivoGraph {
  grid-area: pacienteActivo;
}

.ultimasTransacciones {
  grid-area: ultimasTransacciones;
}

.difCitasMes {
  grid-area: difCitasMes;
}

.aggMensualmente {
  grid-area: aggMensualmente;
}

.ultimosCitasAgregadas {
  grid-area: ultimosCitas;
}

.card {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #ffffff;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(102, 97, 97, 0.151);
  padding: 16px;
  transition: all 0.3s ease;
  position: relative;
  margin-bottom: 1px;
}

.card-title {
  margin: 0 auto;
  font-size: 18px;
  font-weight: bold;
  color: #333;
  text-align: center;
  margin-bottom: 16px;
}

.card-header {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.card-button {
  font-size: 14px;
  color: #007bff;
  background-color: transparent;
  border: 1px solid #007bff;
  border-radius: 4px;
  padding: 4px 8px;
  text-decoration: none;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.card-button:hover {
  background-color: #007bff;
  color: white;
}

.card-title {
  margin: 0;
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.apexcharts-canvas,
.dx-chart,
.dx-pie-chart {
  width: 100%;
  max-width: 500px;
  height: auto;
}

.dx-chart .dxc-legend,
.dx-pie-chart .dxc-legend {
  text-align: center;
  margin-top: 16px;
}
</style>
