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
          <q-btn
            label="Nuevo contacto"
            icon="add"
            color="primary"
            flat
            class="q-ml-auto q-mt-xl bajarbtn"
            @click="handleNuevoContacto"
          />
        </div>
      </div>

      <!-- DataGrid -->
      <DxDataGrid
        :data-source="contactosConDetalles"
        :allow-column-reordering="true"
        :show-borders="true"
        :row-alternation-enabled="true"
        key-expr="id"
        :width="responsiveWidth"
      >
        <DxColumn
          data-field="nombreContacto"
          caption="Nombre"
          :allow-sorting="true"
        />
        <DxColumn
          data-field="direccionContacto"
          caption="Dirección"
          :allow-sorting="true"
        />
        <DxColumn
          data-field="organizacionContacto"
          caption="Organización"
          :allow-sorting="true"
        />
        <DxColumn
          data-field="grupoDescripcion"
          caption="Grupo de Contacto"
          :allow-sorting="true"
          :visible="true"
        />
        <DxColumn
          data-field="departamentoDescripcion"
          caption="Departamento"
          :allow-sorting="true"
          :visible="true"
          width="140px"
        />
        <DxColumn
          data-field="municipioDescripcion"
          caption="Municipio"
          :allow-sorting="true"
          :visible="true"
          width="140px"
        />
        <DxColumn
          data-field="emailContacto"
          caption="E-mail"
          :allow-sorting="true"
        />
        <DxColumn
          data-field="telefonoCasaContacto"
          caption="Teléfono Casa"
          :allow-sorting="true"
          :visible="false"
        />
        <DxColumn
          data-field="telefonoPersonalContacto"
          caption="Tel. Personal"
          :allow-sorting="true"
          :visible="true"
          width="100px"
        />
        <DxColumn
          data-field="observacionContacto"
          caption="Observaciones"
          :allow-sorting="true"
          :visible="true"
        />

        <DxEditing
          mode="popup"
          :allow-updating="true"
          :allow-deleting="true"
          :popup="{
            title: 'Editar Información del Contacto',
            showTitle: true,
            width: 700,
            height: 470,
          }"
        />
        <DxPaging :enabled="true" :page-size="10" />
        <DxFilterRow :visible="true" />
        <DxHeaderFilter :visible="true" />
        <DxColumn type="buttons">
          <DxButton
            name="edit"
            icon="edit"
            @click="(event) => handleEdit(event.row.data)"
          />
          <DxButton
            name="delete"
            icon="trash"
            @click="() => handleDelete(row.data.id)"
          />
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
                icon="close"
                flat
                @click="closeDialog"
              />
            </div>

            <q-form @submit.prevent="guardarcontact">
              <div class="row q-col-gutter-md">
                <!-- Información Personal -->
                <div class="col-12 col-md-6">
                  <q-input
                    v-model="formData.nombreContacto"
                    label="Nombre"
                    outlined
                    dense
                    required
                    class="q-mb-md"
                    :error="!!formErrors.nombreContacto"
                    :error-message="formErrors.nombreContacto"
                  />
                  <q-input
                    v-model="formData.direccionContacto"
                    label="Dirección"
                    outlined
                    dense
                    required
                    class="q-mb-md"
                    :error="!!formErrors.direccionContacto"
                    :error-message="formErrors.direccionContacto"
                  />
                  <q-select
                    v-model="formData.grupoIdContacto"
                    :options="grupos"
                    label="Grupo"
                    option-value="id"
                    option-label="descripcion"
                    outlined
                    dense
                    required
                    class="q-mb-md"
                    :error="!!formErrors.grupoIdContacto"
                    :error-message="formErrors.grupoIdContacto"
                  />
                  <q-input
                    v-model="formData.organizacionContacto"
                    label="Organización"
                    outlined
                    dense
                    class="q-mb-md"
                  />
                </div>

                <!-- Información de Ubicación -->
                <div class="col-12 col-md-6">
                  <q-select
                    v-model="formData.departamentoIdContacto"
                    :options="departamentos"
                    label="Departamento"
                    option-value="id"
                    option-label="descripcion"
                    outlined
                    dense
                    @update:model-value="onDepartamentoChange"
                    required
                    class="q-mb-md"
                    :error="!!formErrors.departamentoIdContacto"
                    :error-message="formErrors.departamentoIdContacto"
                  />
                  <q-select
                    v-model="formData.municipioIdContacto"
                    :options="filteredMunicipios"
                    label="Municipio"
                    option-value="id"
                    option-label="descripcion"
                    outlined
                    dense
                    :disable="!formData.departamentoIdContacto"
                    required
                    class="q-mb-md"
                    :error="!!formErrors.municipioIdContacto"
                    :error-message="formErrors.municipioIdContacto"
                  />
                  <q-input
                    v-model="formData.emailContacto"
                    label="Email"
                    type="email"
                    outlined
                    dense
                    required
                    class="q-mb-md"
                    :error="!!formErrors.emailContacto"
                    :error-message="formErrors.emailContacto"
                  />
                </div>
              </div>

              <div class="row q-col-gutter-md">
                <!-- Información de Contacto -->
                <div class="col-12 col-md-6">
                  <q-input
                    v-model="formData.telefonoCasaContacto"
                    label="Teléfono Casa"
                    outlined
                    mask="####-####"
                    dense
                    class="q-mb-md"
                    :error="!!formErrors.telefonoCasaContacto"
                    :error-message="formErrors.telefonoCasaContacto"
                  />
                  <q-input
                    v-model="formData.telefonoPersonalContacto"
                    label="Teléfono Personal"
                    outlined
                    mask="####-####"
                    dense
                    class="q-mb-md"
                    :error="!!formErrors.telefonoPersonalContacto"
                    :error-message="formErrors.telefonoPersonalContacto"
                  />
                </div>

                <!-- Observaciones -->
                <div class="col-12 col-md-6">
                  <q-input
                    v-model="formData.observacionContacto"
                    label="Observación"
                    outlined
                    type="textarea"
                    dense
                    class="q-mb-md"
                    counter
                    maxlength="500"
                  />
                </div>
              </div>

              <div class="flex justify-center q-mt-lg">
                <q-btn
                  :label="
                    isEditMode ? 'Actualizar Contacto' : 'Guardar Contacto'
                  "
                  color="primary"
                  type="submit"
                  class="full-width"
                  unelevated
                  rounded
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
  DxEditing,
  DxButton,
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

