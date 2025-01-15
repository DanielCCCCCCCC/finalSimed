<template>
  <div class="row justify-center espaciadoLateral q-py-md">
    <div id="app-container" class="container-fluid p-3 q-mb-xl q-px-xl q-pa-xs">
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
        key-expr="EstudioId"
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

        <DxColumn data-field="Codigo" caption="Código" width="100px">
          <DxRequiredRule />
        </DxColumn>
        <DxColumn data-field="Descripcion" caption="Descripción">
          <DxRequiredRule />
        </DxColumn>
        <DxColumn data-field="TipoDescripcion" caption="Tipo">
          <DxRequiredRule />
        </DxColumn>
        <DxColumn data-field="Indicaciones" caption="Indicaciones" />
        <DxColumn data-field="PrecioCosto" caption="Precio Costo" width="120px">
          <template #cell-template="{ data }">
            <span>LPS {{ data.value.toFixed(2) }}</span>
          </template>
        </DxColumn>

        <DxColumn data-field="PrecioVenta" caption="Precio Venta" width="120px">
          <template #cell-template="{ data }">
            <span>LPS {{ data.value.toFixed(2) }}</span>
          </template>
        </DxColumn>
        <DxColumn data-field="Facturar" caption="facturar" />
        <DxColumn data-field="StatusDescripcion" caption="Status" />

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

      <q-dialog v-model="dialogoEstudio" persistent max-width="600px">
        <q-card class="form-card shadow-2 rounded-borders">
          <q-card-section>
            <div class="q-mb-md flex justify-between items-center">
              <h2 class="text-h4 text-primary">
                {{ isEditMode ? "Editar Estudio" : "Agregar Estudio" }}
              </h2>
              <button
                type="button"
                class="btn btn-secondary btnCerrarModal"
                @click="cerrarDialogo"
              >
                <i class="ri-close-line"></i> Cerrar
              </button>
            </div>

            <!-- Reemplazamos q-form con un formulario HTML básico -->
            <form @submit.prevent="guardarEstudio">
              <div class="row q-col-gutter-sm">
                <!-- Campo Código -->
                <div class="col-12 col-md-6 mb-3">
                  <label for="codigo" class="form-label fs-14 text-dark"
                    >Código<span class="required">*</span></label
                  >
                  <div class="input-group">
                    <div class="input-group-text">
                      <i class="ri-hashtag"></i>
                    </div>
                    <input
                      type="text"
                      id="codigo"
                      class="form-control"
                      v-model="formData.Codigo"
                      placeholder="Código del Estudio"
                      :disabled="isEditMode"
                      required
                    />
                  </div>
                  <div v-if="formErrors.Codigo" class="text-danger fs-13 mt-1">
                    {{ formErrors.Codigo }}
                  </div>
                </div>

                <!-- Campo Descripción -->
                <div class="col-12 col-md-6 mb-3">
                  <label for="descripcion" class="form-label fs-14 text-dark"
                    >Descripción<span class="required">*</span></label
                  >
                  <div class="input-group">
                    <div class="input-group-text">
                      <i class="ri-text-wrap"></i>
                    </div>
                    <input
                      type="text"
                      id="Descripcion"
                      class="form-control"
                      v-model="formData.Descripcion"
                      placeholder="Descripción del Estudio"
                      required
                    />
                  </div>
                  <div
                    v-if="formErrors.Descripcion"
                    class="text-danger fs-13 mt-1"
                  >
                    {{ formErrors.Descripcion }}
                  </div>
                </div>

                <!-- Campo Tipo de Estudio -->
                <div class="col-12 col-md-6 mb-3">
                  <label for="tipoEstudio" class="form-label fs-14 text-dark"
                    >Tipo de Estudio<span class="required">*</span></label
                  >
                  <div class="input-group">
                    <div class="input-group-text">
                      <i class="ri-list-check"></i>
                    </div>
                    <select
                      id="tipoEstudio"
                      class="form-select"
                      v-model="formData.TipoEstudioId"
                      required
                    >
                      <option disabled value="">
                        Seleccione un tipo de estudio
                      </option>
                      <option
                        v-for="tipo in TipoEstudios"
                        :key="tipo.TipoEstudioId"
                        :value="tipo.TipoEstudioId"
                      >
                        {{ tipo.Descripcion }}
                      </option>
                    </select>
                  </div>
                  <div
                    v-if="formErrors.TipoEstudioId"
                    class="text-danger fs-13 mt-1"
                  >
                    {{ formErrors.TipoEstudioId }}
                  </div>
                </div>

                <!-- Campo Indicaciones -->
                <div class="col-12 col-md-6 mb-3">
                  <label for="indicaciones" class="form-label fs-14 text-dark"
                    >Indicaciones</label
                  >
                  <div class="input-group">
                    <div class="input-group-text">
                      <i class="ri-file-text-line"></i>
                    </div>
                    <textarea
                      id="Indicaciones"
                      class="form-control"
                      v-model="formData.Indicaciones"
                      placeholder="Ingrese las indicaciones"
                      rows="3"
                    ></textarea>
                  </div>
                </div>

                <!-- Campo Precio Costo -->
                <div class="col-12 col-md-6 mb-3">
                  <label for="precioCosto" class="form-label fs-14 text-dark"
                    >Precio Costo<span class="required">*</span></label
                  >
                  <div class="input-group">
                    <div class="input-group-text">
                      <i class="ri-price-tag-3-line"></i>
                    </div>
                    <input
                      type="number"
                      id="precioCosto"
                      class="form-control"
                      v-model="formData.PrecioCosto"
                      placeholder="Precio Costo"
                      required
                    />
                  </div>
                  <div
                    v-if="formErrors.PrecioCosto"
                    class="text-danger fs-13 mt-1"
                  >
                    {{ formErrors.PrecioCosto }}
                  </div>
                </div>

                <!-- Campo Precio Venta -->
                <div class="col-12 col-md-6 mb-3">
                  <label for="precioVenta" class="form-label fs-14 text-dark"
                    >Precio Venta<span class="required">*</span></label
                  >
                  <div class="input-group">
                    <div class="input-group-text">
                      <i class="ri-price-tag-3-fill"></i>
                    </div>
                    <input
                      type="number"
                      id="PrecioVenta"
                      class="form-control"
                      v-model="formData.PrecioVenta"
                      placeholder="Precio Venta"
                      required
                    />
                  </div>
                  <div
                    v-if="formErrors.PrecioVenta"
                    class="text-danger fs-13 mt-1"
                  >
                    {{ formErrors.PrecioVenta }}
                  </div>
                </div>

                <!-- Checkbox Facturar -->
                <div class="col-12 col-md-6 mb-3">
                  <div class="form-check">
                    <input
                      type="checkbox"
                      id="Facturar"
                      class="form-check-input"
                      v-model="formData.Facturar"
                    />
                    <label for="facturar" class="form-check-label"
                      >Facturar</label
                    >
                  </div>
                </div>

                <!-- Campo Status -->
                <div class="col-12 col-md-6 mb-3">
                  <label for="status" class="form-label fs-14 text-dark"
                    >Status</label
                  >
                  <div class="input-group">
                    <div class="input-group-text">
                      <i class="ri-information-line"></i>
                    </div>
                    <select
                      id="StatusId"
                      class="form-select"
                      v-model="formData.Status"
                      required
                    >
                      <option disabled value="">Seleccione un status</option>
                      <option
                        v-for="status in statusExamenEstudios"
                        :key="status.StatusEstudioId"
                        :value="status.StatusEstudioId"
                      >
                        {{ status.Descripcion }}
                      </option>
                    </select>
                  </div>
                  <div v-if="formErrors.Status" class="text-danger fs-13 mt-1">
                    {{ formErrors.Status }}
                  </div>
                </div>
              </div>

              <div class="flex justify-center q-mt-sm">
                <button
                  type="submit"
                  class="btn btn-primary"
                  style="font-size: 14px; padding: 8px 16px"
                >
                  {{ isEditMode ? "Actualizar Estudio" : "Guardar Estudio" }}
                </button>
              </div>
            </form>
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
const { TipoEstudios } = storeToRefs(tiposEstudiosStore); // Corregido
const { statusExamenEstudios } = storeToRefs(statusExamenEstudiosStore);

