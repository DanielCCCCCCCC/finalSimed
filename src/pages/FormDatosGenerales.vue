<template>
  <q-page class="q-pa-md">
    <q-tabs
      v-model="tab"
      class="bg-white text-black q-mb-sm shadow-2 rounded-borders small-tabs"
    >
      <!-- Pestañas -->
      <q-tab
        name="Departamentos y Municipios"
        icon="location_city"
        label="Departamentos y Municipios"
      />
      <q-tab name="Grupo Sanguíneo" icon="bloodtype" label="Grupo Sanguíneo" />
      <q-tab name="Escolaridad" icon="school" label="Escolaridad" />
      <q-tab name="Estado Civil" icon="favorite" label="Estado Civil" />
    </q-tabs>

    <q-tab-panels v-model="tab" animated swipeable>
      <!-- Panel para Departamentos y Municipios -->
      <q-tab-panel name="Departamentos y Municipios">
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
                <q-card class="q-pa-md q-mt-md wider-card">
                  <q-card-section class="text-h6">
                    Departamento
                  </q-card-section>
                  <q-form
                    @submit.prevent="guardarDepartamento"
                    class="q-gutter-md"
                  >
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
                    </div>
                  </q-form>
                </q-card>
              </q-tab-panel>

              <!-- Subpanel para Municipio -->
              <q-tab-panel name="Municipio">
                <q-card class="q-pa-md q-mt-md wider-card">
                  <q-card-section class="text-h6"> Municipio </q-card-section>
                  <q-form
                    @submit.prevent="guardarMunicipio"
                    class="q-gutter-md"
                  >
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
                      emit-value
                      map-options
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
                    </div>
                  </q-form>
                </q-card>
              </q-tab-panel>
            </q-tab-panels>
          </div>
          <ListadoMunicipios />
        </div>
      </q-tab-panel>

      <!-- Panel para Grupo Sanguíneo -->
      <q-tab-panel name="Grupo Sanguíneo">
        <FormularioGrupoSanguineo />
        <ListadoGrupoSanguineo />
      </q-tab-panel>

      <!-- Panel para Escolaridad -->
      <q-tab-panel name="Escolaridad">
        <FormularioEscolaridad />
        <ListadoTipoEscolaridad />
      </q-tab-panel>

      <!-- Panel para Estado Civil -->
      <q-tab-panel name="Estado Civil">
        <FormularioEstadoCivil />
        <ListadoTipoEstadoCivil />
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import {
  useDepartamentoStore,
  useMunicipioStore,
} from "../stores/DatosGeneralesStores";
import ListadoMunicipios from "./ListadoMunicipios.vue";
import FormularioGrupoSanguineo from "./FormularioGrupoSanguineo.vue";
import ListadoGrupoSanguineo from "./ListadoGrupoSanguineo.vue";
import FormularioEscolaridad from "./FormularioEscolaridad.vue";
import ListadoTipoEscolaridad from "./ListadoTipoEscolaridad.vue";
import FormularioEstadoCivil from "./FormularioEstadoCivil.vue";
import ListadoTipoEstadoCivil from "./ListadoTipoEstadoCivil.vue";

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

// Funciones de guardar y eliminar para Departamento y Municipio
const guardarDepartamento = async () => {
  formErrors.departamentoDescripcion = "";
  if (!departamentoData.descripcion) {
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

const guardarMunicipio = async () => {
  // console.log("departamentoId seleccionado:", municipioData.departamentoId);

  formErrors.municipioDepartamento = "";
  formErrors.municipioDescripcion = "";

  if (!municipioData.departamentoId) {
    formErrors.municipioDepartamento = "Seleccione un departamento.";
    return;
  }
  if (!municipioData.descripcion) {
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

// Funciones para eliminar el último Departamento y Municipio agregado
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

// Tabs de control
const tab = ref("Departamentos y Municipios");
const subTab = ref("Departamento");
</script>
<style scoped>
/* .q-card {
  max-width: 1100px;
  margin: 0 auto;
}

.wide-card {
  max-width: 700px;
  width: 100%;
  margin-bottom: 50px;
}

.q-tab-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.listado-componente {
  max-width: 1800px;
  width: 100%;
  margin: 50px auto;
}

.text-primary {
  color: #1976d2;
}
.formS {
  border-top-left-radius: 40px;
  border-top-right-radius: 15px;
  border-bottom-right-radius: 30px;
  border-bottom-left-radius: 25px;
} */

.wider-card {
  max-width: 800px;
  margin: auto;
}

.q-input,
.q-select {
  font-size: 14px;
}

.q-card-section {
  font-size: 16px;
}
</style>
