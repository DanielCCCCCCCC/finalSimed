<template>
  <q-page class="q-pa-md">
    <q-tabs
      v-model="tab"
      class="bg-white text-black q-mb-sm shadow-2 rounded-borders small-tabs"
      @update:model-value="onTabChange"
    >
      <q-tab
        name="ClasificacionDiagnosticos"
        icon="list"
        label="Clasificación de Diagnósticos"
      />
      <q-tab name="Diagnosticos" icon="assignment" label="Diagnósticos" />
      <q-tab
        name="ControlesMedicion"
        icon="bar_chart"
        label="Controles de Medición"
      />
    </q-tabs>

    <q-tab-panels v-model="tab" animated swipeable>
      <!-- Clasificación de Diagnósticos -->
      <q-tab-panel name="ClasificacionDiagnosticos">
        <q-card class="q-pa-sm bg-grey-1 formS rounded shadow-2xl wide-card">
          <q-card-section class="text-h6 text-primary">
            Clasificación de Diagnósticos
          </q-card-section>
          <q-form @submit.prevent="guardarClasificacion" class="q-gutter-md">
            <q-input
              v-model="clasificacionData.nombre"
              label="Nombre"
              outlined
              dense
              :error="!!formErrors.clasificacionNombre"
              :error-message="formErrors.clasificacionNombre"
            />
            <div class="row justify-end q-mt-md">
              <q-btn
                label="Crear"
                color="primary"
                icon="add"
                @click="guardarClasificacion"
              />
            </div>
          </q-form>
        </q-card>
        <ListadoClasificacionDiagnostico />
      </q-tab-panel>

      <!-- Diagnósticos -->
      <q-tab-panel name="Diagnosticos">
        <!-- Formulario de creación de diagnóstico -->
        <q-card class="q-pa-sm bg-grey-1 formS rounded shadow-2xl wide-card">
          <q-card-section class="text-h6 text-primary">
            Diagnósticos
          </q-card-section>
          <q-form @submit.prevent="guardarDiagnostico" class="q-gutter-md">
            <q-input
              v-model="diagnosticoData.descripcion"
              label="Descripción"
              outlined
              dense
              :error="!!formErrors.diagnosticoDescripcion"
              :error-message="formErrors.diagnosticoDescripcion"
            />
            <q-select
              v-model="diagnosticoData.clasificacionId"
              :options="opcionesClasificaciones"
              option-value="id"
              option-label="label"
              label="Clasificación"
              outlined
              dense
              :error="!!formErrors.diagnosticoClasificacion"
              :error-message="formErrors.diagnosticoClasificacion"
              emit-value
              map-options
            />

            <div class="row justify-end q-mt-md q-ml-xl q-mr-xl">
              <q-btn
                label="Crear"
                color="primary"
                icon="add"
                @click="guardarDiagnostico"
              />
            </div>
          </q-form>
        </q-card>
        <ListadoDiagnosticos />
      </q-tab-panel>

      <!-- Controles de Medición -->
      <q-tab-panel name="ControlesMedicion">
        <q-card class="q-pa-sm bg-grey-1 formS rounded shadow-2xl wide-card">
          <q-card-section class="text-h6 text-primary">
            Controles de Medición
          </q-card-section>
          <q-form @submit.prevent="guardarControl" class="q-gutter-md">
            <q-input
              v-model="controlData.descripcion"
              label="Descripción"
              outlined
              dense
              :error="!!formErrors.controlDescripcion"
              :error-message="formErrors.controlDescripcion"
            />
            <div class="row justify-end q-mt-md q-ml-xl q-mr-xl">
              <q-btn
                label="Crear"
                color="primary"
                icon="add"
                @click="guardarControl"
              />
            </div>
          </q-form>
        </q-card>
        <ListadoControlMedicion />
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watch } from "vue";
import { Notify } from "quasar";
import { useRoute, useRouter } from "vue-router";
import {
  useClasificacionDiagnosticosStore,
  useDiagnosticosStore,
  useControlesMedicionStore,
} from "../stores/DiagnosticosStores";
import { storeToRefs } from "pinia";
import ListadoClasificacionDiagnostico from "./ListadoClasificacionDiagnostico.vue";
import ListadoDiagnosticos from "./ListadoDiagnosticos.vue";
import ListadoControlMedicion from "./ListadoControlMedicion.vue";

// Inicializar tiendas
const clasificacionDiagnosticosStore = useClasificacionDiagnosticosStore();
const diagnosticosStore = useDiagnosticosStore();
const controlesMedicionStore = useControlesMedicionStore();

// Datos reactivos
const clasificacionData = reactive({ nombre: "" });
const diagnosticoData = reactive({ descripcion: "", clasificacionId: null });
const controlData = reactive({ descripcion: "" });

// Referencias a los datos de la tienda
const { clasificaciones } = storeToRefs(clasificacionDiagnosticosStore);

