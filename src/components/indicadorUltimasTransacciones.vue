<template>
  <!-- <q-card flat bordered class="q-px-md q-py-md bg-grey-1"> -->
  <q-card-section>
    <div class="text-caption text-grey-8">CITAS PROGRAMADAS</div>
    <div class="text-caption text-grey-6">
      Resumen de citas agendadas y su estatus
    </div>
  </q-card-section>
  <q-list>
    <!-- Ejemplo de cita programada -->
    <q-item clickable class="q-py-xs">
      <q-item-section avatar>
        <q-avatar rounded color="primary" text-color="white">
          <q-icon name="event" />
        </q-avatar>
      </q-item-section>
      <q-item-section>
        <q-item-label>Cita con el Dr. Pérez</q-item-label>
        <q-item-label caption>Consulta de seguimiento</q-item-label>
      </q-item-section>
      <q-item-section side>
        <div class="text-positive">$50.00</div>
        <div class="text-caption text-grey-6">12 Dic 2023</div>
      </q-item-section>
    </q-item>

    <!-- Otra cita programada -->
    <q-item clickable class="q-py-xs">
      <q-item-section avatar>
        <q-avatar rounded color="secondary" text-color="white">
          <q-icon name="event_busy" />
        </q-avatar>
      </q-item-section>
      <q-item-section>
        <q-item-label>Cita cancelada</q-item-label>
        <q-item-label caption>Paciente: Juan García</q-item-label>
      </q-item-section>
      <q-item-section side>
        <div class="text-negative">Cancelada</div>
        <div class="text-caption text-grey-6">10 Dic 2023</div>
      </q-item-section>
    </q-item>

    <!-- Más citas -->
    <q-item clickable class="q-py-xs">
      <q-item-section avatar>
        <q-avatar rounded color="accent" text-color="white">
          <q-icon name="local_hospital" />
        </q-avatar>
      </q-item-section>
      <q-item-section>
        <q-item-label>Cita de urgencias</q-item-label>
        <q-item-label caption>Paciente: María López</q-item-label>
      </q-item-section>
      <q-item-section side>
        <div class="text-primary">$75.00</div>
        <div class="text-caption text-grey-6">09 Dic 2023</div>
      </q-item-section>
    </q-item>
  </q-list>
  <!-- </q-card> -->
</template>

<script setup>
import { ref } from "vue";
import {
  QCard,
  QCardSection,
  QList,
  QItem,
  QItemSection,
  QItemLabel,
  QAvatar,
  QIcon,
} from "quasar";
</script>

<style scoped>
.q-card {
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
.q-item {
  border-bottom: 1px solid #f1f1f1;
}
.q-item:last-child {
  border-bottom: none;
}
</style>
