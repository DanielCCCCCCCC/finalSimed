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
              label="Nuevo Municipio o Departamento"
              flat
              class="btn btn-primary"
              @click="abrirDialogoAgregar"
            />
          </div>
        </div>
      </div>

      <!-- DataGrid para Municipios -->
      <DxDataGrid
        ref="dataGrid"
        :data-source="municipios"
        key-expr="MunicipioId"
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
                dataField: 'Descripcion',
                label: { text: 'Municipio' },
                validationRules: [
                  {
                    type: 'required',
                    message: 'La descripción es obligatoria',
                  },
                ],
              },
              {
                dataField: 'EstadoId',
                editorType: 'dxSelectBox',
                label: { text: 'Departamento' },
                editorOptions: {
                  dataSource: departamentos,
                  displayExpr: 'Descripcion',
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
        <!-- Agrupación por EstadoId con DxLookup -->
        <DxColumn
          data-field="EstadoId"
          :group-index="0"
          sort-order="asc"
          caption="Departamento"
        >
          <DxLookup
            :data-source="departamentos"
            value-expr="DepartamentoId"
            display-expr="Descripcion"
          />
        </DxColumn>

        <!-- Columna para el nombre del municipio -->
        <DxColumn data-field="Descripcion" caption="Municipio"> </DxColumn>

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
                            v-model="departamentoForm.Descripcion"
                            label="Descripción del Departamento"
                            outlined
                            :error="!!erroresDepartamento.Descripcion"
                            :error-message="erroresDepartamento.Descripcion"
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
                    <form @submit.prevent="guardarMunicipio">
                      <div class="row q-col-gutter-sm">
                        <div class="col-12 col-md-6 mb-3">
                          <label
                            for="descMun"
                            class="form-label fs-14 text-dark"
                          >
                            Descripción del Municipio<span class="required"
                              >*</span
                            >
                          </label>
                          <div class="input-group">
                            <div class="input-group-text">
                              <i class="ri-text-wrap"></i>
                            </div>
                            <input
                              type="text"
                              id="descMun"
                              class="form-control"
                              v-model="municipioForm.Descripcion"
                              placeholder="Ingrese descripción del municipio"
                              required
                            />
                          </div>
                          <div
                            v-if="erroresMunicipio.Descripcion"
                            class="text-danger fs-13 mt-1"
                          >
                            {{ erroresMunicipio.Descripcion }}
                          </div>
                        </div>
                        <div class="col-12 col-md-6 mb-3">
                          <label
                            for="departamentoSelect"
                            class="form-label fs-14 text-dark"
                          >
                            Departamento<span class="required">*</span>
                          </label>
                          <div class="input-group">
                            <div class="input-group-text">
                              <i class="ri-map-pin-line"></i>
                            </div>
                            <select
                              id="departamentoSelect"
                              class="form-select"
                              v-model="municipioForm.EstadoId"
                              required
                            >
                              <option disabled value="">
                                Seleccione un departamento
                              </option>
                              <option
                                v-for="dept in departamentos"
                                :key="dept.DepartamentoId"
                                :value="dept.DepartamentoId"
                              >
                                {{ dept.Descripcion }}
                              </option>
                            </select>
                          </div>
                          <div
                            v-if="erroresMunicipio.EstadoId"
                            class="text-danger fs-13 mt-1"
                          >
                            {{ erroresMunicipio.EstadoId }}
                          </div>
                        </div>
                      </div>
                      <div class="flex justify-end q-mt-sm">
                        <button
                          type="submit"
                          class="btn btn-primary"
                          style="font-size: 14px; padding: 8px 16px"
                        >
                          Guardar Municipio
                        </button>
                      </div>
                    </form>
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
  Descripcion: "",
});
const erroresDepartamento = reactive({
  Descripcion: "",
});

// Formulario para Municipio
const municipioForm = ref({
  Descripcion: "",
  EstadoId: null,
});
const erroresMunicipio = reactive({
  Descripcion: "",
  EstadoId: "",
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
  departamentoForm.value.Descripcion = "";
  erroresDepartamento.Descripcion = "";
};

// Resetear formulario de Municipio
const resetFormularioMunicipio = () => {
  municipioForm.value.Descripcion = "";
  municipioForm.value.EstadoId = null;
  erroresMunicipio.Descripcion = "";
  erroresMunicipio.EstadoId = "";
};

// Guardar Departamento (Agregar)
const guardarDepartamento = async () => {
  const { Descripcion } = departamentoForm.value;

  // Resetear errores
  erroresDepartamento.Descripcion = "";

  // Validar campos requeridos
  if (!Descripcion.trim()) {
    erroresDepartamento.Descripcion = "La descripción es obligatoria.";
    Notify.create({
      message:
        "Por favor, corrige los errores en el formulario de Departamentos.",
      color: "negative",
      position: "top-right",
    });
    return;
  }

  try {
    await departamentoStore.agregarDepartamento(Descripcion.trim());
    Notify.create({
      type: "positive",
      message: "Departamento agregado exitosamente",
      position: "top-right",
    });
    await departamentoStore.cargarDepartamentos();
    // cerrarDialogoAgregar();
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
  const { Descripcion, EstadoId } = municipioForm.value;

  // Resetear errores
  erroresMunicipio.Descripcion = "";
  erroresMunicipio.EstadoId = "";

  // Validar campos requeridos
  let tieneErrores = false;
  if (!Descripcion.trim()) {
    erroresMunicipio.Descripcion = "La descripción es obligatoria.";
    tieneErrores = true;
  }
  if (!EstadoId) {
    erroresMunicipio.EstadoId = "Seleccione un departamento.";
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
    await municipioStore.agregarMunicipio(Descripcion.trim(), EstadoId);
    Notify.create({
      type: "positive",
      message: "Municipio agregado exitosamente",
      position: "top-right",
    });
    await municipioStore.cargarMunicipios();
    // cerrarDialogoAgregar();
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
    const { Descripcion, EstadoId } = e.data;
    await municipioStore.agregarMunicipio(Descripcion, EstadoId);
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
    const { Descripcion, EstadoId } = { ...e.oldData, ...e.newData };
    await municipioStore.actualizarMunicipio(id, Descripcion, EstadoId);
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
