<!-- src/components/ContactosGestion.vue -->
<template>
  <div class="row justify-center q-py-md">
    <div id="app-container" class="q-mb-xl q-px-xl q-pa-xs">
      <!-- Contenedor del título y botón -->
      <div class="q-pb-md">
        <div class="row items-center">
          <div class="header-container">
            <h4 class="header-title">Contactos Existentes</h4>
            <p class="parrafo">Catálogo de contactos del centro médico</p>
          </div>
          <div>
            <q-btn
              label="Nuevo contacto"
              flat
              class="btn btn-primary btn-sm btn-wave right-content fsButton fe fe-plus"
              @click="handleNuevoContacto"
            />
          </div>
        </div>
      </div>

      <!-- DataGrid -->
      <DxDataGrid
        ref="dataGrid"
        :data-source="contactosConDetalles"
        :allow-column-reordering="true"
        :row-alternation-enabled="true"
        :focused-row-enabled="true"
        :focused-row-key="focusedRowKey"
        :key-expr="'id'"
        :show-borders="true"
        class="grid theme-dependent"
        :width="responsiveWidth"
        @row-click="rowClick"
      >
        <DxEditing :allow-updating="true" :allow-deleting="true" mode="popup" />

        <DxScrolling mode="virtual" />

        <DxSorting mode="multiple" />
        <DxHeaderFilter :visible="true" />
        <DxColumnChooser :enabled="true" />
        <DxLoadPanel :show-pane="true" />
        <DxSelection
          select-all-mode="allPages"
          show-check-boxes-mode="always"
          mode="multiple"
        />
        <DxSearchPanel
          :width="300"
          :visible="true"
          placeholder="Buscar Contacto"
        />
        <!-- Columnas de datos -->
        <DxColumn
          data-field="nombreContacto"
          caption="Nombre"
          :allow-sorting="true"
          :min-width="130"
        />
        <DxColumn
          data-field="direccionContacto"
          caption="Dirección"
          :allow-sorting="true"
          :min-width="180"
        />
        <DxColumn
          data-field="organizacionContacto"
          caption="Organización"
          :allow-sorting="true"
          :min-width="140"
        />
        <DxColumn
          data-field="grupoDescripcion"
          caption="Grupo de Contacto"
          :allow-sorting="true"
          :visible="true"
          :min-width="120"
        />
        <DxColumn
          data-field="departamentoDescripcion"
          caption="Departamento"
          :allow-sorting="true"
          :visible="true"
          :min-width="140"
        />
        <DxColumn
          data-field="municipioDescripcion"
          caption="Municipio"
          :allow-sorting="true"
          :visible="true"
          :min-width="140"
        />
        <DxColumn
          data-field="emailContacto"
          caption="E-mail"
          :allow-sorting="true"
          :min-width="180"
        />
        <DxColumn
          data-field="telefonoCasaContacto"
          caption="Teléfono Casa"
          :allow-sorting="true"
          :visible="false"
          :min-width="100"
        />
        <DxColumn
          data-field="telefonoPersonalContacto"
          caption="Tel. Personal"
          :allow-sorting="true"
          :visible="true"
          :min-width="100"
        />
        <DxColumn
          data-field="observacionContacto"
          caption="Observaciones"
          :allow-sorting="true"
          :visible="true"
          :min-width="180"
        />

        <!-- Botones de edición y eliminación -->
        <DxColumn type="buttons">
          <DxButton name="edit" icon="edit" @click="onEditButtonClick" />
          <DxButton name="delete" icon="trash" @click="onDeleteButtonClick" />
        </DxColumn>
      </DxDataGrid>

      <!-- Diálogo modal para Nuevo Contacto -->
      <q-dialog v-model="dialogNuevoContacto" persistent max-width="800px">
        <q-card class="form-card shadow-2 rounded-borders">
          <q-card-section>
            <div class="q-mb-md flex justify-between items-center">
              <h2 class="text-h4 text-primary">
                {{ isEditMode ? "Editar Contacto" : "Agregar Contacto" }}
              </h2>
              <q-btn
                label="Cerrar"
                color="secondary"
                flat
                @click="closeDialog"
                class="btnCerrarModal fe-log-out"
              />
            </div>

            <q-form @submit.prevent="guardarcontact">
              <!-- Información Personal -->
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label">Nombre</label>
                  <q-input
                    v-model="formData.nombreContacto"
                    placeholder="Nombre"
                    dense
                    required
                    class="form-control"
                    :error="!!formErrors.nombreContacto"
                    :error-message="formErrors.nombreContacto"
                  />
                </div>

                <div class="col-md-6 mb-3">
                  <label class="form-label">Dirección</label>
                  <q-input
                    v-model="formData.direccionContacto"
                    placeholder="Dirección"
                    dense
                    required
                    class="form-control"
                    :error="!!formErrors.direccionContacto"
                    :error-message="formErrors.direccionContacto"
                  />
                </div>

                <div class="col-md-6 mb-3">
                  <label class="form-label">Grupo</label>
                  <q-select
                    v-model="formData.grupoIdContacto"
                    :options="grupos"
                    option-value="id"
                    option-label="descripcion"
                    required
                    dense
                    class="form-select no-arrow"
                    :error="!!formErrors.grupoIdContacto"
                    :error-message="formErrors.grupoIdContacto"
                  />
                </div>

                <div class="col-md-6 mb-3">
                  <label class="form-label">Departamento</label>
                  <q-select
                    v-model="formData.departamentoIdContacto"
                    :options="departamentos"
                    option-value="id"
                    option-label="descripcion"
                    placeholder="Seleccione un departamento"
                    dense
                    required
                    class="form-select"
                    @update:model-value="onDepartamentoChange"
                    :error="!!formErrors.departamentoIdContacto"
                    :error-message="formErrors.departamentoIdContacto"
                  />
                </div>

                <div class="col-md-6 mb-3">
                  <label class="form-label">Municipio</label>
                  <q-select
                    v-model="formData.municipioIdContacto"
                    :options="filteredMunicipios"
                    option-value="id"
                    option-label="descripcion"
                    placeholder="Seleccione un municipio"
                    dense
                    required
                    class="form-select"
                    :disable="!formData.departamentoIdContacto"
                    :error="!!formErrors.municipioIdContacto"
                    :error-message="formErrors.municipioIdContacto"
                  />
                </div>

                <div class="col-md-6 mb-3">
                  <label class="form-label">Email</label>
                  <q-input
                    v-model="formData.emailContacto"
                    type="email"
                    placeholder="Email"
                    dense
                    required
                    class="form-control"
                    :error="!!formErrors.emailContacto"
                    :error-message="formErrors.emailContacto"
                  />
                </div>

                <div class="col-md-6 mb-3">
                  <label class="form-label">Teléfono Casa</label>
                  <q-input
                    v-model="formData.telefonoCasaContacto"
                    placeholder="Teléfono Casa"
                    dense
                    mask="####-####"
                    class="form-control"
                    :error="!!formErrors.telefonoCasaContacto"
                    :error-message="formErrors.telefonoCasaContacto"
                  />
                </div>

                <div class="col-md-6 mb-3">
                  <label class="form-label">Teléfono Personal</label>
                  <q-input
                    v-model="formData.telefonoPersonalContacto"
                    placeholder="Teléfono Personal"
                    dense
                    mask="####-####"
                    class="form-control"
                    :error="!!formErrors.telefonoPersonalContacto"
                    :error-message="formErrors.telefonoPersonalContacto"
                  />
                </div>

                <div class="col-md-6 mb-3">
                  <label class="form-label">Observación</label>
                  <q-input
                    v-model="formData.observacionContacto"
                    type="textarea"
                    placeholder="Observación"
                    dense
                    maxlength="500"
                    counter
                    class="form-control"
                  />
                </div>

                <div class="col-md-12">
                  <q-btn
                    :label="
                      isEditMode ? 'Actualizar Contacto' : 'Guardar Contacto'
                    "
                    color="primary"
                    type="submit"
                    unelevated
                    rounded
                    class="btn btn-primary d-grid"
                  />
                </div>
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
  DxSorting,
  DxLoadPanel,
  DxColumnChooser,
  DxEditing,
  DxSearchPanel,
  DxButton,
  DxSelection,
} from "devextreme-vue/data-grid";
import { ref, onMounted, onUnmounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useContactStore } from "../stores/ContacStores";
import { useGruposContactosStore } from "../stores/ConfiMedicasStores";
import {
  useDepartamentoStore,
  useMunicipioStore,
} from "../stores/DatosGeneralesStores";
import { Notify } from "quasar";
import { storeToRefs } from "pinia";

