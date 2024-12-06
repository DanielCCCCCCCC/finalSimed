<template>
  <div class="row">
    <div class="col-3">
      <q-list bordered>
        <q-item
          clickable
          v-ripple
          @click="subTab = 'Departamento'"
          :active="subTab === 'Departamento'"
        >
          <q-item-section>Departamento</q-item-section>
        </q-item>
        <q-item
          clickable
          v-ripple
          @click="subTab = 'Municipio'"
          :active="subTab === 'Municipio'"
        >
          <q-item-section>Municipio</q-item-section>
        </q-item>
      </q-list>
    </div>

    <div class="col-9">
      <q-tab-panels v-model="subTab" animated>
        <!-- Subpanel para Departamento -->
        <q-tab-panel name="Departamento">
          <q-card
            class="q-pa-sm q-mt-md formS bg-grey-1 rounded shadow-2xl wide-card"
          >
            <q-card-section class="text-h6 text-primary">
              Departamento
            </q-card-section>
            <q-form @submit.prevent="guardarDepartamento" class="q-gutter-md">
              <q-input
                v-model="departamentoData.descripcion"
                label="Descripción"
                outlined
                dense
                :error="!!formErrors.departamentoDescripcion"
                :error-message="formErrors.departamentoDescripcion"
              />
              <div class="row justify-end q-mt-md">
                <q-btn
                  label="Crear Departamento"
                  color="primary"
                  icon="add"
                  @click="guardarDepartamento"
                />
                <q-btn
                  label="Eliminar último agregado"
                  color="negative"
                  icon="delete"
                  @click="eliminarDepartamento"
                  class="q-ml-sm"
                />
              </div>
            </q-form>
          </q-card>
        </q-tab-panel>

        <!-- Subpanel para Municipio -->
        <q-tab-panel name="Municipio">
          <q-card
            class="q-pa-sm formS q-mt-md bg-grey-1 rounded shadow-2xl wide-card"
          >
            <q-card-section class="text-h6 text-primary">
              Municipio
            </q-card-section>
            <q-form @submit.prevent="guardarMunicipio" class="q-gutter-md">
              <q-select
                v-model="municipioData.departamentoId"
                :options="departamentos"
                option-value="id"
                option-label="descripcion"
                label="Departamento"
                outlined
                dense
                :error="!!formErrors.municipioDepartamento"
                :error-message="formErrors.municipioDepartamento"
              />
              <q-input
                v-model="municipioData.descripcion"
                label="Descripción"
                outlined
                dense
                :error="!!formErrors.municipioDescripcion"
                :error-message="formErrors.municipioDescripcion"
              />
              <div class="row justify-end q-mt-md">
                <q-btn
                  label="Crear Municipio"
                  color="primary"
                  icon="add"
                  @click="guardarMunicipio"
                />
                <q-btn
                  label="Eliminar último agregado"
                  color="negative"
                  icon="delete"
                  @click="eliminarMunicipio"
                  class="q-ml-sm"
                />
              </div>
            </q-form>
          </q-card>
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </div>
</template>
<script setup>
import { ref, reactive, onMounted } from "vue";
import {
  useDepartamentoStore,
  useMunicipioStore,
} from "../stores/DatosGeneralesStores";
import { storeToRefs } from "pinia";
import { Notify } from "quasar";

// Inicializar tiendas
const departamentoStore = useDepartamentoStore();
const municipioStore = useMunicipioStore();

// Datos reactivos
const departamentoData = reactive({ descripcion: "" });
const municipioData = reactive({ descripcion: "", departamentoId: null });

// Referencias a los datos
const { departamentos } = storeToRefs(departamentoStore);

// Estado de los errores de validación
const formErrors = reactive({
  departamentoDescripcion: "",
  municipioDepartamento: "",
  municipioDescripcion: "",
});

// Cargar datos al montar el componente
onMounted(() => {
  departamentoStore.cargarDepartamentos();
});

// Función para guardar el departamento
const guardarDepartamento = async () => {
  formErrors.departamentoDescripcion = "";
  if (!departamentoData.descripcion.trim()) {
    formErrors.departamentoDescripcion =
      "La descripción del departamento es obligatoria.";
    return;
  }
  try {
    await departamentoStore.agregarDepartamento(departamentoData.descripcion);
    Notify.create({
      type: "positive",
      message: "Departamento creado exitosamente",
      position: "top-right",
    });
    departamentoData.descripcion = "";
  } catch (error) {
    Notify.create({
      type: "negative",
      message: "Error al crear departamento",
      position: "top-right",
    });
    console.error("Error al crear departamento:", error);
  }
};

// Función para eliminar el último departamento agregado
const eliminarDepartamento = async () => {
  try {
    await departamentoStore.eliminarUltimoDepartamento();
    Notify.create({
      type: "positive",
      message: "Departamento eliminado exitosamente",
      position: "top-right",
    });
  } catch (error) {
    Notify.create({
      type: "negative",
      message: "Error al eliminar departamento",
      position: "top-right",
    });
    console.error("Error al eliminar departamento:", error);
  }
};

// Función para guardar el municipio
const guardarMunicipio = async () => {
  formErrors.municipioDepartamento = "";
  formErrors.municipioDescripcion = "";

  if (!municipioData.departamentoId) {
    formErrors.municipioDepartamento = "Seleccione un departamento.";
    return;
  }
  if (!municipioData.descripcion.trim()) {
    formErrors.municipioDescripcion = "La descripción es obligatoria.";
    return;
  }

  try {
    await municipioStore.agregarMunicipio(
      municipioData.descripcion,
      municipioData.departamentoId
    );
    Notify.create({
      type: "positive",
      message: "Municipio creado exitosamente",
      position: "top-right",
    });
    // Limpiar los campos después de guardar
    municipioData.descripcion = "";
    municipioData.departamentoId = null;
  } catch (error) {
    Notify.create({
      type: "negative",
      message: "Error al crear municipio",
      position: "top-right",
    });
    console.error("Error al crear municipio:", error);
  }
};

// Función para eliminar el último municipio agregado
const eliminarMunicipio = async () => {
  try {
    await municipioStore.eliminarUltimoMunicipio();
    Notify.create({
      type: "positive",
      message: "Municipio eliminado exitosamente",
      position: "top-right",
    });
  } catch (error) {
    Notify.create({
      type: "negative",
      message: "Error al eliminar municipio",
      position: "top-right",
    });
    console.error("Error al eliminar municipio:", error);
  }
};

// Control de las subpestañas
const subTab = ref("Departamento");
</script>
<style scoped>
.formS {
  border-top-left-radius: 40px;
  border-top-right-radius: 15px;
  border-bottom-right-radius: 30px;
  border-bottom-left-radius: 25px;
}

.wide-card {
  max-width: 700px;
  width: 100%;
  margin-bottom: 50px;
}

.text-primary {
  color: #1976d2;
}
</style>
