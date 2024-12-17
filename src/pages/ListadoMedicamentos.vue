<template>
  <div class="row justify-center espaciadoLateral q-py-md">
    <div id="app-container" class="q-mb-xl q-px-xl q-pa-xs">
      <!-- Encabezado y botón para agregar nuevo medicamento -->
      <div class="q-pb-md">
        <div class="row items-center">
          <div class="header-container">
            <h4 class="header-title">Medicamentos Existentes</h4>
            <p class="parrafo">Catálogo de medicamentos del centro médico</p>
          </div>
          <div>
            <q-btn
              label="Nuevo Medicamento"
              flat
              class="btn btn-primary btn-sm btn-wave right-content fsButton fe fe-plus"
              @click="abrirDialogoNuevoMedicamento"
            />
          </div>
        </div>
      </div>

      <!-- DataGrid para medicamentos -->
      <DxDataGrid
        :data-source="medicamentosConDetalles"
        :allow-column-reordering="true"
        :column-auto-width="true"
        :column-resizing-mode="'widget'"
        :row-alternation-enabled="true"
        :show-borders="true"
        key-expr="codigo"
        class="custom-data-grid"
      >
        <DxPaging :enabled="true" :page-size="10" />
        <!-- <DxScrolling mode="virtual" /> -->

        <DxSorting mode="multiple" />
        <DxHeaderFilter :visible="true" />
        <DxColumnChooser :enabled="true" />
        <DxLoadPanel :show-pane="true" />
        <DxSearchPanel
          :width="300"
          :visible="true"
          placeholder="Buscar Medicamento"
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
          <DxRequiredRule />
        </DxColumn>
        <DxColumn data-field="precioVenta" caption="Precio Venta" width="120px">
          <DxRequiredRule />
        </DxColumn>
        <DxColumn data-field="facturar" caption="Facturar" width="100px" />
        <DxColumn data-field="statusDescripcion" caption="Status" />

        <DxEditing
          mode="popup"
          :allow-updating="true"
          :allow-deleting="true"
          :popup="{
            title: 'Editar Información del Hospital',
            showTitle: true,
            width: 700,
            height: 470,
          }"
        />
        <!-- Botones de acción -->
        <DxColumn type="buttons" width="120">
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
            @click="eliminarMedicamento"
          />
        </DxColumn>
      </DxDataGrid>

      <!-- Diálogo Modal para Agregar/Editar Medicamento -->
      <q-dialog v-model="dialogoMedicamento" persistent max-width="600px">
        <q-card class="form-card shadow-2 rounded-borders">
          <q-card-section>
            <div class="q-mb-md flex justify-between items-center">
              <h2 class="text-h4 text-primary">
                {{ isEditMode ? "Editar Medicamento" : "Agregar Medicamento" }}
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

            <q-form @submit.prevent="guardarMedicamento">
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
                    class="w-100"
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
                    class="w-100"
                  />
                </div>

                <div class="col-12 col-md-6 mb-3">
                  <q-select
                    v-model="formData.tipoId"
                    :options="tiposMedicamentos"
                    option-value="id"
                    option-label="descripcion"
                    label="Tipo de Medicamento"
                    outlined
                    dense
                    :error="!!formErrors.tipoId"
                    :error-message="formErrors.tipoId"
                    required
                    emit-value
                    map-options
                    class="w-100"
                  />
                </div>

                <div class="col-12 col-md-6 mb-3">
                  <q-input
                    v-model="formData.indicaciones"
                    label="Indicaciones"
                    type="textarea"
                    outlined
                    dense
                    class="w-100"
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
                    class="w-100"
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
                    class="w-100"
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
                    :options="statuses"
                    option-value="id"
                    option-label="descripcion"
                    label="Status"
                    outlined
                    dense
                    :error="!!formErrors.status"
                    :error-message="formErrors.status"
                    emit-value
                    map-options
                    class="w-100"
                  />
                </div>
              </div>

              <div class="flex justify-center q-mt-sm">
                <q-btn
                  :label="
                    isEditMode
                      ? 'Actualizar Medicamento'
                      : 'Guardar Medicamento'
                  "
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
  DxRequiredRule,
  DxColumnChooser,
  DxScrolling,
  DxSorting,
  DxLoadPanel,
  DxSearchPanel,
  DxEditing,
} from "devextreme-vue/data-grid";
import { ref, computed, onMounted } from "vue";
import { useQuasar, Notify } from "quasar";
import { storeToRefs } from "pinia";

import { useMedicamentoStore } from "../stores/DirectoriosStores";
import { useTiposMedicamentosStore } from "../stores/ConfiMedicasStores";
import { useStatusStore } from "../stores/status";

// Instancias de las tiendas
const medicamentoStore = useMedicamentoStore();
const tiposMedicamentosStore = useTiposMedicamentosStore();
const statusStore = useStatusStore();

// Referencias a los datos de las tiendas
const { medicamentos } = storeToRefs(medicamentoStore);
const { medicamentos: tiposMedicamentos } = storeToRefs(tiposMedicamentosStore);
const { statuses } = storeToRefs(statusStore);

