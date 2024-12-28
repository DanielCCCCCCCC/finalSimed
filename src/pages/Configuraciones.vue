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
              <span>Crear Usuarios</span>
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
          <li class="nav-item">
            <a
              class="nav-link d-flex align-items-center"
              :class="{ active: activeTab === 'perfilMedico' }"
              href="#perfilMedico-tab"
              @click.prevent="activeTab = 'perfilMedico'"
              role="tab"
              aria-current="page"
              :aria-selected="activeTab === 'perfilMedico'"
            >
              <i class="ri-medical-line me-2"></i>
              <span>Perfil Médico</span>
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
                <!-- DxDataGrid Component -->
                <DxDataGrid
                  :data-source="users"
                  :allow-column-reordering="true"
                  :row-alternation-enabled="true"
                  :show-borders="true"
                  key-expr="id"
                  :column-auto-width="true"
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

                  <!-- Fecha de creación -->
                  <DxColumn
                    data-field="created_at"
                    caption="Creado en"
                    :calculate-cell-value="
                      (data) => formatDate(data.created_at)
                    "
                    :allow-sorting="true"
                    :allow-editing="false"
                    min-width="150"
                  />
                  <!-- ID del usuario -->
                  <!-- <DxColumn
                    data-field="id"
                    caption="ID"
                    :allow-sorting="true"
                    :allow-editing="false"
                    min-width="100"
                  /> -->

                  <!-- Correo (NO editable) -->
                  <DxColumn
                    data-field="email"
                    caption="Correo Electrónico"
                    :allow-sorting="true"
                    :allow-editing="true"
                    min-width="150"
                  >
                    <DxRequiredRule />
                    <DxEmailRule />
                  </DxColumn>

                  <!-- Contraseña (NO editable, oculto) -->
                  <DxColumn
                    data-field="password"
                    caption="Contraseña"
                    :allow-sorting="false"
                    :allow-editing="true"
                    data-type="string"
                    :visible="false"
                  />

                  <!-- Rol (NO editable) -->
                  <DxColumn
                    data-field="role"
                    caption="Rol"
                    min-width="100"
                    data-type="string"
                    :allow-editing="true"
                  >
                    <DxLookup
                      :data-source="rolesOptions"
                      value-expr="value"
                      display-expr="text"
                    />
                    <DxRequiredRule />
                  </DxColumn>

                  <!-- Campos nuevos: alias, direccion, telefono, observaciones -->
                  <DxColumn
                    data-field="alias"
                    caption="Alias"
                    data-type="string"
                    :allow-sorting="true"
                  />
                  <DxColumn
                    data-field="direccion"
                    caption="Dirección"
                    data-type="string"
                    :allow-sorting="true"
                  />
                  <DxColumn
                    data-field="telefono"
                    caption="Teléfono"
                    data-type="string"
                    :allow-sorting="true"
                    width="80px"
                  />
                  <DxColumn
                    data-field="observaciones"
                    caption="Observaciones"
                    data-type="string"
                    :allow-sorting="true"
                  />

                  <!-- Botones de acción -->
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
                <CodeQr />
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

          <!-- Pestaña Perfil Médico -->
          <div
            :class="[
              'tab-pane',
              activeTab === 'perfilMedico' ? 'show active' : '',
            ]"
            id="perfilMedico-tab"
            role="tabpanel"
          >
            <!-- Solo se muestra PerfilMedico cuando la pestaña está activa -->
            <PerfilMedico class="hsize" v-if="activeTab === 'perfilMedico'" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { useQuasar } from "quasar";
import { storeToRefs } from "pinia";

// **Stores**
import { useCrearUsuariosStore } from "../stores/crearUsuarios"; // Ajusta la ruta si es necesario
import { useAuthStore } from "../stores/auth";
import { useOrganizacionStore } from "../stores/organizacionStore";

// **Componentes**
import PerfilMedico from "./PerfilMedico.vue";
import CodeQr from "../components/CodeQR.vue";

// **DevExtreme DataGrid**
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

// Emitir eventos (si se necesita cerrar el modal desde un componente padre)
const emit = defineEmits(["cerrar"]);

// Instancia de Quasar para notificaciones
const $q = useQuasar();

// Estado reactivo para la pestaña activa
const activeTab = ref("crearUsuarios");

