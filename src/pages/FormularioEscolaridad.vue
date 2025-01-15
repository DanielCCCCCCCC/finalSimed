<template>
  <q-card class="formS q-pa-sm q-mt-md bg-grey-1 rounded shadow-2xl wide-card">
    <q-card-section class="text-h6 text-primary"> Escolaridad </q-card-section>
    <q-form @submit.prevent="guardarEscolaridad" class="q-gutter-md">
      <q-input
        v-model="escolaridadData.descripcion"
        label="Descripción"
        outlined
        dense
        :error="!!formErrors.escolaridadDescripcion"
        :error-message="formErrors.escolaridadDescripcion"
      />
      <div class="row justify-end q-mt-md">
        <q-btn
          label="Crear Escolaridad"
          color="primary"
          icon="add"
          @click="guardarEscolaridad"
        />
      </div>
    </q-form>
  </q-card>
</template>
<script setup>
import { reactive } from "vue";
// import { useEscolaridadStore } from "../stores/DatosGeneralesStores";
import { Notify } from "quasar";

// Inicializar tienda
const escolaridadStore = useEscolaridadStore();

// Datos reactivos
const escolaridadData = reactive({ descripcion: "" });

// Estado de los errores de validación
const formErrors = reactive({
  escolaridadDescripcion: "",
});

// Función para guardar la escolaridad
const guardarEscolaridad = async () => {
  formErrors.escolaridadDescripcion = "";
  if (!escolaridadData.descripcion) {
    formErrors.escolaridadDescripcion =
      "La descripción de escolaridad es obligatoria.";
    return;
  }
  try {
    await escolaridadStore.agregarEscolaridad(escolaridadData.descripcion);
    Notify.create({
      type: "positive",
      message: "Escolaridad creada exitosamente",
      position: "top-right",
    });
    escolaridadData.descripcion = "";
  } catch (error) {
    Notify.create({
      type: "negative",
      message: "Error al crear escolaridad",
      position: "top-right",
    });
  }
};

// Función para eliminar la última escolaridad agregada
const eliminarEscolaridad = async () => {
  try {
    await escolaridadStore.eliminarUltimaEscolaridad();
    Notify.create({
      type: "positive",
      message: "Escolaridad eliminada exitosamente",
      position: "top-right",
    });
  } catch (error) {
    Notify.create({
      type: "negative",
      message: "Error al eliminar escolaridad",
      position: "top-right",
    });
  }
};
</script>