/* Contenedor principal */
#app-container {
  padding: 20px;
  background-color: #f9f9f9;
  margin: 0 20px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* Formulario de contacto */
.form-card {
  max-width: 800px; /* Ancho máximo del formulario */
  width: 100%;
  margin: auto; /* Centra el card */
  background-color: #ffffff; /* Fondo blanco */
  border-radius: 20px; /* Bordes redondeados */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.text-primary {
  color: #1976d2 !important; /* Color primario de Quasar */
}

.form-card h2 {
  font-weight: bold;
}

.q-btn.flat.round {
  border-radius: 50%;
}

.q-card-section {
  padding: 24px;
}

/* Responsividad */
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

/* Estilos adicionales */
.header-container {
  display: flex;
  flex-direction: column;
  margin-right: auto;
}

.parrafo {
  font-size: 1rem;
  color: #555;
  margin: 5px 20px 25px 20px;
}

.header-title {
  font-size: 2rem;
  font-weight: bold;
  color: #333;
  margin: 20px 20px 0px;
}

.bajarbtn {
  margin-bottom: -40px;
}

.card .q-input,
.card .q-select {
  margin-bottom: 1rem;
}

/* Botones */
.btn-primary {
  background-color: #1976d2;
  color: #ffffff;
}

.btn-secondary {
  background-color: #9e9e9e;
  color: #ffffff;
}

.btn-primary:hover {
  background-color: #1565c0;
}

.btn-secondary:hover {
  background-color: #757575;
}

/* Avatar */
.form-avatar {
  border: 2px solid #1976d2; /* Borde para el avatar */
}

/* Mejoras en el DataGrid */
.dx-datagrid {
  background-color: #ffffff;
  border-radius: 10px;
  overflow: hidden;
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
</style>