// Opciones de clasificación para el select
const opcionesClasificaciones = computed(() =>
  clasificaciones.value.map((clasificacion) => ({
    label: clasificacion.nombre,
    id: clasificacion.id,
  }))
);

// Estado de los errores de validación
const formErrors = reactive({
  clasificacionNombre: "",
  diagnosticoDescripcion: "",
  diagnosticoClasificacion: "",
  controlDescripcion: "",
});

// Acceder a la ruta y al router
const route = useRoute();
const router = useRouter();

// Definir las pestañas disponibles
const pestañasDisponibles = [
  "ClasificacionDiagnosticos",
  "Diagnosticos",
  "ControlesMedicion",
];

// Inicializar la pestaña activa desde el parámetro de consulta o por defecto
const tab = ref("ClasificacionDiagnosticos");

const inicializarTab = () => {
  const tabQuery = route.query.tab;
  if (tabQuery && pestañasDisponibles.includes(tabQuery)) {
    tab.value = tabQuery;
  }
};

// Llamar a la función al montar el componente
onMounted(() => {
  inicializarTab();

  // Cargar datos al montar el componente
  clasificacionDiagnosticosStore.cargarClasificaciones();
  diagnosticosStore.cargarDiagnosticos();
  controlesMedicionStore.cargarControles();
});

// Función para manejar el cambio de pestaña y actualizar la URL
const onTabChange = (nuevaTab) => {
  router.replace({ query: { ...route.query, tab: nuevaTab } });
};

// Observar cambios en la ruta para actualizar la pestaña si la URL cambia
watch(
  () => route.query.tab,
  (nuevaTab) => {
    if (nuevaTab && pestañasDisponibles.includes(nuevaTab)) {
      tab.value = nuevaTab;
    }
  }
);

// Funciones de guardar y eliminar
const guardarClasificacion = async () => {
  formErrors.clasificacionNombre = "";
  if (!clasificacionData.nombre) {
    formErrors.clasificacionNombre =
      "El nombre de la clasificación es obligatorio.";
    return;
  }
  try {
    await clasificacionDiagnosticosStore.agregarClasificacion(
      clasificacionData.nombre
    );
    clasificacionData.nombre = ""; // Limpiar campo
    Notify.create({
      message: "Clasificación guardada",
      position: "top-right",
      color: "positive",
    });
  } catch (error) {
    console.error("Error al guardar la clasificación:", error);
    Notify.create({
      message: "Error al guardar la clasificación",
      position: "top-right",
      color: "negative",
    });
  }
};

const guardarDiagnostico = async () => {
  // Limpiar errores anteriores
  formErrors.diagnosticoDescripcion = "";
  formErrors.diagnosticoClasificacion = "";

  // Validar campos
  if (!diagnosticoData.descripcion) {
    formErrors.diagnosticoDescripcion =
      "La descripción del diagnóstico es obligatoria.";
    return;
  }

  if (!diagnosticoData.clasificacionId) {
    formErrors.diagnosticoClasificacion =
      "La clasificación del diagnóstico es obligatoria.";
    return;
  }

  // Verificar los datos antes de guardar
  // console.log("Datos a guardar:", diagnosticoData);

  try {
    // Llamamos a agregarDiagnostico pasando los parámetros por separado
    await diagnosticosStore.agregarDiagnostico(
      diagnosticoData.descripcion,
      diagnosticoData.clasificacionId
    );

    // Limpiar campos después de guardar
    diagnosticoData.descripcion = "";
    diagnosticoData.clasificacionId = null;

    // Mostrar notificación
    Notify.create({
      message: "Diagnóstico guardado con éxito.",
      position: "top-right",
      color: "positive",
    });
  } catch (error) {
    console.error("Error al guardar el diagnóstico:", error);
    Notify.create({
      message: "Hubo un error al guardar el diagnóstico.",
      position: "top-right",
      color: "negative",
    });
  }
};

const guardarControl = async () => {
  formErrors.controlDescripcion = "";
  if (!controlData.descripcion) {
    formErrors.controlDescripcion =
      "La descripción del control es obligatoria.";
    return;
  }
  try {
    await controlesMedicionStore.agregarControl(controlData.descripcion);
    controlData.descripcion = ""; // Limpiar campo
    Notify.create({
      message: "Control guardado",
      position: "top-right",
      color: "positive",
    });
  } catch (error) {
    console.error("Error al guardar el control:", error);
    Notify.create({
      message: "Error al guardar el control",
      position: "top-right",
      color: "negative",
    });
  }
};
</script>
<style scoped>
.q-page {
  background-color: #f9f9f9;
}

.small-tabs .q-tab {
  font-size: 14px;
}

.wide-card {
  max-width: 800px;
  margin: auto;
}

.text-primary {
  color: #1976d2;
}

.q-mt-md {
  margin-top: 16px;
}
</style>