// Usar las stores
const crearUsuariosStore = useCrearUsuariosStore();
const organizacionStore = useOrganizacionStore();
const authStore = useAuthStore();

// Desestructurar propiedades reactivas de las stores
const { users } = storeToRefs(crearUsuariosStore);
const { organizaciones } = storeToRefs(organizacionStore);
const { user, tenant_id, role, isAuthenticated } = storeToRefs(authStore);

// Opciones para los roles (aunque estarán deshabilitados para edición)
const rolesOptions = ref([
  { value: "admin", text: "Admin" },
  { value: "medico", text: "Médico" },
  { value: "secretario", text: "Secretario(a)" },
  { value: "paciente", text: "Paciente" },
]);

// Estado reactivo para el formulario de Organización (no se usa mucho aquí)
const formOrganizacion = reactive({
  nombre: "",
  email: "",
  password: "",
  role: "",
});

// Estado reactivo para los errores del formulario de Organización
const errorsOrganizacion = reactive({});

// Función para formatear fechas
const formatDate = (dateString) => {
  try {
    return format(new Date(dateString), "dd/MM/yyyy hh:mm a");
  } catch {
    return "Fecha no válida";
  }
};

/** Actualizar la organización (ejemplo, si lo necesitas) */
const actualizarOrganizacion = async () => {
  try {
    await organizacionStore.actualizarOrganizacion(formOrganizacion);
    $q.notify({
      type: "positive",
      message: "Organización actualizada exitosamente.",
    });
    formOrganizacion.nombre = "";
    formOrganizacion.email = "";
    formOrganizacion.password = "";
    formOrganizacion.role = "";
  } catch (err) {
    if (err.errors) {
      err.errors.forEach((error) => {
        errorsOrganizacion[error.field] = error.message;
      });
    }
    $q.notify({
      type: "negative",
      message: err.message || "Error al actualizar la organización.",
    });
  }
};

/**
 * Crear usuario (cuando se presiona "Agregar" en el DataGrid)
 */
const onRowInserting = async (e) => {
  const { data } = e;
  try {
    // data contendrá { email, password, role, alias, direccion, telefono, observaciones }
    await crearUsuariosStore.crearUsuario(data);
    e.cancel = true;
    await crearUsuariosStore.cargarUsuarios();
    $q.notify({
      type: "positive",
      message: "Usuario creado exitosamente.",
    });
  } catch (err) {
    e.cancel = true;
    $q.notify({
      type: "negative",
      message: err.message || "Error al crear el usuario.",
    });
  }
};

/**
 * Actualizar usuario (cuando se presiona "Guardar" en edición en el DataGrid)
 */
const onRowUpdating = async (e) => {
  const { key, newData } = e;
  try {
    // key es el 'id' del usuario
    // newData contendrá SOLO los campos modificados
    await crearUsuariosStore.actualizarUsuario({ id: key, ...newData });
    e.cancel = true;
    await crearUsuariosStore.cargarUsuarios();
    $q.notify({
      type: "positive",
      message: "Usuario actualizado exitosamente.",
    });
  } catch (err) {
    e.cancel = true;
    $q.notify({
      type: "negative",
      message: err.message || "Error al actualizar el usuario.",
    });
  }
};

/**
 * Eliminar usuario (cuando se presiona el botón "Eliminar" en el DataGrid)
 */
const onRowDeleting = async (e) => {
  const { key } = e;
  try {
    await crearUsuariosStore.eliminarUsuario(key);
    e.cancel = true;
    await crearUsuariosStore.cargarUsuarios();
    $q.notify({
      type: "positive",
      message: "Usuario eliminado exitosamente.",
    });
  } catch (err) {
    e.cancel = true;
    $q.notify({
      type: "negative",
      message: err.message || "Error al eliminar el usuario.",
    });
  }
};

// Al montar el componente, cargamos los usuarios y las organizaciones
onMounted(async () => {
  await crearUsuariosStore.cargarUsuarios();
  await organizacionStore.cargarOrganizaciones();
  console.log("User Auth:", user.value?.email);
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
  height: 90vh; /* Ajusta según tu preferencia */
}
.custom-data-grid {
  width: 100%;
}
.menu-container {
  background: #f8f9fa;
  border-radius: 8px;
  height: 86vh;
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
.hsize {
  height: 600px;
  position: relative;
  top: -10px;
}
.q-btn {
  width: 100%;
}
</style>
