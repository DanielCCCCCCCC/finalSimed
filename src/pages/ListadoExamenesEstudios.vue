<template>
  <div class="row justify-center espaciadoLateral q-py-md">
    <div id="app-container" class="q-mb-xl q-px-xl q-pa-xs">
      <!-- Encabezado y botón para agregar nuevo estudio -->
      <div class="q-pb-md">
        <div class="row items-center">
          <div class="header-container">
            <h4 class="header-title">Estudios y Exámenes Existentes</h4>
            <p class="parrafo">
              Catálogo de estudios y exámenes del centro médico
            </p>
          </div>
          <div>
            <q-btn
              label="Nuevo Estudio"
              flat
              class="btn btn-primary"
              @click="abrirDialogoNuevoEstudio"
            />
          </div>
        </div>
      </div>

      <!-- DataGrid para estudios -->
      <DxDataGrid
        :data-source="estudiosConDetalles"
        :allow-column-reordering="true"
        :column-auto-width="true"
        :column-resizing-mode="'widget'"
        :row-alternation-enabled="true"
        :show-borders="true"
        key-expr="id"
        class="custom-data-grid"
      >
        <DxPaging :enabled="true" :page-size="10" />
        <!-- <DxScrolling mode="virtual" /> -->
        <DxSorting mode="multiple" />
        <DxHeaderFilter :visible="true" />
        <DxColumnChooser :enabled="true" />
        <DxLoadPanel :show-pane="true" />
        <!-- <DxSelection
          select-all-mode="allPages"
          show-check-boxes-mode="always"
          mode="multiple"
        /> -->
        <DxSearchPanel
          :width="300"
          :visible="true"
          placeholder="Buscar Estudio"
        />

        <!-- Columnas -->
        <DxColumn data-field="codigo" caption="Código" width="100px">
          <DxRequiredRule />
        </DxColumn>
        <DxColumn data-field="descripcion" caption="Descripción">
          <DxRequiredRule />
        </DxColumn>
        <!-- Columna con lookup para mostrar descripción del tipo -->
        <DxColumn data-field="tipoDescripcion" caption="Tipo">
          <DxRequiredRule />
        </DxColumn>
        <DxColumn data-field="indicaciones" caption="Indicaciones" />
        <DxColumn data-field="precioCosto" caption="Precio Costo" width="120px">
          <template #cell-template="{ data }">
            <span>LPS {{ data.value.toFixed(2) }}</span>
          </template>
        </DxColumn>

        <DxColumn data-field="precioVenta" caption="Precio Venta" width="120px">
          <template #cell-template="{ data }">
            <span>LPS {{ data.value.toFixed(2) }}</span>
          </template>
        </DxColumn>
        <!-- Columna con lookup para mostrar descripción del status -->
        <DxColumn data-field="facturar" caption="facturar" />
        <DxColumn data-field="statusDescripcion" caption="Status" />

        <DxEditing
          mode="popup"
          :allow-updating="true"
          :allow-deleting="true"
          :popup="{
            title: 'Editar Información del Estudio',
            showTitle: true,
            width: 700,
            height: 470,
          }"
        />

        <!-- Botones de acción -->
        <DxColumn type="buttons">
          <DxButton
            name="edit"
            icon="edit"
            hint="Editar"
            @click="abrirFormularioEdicion"
          />
          <DxButton
            name="delete"
            icon="trash"
            hint="Eliminar"
            @click="eliminarEstudio"
          />
        </DxColumn>
      </DxDataGrid>

      <!-- Diálogo Modal para Agregar/Editar Estudio -->
      <q-dialog v-model="dialogoEstudio" persistent max-width="600px">
        <q-card class="form-card shadow-2 rounded-borders">
          <q-card-section>
            <div class="q-mb-md flex justify-between items-center">
              <h2 class="text-h4 text-primary">
                {{ isEditMode ? "Editar Estudio" : "Agregar Estudio" }}
              </h2>
              <q-btn
                label="Cerrar"
                color="secondary"
                icon="close"
                flat
                @click="cerrarDialogo"
                class="btnCerrarModal"
              />
            </div>

            <q-form @submit.prevent="guardarEstudio">
              <div class="row q-col-gutter-sm">
                <div class="col-12 col-md-6 mb-3">
                  <q-input
                    v-model="formData.codigo"
                    label="Código"
                    outlined
                    dense
                    :disable="isEditMode"
                    :error="!!formErrors.codigo"
                    :error-message="formErrors.codigo"
                    required
                  />
                </div>

                <div class="col-12 col-md-6 mb-3">
                  <q-input
                    v-model="formData.descripcion"
                    label="Descripción"
                    outlined
                    dense
                    :error="!!formErrors.descripcion"
                    :error-message="formErrors.descripcion"
                    required
                  />
                </div>

                <div class="col-12 col-md-6 mb-3">
                  <q-select
                    v-model="formData.tipoId"
                    :options="tiposEstudios"
                    option-value="id"
                    option-label="descripcion"
                    label="Tipo de Estudio"
                    outlined
                    dense
                    :error="!!formErrors.tipoId"
                    :error-message="formErrors.tipoId"
                    required
                    emit-value
                    map-options
                  />
                </div>

                <div class="col-12 col-md-6 mb-3">
                  <q-input
                    v-model="formData.indicaciones"
                    label="Indicaciones"
                    type="textarea"
                    outlined
                    dense
                  />
                </div>

                <div class="col-12 col-md-6 mb-3">
                  <q-input
                    v-model="formData.precioCosto"
                    label="Precio Costo"
                    type="number"
                    outlined
                    dense
                    :error="!!formErrors.precioCosto"
                    :error-message="formErrors.precioCosto"
                    required
                  />
                </div>

                <div class="col-12 col-md-6 mb-3">
                  <q-input
                    v-model="formData.precioVenta"
                    label="Precio Venta"
                    type="number"
                    outlined
                    dense
                    :error="!!formErrors.precioVenta"
                    :error-message="formErrors.precioVenta"
                    required
                  />
                </div>
                <div class="col-12 col-md-6 mb-3">
                  <q-checkbox
                    v-model="formData.facturar"
                    label="Facturar"
                    outlined
                    class="w-10"
                  />
                </div>
                <div class="col-12 col-md-6 mb-3">
                  <q-select
                    v-model="formData.status"
                    :options="statusExamenEstudios"
                    option-value="id"
                    option-label="descripcion"
                    label="Status"
                    outlined
                    dense
                    :error="!!formErrors.status"
                    :error-message="formErrors.status"
                    emit-value
                    map-options
                  />
                </div>
              </div>

              <div class="flex justify-center q-mt-sm">
                <q-btn
                  :label="isEditMode ? 'Actualizar Estudio' : 'Guardar Estudio'"
                  color="primary"
                  type="submit"
                  class="btn-primary"
                  style="font-size: 14px; padding: 8px 16px"
                />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </q-dialog>
    </div>
  </div>