// **Instancias de las tiendas**
const gruposContactosStore = useGruposContactosStore();
const departamentoStore = useDepartamentoStore();
const municipioStore = useMunicipioStore();
const contactStore = useContactStore();

// **Referencias a los datos de las tiendas**
const { grupos } = storeToRefs(gruposContactosStore);
const { departamentos } = storeToRefs(departamentoStore);
const { municipios } = storeToRefs(municipioStore);
const { contactos } = storeToRefs(contactStore);

// **Router y Route**
const route = useRoute();
const router = useRouter();

// **Variables y funciones reactivas**
const dialogNuevoContacto = ref(false);
const formData = ref({
  nombreContacto: "",
  direccionContacto: "",
  organizacionContacto: "",
  grupoIdContacto: null,
  departamentoIdContacto: null,
  municipioIdContacto: null,
  emailContacto: "",
  telefonoCasaContacto: "",
  telefonoPersonalContacto: "",
  observacionContacto: "",
});
const formErrors = ref({});
const isEditMode = ref(false);
const contactId = ref(null);

// **Computed properties**
const contactosConDetalles = computed(() => {
  return (contactos.value || []).map((contacto) => {
    const grupo = (grupos.value || []).find(
      (grp) => grp.id === Number(contacto.grupoIdContacto)
    );
    const departamento = (departamentos.value || []).find(
      (dept) => dept.id === Number(contacto.departamentoIdContacto)
    );
    const municipio = (municipios.value || []).find(
      (mun) => mun.id === Number(contacto.municipioIdContacto)
    );
    return {
      ...contacto,
      grupoDescripcion: grupo ? grupo.descripcion : "Grupo no encontrado",
      departamentoDescripcion: departamento
        ? departamento.descripcion
        : "Departamento no encontrado",
      municipioDescripcion: municipio
        ? municipio.descripcion
        : "Municipio no encontrado",
    };
  });
});

