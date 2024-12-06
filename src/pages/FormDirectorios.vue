<template>
  <!-- COMPONENTE PADRE FormDirectorios.vue -->
  <q-page class="q-pa-md">
    <q-tabs
      v-model="tab"
      class="bg-white text-black q-mb-sm shadow-2 rounded-borders"
      @update:model-value="onTabChange"
    >
      <q-tab name="Hospitales" icon="local_hospital" label="Hospitales" />
      <q-tab
        name="Medicamentos"
        icon="medication"
        label="Medicamentos y Otros"
      />
      <q-tab name="Estudios" icon="description" label="Exámenes y Estudios" />
    </q-tabs>

    <q-tab-panels v-model="tab">
      <!-- Pestaña: Hospitales -->
      <q-tab-panel name="Hospitales">
        <HospitalForm />
      </q-tab-panel>

      <!-- Pestaña: Medicamentos y Otros -->
      <q-tab-panel name="Medicamentos">
        <MedicamentoForm />
      </q-tab-panel>

      <!-- Pestaña: Exámenes y Estudios -->
      <q-tab-panel name="Estudios">
        <EstudioForm />
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import HospitalForm from "./HospitalForm.vue";
import MedicamentoForm from "./MedicamentoForm.vue";
import EstudioForm from "./EstudioForm.vue";

// Acceder a la ruta y al router
const route = useRoute();
const router = useRouter();

// Definir las pestañas disponibles
const pestañasDisponibles = ["Hospitales", "Medicamentos", "Estudios"];

// Inicializar la pestaña activa desde el parámetro de consulta o por defecto
const tab = ref("Hospitales");

// Función para actualizar la pestaña según la URL
const inicializarTab = () => {
  const tabQuery = route.query.tab;
  if (tabQuery && pestañasDisponibles.includes(tabQuery)) {
    tab.value = tabQuery;
  }
};

// Llamar a la función al montar el componente
onMounted(() => {
  inicializarTab();
});

// Función para manejar el cambio de pestaña y actualizar la URL
const onTabChange = (nuevaTab) => {
  router.replace({ query: { ...route.query, tab: nuevaTab } });
};

// Opcional: observar cambios en la ruta para actualizar la pestaña si la URL cambia
watch(
  () => route.query.tab,
  (nuevaTab) => {
    if (nuevaTab && pestañasDisponibles.includes(nuevaTab)) {
      tab.value = nuevaTab;
    }
  }
);

// Estado adicional si es necesario
const hospitalSeleccionado = ref(null);

function manejarEdicion(hospital) {
  hospitalSeleccionado.value = hospital; // Asignar el hospital seleccionado
}
</script>