</template>
<script setup>
import {
  DxDataGrid,
  DxColumn,
  DxPaging,
  DxFilterRow,
  DxHeaderFilter,
  DxButton,
  DxEditing,
  DxRequiredRule,
  DxColumnChooser,
  DxScrolling,
  DxSorting,
  DxLoadPanel,
  DxSearchPanel,
} from "devextreme-vue/data-grid";
import { ref, computed, onMounted } from "vue";
import { useQuasar, Notify } from "quasar";
import { storeToRefs } from "pinia";

import { useEstudioStore } from "../stores/DirectoriosStores";
import { useTiposEstudiosStore } from "../stores/ConfiMedicasStores";
import { useStatusExamenEstudiosStore } from "../stores/statusExamenEstudio";

// Instancias de las tiendas
const estudioStore = useEstudioStore();
const tiposEstudiosStore = useTiposEstudiosStore();
const statusExamenEstudiosStore = useStatusExamenEstudiosStore();

// Referencias a los datos de las tiendas
const { estudios } = storeToRefs(estudioStore);
const { estudios: tiposEstudios } = storeToRefs(tiposEstudiosStore); // Corregido
const { statusExamenEstudios } = storeToRefs(statusExamenEstudiosStore);

// Estado para el modal
const dialogoEstudio = ref(false);
const isEditMode = ref(false);
const selectedEstudioId = ref(null); // Cambiado a ref

