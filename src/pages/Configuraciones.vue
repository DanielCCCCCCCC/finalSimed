<template>
  <div class="main-container">
    <div class="row">
      <!-- Menú de Pestañas Verticales -->
      <div class="col-md-2 menu-container">
        <ul class="nav nav-tabs flex-column vertical-tabs" role="tablist">
          <li class="nav-item">
            <a
              class="nav-link d-flex align-items-center"
              :class="{ active: activeTab === 'crearUsuarios' }"
              href="#crearUsuarios-tab"
              @click.prevent="activeTab = 'crearUsuarios'"
              role="tab"
              aria-current="page"
              :aria-selected="activeTab === 'crearUsuarios'"
            >
              <i class="ri-user-add-line me-2"></i>
              <span>Crear Usuarios </span>
            </a>
          </li>
          <li class="nav-item">
            <a
              class="nav-link d-flex align-items-center"
              :class="{ active: activeTab === 'organizacion' }"
              href="#organizacion-tab"
              @click.prevent="activeTab = 'organizacion'"
              role="tab"
              aria-current="page"
              :aria-selected="activeTab === 'organizacion'"
            >
              <i class="ri-buildings-line me-2"></i>
              <span>Organización</span>
            </a>
          </li>
        </ul>
      </div>

      <!-- Contenido de las Pestañas -->
      <div class="col-12 col-md-10 content-container">
        <div class="tab-content">
          <!-- Pestaña Crear Usuarios -->
          <div
            :class="[
              'tab-pane',
              activeTab === 'crearUsuarios' ? 'show active' : '',
            ]"
            id="crearUsuarios-tab"
            role="tabpanel"
          >
            <q-card class="form-container">
              <q-card-section class="header bg-primary text-white">
                <div class="text-h6">
                  Crear Usuarios para: {{ organizaciones[0]?.nombre }}
                </div>
              </q-card-section>
              <q-card-section>
                <DxDataGrid
                  :data-source="users"
                  :allow-column-reordering="true"
                  :row-alternation-enabled="true"
                  :show-borders="true"
                  key-expr="id"
                  :column-auto-width="false"
                  :column-min-width="90"
                  class="custom-data-grid"
                  :column-resizing-mode="'widget'"
                  @row-inserting="onRowInserting"
                  @row-updating="onRowUpdating"
                  @row-deleting="onRowDeleting"
                >
                  <DxEditing
                    :allow-updating="true"
                    :allow-adding="true"
                    :allow-deleting="true"
                    mode="form"
                  />
                  <DxPaging :enabled="true" :page-size="10" />

                  <DxColumn
                    data-field="created_at"
                    caption="Creado en"
                    :calculate-cell-value="
                      (data) => formatDate(data.created_at)
                    "
                    :allow-sorting="true"
                    width="250px"
                    :allow-editing="false"
                  />
                  <DxColumn
                    data-field="id"
                    caption="ID"
                    :allow-sorting="true"
                    width="300px"
                    :allow-editing="false"
                  />
                  <DxColumn
                    data-field="email"
                    caption="Correo Electrónico"
                    min-width="150"
                    width="395px"
                  >
                    <DxRequiredRule />
                    <DxEmailRule />
                  </DxColumn>
                  <DxColumn
                    data-field="password"
                    caption="Contraseña"
                    min-width="150"
                    width="200px"
                    data-type="string"
                    :visible="false"
                  >
                    <DxRequiredRule />
                  </DxColumn>

                  <DxColumn
                    data-field="role"
                    caption="Rol"
                    min-width="150"
                    width="250px"
                    data-type="string"
                  >
                    <DxLookup
                      :data-source="rolesOptions"
                      value-expr="value"
                      display-expr="text"
                    />
                    <DxRequiredRule />
                  </DxColumn>
                  <DxColumn type="buttons" width="120">
                    <DxButton name="edit" icon="edit" hint="Editar" />
                    <DxButton name="delete" icon="trash" hint="Eliminar" />
                  </DxColumn>
                </DxDataGrid>
              </q-card-section>
            </q-card>
          </div>

          <!-- Pestaña Organización -->
          <div
            :class="[
              'tab-pane',
              activeTab === 'organizacion' ? 'show active' : '',
            ]"
            id="organizacion-tab"
            role="tabpanel"
          >
            <q-card class="form-container">
              <q-card-section class="header bg-primary text-white">
                <div class="text-h6">Organización</div>
              </q-card-section>
              <q-card-section>
                <div v-if="organizaciones.length">
                  <q-list dense bordered separator>
                    <q-item>
                      <q-item-section>
                        <q-item-label><strong>Nombre:</strong></q-item-label>
                      </q-item-section>
                      <q-item-section side>
                        <q-item-label>{{
                          organizaciones[0]?.nombre
                        }}</q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-item>
                      <q-item-section>
                        <q-item-label><strong>Dirección:</strong></q-item-label>
                      </q-item-section>
                      <q-item-section side>
                        <q-item-label>{{
                          organizaciones[0]?.direccion
                        }}</q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-item>
                      <q-item-section>
                        <q-item-label><strong>Email:</strong></q-item-label>
                      </q-item-section>
                      <q-item-section side>
                        <q-item-label>{{
                          organizaciones[0]?.email_contacto
                        }}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { useQuasar } from "quasar";
import { useCrearUsuariosStore } from "../stores/crearUsuarios"; // Asegúrate de que la ruta sea correcta
import { useAuthStore } from "../stores/auth"; // Importa la store de autenticación
import { useOrganizacionStore } from "../stores/organizacionStore"; // Importa la store de organización
import {
  DxDataGrid,
  DxEditing,
  DxPaging,
  DxColumn,
  DxRequiredRule,
  DxEmailRule,
  DxLookup,
  DxButton,
} from "devextreme-vue/data-grid";
import { format } from "date-fns";

