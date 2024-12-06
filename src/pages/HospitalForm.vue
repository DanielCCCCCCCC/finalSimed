<template>
  <q-card class="q-pa-sm q-mt-md bg-grey-1 rounded formS shadow-2xl wide-card">
    <q-card-section class="text-h6 text-primary"> Hospitales </q-card-section>
    <q-form @submit.prevent="guardarHospital" class="q-gutter-md">
      <div class="row">
        <div class="col">
          <q-input
            class="q-mb-sm q-mr-sm"
            v-model="hospitalData.nombre"
            label="Nombre"
            outlined
            dense
            :error="!!hospitalErrors.nombre"
            :error-message="hospitalErrors.nombre"
          />
          <q-input
            class="q-mb-sm q-mr-sm"
            v-model="hospitalData.direccion"
            label="Dirección"
            outlined
            dense
            :error="!!hospitalErrors.direccion"
            :error-message="hospitalErrors.direccion"
          />
          <q-select
            class="q-mb-sm q-mr-sm"
            v-model="hospitalData.departamentoId"
            :options="departamentos"
            label="Departamento"
            option-value="id"
            option-label="descripcion"
            outlined
            dense
            :error="!!hospitalErrors.departamentoId"
            :error-message="hospitalErrors.departamentoId"
          />
          <q-select
            class="q-mb-sm q-mr-sm"
            v-model="hospitalData.municipioId"
            :options="filteredMunicipios"
            label="Municipio"
            option-value="id"
            option-label="descripcion"
            outlined
            dense
            :error="!!hospitalErrors.municipioId"
            :error-message="hospitalErrors.municipioId"
          />
        </div>
        <div class="col">
          <q-input
            class="q-mb-sm q-mr-sm"
            v-model="hospitalData.telefono"
            label="Teléfono"
            outlined
            dense
            mask="####-####"
            :error="!!hospitalErrors.telefono"
            :error-message="hospitalErrors.telefono"
          />
          <q-input
            class="q-mb-sm q-mr-sm"
            v-model="hospitalData.email"
            label="Email"
            type="email"
            outlined
            dense
            :error="!!hospitalErrors.email"
            :error-message="hospitalErrors.email"
          />
          <q-input
            class="q-mb-sm q-mr-sm"
            v-model="hospitalData.web"
            label="Web"
            outlined
            dense
            :error="!!hospitalErrors.web"
            :error-message="hospitalErrors.web"
          />
        </div>
      </div>
      <div class="row justify-end q-mt-md">
        <q-btn
          label="Guardar"
          color="primary"
          icon="add"
          @click="guardarHospital"
          class="q-mb-sm q-mr-sm"
        />
      </div>
    </q-form>
  </q-card>
  <div class="listado-componente q-tab-panel">
    <ListadoHospitales />
  </div>
</template>
<script setup>
import { reactive, ref, computed, onMounted, watch } from "vue";
import { useHospitalStore } from "../stores/DirectoriosStores";
import {
  useDepartamentoStore,
  useMunicipioStore,
} from "../stores/DatosGeneralesStores";
import { storeToRefs } from "pinia";
import { Notify } from "quasar";
import ListadoHospitales from "./ListadoHospitales.vue";

// Inicializar tiendas
const hospitalStore = useHospitalStore();
const departamentoStore = useDepartamentoStore();
const municipioStore = useMunicipioStore();

// Acceso a propiedades reactivas de las tiendas
const { departamentos } = storeToRefs(departamentoStore);
const { municipios } = storeToRefs(municipioStore);

// Datos reactivos para el formulario
const hospitalData = reactive({
  nombre: "",
  direccion: "",
  departamentoId: null,
  municipioId: null,
  telefono: "",
  email: "",
  web: "",
});

// Errores de validación
const hospitalErrors = reactive({
  nombre: "",
  direccion: "",
  departamentoId: "",
  municipioId: "",
  telefono: "",
  email: "",
  web: "",
});

// Computed para filtrar municipios según el departamento
const filteredMunicipios = computed(() => {
  if (!hospitalData.departamentoId) return [];
  const departamentoId =
    typeof hospitalData.departamentoId === "object"
      ? hospitalData.departamentoId.id
      : hospitalData.departamentoId;

  return municipios.value.filter(
    (municipio) => municipio.departamentoId === departamentoId
  );
});

watch(
  () => hospitalData.departamentoId,
  () => {
    hospitalData.municipioId = null;
  }
);

// Cargar datos al montar el componente
onMounted(async () => {
  await departamentoStore.cargarDepartamentos();
  await municipioStore.cargarMunicipios();
});

// Función para guardar hospital
const guardarHospital = async () => {
  // Reiniciar errores
  Object.keys(hospitalErrors).forEach((key) => {
    hospitalErrors[key] = "";
  });

  // Validación de campos obligatorios
  if (!hospitalData.nombre) hospitalErrors.nombre = "El nombre es obligatorio.";
  if (!hospitalData.direccion)
    hospitalErrors.direccion = "La dirección es obligatoria.";
  if (!hospitalData.departamentoId)
    hospitalErrors.departamentoId = "Seleccione un departamento.";
  if (!hospitalData.municipioId)
    hospitalErrors.municipioId = "Seleccione un municipio.";
  if (!hospitalData.telefono)
    hospitalErrors.telefono = "El teléfono es obligatorio.";
  if (!hospitalData.email) hospitalErrors.email = "El email es obligatorio.";

  if (Object.values(hospitalErrors).some((error) => error)) {
    Notify.create({
      type: "negative",
      position: "top-right",
      message: "Por favor, complete todos los campos obligatorios",
    });
    return;
  }

  // Preparar datos para guardar
  // const departamentoId =
  //   typeof hospitalData.departamentoId === "object"
  //     ? hospitalData.departamentoId.id
  //     : hospitalData.departamentoId;
  // const departamentoDescripcion =
  //   departamentos.value.find((dep) => dep.id === departamentoId)?.descripcion ||
  //   "";

  // const municipioId =
  //   typeof hospitalData.municipioId === "object"
  //     ? hospitalData.municipioId.id
  //     : hospitalData.municipioId;
  // // const municipioDescripcion =
  // //   municipios.value.find((mun) => mun.id === municipioId)?.descripcion || "";

  const hospitalInfo = {
    nombre: hospitalData.nombre,
    direccion: hospitalData.direccion,
    departamento_id: hospitalData.departamentoId.id, // Corregido
    municipio_id: hospitalData.municipioId.id,
    telefono: hospitalData.telefono,
    email: hospitalData.email,
    web: hospitalData.web,
  };

  try {
    await hospitalStore.agregarHospital(hospitalInfo);
    Notify.create({
      type: "positive",
      position: "top-right",
      message: "Hospital guardado correctamente",
    });
    // Limpiar formulario
    Object.keys(hospitalData).forEach((key) => {
      hospitalData[key] = "";
    });
  } catch (error) {
    Notify.create({
      type: "negative",
      position: "top-right",
      message: "Error al guardar el hospital",
    });
    console.error("Error al guardar hospital:", error);
  }
};
</script>