const responsiveWidth = ref(window.innerWidth < 600 ? "100%" : "auto");
const updateWidth = () => {
  responsiveWidth.value = window.innerWidth < 600 ? "100%" : "auto";
};

// **Funciones**
// Función para abrir el diálogo para nuevo contacto
const handleNuevoContacto = () => {
  isEditMode.value = false;
  resetForm();
  dialogNuevoContacto.value = true;
};

// Función para cerrar el diálogo
const closeDialog = () => {
  dialogNuevoContacto.value = false;
};

// Función para restablecer el formulario
const resetForm = () => {
  formData.value = {
    nombreContacto: "",
    direccionContacto: "",
    organizacionContacto: "",
    grupoIdContacto: null,
    departamentoIdContacto: null,
    municipioIdContacto: null,
    emailContacto: "",
    telefonoCasaContacto: "",
    telefonoPersonalContacto: "",
    observacionContacto: "",
  };
  formErrors.value = {};
};

// Fetch de datos al montar el componente
onMounted(async () => {
  await contactStore.cargarContactos();
  await gruposContactosStore.cargarGrupos();
  await departamentoStore.cargarDepartamentos();
  await municipioStore.cargarMunicipios();
  window.addEventListener("resize", updateWidth);

  // Verificar si se está editando desde una ruta específica
  const contactoIdParam = route.params.id;
  if (contactoIdParam) {
    await cargarContactoParaEditar(contactoIdParam);
  }
});

// Limpieza al desmontar el componente
onUnmounted(() => {
  window.removeEventListener("resize", updateWidth);
});

// Función para manejar la edición de un contacto
const handleEdit = (contacto) => {
  if (contacto && contacto.id) {
    isEditMode.value = true;
    contactId.value = contacto.id;
    formData.value = {
      nombreContacto: contacto.nombreContacto,
      direccionContacto: contacto.direccionContacto,
      organizacionContacto: contacto.organizacionContacto,
      grupoIdContacto: contacto.grupoIdContacto,
      departamentoIdContacto: contacto.departamentoIdContacto,
      municipioIdContacto: contacto.municipioIdContacto,
      emailContacto: contacto.emailContacto,
      telefonoCasaContacto: contacto.telefonoCasaContacto,
      telefonoPersonalContacto: contacto.telefonoPersonalContacto,
      observacionContacto: contacto.observacionContacto,
    };
    dialogNuevoContacto.value = true;
  } else {
    console.error("El contacto recibido es inválido:", contacto);
  }
};

// Función para manejar la eliminación de un contacto
const handleDelete = async (contactoId) => {
  try {
    await contactStore.eliminarContacto(contactoId);
    Notify.create({
      message: "Contacto eliminado exitosamente",
      color: "green",
      position: "top-right",
    });
    // Actualizar la lista de contactos
    await contactStore.cargarContactos();
  } catch (error) {
    console.error("Error al eliminar el contacto:", error);
    Notify.create({
      message: "Error al eliminar el contacto",
      color: "red",
      position: "top-right",
    });
  }
};

