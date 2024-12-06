<template>
  <!-- Utilizar .container o una de sus variantes para envolver el dashboard -->
  <div class="container-fluid">
    <!-- Cambia a .container, .container-sm, etc., según tus necesidades -->
    <div class="dashboard">
      <!-- Tarjeta de Citas Agendadas -->
      <div class="card tCitasAgendadas">
        <h3 class="card-title">Citas Agendadas</h3>
        <CitasAgendadas />
      </div>

      <!-- Tarjeta de Estado de Pacientes -->
      <div class="card tPacienteActivoGraph">
        <h3 class="card-title">Estado de Pacientes</h3>
        <PacienteActivoGraph />
      </div>

      <!-- Tarjeta de Registros Semanales -->
      <div class="card tPacientesAggMensualmente">
        <h3 class="card-title">Registros de Pacientes Semanales</h3>
        <indicadorUltimasTransacciones />
      </div>

      <!-- Tarjeta de Indicador de Diferencia de Citas del Mes -->
      <div class="card tPacientesAggMensualmente">
        <IndicadorDifCitasMes />
      </div>

      <!-- Tarjeta de Indicador de Últimas Transacciones -->

      <div class="card tPacientesAggMensualmente">
        <h3 class="card-title">Registros de Pacientes Semanales</h3>
        <PacientesAggMensualmente />
      </div>
      <!-- Tarjeta de Prueba de ApexCharts (Opcional) -->
      <div class="card tPacientesAggMensualmente">
        <!-- <TestApexChart /> -->
      </div>
    </div>
  </div>
</template>

<script setup>
import CitasAgendadas from "src/components/CitasAgendadas.vue";
import PacienteActivoGraph from "src/components/PacienteActivoGraph.vue";
import PacientesAggMensualmente from "src/components/PacientesAggMensualmente.vue";
import IndicadorDifCitasMes from "src/components/IndicadorDifCitasMes.vue";
import indicadorUltimasTransacciones from "src/components/indicadorUltimasTransacciones.vue";
import TestApexChart from "src/components/TestApexChart.vue"; // Asegúrate de descomentar si lo usas
</script>

<style scoped>
.dashboard {
  display: grid;
  grid-template-columns: repeat(
    auto-fill,
    minmax(300px, 1fr)
  ); /* Adaptable según el tamaño */
  gap: 16px; /* Espaciado entre tarjetas */
  padding: 16px;
}

/* Estilo base para las tarjetas */
.card {
  display: flex;
  flex-direction: column; /* Asegura que el título y gráfico estén en columna */
  align-items: center; /* Centrar horizontalmente */
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 16px;
  min-height: 10px; /* Altura mínima consistente */
  transition: all 0.3s ease; /* Transición suave al cambiar tamaño */
}

/* Estilo de los títulos de las tarjetas */
.card-title {
  margin: 0;
  font-size: 18px;
  font-weight: bold;
  color: #333;
  text-align: center;
  margin-bottom: 16px; /* Espaciado entre el título y el gráfico */
}

/* Centrar y tamaño de los gráficos */
.apexcharts-canvas {
  width: 100%; /* Ajusta el gráfico al ancho disponible */
  max-width: 500px; /* Tamaño máximo para mantener consistencia */
  height: auto; /* Ajusta automáticamente la altura */
}

/* Opcional: Estilos específicos para DevExtreme's DxChart si aún los usas */
.dx-chart,
.dx-pie-chart {
  width: 100%; /* Ajusta el gráfico al ancho disponible */
  max-width: 400px; /* Tamaño máximo para mantener consistencia */
  height: auto; /* Ajusta automáticamente la altura */
}

/* Centrar internamente el contenido gráfico */
.dx-chart .dxc-series-group,
.dx-pie-chart .dxc-series-group {
  transform: translate(0, 0); /* Asegura que el gráfico esté centrado */
}

/* Asegura que la leyenda se alinee correctamente */
.dx-chart .dxc-legend,
.dx-pie-chart .dxc-legend {
  text-align: center;
  margin-top: 16px; /* Espaciado entre la leyenda y el gráfico */
}

/* Media Queries para Ajustes Específicos (Opcional) */
@media (max-width: 575.98px) {
  .dashboard {
    grid-template-columns: 1fr; /* Una columna en pantallas extra pequeñas */
  }
}

@media (min-width: 576px) and (max-width: 767.98px) {
  .dashboard {
    grid-template-columns: repeat(
      2,
      1fr
    ); /* Dos columnas en pantallas pequeñas */
  }
}

@media (min-width: 768px) and (max-width: 991.98px) {
  .dashboard {
    grid-template-columns: repeat(
      3,
      1fr
    ); /* Tres columnas en pantallas medianas */
  }
}

@media (min-width: 992px) and (max-width: 1199.98px) {
  .dashboard {
    grid-template-columns: repeat(
      3,
      1fr
    ); /* Tres columnas en pantallas grandes */
  }
}

@media (min-width: 1200px) {
  .dashboard {
    grid-template-columns: repeat(
      4,
      1fr
    ); /* Cuatro columnas en pantallas extra grandes */
  }
}
</style>
