<template>
  <q-page class="q-pa-md">
    <q-card class="q-pa-sm bg-grey-1 formS rounded shadow-2xl wide-card">
      <q-card-section class="text-h6 text-primary">
        Tipos de Estudios
      </q-card-section>
      <q-form @submit.prevent="guardarEstudio" class="q-gutter-md">
        <q-input
          v-model="estudioData.descripcion"
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
            @click="guardarEstudio"
          />
        </div>
      </q-form>
    </q-card>
    <ListadoTiposEstudios />
  </q-page>
</template>

<script setup>
import { ref, reactive } from "vue";
import { Notify } from "quasar";
import ListadoTiposEstudios from "./ListadoTiposEstudios.vue";
import { useTiposEstudiosStore } from "../stores/ConfiMedicasStores";

// Datos reactivos
const estudioData = ref({ descripcion: "" });
const formErrors = reactive({ descripcion: "" });

// Acceso al store
const tiposEstudiosStore = useTiposEstudiosStore();

// Función para guardar el tipo de estudio
const guardarEstudio = async () => {
  formErrors.descripcion = "";

  // Validar el campo
  if (!estudioData.value.descripcion.trim()) {
    formErrors.descripcion = "La descripción es obligatoria.";
    return;
  }

  try {
    await tiposEstudiosStore.agregarEstudio(estudioData.value.descripcion);
    estudioData.value.descripcion = ""; // Limpiar el campo
    Notify.create({
      message: "Tipo de estudio guardado exitosamente",
      color: "positive",
      position: "top-right",
    });
  } catch (error) {
    Notify.create({
      message: "Error al guardar el tipo de estudio",
      color: "negative",
      position: "top-right",
    });
    console.error("Error al guardar el tipo de estudio:", error);
  }
};
</script>

<style scoped>
/* Estilos consistentes con otros formularios */
.q-page {
  background-color: #f9f9f9;
}

.wide-card {
  max-width: 800px; /* Asegura el mismo ancho */
  margin: auto; /* Centra el formulario */
}

.text-primary {
  color: #1976d2; /* Azul primario para encabezados */
}

.q-mt-md {
  margin-top: 16px; /* Espaciado consistente */
}

.q-pa-md {
  padding: 16px; /* Relleno consistente */
}

.formS {
  padding: 16px; /* Relleno interno uniforme */
}
</style>
