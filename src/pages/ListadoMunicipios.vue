<template>
  <div class="row justify-center espaciadoLateral q-py-md">
    <div id="app-container" class="q-mb-xl q-px-xl q-pa-xs">
      <!-- Encabezado General -->
      <div class="q-pb-md">
        <div class="row items-center">
          <div class="header-container">
            <h4 class="header-title">Gestión de Municipios</h4>
            <p class="parrafo">Catálogo de municipios del centro médico</p>
          </div>
          <div>
            <q-btn
              label="Agregar"
              flat
              class="btn btn-primary btn-sm btn-wave fsButton fe fe-plus"
              @click="abrirDialogoAgregar"
            />
          </div>
        </div>
      </div>

      <!-- DataGrid para Municipios -->
      <DxDataGrid
        ref="dataGrid"
        :data-source="municipios"
        key-expr="id"
        :allow-column-resizing="true"
        :column-auto-width="true"
        :allow-column-reordering="true"
        :editing="{
          mode: 'popup',
          allowUpdating: true,
          allowAdding: true,
          allowDeleting: true,
          popup: {
            title: 'Editar Municipio',
            showTitle: true,
            width: 700,
            height: 345,
          },
          form: {
            items: [
              {
                dataField: 'descripcion',
                label: { text: 'Municipio' },
                validationRules: [
                  {
                    type: 'required',
                    message: 'La descripción es obligatoria',
                  },
                ],
              },
              {
                dataField: 'departamentoId',
                editorType: 'dxSelectBox',
                label: { text: 'Departamento' },
                editorOptions: {
                  dataSource: departamentos,
                  displayExpr: 'descripcion',
                  valueExpr: 'id',
                  searchEnabled: true,
                },
                validationRules: [
                  { type: 'required', message: 'Seleccione un departamento' },
                ],
              },
            ],
          },
        }"
        @rowInserting="onRowInserting"
        @rowUpdating="onRowUpdating"
        @rowRemoving="onRowRemoving"
        class="custom-data-grid"
      >
        <!-- Agrupación por departamentoId con DxLookup -->
        <DxColumn
          data-field="departamentoId"
          :group-index="0"
          sort-order="asc"
          caption="Departamento"
        >
          <DxLookup
            :data-source="departamentos"
            value-expr="id"
            display-expr="descripcion"
          />
        </DxColumn>

        <!-- Columna para el nombre del municipio -->
        <DxColumn data-field="descripcion" caption="Municipio"> </DxColumn>

        <!-- Columna de botones de acción -->
        <DxColumn type="buttons">
          <DxButton name="edit" icon="edit" hint="Editar" />
          <DxButton name="delete" icon="trash" hint="Eliminar" />
        </DxColumn>

        <!-- Componentes adicionales -->
        <DxColumnChooser :enabled="true" />
        <DxColumnFixing :enabled="true" />
        <!-- <DxFilterRow :visible="true" /> -->
        <DxSearchPanel :visible="true" />
        <DxGroupPanel :visible="true" />
        <DxSummary>
          <DxGroupItem summary-type="count" displayFormat="{0} municipios" />
        </DxSummary>
        <DxGrouping :auto-expand-all="expanded" />
        <DxToolbar>
          <DxItem name="groupPanel" />
          <DxItem location="after" template="button-template" />
          <DxItem name="exportButton" />
          <DxItem name="columnChooserButton" />
          <DxItem name="searchPanel" />
        </DxToolbar>
        <template #button-template>
          <DxButton
            :text="expanded ? 'Contraer Todo' : 'Expandir Todo'"
            :width="136"
            @click="toggleExpand"
          />
        </template>
      </DxDataGrid>

      <!-- Modal para Agregar Departamentos y Municipios -->
      <q-dialog v-model="mostrarDialogoAgregar" persistent max-width="800px">
        <q-card class="form-card shadow-2 rounded-borders">
          <q-card-section>
            <div class="q-mb-md flex justify-between items-center">
              <h2 class="text-h4 text-primary">
                Agregar Departamento y Municipio
              </h2>
              <q-btn
                label="Cerrar"
                color="secondary"
                icon="close"
                flat
                @click="cerrarDialogoAgregar"
                class="btnCerrarModal"
              />
            </div>

            <!-- Sistema de Pestañas Verticales -->
            <div class="row">
              <div class="col-md-3">
                <ul
                  class="nav nav-tabs flex-column vertical-tabs-2"
                  role="tablist"
                >
                  <li class="nav-item">
                    <a
                      class="nav-link"
                      :class="{ active: activeSubTab === 'departamentos' }"
                      data-bs-toggle="tab"
                      role="tab"
                      href="#departamentos-tab"
                      @click.prevent="actualizarSubTab('departamentos')"
                    >
                      <p class="mb-1"><i class="ri-home-4-line"></i></p>
                      <p class="mb-0 text-break">Departamentos</p>
                    </a>
                  </li>
                  <li class="nav-item">
                    <a
                      class="nav-link"
                      :class="{ active: activeSubTab === 'municipios' }"
                      data-bs-toggle="tab"
                      role="tab"
                      href="#municipios-tab"
                      @click.prevent="actualizarSubTab('municipios')"
                    >
                      <p class="mb-1">
                        <i class="ri-customer-service-line"></i>
                      </p>
                      <p class="mb-0 text-break">Municipios</p>
                    </a>
                  </li>
                </ul>
              </div>

              <div class="col-md-9">
                <div class="tab-content">
                  <!-- Pestaña de Departamentos -->
                  <div
                    class="tab-pane fade"
                    :class="{
                      show: activeSubTab === 'departamentos',
                      active: activeSubTab === 'departamentos',
                    }"
                    id="departamentos-tab"
                    role="tabpanel"
                  >
                    <q-form @submit.prevent="guardarDepartamento">
                      <div class="row q-col-gutter-sm">
                        <div class="col-12 mb-3">
                          <q-input
                            v-model="departamentoForm.descripcion"
                            label="Descripción del Departamento"
                            outlined
                            :error="!!erroresDepartamento.descripcion"
                            :error-message="erroresDepartamento.descripcion"
                            required
                          />
                        </div>
                      </div>
                      <div class="flex justify-end q-mt-sm">
                        <q-btn
                          label="Guardar Departamento"
                          color="primary"
                          type="submit"
                          class="btn-primary"
                          style="font-size: 14px; padding: 8px 16px"
                        />
                      </div>
                    </q-form>
                  </div>

                  <!-- Pestaña de Municipios -->
                  <div
                    class="tab-pane fade"
                    :class="{
                      show: activeSubTab === 'municipios',
                      active: activeSubTab === 'municipios',
                    }"
                    id="municipios-tab"
                    role="tabpanel"
                  >
                    <q-form @submit.prevent="guardarMunicipio">
                      <div class="row q-col-gutter-sm">
                        <div class="col-12 col-md-6 mb-3">
                          <q-input
                            v-model="municipioForm.descripcion"
                            label="Descripción del Municipio"
                            outlined
                            :error="!!erroresMunicipio.descripcion"
                            :error-message="erroresMunicipio.descripcion"
                            required
                          />
                        </div>
                        <div class="col-12 col-md-6 mb-3">
                          <q-select
                            v-model="municipioForm.departamentoId"
                            :options="departamentos"
                            option-value="id"
                            option-label="descripcion"
                            label="Departamento"
                            outlined
                            dense
                            :error="!!erroresMunicipio.departamentoId"
                            :error-message="erroresMunicipio.departamentoId"
                            required
                            emit-value
                            map-options
                            placeholder="Seleccione un departamento"
                          />
                        </div>
                      </div>
                      <div class="flex justify-end q-mt-sm">
                        <q-btn
                          label="Guardar Municipio"
                          color="primary"
                          type="submit"
                          class="btn-primary"
                          style="font-size: 14px; padding: 8px 16px"
                        />
                      </div>
                    </q-form>
                  </div>
                </div>
              </div>
            </div>
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
  DxColumnChooser,
  DxColumnFixing,
  DxFilterRow,
  DxSearchPanel,
  DxGroupPanel,
  DxSummary,
  DxGroupItem,
  DxGrouping,
  DxToolbar,
  DxItem,
  DxLookup,
  DxButton,
} from "devextreme-vue/data-grid";
import { DxButton as DxButtonComponent } from "devextreme-vue/button";
import {
  useMunicipioStore,
  useDepartamentoStore,
} from "../stores/DatosGeneralesStores";
import { storeToRefs } from "pinia";
import { onMounted, ref, reactive } from "vue";
import { Notify } from "quasar";

