<template>
  <div>
    <q-input
      v-model="localFecha"
      label="Fecha de Nacimiento"
      outlined
      dense
      readonly
      @focus="menuFecha = true"
    >
      <template v-slot:append>
        <q-icon name="event" @click.stop="menuFecha = true" />
      </template>
    </q-input>

    <q-menu
      v-model="menuFecha"
      position="center"
      anchor="center middle"
      self="center middle"
      class="no-background"
    >
      <q-date v-model="localFecha" mask="YYYY-MM-DD" @input="handleDateInput" />
    </q-menu>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { useFichaIdentificacionStore } from "../stores/fichaIdentificacionStores";

const menuFecha = ref(false);
const localFecha = ref("");

// Vincula la fecha de nacimiento con el store
const store = useFichaIdentificacionStore();
watch(
  () => store.formIdentificacion.fechaNacimiento,
  (val) => {
    localFecha.value = val;
  }
);

const handleDateInput = (date) => {
  menuFecha.value = false;
  store.formIdentificacion.fechaNacimiento = date;
};
</script>