// Formulario de datos
const formData = ref({
  codigo: "",
  descripcion: "",
  tipoId: null,
  indicaciones: "",
  precioCosto: "",
  precioVenta: "",
  facturar: false,
  status: null,
});

// Errores del formulario
const formErrors = ref({});

// Cargar datos al montar el componente
onMounted(async () => {
  try {
    await Promise.all([
      estudioStore.cargarEstudios(),
      tiposEstudiosStore.cargarEstudios(), // Asegurar que cargue tiposEstudios
      statusExamenEstudiosStore.cargarStatusExamenEstudios(),
    ]);
  } catch (error) {
    console.error("Error al cargar datos:", error);
    Notify.create({
      message: "Error al cargar los datos iniciales.",
      color: "negative",
      position: "top-right",
    });
  }
});

// Computed para agregar descripciones a los estudios
const estudiosConDetalles = computed(() => {
  console.log("estudios:", estudios.value);
  console.log("tiposEstudios:", tiposEstudios.value);
  console.log("statusExamenEstudios:", statusExamenEstudios.value);

  if (!estudios.value || !tiposEstudios.value || !statusExamenEstudios.value) {
    return [];
  }

  return estudios.value.map((estudio) => {
    const tipo = tiposEstudios.value.find((t) => t.id === estudio.tipoId);
    const status = statusExamenEstudios.value.find(
      (s) => s.id === estudio.status
    );
    return {
      ...estudio,
      tipoDescripcion: tipo ? tipo.descripcion : "Tipo no encontrado",
      statusDescripcion: status ? status.descripcion : "Status no encontrado",
    };
  });
});

// Función para abrir el diálogo de nuevo estudio
function abrirDialogoNuevoEstudio() {
  isEditMode.value = false;
  resetFormulario();
  dialogoEstudio.value = true;
}

// Función para cerrar el diálogo
function cerrarDialogo() {
  dialogoEstudio.value = false;
  resetFormulario();
}

// Función para resetear el formulario
function resetFormulario() {
  formData.value = {
    codigo: "",
    descripcion: "",
    tipoId: null,
    indicaciones: "",
    precioCosto: "",
    precioVenta: "",
    facturar: false,
    status: null,
  };
  formErrors.value = {};
  isEditMode.value = false;
  selectedEstudioId.value = null; // Resetear el ID seleccionado
}

// Función para abrir el formulario de edición
function abrirFormularioEdicion(e) {
  const estudio = e.row.data; // Asegurar que recibes el objeto del row
  isEditMode.value = true;
  selectedEstudioId.value = estudio.id; // Usar ref
  formData.value = {
    codigo: estudio.codigo || "",
    descripcion: estudio.descripcion || "",
    tipoId: estudio.tipoId || null,
    indicaciones: estudio.indicaciones || "",
    precioCosto: estudio.precioCosto || "",
    precioVenta: estudio.precioVenta || "",
    facturar: estudio.facturar || false,
    status: estudio.status || null,
  };
  dialogoEstudio.value = true;
}