// Instancias de las tiendas
const municipioStore = useMunicipioStore();
const departamentoStore = useDepartamentoStore();

// Referencias reactivas a los datos de las tiendas
const { municipios } = storeToRefs(municipioStore);
const { departamentos } = storeToRefs(departamentoStore);
const expanded = ref(false);

// Estado para el modal de agregar Departamentos y Municipios
const mostrarDialogoAgregar = ref(false);
const activeSubTab = ref("departamentos");

// Formulario para Departamento
const departamentoForm = ref({
  descripcion: "",
});
const erroresDepartamento = reactive({
  descripcion: "",
});

// Formulario para Municipio
const municipioForm = ref({
  descripcion: "",
  departamentoId: null,
});
const erroresMunicipio = reactive({
  descripcion: "",
  departamentoId: "",
});

// Cargar datos al montar el componente
onMounted(async () => {
  await departamentoStore.cargarDepartamentos();
  await municipioStore.cargarMunicipios();
});

// Alternar el estado expandido
const toggleExpand = () => {
  expanded.value = !expanded.value;
};

// Funciones para el modal de Departamentos y Municipios

// Abrir el modal
const abrirDialogoAgregar = () => {
  mostrarDialogoAgregar.value = true;
  activeSubTab.value = "departamentos";
  resetFormularioDepartamento();
  resetFormularioMunicipio();
};

// Cerrar el modal
const cerrarDialogoAgregar = () => {
  mostrarDialogoAgregar.value = false;
  resetFormularioDepartamento();
  resetFormularioMunicipio();
};