// Estado para el modal
const dialogoEstudio = ref(false);
const isEditMode = ref(false);
const selectedEstudioId = ref(null); // Cambiado a ref

// Formulario de datos
const formData = ref({
  Codigo: "",
  Descripcion: "",
  TipoEstudioId: null,
  Indicaciones: "",
  PrecioCosto: "",
  PrecioVenta: "",
  Facturar: false,
  Status: null,
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
    const estudios = ref([]);
    console.log("Tipos de estudios: ", estudios.value);
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
  console.log("tiposEstudios:", TipoEstudios.value);
  console.log("statusExamenEstudios:", statusExamenEstudios.value);

  if (!estudios.value || !TipoEstudios.value || !statusExamenEstudios.value) {
    return [];
  }

  return estudios.value.map((estudio) => {
    const tipo = TipoEstudios.value.find(
      (t) => t.TipoEstudioId === Number(estudio.TipoEstudioId)
    );
    const status = statusExamenEstudios.value.find(
      (s) => s.StatusEstudioId === estudio.StatusId
    );
    console.log("TIPO DESCRIPCION XD: ", tipo.Descripcion);
    return {
      ...estudio,
      TipoDescripcion: tipo ? tipo.Descripcion : "Tipo no encontrado",
      StatusDescripcion: status ? status.Descripcion : "Status no encontrado",
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
    TipoEstudioId: null,
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
    Codigo: estudio.Codigo || "",
    Descripcion: estudio.Descripcion || "",
    TipoEstudioId: estudio.TipoEstudioId || null,
    Indicaciones: estudio.Indicaciones || "",
    PrecioCosto: estudio.PrecioCosto || "",
    PrecioVenta: estudio.PrecioVenta || "",
    Facturar: estudio.Facturar || false,
    StatusId: estudio.StatusId || null,
  };
  dialogoEstudio.value = true;
}

// Función para guardar o actualizar el estudio
async function guardarEstudio() {
  // Validar campos requeridos
  formErrors.value = {};
  if (!formData.value.Codigo && !isEditMode.value)
    formErrors.value.Codigo = "El código es obligatorio.";
  if (!formData.value.Descripcion)
    formErrors.value.Descripcion = "La descripción es obligatoria.";
  if (!formData.value.TipoEstudioId)
    formErrors.value.TipoEstudioId = "El tipo es obligatorio.";
  if (!formData.value.PrecioCosto)
    formErrors.value.PrecioCosto = "El precio costo es obligatorio.";
  if (!formData.value.PrecioVenta)
    formErrors.value.PrecioVenta = "El precio venta es obligatorio.";

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
      Codigo: formData.value.Codigo,
      Descripcion: formData.value.Descripcion,
      TipoEstudioId: formData.value.TipoEstudioId, // bigint (ID)
      Indicaciones: formData.value.Indicaciones,
      PrecioCosto: formData.value.PrecioCosto,
      PrecioVenta: formData.value.PrecioVenta,
      Facturar: formData.value.Facturar,
      StatusId: formData.value.Status, // bigint (ID)
    };

    // Verificar que tipoId y status son números
    // console.log("Tipo ID:", estudioData.tipoId);
    // console.log("Status ID:", estudioData.status);

    if (isEditMode.value && selectedEstudioId.value) {
      console.log("Actualizando Estudio con ID:", selectedEstudioId.value);
      console.log("Datos para actualizar:", estudioData);
      await estudioStore.actualizarEstudio({
        EstudioId: selectedEstudioId.value,
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
    const estudioId = e.row.data.EstudioId; // Usar 'id' en lugar de 'codigo'
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
  display: flex;
  flex-wrap: wrap;
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

@media (max-width: 768) {
  .form-card {
    max-width: 576px;
  }
}

@media (max-width: 768px) {
  .form-card {
    max-width: 100%;
  }
}
</style>