// Función para guardar o actualizar el estudio
async function guardarEstudio() {
  // Validar campos requeridos
  formErrors.value = {};
  if (!formData.value.codigo && !isEditMode.value)
    formErrors.value.codigo = "El código es obligatorio.";
  if (!formData.value.descripcion)
    formErrors.value.descripcion = "La descripción es obligatoria.";
  if (!formData.value.tipoId)
    formErrors.value.tipoId = "El tipo es obligatorio.";
  if (!formData.value.precioCosto)
    formErrors.value.precioCosto = "El precio costo es obligatorio.";
  if (!formData.value.precioVenta)
    formErrors.value.precioVenta = "El precio venta es obligatorio.";

  if (Object.keys(formErrors.value).length > 0) {
    Notify.create({
      message: "Por favor, corrige los errores en el formulario.",
      color: "negative",
      position: "top-right",
    });
    return;
  }

  try {
    const estudioData = {
      codigo: formData.value.codigo,
      descripcion: formData.value.descripcion,
      tipoId: formData.value.tipoId, // bigint (ID)
      indicaciones: formData.value.indicaciones,
      precioCosto: formData.value.precioCosto,
      precioVenta: formData.value.precioVenta,
      facturar: formData.value.facturar,
      status: formData.value.status, // bigint (ID)
    };

    // Verificar que tipoId y status son números
    console.log("Tipo ID:", estudioData.tipoId);
    console.log("Status ID:", estudioData.status);

    if (isEditMode.value && selectedEstudioId.value) {
      console.log("Actualizando Estudio con ID:", selectedEstudioId.value);
      console.log("Datos para actualizar:", estudioData);
      await estudioStore.actualizarEstudio({
        id: selectedEstudioId.value, // Usar 'id' en lugar de 'codigo'
        ...estudioData,
      });
      Notify.create({
        type: "positive",
        message: "Estudio actualizado con éxito",
        position: "top-right",
      });
    } else {
      console.log("Agregando nuevo Estudio:", estudioData);
      await estudioStore.agregarEstudio(estudioData);
      Notify.create({
        type: "positive",
        message: "Estudio agregado con éxito",
        position: "top-right",
      });
    }

    await estudioStore.cargarEstudios(); // Actualizar el listado
    cerrarDialogo();
  } catch (error) {
    console.error("Error al guardar el estudio:", error);
    Notify.create({
      type: "negative",
      message: "Hubo un error al guardar el estudio",
      position: "top-right",
    });
  }
}

// Función para eliminar un estudio
async function eliminarEstudio(e) {
  try {
    const estudioId = e.row.data.id; // Usar 'id' en lugar de 'codigo'
    console.log("Eliminando Estudio con ID:", estudioId);
    await estudioStore.eliminarEstudio(estudioId);
    Notify.create({
      type: "positive",
      message: "Estudio eliminado exitosamente",
      position: "top-right",
    });
    await estudioStore.cargarEstudios();
  } catch (error) {
    Notify.create({
      type: "negative",
      message: "Error al eliminar el estudio",
      position: "top-right",
    });
    console.error("Error al eliminar estudio:", error);
  }
}
</script>

<style scoped>
#app-container {
  padding: 20px;
  background-color: #f9f9f9;
  margin: 0 20px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 93%;
}

.form-card {
  max-width: 800px;
  width: 100%;
  margin: auto;
  background-color: #ffffff;
  border-radius: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.espaciadoLateral {
  margin-left: 70px;
}

.fsButton {
  font-size: 16px;
}

.btnCerrarModal {
  font-size: 16px;
}

.custom-data-grid {
  background-color: #ffffff;
  border-radius: 8px;
  overflow: hidden;
  width: 100%;
  /* box-shadow: 0 4px 8px rgba(14, 70, 192, 0.1); */
}

.dx-datagrid-header-panel {
  background-color: #1976d2;
  color: #ffffff;
}

.dx-datagrid-row-alternation-enabled .dx-row {
  background-color: #f1f1f1;
}

.dx-datagrid .dx-command-edit .dx-button {
  background-color: transparent;
  border: none;
  color: #1976d2;
}

.dx-datagrid .dx-command-edit .dx-button:hover {
  color: #1565c0;
}

@media (max-width: 1024px) {
  .form-card {
    max-width: 700px;
  }
}

@media (max-width: 768px) {
  .form-card {
    max-width: 100%;
  }
}
</style>
