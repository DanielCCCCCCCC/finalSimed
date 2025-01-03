<template>
  <div :style="{ backgroundColor: backgroundColor }" class="container-fluid">
    <div class="dashboard">
      <!-- 1) Indicador arriba a la izquierda, doble ancho -->
      <div class="card indicadorAutoCitas">
        <IndicadorSolicitudCitas />
      </div>

      <!-- 2) Los demás componentes con sus áreas de grid -->
      <div class="card pacienteActivoGraph">
        <PacienteActivoGraph />
      </div>

      <div class="card ultimasTransacciones">
        <IndicadorUltimasTransacciones />
      </div>

      <div class="card aggMensualmente">
        <PacientesAggMensualmente />
      </div>

      <div class="card difCitasMes">
        <IndicadorDifCitasMes />
      </div>

      <!-- <div class="card ultimosCitasAgregadas">
        <IndicadorUltimosCitasAgregadas />
      </div> -->

      <div class="card citasAgendadas">
        <CitasAgendadas />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useThemeStore } from "../stores/themeStore";

import CitasAgendadas from "src/components/CitasAgendadas.vue";
import PacienteActivoGraph from "src/components/PacienteActivoGraph.vue";
import PacientesAggMensualmente from "src/components/PacientesAggMensualmente.vue";
import IndicadorDifCitasMes from "src/components/IndicadorDifCitasMes.vue";
import IndicadorUltimasTransacciones from "src/components/IndicadorUltimasTransacciones.vue";
import IndicadorUltimosCitasAgregadas from "../components/IndicadorUltimosCitasAgregadas.vue";
import IndicadorSolicitudCitas from "../components/IndicadorSolicitudCitas.vue";

const themeStore = useThemeStore();
const backgroundColor = computed(() => themeStore.backgroundColor);

onMounted(() => {
  document.documentElement.style.setProperty(
    "--default-body-bg-color",
    themeStore.backgroundColor
  );
});
</script>

<style scoped>
.dashboard {
  display: grid;
  gap: 16px;
  margin-left: 90px;
  /* FONDO */
  background-color: var(--default-body-bg-color);

  /* Definir 4 columnas y 2 filas, ajustadas a tu preferencia */
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: auto auto;

  /* Definir las áreas */
  /* Queremos que indicadorAutoCitas ocupe 2 columnas en la primera fila */
  grid-template-areas:
    "indicadorAutoCitas indicadorAutoCitas pacienteActivoGraph ultimasTransacciones"
    "aggMensualmente difCitasMes citasAgendadas citasAgendadas";
}

/* 1) Área para Indicador de 8 citas */
.indicadorAutoCitas {
  grid-area: indicadorAutoCitas;
}

/* 2) Ajustar las demás áreas */
.pacienteActivoGraph {
  grid-area: pacienteActivoGraph;
}

.ultimasTransacciones {
  grid-area: ultimasTransacciones;
}

.aggMensualmente {
  grid-area: aggMensualmente;
}

.difCitasMes {
  grid-area: difCitasMes;
}

.ultimosCitasAgregadas {
  grid-area: ultimosCitasAgregadas;
}

.citasAgendadas {
  grid-area: citasAgendadas;
}

/* Tarjetas */
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
</style>
