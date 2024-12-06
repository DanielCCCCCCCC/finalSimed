<template>
  <q-card class="formS q-pa-sm q-mt-md bg-grey-1 rounded shadow-2xl wide-card">
    <q-card-section class="text-h6 text-primary"> Estado Civil </q-card-section>
    <q-form @submit.prevent="guardarEstadoCivil" class="q-gutter-md">
      <q-input
        v-model="estadoCivilData.descripcion"
        label="Descripción"
        outlined
        dense
        :error="!!formErrors.estadoCivilDescripcion"
        :error-message="formErrors.estadoCivilDescripcion"
      />
      <div class="row justify-end q-mt-md">
        <q-btn
          label="Crear Estado Civil"
          color="primary"
          icon="add"
          @click="guardarEstadoCivil"
        />
      </div>
    </q-form>
  </q-card>
</template>
<script setup>
import { reactive } from "vue";
import { useEstadoCivilStore } from "../stores/DatosGeneralesStores";
import { Notify } from "quasar";

// Inicializar tienda
const estadoCivilStore = useEstadoCivilStore();

// Datos reactivos
const estadoCivilData = reactive({ descripcion: "" });

// Estado de los errores de validación
const formErrors = reactive({
  estadoCivilDescripcion: "",
});

// Función para guardar el estado civil
const guardarEstadoCivil = async () => {
  formErrors.estadoCivilDescripcion = "";
  if (!estadoCivilData.descripcion) {
    formErrors.estadoCivilDescripcion =
      "La descripción del estado civil es obligatoria.";
    return;
  }
  try {
    await estadoCivilStore.agregarEstadoCivil(estadoCivilData.descripcion);
    Notify.create({
      type: "positive",
      message: "Estado Civil creado exitosamente",
      position: "top-right",
    });
    estadoCivilData.descripcion = "";
  } catch (error) {
    Notify.create({
      type: "negative",
      message: "Error al crear estado civil",
      position: "top-right",
    });
  }
};

// Función para eliminar el último estado civil agregado
const eliminarEstadoCivil = async () => {
  try {
    await estadoCivilStore.eliminarUltimoEstadoCivil();
    Notify.create({
      type: "positive",
      message: "Estado Civil eliminado exitosamente",
      position: "top-right",
    });
  } catch (error) {
    Notify.create({
      type: "negative",
      message: "Error al eliminar estado civil",
      position: "top-right",
    });
  }
};
</script>
