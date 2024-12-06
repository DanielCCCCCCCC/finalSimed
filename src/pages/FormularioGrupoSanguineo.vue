<template>
  <q-card class="formS q-pa-sm q-mt-md bg-grey-1 rounded shadow-2xl wide-card">
    <q-card-section class="text-h6 text-primary">
      Grupo Sanguíneo
    </q-card-section>
    <q-form @submit.prevent="guardarGrupoSanguineo" class="q-gutter-md">
      <q-input
        v-model="grupoSanguineoData.descripcion"
        label="Descripción"
        outlined
        dense
        :error="!!formErrors.grupoSanguineoDescripcion"
        :error-message="formErrors.grupoSanguineoDescripcion"
      />
      <div class="row justify-end q-mt-md">
        <q-btn
          label="Crear Grupo Sanguíneo"
          color="primary"
          icon="add"
          @click="guardarGrupoSanguineo"
        />
      </div>
    </q-form>
  </q-card>
</template>
<script setup>
import { reactive } from "vue";
import { useGrupoSanguineoStore } from "../stores/DatosGeneralesStores";
import { Notify } from "quasar";

// Inicializar tienda
const grupoSanguineoStore = useGrupoSanguineoStore();

// Datos reactivos
const grupoSanguineoData = reactive({ descripcion: "" });

// Estado de los errores de validación
const formErrors = reactive({
  grupoSanguineoDescripcion: "",
});

// Función para guardar el grupo sanguíneo
const guardarGrupoSanguineo = async () => {
  formErrors.grupoSanguineoDescripcion = "";
  if (!grupoSanguineoData.descripcion) {
    formErrors.grupoSanguineoDescripcion =
      "La descripción del grupo sanguíneo es obligatoria.";
    return;
  }
  try {
    await grupoSanguineoStore.agregarGrupoSanguineo(
      grupoSanguineoData.descripcion
    );
    Notify.create({
      type: "positive",
      message: "Grupo Sanguíneo creado exitosamente",
      position: "top-right",
    });
    grupoSanguineoData.descripcion = "";
  } catch (error) {
    Notify.create({
      type: "negative",
      message: "Error al crear grupo sanguíneo",
      position: "top-right",
    });
  }
};

// Función para eliminar el último grupo sanguíneo agregado
const eliminarGrupoSanguineo = async () => {
  try {
    await grupoSanguineoStore.eliminarUltimoGrupoSanguineo();
    Notify.create({
      type: "positive",
      message: "Grupo Sanguíneo eliminado exitosamente",
      position: "top-right",
    });
  } catch (error) {
    Notify.create({
      type: "negative",
      message: "Error al eliminar grupo sanguíneo",
      position: "top-right",
    });
  }
};
</script>