// Resetear formulario de Departamento
const resetFormularioDepartamento = () => {
  departamentoForm.value.descripcion = "";
  erroresDepartamento.descripcion = "";
};

// Resetear formulario de Municipio
const resetFormularioMunicipio = () => {
  municipioForm.value.descripcion = "";
  municipioForm.value.departamentoId = null;
  erroresMunicipio.descripcion = "";
  erroresMunicipio.departamentoId = "";
};

// Guardar Departamento (Agregar)
const guardarDepartamento = async () => {
  const { descripcion } = departamentoForm.value;

  // Resetear errores
  erroresDepartamento.descripcion = "";

  // Validar campos requeridos
  if (!descripcion.trim()) {
    erroresDepartamento.descripcion = "La descripción es obligatoria.";
    Notify.create({
      message:
        "Por favor, corrige los errores en el formulario de Departamentos.",
      color: "negative",
      position: "top-right",
    });
    return;
  }

  try {
    await departamentoStore.agregarDepartamento(descripcion.trim());
    Notify.create({
      type: "positive",
      message: "Departamento agregado exitosamente",
      position: "top-right",
    });
    await departamentoStore.cargarDepartamentos();
    cerrarDialogoAgregar();
  } catch (error) {
    Notify.create({
      type: "negative",
      message: "Hubo un error al agregar el departamento",
      position: "top-right",
    });
    console.error("Error al guardar departamento:", error);
  }
};

// Guardar Municipio (Agregar)
const guardarMunicipio = async () => {
  const { descripcion, departamentoId } = municipioForm.value;

  // Resetear errores
  erroresMunicipio.descripcion = "";
  erroresMunicipio.departamentoId = "";

  // Validar campos requeridos
  let tieneErrores = false;
  if (!descripcion.trim()) {
    erroresMunicipio.descripcion = "La descripción es obligatoria.";
    tieneErrores = true;
  }
  if (!departamentoId) {
    erroresMunicipio.departamentoId = "Seleccione un departamento.";
    tieneErrores = true;
  }

  if (tieneErrores) {
    Notify.create({
      message: "Por favor, corrige los errores en el formulario de Municipios.",
      color: "negative",
      position: "top-right",
    });
    return;
  }

  try {
    await municipioStore.agregarMunicipio(descripcion.trim(), departamentoId);
    Notify.create({
      type: "positive",
      message: "Municipio agregado exitosamente",
      position: "top-right",
    });
    await municipioStore.cargarMunicipios();
    cerrarDialogoAgregar();
  } catch (error) {
    Notify.create({
      type: "negative",
      message: "Hubo un error al agregar el municipio",
      position: "top-right",
    });
    console.error("Error al guardar municipio:", error);
  }
};

// Manejar la inserción de un nuevo municipio (desde el grid)
const onRowInserting = async (e) => {
  try {
    const { descripcion, departamentoId } = e.data;
    await municipioStore.agregarMunicipio(descripcion, departamentoId);
    Notify.create({
      type: "positive",
      message: "Municipio agregado exitosamente",
      position: "top-right",
    });
  } catch (error) {
    console.error("Error al agregar municipio:", error);
    Notify.create({
      type: "negative",
      message: "Error al agregar municipio",
      position: "top-right",
    });
    e.cancel = true;
  }
};

// Manejar la actualización de un municipio (desde el grid)
const onRowUpdating = async (e) => {
  try {
    const id = e.oldData.id;
    const { descripcion, departamentoId } = { ...e.oldData, ...e.newData };
    await municipioStore.actualizarMunicipio(id, descripcion, departamentoId);
    Notify.create({
      type: "positive",
      message: "Municipio actualizado exitosamente",
      position: "top-right",
    });
  } catch (error) {
    console.error("Error al actualizar municipio:", error);
    Notify.create({
      type: "negative",
      message: "Error al actualizar municipio",
      position: "top-right",
    });
    e.cancel = true;
  }
};

// Manejar la eliminación de un municipio (desde el grid)
const onRowRemoving = async (e) => {
  try {
    const id = e.data.id;
    await municipioStore.eliminarMunicipio(id);
    Notify.create({
      type: "positive",
      message: "Municipio eliminado exitosamente",
      position: "top-right",
    });
  } catch (error) {
    console.error("Error al eliminar municipio:", error);
    Notify.create({
      type: "negative",
      message: "Error al eliminar municipio",
      position: "top-right",
    });
    e.cancel = true;
  }
};

// Actualizar pestaña activa
const actualizarSubTab = (tabName) => {
  activeSubTab.value = tabName;
};
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

.vertical-tabs-2 {
  margin-right: 20px;
  list-style: none;
  padding-left: 0;
}
/*
.nav-link {
  display: flex;
  align-items: center;
  padding: 10px 15px;
  border: 1px solid transparent;
  border-radius: 4px;
  margin-bottom: 5px;
  cursor: pointer;
  transition: background-color 0.3s, border-color 0.3s;
} */
.custom-data-grid {
  background-color: #ffffff;
  border-radius: 8px;
  overflow: hidden;
  width: 100%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
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

.text-h6 {
  font-size: 1.25rem;
  font-weight: bold;
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
