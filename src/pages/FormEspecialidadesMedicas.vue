<template>
  <q-page class="q-pa-md">
    <q-card class="q-pa-sm formS bg-grey-1 rounded shadow-2xl wide-card">
      <q-card-section class="text-h6 text-primary">
        Especialidades Médicas
      </q-card-section>
      <q-form @submit.prevent="guardarEspecialidad" class="q-gutter-md">
        <q-input
          v-model="especialidadData.descripcion"
          label="Descripción"
          outlined
          dense
          :error="!!formErrors.descripcion"
          :error-message="formErrors.descripcion"
        />
        <div class="row justify-end q-mt-md">
          <q-btn
            label="Crear"
            color="primary"
            icon="add"
            @click="guardarEspecialidad"
          />
        </div>
      </q-form>
    </q-card>
    <ListadoEspecialidadesMedicas />
  </q-page>
</template>

<script setup>
import { ref, reactive } from "vue";
import { Notify } from "quasar";
import ListadoEspecialidadesMedicas from "./ListadoEspecialidadesMedicas.vue";
import { useEspecialidadMedicaStore } from "../stores/ConfiMedicasStores";

// Datos reactivos
const especialidadData = ref({ descripcion: "" });
const formErrors = reactive({ descripcion: "" });

// Acceso al store
const especialidadStore = useEspecialidadMedicaStore();

// Función para guardar la especialidad
const guardarEspecialidad = async () => {
  formErrors.descripcion = "";

  // Validar el campo
  if (!especialidadData.value.descripcion.trim()) {
    formErrors.descripcion = "La descripción es obligatoria.";
    return;
  }

  try {
    await especialidadStore.agregarEspecialidad(
      especialidadData.value.descripcion
    );
    especialidadData.value.descripcion = ""; // Limpiar el campo
    Notify.create({
      message: "Especialidad guardada exitosamente",
      color: "positive",
      position: "top-right",
    });
  } catch (error) {
    Notify.create({
      message: "Error al guardar la especialidad",
      color: "negative",
      position: "top-right",
    });
    console.error("Error al guardar la especialidad:", error);
  }
};
</script>

<style scoped>
/* Aseguramos que todos los estilos sean consistentes */
.q-page {
  background-color: #f9f9f9;
}

.wide-card {
  max-width: 800px; /* Asegura que el ancho sea el mismo */
  margin: auto; /* Centra la tarjeta */
}

.text-primary {
  color: #1976d2; /* Azul primario para los encabezados */
}

.q-mt-md {
  margin-top: 16px; /* Espaciado consistente */
}

.q-pa-md {
  padding: 16px; /* Relleno consistente en la página */
}

.formS {
  padding: 16px; /* Relleno interno uniforme */
}
</style>