// Estado para el modal
const dialogoMedicamento = ref(false);
const isEditMode = ref(false);
let selectedMedicamentoId = ref(null); // Cambiado de 'selectedMedicamentoCodigo' a 'selectedMedicamentoId'

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
      medicamentoStore.cargarMedicamentos(),
      tiposMedicamentosStore.cargarMedicamentos(),
      statusStore.cargarStatuses(),
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

// Computed para agregar descripciones a los medicamentos
const medicamentosConDetalles = computed(() => {
  console.log("medicamentos:", medicamentos.value);
  console.log("tiposMedicamentos:", tiposMedicamentos.value);
  console.log("statuses:", statuses.value);

  return (medicamentos.value || []).map((medicamento, index) => {
    console.log(`Medicamento ${index}:`, medicamento);

    if (!medicamento) {
      return {
        tipoDescripcion: "Medicamento no válido",
        statusDescripcion: "Medicamento no válido",
      };
    }

    const tipo = (tiposMedicamentos.value || []).find((t) => {
      console.log(
        `Comparando tipoId: ${t?.id} con medicamento.tipoId: ${medicamento.tipoId}`
      );
      return t?.id === medicamento.tipoId;
    });

    const status = (statuses.value || []).find((s) => {
      console.log(
        `Comparando statusId: ${s?.id} con medicamento.status: ${medicamento.status}`
      );
      return s?.id === medicamento.status;
    });

    return {
      ...medicamento,
      tipoDescripcion: tipo ? tipo.descripcion : "Tipo no encontrado",
      statusDescripcion: status ? status.descripcion : "Status no encontrado",
    };
  });
});

// Función para abrir el diálogo de nuevo medicamento
function abrirDialogoNuevoMedicamento() {
  isEditMode.value = false;
  resetFormulario();
  dialogoMedicamento.value = true;
}

// Función para cerrar el diálogo
function cerrarDialogo() {
  dialogoMedicamento.value = false;
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
  selectedMedicamentoId.value = null; // Resetear el ID seleccionado
}

// Función para abrir el formulario de edición
function abrirFormularioEdicion(e) {
  const medicamento = e.row.data;
  isEditMode.value = true;
  selectedMedicamentoId.value = medicamento.id; // Guardar el 'id' en lugar de 'codigo'
  formData.value = {
    codigo: medicamento.codigo || "",
    descripcion: medicamento.descripcion || "",
    tipoId: medicamento.tipoId || null,
    indicaciones: medicamento.indicaciones || "",
    precioCosto: medicamento.precioCosto || "",
    precioVenta: medicamento.precioVenta || "",
    facturar: medicamento.facturar || false,
    status: medicamento.status || null,
  };
  dialogoMedicamento.value = true;
}

// Función para guardar o actualizar el medicamento
async function guardarMedicamento() {
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
    const medicamentoData = {
      codigo: formData.value.codigo,
      descripcion: formData.value.descripcion,
      tipoId: formData.value.tipoId, // bigint (ID)
      indicaciones: formData.value.indicaciones,
      precioCosto: formData.value.precioCosto,
      precioVenta: formData.value.precioVenta,
      facturar: formData.value.facturar,
      status: formData.value.status, // bigint (ID)
    };

    if (isEditMode.value && selectedMedicamentoId.value) {
      await medicamentoStore.actualizarMedicamento({
        id: selectedMedicamentoId.value, // Usar 'id' en lugar de 'codigo'
        ...medicamentoData,
      });
      Notify.create({
        type: "positive",
        message: "Medicamento actualizado exitosamente",
        position: "top-right",
      });
    } else {
      await medicamentoStore.agregarMedicamento(medicamentoData);
      Notify.create({
        type: "positive",
        message: "Medicamento agregado exitosamente",
        position: "top-right",
      });
    }

    await medicamentoStore.cargarMedicamentos(); // Actualizar el listado
    cerrarDialogo();
  } catch (error) {
    console.error("Error al guardar el medicamento:", error);
    Notify.create({
      type: "negative",
      message: "Hubo un error al guardar el medicamento",
      position: "top-right",
    });
  }
}

// Función para eliminar un medicamento
async function eliminarMedicamento(e) {
  try {
    const medicamentoId = e.row.data.id; // Usar 'id' en lugar de 'codigo'
    await medicamentoStore.eliminarMedicamento(medicamentoId);
    Notify.create({
      type: "positive",
      message: "Medicamento eliminado exitosamente",
      position: "top-right",
    });
    await medicamentoStore.cargarMedicamentos();
  } catch (error) {
    Notify.create({
      type: "negative",
      message: "Error al eliminar el medicamento",
      position: "top-right",
    });
    console.error("Error al eliminar medicamento:", error);
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
  padding-left: 1.5%;
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
  /* box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); */
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

.text-negative {
  color: #f44336;
}

.text-caption {
  font-size: 12px;
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