import { storeToRefs } from "pinia";

// Emitir eventos (si se necesita cerrar el modal desde un componente padre)
const emit = defineEmits(["cerrar"]);

// Instancia de Quasar para notificaciones
const $q = useQuasar();

// Estado reactivo para la pestaña activa
const activeTab = ref("crearUsuarios");

// Importa y utiliza las stores
const crearUsuariosStore = useCrearUsuariosStore();
const organizacionStore = useOrganizacionStore();
const authStore = useAuthStore();

// Desestructurar propiedades reactivas de las stores
const { user, tenant_id, role, isAuthenticated } = storeToRefs(authStore);
const { users } = storeToRefs(crearUsuariosStore);
const { organizaciones } = storeToRefs(organizacionStore);

// Opciones para los roles en el DataGrid
const rolesOptions = ref([
  { value: "admin", text: "Admin" },
  { value: "medico", text: "Médico" },
  { value: "secretario", text: "Secretario(a)" },
  { value: "paciente", text: "Paciente" },
  // Agrega más roles según sea necesario
]);

// Estado reactivo para el formulario de Organización
const formOrganizacion = reactive({
  nombre: "",
  email: "",
  password: "",
  role: "",
});

// Estado reactivo para los errores del formulario de Organización
const errorsOrganizacion = reactive({});
// Función para convertir el formato de la fecha
const formatDate = (dateString) => {
  try {
    return format(new Date(dateString), "dd/MM/yyyy hh:mm a");
  } catch {
    return "Fecha no válida";
  }
};
/**
 * Función para actualizar la organización.
 * Implementa la lógica para actualizar en tu backend aquí.
 */
const actualizarOrganizacion = async () => {
  try {
    await organizacionStore.actualizarOrganizacion(formOrganizacion);
    // Mostrar notificación de éxito
    $q.notify({
      type: "positive",
      message: "Organización actualizada exitosamente.",
    });
    // Limpiar el formulario
    formOrganizacion.nombre = "";
    formOrganizacion.email = "";
    formOrganizacion.password = "";
    formOrganizacion.role = "";
  } catch (err) {
    // Manejar errores de validación
    if (err.errors) {
      err.errors.forEach((error) => {
        errorsOrganizacion[error.field] = error.message;
      });
    }
    // Mostrar notificación de error
    $q.notify({
      type: "negative",
      message: err.message || "Error al actualizar la organización.",
    });
  }
};

/**
 * Función para manejar la inserción de una fila (Agregar Usuario) en el DataGrid
 */
const onRowInserting = async (e) => {
  const { data } = e;
  try {
    await crearUsuariosStore.crearUsuario(data);
    e.cancel = true;
    await crearUsuariosStore.cargarUsuarios();
    // Mostrar notificación de éxito
    $q.notify({
      type: "positive",
      message: "Usuario creado exitosamente.",
    });
  } catch (err) {
    e.cancel = true;
    // Mostrar notificación de error
    $q.notify({
      type: "negative",
      message: err.message || "Error al crear el usuario.",
    });
  }
};

/**
 * Función para manejar la actualización de una fila (Editar Usuario) en el DataGrid
 */
const onRowUpdating = async (e) => {
  const { key, newData } = e;
  try {
    await crearUsuariosStore.actualizarUsuario({ id: key, ...newData });
    e.cancel = true; // Evita que DevExtreme maneje la actualización automáticamente
    await crearUsuariosStore.cargarUsuarios();
    $q.notify({
      type: "positive",
      message: "Usuario actualizado exitosamente.",
    });
  } catch (err) {
    e.cancel = true;
    // Mostrar notificación de error
    $q.notify({
      type: "negative",
      message: err.message || "Error al actualizar el usuario.",
    });
  }
};

/**
 * Función para manejar la eliminación de una fila (Eliminar Usuario) en el DataGrid
 */
const onRowDeleting = async (e) => {
  const { key } = e;
  try {
    await crearUsuariosStore.eliminarUsuario(key);
    e.cancel = true; // Evita que DevExtreme maneje la eliminación automáticamente
    // Refrescar la lista de usuarios
    await crearUsuariosStore.cargarUsuarios();
    // Mostrar notificación de éxito
    $q.notify({
      type: "positive",
      message: "Usuario eliminado exitosamente.",
    });
  } catch (err) {
    e.cancel = true;
    // Mostrar notificación de error
    $q.notify({
      type: "negative",
      message: err.message || "Error al eliminar el usuario.",
    });
  }
};

// Obtener la lista de usuarios y organizaciones al montar el componente
onMounted(async () => {
  await crearUsuariosStore.cargarUsuarios();
  await organizacionStore.cargarOrganizaciones();
  console.log(user.value?.email);
  console.log("Organizaciones: ", organizaciones.value);
});
</script>

<style scoped>
.main-container {
  background-color: #ffffff;
  padding: 20px;
  border-radius: 8px;
  width: 90%;
  position: relative;
  left: 135px;
  height: 90vb;
}

.menu-container {
  background: #f8f9fa;
  border-radius: 8px;
  height: 86vb;
}

.vertical-tabs .nav-link {
  font-size: 14px;
  padding: 10px;
  margin-bottom: 5px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.vertical-tabs .nav-link.active {
  background: #e74c3c;
  color: white;
}

.content-container {
  padding: 20px;
}

.form-container {
  border-radius: 8px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
}

.header {
  border-radius: 8px 8px 0 0;
}

.custom-data-grid {
  height: 400px;
  margin-top: 10px;
}

.q-btn {
  width: 100%;
}
</style>
