<!-- src/components/ContactosGestion.vue -->
<template>
  <div class="row justify-center espaciadoLateral q-py-md">
    <div id="app-container" class="q-mb-xl q-px-xl q-pa-xs">
      <!-- Contenedor del título y botón -->
      <div class="q-pb-md">
        <div class="row items-center">
          <div class="header-container">
            <h4 class="header-title">Guia Telefónica</h4>
            <p class="parrafo">Catálogo de contactos del centro médico</p>
          </div>
          <div>
            <q-btn
              label="Nuevo contacto"
              flat
              class="btn btn-primary"
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

        <DxPaging :enabled="true" :page-size="10" />
        <!-- <DxScrolling mode="virtual" /> -->
        <DxSorting mode="multiple" />
        <DxHeaderFilter :visible="true" />
        <DxFilterRow :visible="false" />

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

      <!-- Diálogo modal para Nuevo/Editar Contacto -->
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
            <div class="q-ml-md">
              <!-- Formulario con elementos HTML nativos -->
              <form @submit.prevent="guardarcontact">
                <!-- Información Personal -->
                <div class="row">
                  <!-- Nombre -->
                  <div class="col-md-6 mb-3">
                    <label class="form-label">Nombre</label>
                    <input
                      v-model="formData.nombreContacto"
                      type="text"
                      class="form-control"
                      :class="{ 'is-invalid': formErrors.nombreContacto }"
                      placeholder="Nombre"
                      required
                    />
                    <div
                      v-if="formErrors.nombreContacto"
                      class="invalid-feedback"
                    >
                      {{ formErrors.nombreContacto }}
                    </div>
                  </div>

                  <!-- Dirección -->
                  <div class="col-md-6 mb-3">
                    <label class="form-label">Dirección</label>
                    <input
                      v-model="formData.direccionContacto"
                      type="text"
                      class="form-control"
                      :class="{ 'is-invalid': formErrors.direccionContacto }"
                      placeholder="Dirección"
                      required
                    />
                    <div
                      v-if="formErrors.direccionContacto"
                      class="invalid-feedback"
                    >
                      {{ formErrors.direccionContacto }}
                    </div>
                  </div>

                  <!-- Departamento -->
                  <div class="col-md-6 mb-3">
                    <label class="form-label">Departamento</label>
                    <select
                      v-model="formData.departamentoIdContacto"
                      class="form-select"
                      @change="onDepartamentoChange($event.target.value)"
                      :class="{
                        'is-invalid': formErrors.departamentoIdContacto,
                      }"
                      required
                    >
                      <option disabled value="">
                        Seleccione un departamento
                      </option>
                      <option
                        v-for="dep in departamentos"
                        :key="dep.id"
                        :value="dep.id"
                      >
                        {{ dep.descripcion }}
                      </option>
                    </select>
                    <div
                      v-if="formErrors.departamentoIdContacto"
                      class="invalid-feedback"
                    >
                      {{ formErrors.departamentoIdContacto }}
                    </div>
                  </div>

                  <!-- Municipio -->
                  <div class="col-md-6 mb-3">
                    <label class="form-label">Municipio</label>
                    <select
                      v-model="formData.municipioIdContacto"
                      class="form-select"
                      :class="{ 'is-invalid': formErrors.municipioIdContacto }"
                      :disabled="!formData.departamentoIdContacto"
                      required
                    >
                      <option disabled value="">Seleccione un municipio</option>
                      <option
                        v-for="mun in filteredMunicipios"
                        :key="mun.id"
                        :value="mun.id"
                      >
                        {{ mun.descripcion }}
                      </option>
                    </select>
                    <div
                      v-if="formErrors.municipioIdContacto"
                      class="invalid-feedback"
                    >
                      {{ formErrors.municipioIdContacto }}
                    </div>
                  </div>

                  <!-- Email -->
                  <div class="col-md-6 mb-3">
                    <label class="form-label">Email</label>
                    <input
                      v-model="formData.emailContacto"
                      type="email"
                      class="form-control"
                      :class="{ 'is-invalid': formErrors.emailContacto }"
                      placeholder="Email"
                      required
                    />
                    <div
                      v-if="formErrors.emailContacto"
                      class="invalid-feedback"
                    >
                      {{ formErrors.emailContacto }}
                    </div>
                  </div>

                  <!-- Teléfono Casa -->
                  <div class="col-md-6 mb-3">
                    <label class="form-label">Teléfono Casa</label>
                    <input
                      v-model="formData.telefonoCasaContacto"
                      type="text"
                      class="form-control"
                      :class="{ 'is-invalid': formErrors.telefonoCasaContacto }"
                      placeholder="Teléfono Casa"
                    />
                    <div
                      v-if="formErrors.telefonoCasaContacto"
                      class="invalid-feedback"
                    >
                      {{ formErrors.telefonoCasaContacto }}
                    </div>
                  </div>

                  <!-- Teléfono Personal -->
                  <div class="col-md-6 mb-3">
                    <label class="form-label">Teléfono Personal</label>
                    <input
                      v-model="formData.telefonoPersonalContacto"
                      type="text"
                      class="form-control"
                      :class="{
                        'is-invalid': formErrors.telefonoPersonalContacto,
                      }"
                      placeholder="Teléfono Personal"
                    />
                    <div
                      v-if="formErrors.telefonoPersonalContacto"
                      class="invalid-feedback"
                    >
                      {{ formErrors.telefonoPersonalContacto }}
                    </div>
                  </div>

                  <!-- Observación -->
                  <div class="col-md-6 mb-3">
                    <label class="form-label">Observación</label>
                    <textarea
                      v-model="formData.observacionContacto"
                      class="form-control"
                      placeholder="Observación"
                      maxlength="500"
                    ></textarea>
                  </div>

                  <!-- Botón de Guardar -->
                  <div class="flex justify-center q-mt-sm">
                    <button
                      :class="['btn', 'btn-primary', 'd-grid']"
                      type="submit"
                    >
                      {{
                        isEditMode ? "Actualizar Contacto" : "Guardar Contacto"
                      }}
                    </button>
                  </div>
                </div>
              </form>
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
import { useRoute } from "vue-router";
import { useContactStore } from "../stores/ContacStores";
import {
  useDepartamentoStore,
  useMunicipioStore,
} from "../stores/DatosGeneralesStores";
import { Notify } from "quasar";
import { storeToRefs } from "pinia";

