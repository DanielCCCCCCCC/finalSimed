<!-- src/components/nuevoFormulario.vue -->
<template>
  <q-page class="q-pa-md flex flex-center">
    <q-card class="shadow-2 rounded-borders form-card">
      <q-card-section>
        <div class="q-mb-md flex justify-between items-center">
          <h2 class="text-h4 text-primary">
            {{ isEditMode ? "Editar Contacto" : "Agregar Contacto" }}
          </h2>
          <q-btn
            label="Volver al Listado"
            color="secondary"
            icon="arrow_back"
            flat
            @click="volverAlListado"
          />
        </div>

        <q-form @submit.prevent="guardarContacto">
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
              />
              <q-input
                v-model="formData.direccionContacto"
                label="Dirección"
                outlined
                dense
                required
                class="q-mb-md"
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
              :label="isEditMode ? 'Actualizar Contacto' : 'Guardar Contacto'"
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
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  useDepartamentoStore,
  useMunicipioStore,
} from "../stores/DatosGeneralesStores";
import { useGruposContactosStore } from "../stores/ConfiMedicasStores";
import { useContactStore } from "../stores/ContacStores";
import { Notify } from "quasar";
import { storeToRefs } from "pinia";

// Instancias de las tiendas
const departamentoStore = useDepartamentoStore();
const municipioStore = useMunicipioStore();
const contactStore = useContactStore();
const gruposContactosStore = useGruposContactosStore();

// Referencias a los datos de las tiendas
const { grupos } = storeToRefs(gruposContactosStore);
const { departamentos } = storeToRefs(departamentoStore);
const { municipios } = storeToRefs(municipioStore);

// Router y Route
const route = useRoute();
const router = useRouter();

// Datos del formulario
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

// Manejo de errores
const formErrors = ref({});

// Modo edición
const isEditMode = ref(false);
let selectedContactId = null;

// Computed para filtrar los municipios según el departamento seleccionado
const filteredMunicipios = computed(() => {
  if (!formData.value.departamentoIdContacto) return [];
  const deptId =
    formData.value.departamentoIdContacto.id ||
    formData.value.departamentoIdContacto;
  return municipios.value.filter(
    (municipio) => municipio.departamentoId === deptId
  );
});

// Manejar el cambio de departamento
function onDepartamentoChange(departamento) {
  formData.value.departamentoIdContacto = departamento;
  formData.value.municipioIdContacto = null; // Resetear el municipio al cambiar de departamento
}

// Cargar datos iniciales
onMounted(async () => {
  await gruposContactosStore.cargarGrupos();
  await departamentoStore.cargarDepartamentos();
  await municipioStore.cargarMunicipios();

  // Verificar si se está editando
  const contactoId = route.params.id;
  if (contactoId) {
    await cargarContactoParaEditar(contactoId);
  }
});

// Función para cargar contacto en modo edición
async function cargarContactoParaEditar(contactoId) {
  try {
    const contacto = await contactStore.obtenerContacto(contactoId);
    if (contacto) {
      formData.value = {
        nombreContacto: contacto.nombreContacto,
        direccionContacto: contacto.direccionContacto,
        organizacionContacto: contacto.organizacionContacto,
        grupoIdContacto:
          grupos.value.find((grp) => grp.id === contacto.grupoIdContacto) ||
          null,
        departamentoIdContacto:
          departamentos.value.find(
            (dept) => dept.id === contacto.departamentoIdContacto
          ) || null,
        municipioIdContacto:
          municipios.value.find(
            (mun) => mun.id === contacto.municipioIdContacto
          ) || null,
        emailContacto: contacto.emailContacto,
        telefonoCasaContacto: contacto.telefonoCasaContacto,
        telefonoPersonalContacto: contacto.telefonoPersonalContacto,
        observacionContacto: contacto.observacionContacto,
      };
      selectedContactId = contacto.id;
      isEditMode.value = true;
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

// Guardar o actualizar contacto
async function guardarContacto() {
  const contactoData = {
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
  formErrors.value = {};

  if (!contactoData.nombreContacto) {
    formErrors.value.nombreContacto = "El nombre es obligatorio.";
  }
  if (!contactoData.direccionContacto) {
    formErrors.value.direccionContacto = "La dirección es obligatoria.";
  }
  if (!contactoData.grupoIdContacto) {
    formErrors.value.grupoIdContacto = "El grupo es obligatorio.";
  }
  if (!contactoData.departamentoIdContacto) {
    formErrors.value.departamentoIdContacto = "El departamento es obligatorio.";
  }
  if (!contactoData.municipioIdContacto) {
    formErrors.value.municipioIdContacto = "El municipio es obligatorio.";
  }
  if (!contactoData.emailContacto) {
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
      await contactStore.actualizarContacto({
        id: selectedContactId,
        ...contactoData,
      });
      Notify.create({
        message: "Contacto actualizado exitosamente",
        color: "positive",
        position: "top-right",
      });
    } else {
      await contactStore.agregarContacto(contactoData);
      Notify.create({
        message: "Contacto guardado exitosamente",
        color: "positive",
        position: "top-right",
      });
    }
    resetFormulario();
    router.push({ name: "contactsList" }); // Asegúrate de que este nombre de ruta exista
  } catch (error) {
    console.error("Error al guardar contacto:", error);
    Notify.create({
      message: "Hubo un error al guardar el contacto",
      color: "negative",
      position: "top-right",
    });
  }
}

// Resetear formulario
function resetFormulario() {
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
  isEditMode.value = false;
  selectedContactId = null;
}

// Función para volver al listado
function volverAlListado() {
  router.push({ name: "contactsList" }); // Asegúrate de que este nombre de ruta exista
}
</script>

<style scoped>
/* Si usas sharedStyles.css, esta sección puede estar vacía o contener estilos específicos adicionales */
</style>
