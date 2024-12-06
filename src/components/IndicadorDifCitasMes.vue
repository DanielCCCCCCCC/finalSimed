<template>
  <q-card flat bordered class="q-px-md q-py-md bg-grey-1">
    <div class="row items-center">
      <div class="col">
        <div class="text-caption text-grey">TOTAL CITAS AGENDADAS</div>
        <div class="text-caption text-grey">Mes anterior vs mes actual</div>
        <div class="text-h5 text-bold text-black q-mt-sm">{{ totalCitas }}</div>
        <div
          :class="{
            'text-positive': porcentajeCambio >= 0,
            'text-negative': porcentajeCambio < 0,
          }"
        >
          {{ porcentajeCambio | formatPorcentaje }}
          {{ porcentajeCambio >= 0 ? "Mayor" : "Menor" }}
        </div>
      </div>
      <div class="col-auto">
        <q-icon
          name="event_note"
          size="36px"
          class="bg-red-1 text-red text-center rounded-circle q-pa-sm"
        />
      </div>
    </div>
  </q-card>
</template>

<script setup>
import { ref } from "vue";

// Datos iniciales (estos deben venir de tu lógica de negocio o API)
const totalMesAnterior = ref(50); // Número de citas del mes pasado
const totalMesActual = ref(75); // Número de citas del mes actual

// Cálculo de total y cambio porcentual
const totalCitas = totalMesActual.value;
const porcentajeCambio =
  ((totalMesActual.value - totalMesAnterior.value) / totalMesAnterior.value) *
  100;

// Filtro para formatear porcentaje
const formatPorcentaje = (value) => {
  return `${Math.abs(value).toFixed(1)}%`;
};
</script>

<style scoped>
.q-card {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.text-caption {
  font-size: 0.9rem;
  margin-bottom: 0.2rem;
}

.text-h5 {
  font-size: 1.5rem;
}

.q-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