// ----------------- STORES --------------------
const departamentoStore = useDepartamentoStore();
const municipioStore = useMunicipioStore();
const contactStore = useContactStore();

// Referencias a datos de las tiendas
const { departamentos } = storeToRefs(departamentoStore);
const { municipios } = storeToRefs(municipioStore);
const { contactos } = storeToRefs(contactStore);

// ----------------- REFS y VARIABLES --------------------
const dialogNuevoContacto = ref(false);
const formData = ref({
  nombreContacto: "",
  direccionContacto: "",
  organizacionContacto: "",
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
const route = useRoute();

// Para el DataGrid
const focusedRowKey = ref(null);

// Responsividad del DataGrid
const responsiveWidth = ref(window.innerWidth < 600 ? "100%" : "auto");
const updateWidth = () => {
  responsiveWidth.value = window.innerWidth < 600 ? "100%" : "auto";
};

// ----------------- COMPUTED --------------------
// Se mapean los contactos para mostrar "Departamento" y "Municipio" por su descripción
const contactosConDetalles = computed(() => {
  return (contactos.value || []).map((contacto) => {
    const departamento = (departamentos.value || []).find(
      (dept) => dept.id === Number(contacto.departamentoIdContacto)
    );
    const municipio = (municipios.value || []).find(
      (mun) => mun.id === Number(contacto.municipioIdContacto)
    );
    return {
      ...contacto,
      departamentoDescripcion: departamento
        ? departamento.descripcion
        : "Departamento no encontrado",
      municipioDescripcion: municipio
        ? municipio.descripcion
        : "Municipio no encontrado",
    };
  });
});

// Filtra los municipios en base al departamento seleccionado
const filteredMunicipios = computed(() => {
  if (!formData.value.departamentoIdContacto) return [];
  return municipios.value.filter(
    (municipio) =>
      municipio.departamentoId === Number(formData.value.departamentoIdContacto)
  );
});

// ----------------- LIFECYCLE --------------------
onMounted(async () => {
  await contactStore.cargarContactos();
  await departamentoStore.cargarDepartamentos();
  await municipioStore.cargarMunicipios();
  window.addEventListener("resize", updateWidth);

  // Verificar si se está editando desde la ruta (por ejemplo "/contactos/:id")
  const contactoIdParam = route.params.id;
  if (contactoIdParam) {
    await cargarContactoParaEditar(contactoIdParam);
  }
});

onUnmounted(() => {
  window.removeEventListener("resize", updateWidth);
});

// ----------------- MÉTODOS --------------------
// Abrir modal para nuevo contacto
const handleNuevoContacto = () => {
  isEditMode.value = false;
  resetForm();
  dialogNuevoContacto.value = true;
};

// Cerrar modal
const closeDialog = () => {
  dialogNuevoContacto.value = false;
};

// Resetear formulario
const resetForm = () => {
  formData.value = {
    nombreContacto: "",
    direccionContacto: "",
    organizacionContacto: "",
    departamentoIdContacto: null,
    municipioIdContacto: null,
    emailContacto: "",
    telefonoCasaContacto: "",
    telefonoPersonalContacto: "",
    observacionContacto: "",
  };
  formErrors.value = {};
};

// Cargar contacto para edición
async function cargarContactoParaEditar(id) {
  try {
    const contacto = await contactStore.obtenerContacto(id);
    if (contacto) {
      isEditMode.value = true;
      contactId.value = contacto.id;
      formData.value = {
        nombreContacto: contacto.nombreContacto,
        direccionContacto: contacto.direccionContacto,
        organizacionContacto: contacto.organizacionContacto,
        departamentoIdContacto: contacto.departamentoIdContacto,
        municipioIdContacto: contacto.municipioIdContacto,
        emailContacto: contacto.emailContacto,
        telefonoCasaContacto: contacto.telefonoCasaContacto,
        telefonoPersonalContacto: contacto.telefonoPersonalContacto,
        observacionContacto: contacto.observacionContacto,
      };
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

// Manejar clic en Editar (desde la columna de botones de DxDataGrid)
const onEditButtonClick = (e) => {
  handleEdit(e.row.data);
};

// Asignar datos al formulario para edición
const handleEdit = (contacto) => {
  if (contacto && contacto.id) {
    isEditMode.value = true;
    contactId.value = contacto.id;
    formData.value = {
      nombreContacto: contacto.nombreContacto,
      direccionContacto: contacto.direccionContacto,
      organizacionContacto: contacto.organizacionContacto,
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

// Manejar clic en Eliminar
const onDeleteButtonClick = async (e) => {
  await handleDelete(e.row.data.id);
};

// Eliminar un contacto
const handleDelete = async (id) => {
  try {
    await contactStore.eliminarContacto(id);
    Notify.create({
      message: "Contacto eliminado exitosamente",
      color: "green",
      position: "top-right",
    });
    // Refrescar
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

// Guardar o actualizar el contacto
async function guardarcontact() {
  // Reconstruir el payload
  const contactData = {
    ...formData.value,
    departamentoIdContacto:
      Number(formData.value.departamentoIdContacto) || null,
    municipioIdContacto: Number(formData.value.municipioIdContacto) || null,
  };

  // Validaciones básicas
  formErrors.value = {};

  if (!contactData.nombreContacto) {
    formErrors.value.nombreContacto = "El nombre es obligatorio.";
  }
  if (!contactData.direccionContacto) {
    formErrors.value.direccionContacto = "La dirección es obligatoria.";
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

  // Si hay errores, detener
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
    // Refrescar lista
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

// Actualizar departamento y resetear municipio al cambiar de departamento
function onDepartamentoChange(departamentoId) {
  formData.value.departamentoIdContacto = departamentoId;
  formData.value.municipioIdContacto = null;
}

// Para abrir panel lateral al hacer click en una fila (si lo tuvieras implementado)
const rowClick = (e) => {
  focusedRowKey.value = e.key;
  // Aquí podrías abrir un panel lateral o hacer cualquier otra acción.
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
  border-radius: 20px 0px 0px 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.fsButton {
  font-size: 16px;
}

.btnCerrarModal {
  font-size: 16px;
}

/* Ejemplo de clase para marcar inputs con error (Bootstrap-like) */
.is-invalid {
  border: 1px solid #dc3545;
}

.invalid-feedback {
  color: #dc3545;
  font-size: 0.875rem;
}

.espaciadoLateral {
  margin-left: 70px;
}

.right-content {
  justify-self: end;
}
</style>
