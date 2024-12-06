<template>
  <q-card class="q-pa-sm q-mt-md bg-grey-1 rounded formS shadow-2xl wide-card">
    <q-card-section class="text-h6 text-primary">
      Exámenes y Estudios
    </q-card-section>
    <q-form @submit.prevent="guardarEstudio" class="q-gutter-md">
      <div class="row">
        <div class="col">
          <q-input
            class="q-mb-sm q-mr-sm"
            v-model="estudioData.codigo"
            label="Código"
            outlined
            dense
            :error="!!estudioErrors.codigo"
            :error-message="estudioErrors.codigo"
          />
          <q-input
            class="q-mb-sm q-mr-sm"
            v-model="estudioData.descripcion"
            label="Descripción"
            outlined
            dense
            :error="!!estudioErrors.descripcion"
            :error-message="estudioErrors.descripcion"
          />
          <q-select
            class="q-mb-sm q-mr-sm"
            v-model="estudioData.tipoId"
            :options="estudios"
            option-value="id"
            option-label="descripcion"
            label="Tipo de estudio"
            outlined
            dense
            :error="!!estudioErrors.tipoId"
            :error-message="estudioErrors.tipoId"
          />
          <q-input
            class="q-mb-sm q-mr-sm"
            v-model="estudioData.indicaciones"
            label="Indicaciones"
            type="textarea"
            outlined
            dense
            :error="!!estudioErrors.indicaciones"
            :error-message="estudioErrors.indicaciones"
          />
        </div>
        <div class="col">
          <q-input
            class="q-mb-sm q-mr-sm"
            v-model="estudioData.precioCosto"
            label="Precio Costo"
            outlined
            dense
            :error="!!estudioErrors.precioCosto"
            :error-message="estudioErrors.precioCosto"
          />
          <q-input
            class="q-mb-sm q-mr-sm"
            v-model="estudioData.precioVenta"
            label="Precio Venta"
            outlined
            dense
            :error="!!estudioErrors.precioVenta"
            :error-message="estudioErrors.precioVenta"
          />
          <q-checkbox
            class="q-mb-sm q-mr-sm"
            v-model="estudioData.facturar"
            label="Facturar"
          />
          <q-select
            class="q-mb-sm q-mr-sm"
            v-model="estudioData.status"
            :options="statusExamenEstudios"
            option-value="id"
            option-label="descripcion"
            label="Status"
            outlined
            dense
            :error="!!estudioErrors.status"
            :error-message="estudioErrors.status"
          />
        </div>
      </div>
      <div class="row justify-end q-mt-md">
        <q-btn
          label="Guardar"
          color="primary"
          icon="save"
          type="submit"
          class="q-mb-sm q-mr-sm"
        />
      </div>
    </q-form>
  </q-card>
  <div class="listado-componente q-tab-panel">
    <ListadoExamenesEstudios />
  </div>
</template>
<script setup>
import { reactive, ref, onMounted } from "vue";
import { useEstudioStore } from "../stores/DirectoriosStores";
import { useTiposEstudiosStore } from "../stores/ConfiMedicasStores";
import { useStatusExamenEstudiosStore } from "../stores/statusExamenEstudio";
import { storeToRefs } from "pinia";
import { Notify } from "quasar";
import ListadoExamenesEstudios from "./ListadoExamenesEstudios.vue";

// Inicializar tiendas
const estudioStore = useEstudioStore();
const tiposEstudiosStore = useTiposEstudiosStore();
const examenEstudiosStore = useStatusExamenEstudiosStore();

// Acceso a propiedades reactivas de las tiendas
const { estudios } = storeToRefs(tiposEstudiosStore);
const { statusExamenEstudios } = storeToRefs(examenEstudiosStore);

// Datos reactivos para el formulario
const estudioData = reactive({
  codigo: "",
  descripcion: "",
  tipoId: "",
  indicaciones: "",
  precioCosto: "",
  precioVenta: "",
  facturar: false,
  status: "",
});

// Errores de validación
const estudioErrors = reactive({
  codigo: "",
  descripcion: "",
  tipoId: "",
  indicaciones: "",
  precioCosto: "",
  precioVenta: "",
  status: "",
});

// Cargar datos al montar el componente
onMounted(async () => {
  try {
    await Promise.all([
      tiposEstudiosStore.cargarEstudios(),
      examenEstudiosStore.cargarStatusExamenEstudios(),
    ]);
  } catch (error) {
    console.error("Error al cargar datos:", error);
  }
});

// Función para guardar estudio
const guardarEstudio = async () => {
  // Limpiar errores previos
  Object.keys(estudioErrors).forEach((key) => (estudioErrors[key] = ""));

  // Validaciones
  if (!estudioData.codigo) estudioErrors.codigo = "Ingrese un código.";
  if (!estudioData.descripcion)
    estudioErrors.descripcion = "Ingrese una descripción.";
  if (!estudioData.tipoId)
    estudioErrors.tipoId = "Seleccione un tipo de estudio.";
  if (!estudioData.precioCosto)
    estudioErrors.precioCosto = "Ingrese el precio de costo.";
  if (!estudioData.precioVenta)
    estudioErrors.precioVenta = "Ingrese el precio de venta.";
  if (!estudioData.status) estudioErrors.status = "Seleccione un status.";

  // Si hay errores, detener
  if (Object.values(estudioErrors).some((error) => error)) {
    Notify.create({
      type: "negative",
      message: "Por favor corrija los errores en el formulario.",
      position: "top-right",
    });
    return;
  }

  try {
    const estudio = {
      ...estudioData,
      tipoId:
        typeof estudioData.tipoId === "object"
          ? estudioData.tipoId.id
          : estudioData.tipoId,
      status:
        typeof estudioData.status === "object"
          ? estudioData.status.id
          : estudioData.status,
    };

    // Guardar el estudio
    await estudioStore.agregarEstudio(estudio);

    Notify.create({
      type: "positive",
      message: "Estudio guardado con éxito.",
      position: "top-right",
    });

    // Limpiar formulario
    Object.keys(estudioData).forEach((key) => {
      estudioData[key] = key === "facturar" ? false : "";
    });
  } catch (error) {
    console.error("Error al guardar estudio:", error);
    Notify.create({
      type: "negative",
      message: "Error al guardar el estudio.",
      position: "top-right",
    });
  }
};
</script>