// Función para guardar o actualizar el contacto
async function guardarcontact() {
  const contactData = {
    ...formData.value,
    grupoIdContacto:
      formData.value.grupoIdContacto?.id || formData.value.grupoIdContacto,
    departamentoIdContacto:
      formData.value.departamentoIdContacto?.id ||
      formData.value.departamentoIdContacto,
    municipioIdContacto:
      formData.value.municipioIdContacto?.id ||
      formData.value.municipioIdContacto,
  };

  // Validaciones básicas
  formErrors.value = {}; // Resetear errores

  if (!contactData.nombreContacto) {
    formErrors.value.nombreContacto = "El nombre es obligatorio.";
  }
  if (!contactData.direccionContacto) {
    formErrors.value.direccionContacto = "La dirección es obligatoria.";
  }
  if (!contactData.grupoIdContacto) {
    formErrors.value.grupoIdContacto = "El grupo es obligatorio.";
  }
  if (!contactData.departamentoIdContacto) {
    formErrors.value.departamentoIdContacto = "El departamento es obligatorio.";
  }
  if (!contactData.municipioIdContacto) {
    formErrors.value.municipioIdContacto = "El municipio es obligatorio.";
  }
  if (!contactData.emailContacto) {
    formErrors.value.emailContacto = "El email es obligatorio.";
  }

  // Verificar si hay errores
  if (Object.keys(formErrors.value).length > 0) {
    Notify.create({
      message: "Por favor, corrige los errores en el formulario.",
      color: "negative",
      position: "top-right",
    });
    return;
  }

  try {
    if (isEditMode.value) {
      await contactStore.actualizarContacto(contactId.value, contactData);
      Notify.create({
        message: "Contacto actualizado exitosamente",
        color: "positive",
        position: "top-right",
      });
    } else {
      await contactStore.agregarContacto(contactData);
      Notify.create({
        message: "Contacto agregado exitosamente",
        color: "positive",
        position: "top-right",
      });
    }
    // Actualizar la lista de contactos
    await contactStore.cargarContactos();
    dialogNuevoContacto.value = false;
  } catch (error) {
    console.error("Error al guardar contacto:", error);
    Notify.create({
      message: "Hubo un error al guardar el contacto",
      color: "negative",
      position: "top-right",
    });
  }
}

// Función para cargar contacto en modo edición desde una ruta específica
async function cargarContactoParaEditar(contactoId) {
  try {
    const contacto = await contactStore.obtenerContacto(contactoId);
    if (contacto) {
      formData.value = {
        nombreContacto: contacto.nombreContacto,
        direccionContacto: contacto.direccionContacto,
        organizacionContacto: contacto.organizacionContacto,
        grupoIdContacto: contacto.grupoIdContacto,
        departamentoIdContacto: contacto.departamentoIdContacto,
        municipioIdContacto: contacto.municipioIdContacto,
        emailContacto: contacto.emailContacto,
        telefonoCasaContacto: contacto.telefonoCasaContacto,
        telefonoPersonalContacto: contacto.telefonoPersonalContacto,
        observacionContacto: contacto.observacionContacto,
      };
      contactId.value = contacto.id;
      isEditMode.value = true;
      dialogNuevoContacto.value = true;
    }
  } catch (error) {
    console.error("Error al cargar el contacto para editar:", error);
    Notify.create({
      message: "No se pudo cargar el contacto para editar.",
      color: "negative",
      position: "top-right",
    });
  }
}

// Función para manejar el cambio de departamento y filtrar municipios
function onDepartamentoChange(departamentoId) {
  formData.value.departamentoIdContacto = departamentoId;
  formData.value.municipioIdContacto = null; // Resetear el municipio al cambiar de departamento
}

// **Definición Correcta de `filteredMunicipios`**
const filteredMunicipios = computed(() => {
  if (!formData.value.departamentoIdContacto) return [];
  const deptId =
    formData.value.departamentoIdContacto.id ||
    formData.value.departamentoIdContacto;
  return municipios.value.filter(
    (municipio) => municipio.departamentoId === deptId
  );
});
</script>

<style scoped>
/* src/styles/sharedStyles.css */

#app-container {
  padding: 20px;
  background-color: #f9f9f9;
  margin: 0 20px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  /* position: relative;
  margin-left: 100px;
  margin-right: 100px; */
  width: 93%;
}

.form-card {
  max-width: 800px;
  width: 100%;
  margin: auto;
  background-color: #ffffff;
  border-radius: 20px 0px 0px 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
.fsButton {
  font-size: 16px;
}
.btnCerrarModal {
  font-size: 16px;
}
.no-arrow .q-select__dropdown-icon {
  display: none;
}

.right-content {
  justify-self: end;
}
</style>
