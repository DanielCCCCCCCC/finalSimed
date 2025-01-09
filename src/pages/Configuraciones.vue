<template>
  <div class="main-container">
    <div class="row">
      <!-- Menú de Pestañas Verticales -->
      <div class="menu-container">
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
              <i class="ri-building-2-line me-2"></i>
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
              <i class="ri-user-heart-line me-2"></i>
              <span>Perfil Médico</span>
            </a>
          </li>
        </ul>
      </div>

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

                  <!-- Correo (editable) -->
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

                  <!-- Rol (editable) -->
                  <DxColumn
                    data-field="role"
                    caption="Rol"
                    min-width="60"
                    width="120"
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

                  <!-- Especialidad Médica (editable) -->
                  <DxColumn
                    data-field="especialidadMedica"
                    caption="Especialidad Médica"
                    min-width="150"
                    width="100"
                    data-type="string"
                    :allow-editing="true"
                  >
                    <DxLookup
                      :data-source="especialidades"
                      value-expr="id"
                      display-expr="descripcion"
                      @contentReady="onLookupContentReady"
                    />
                    <DxRequiredRule />
                  </DxColumn>
                  <!-- Nueva Columna: Bandera (Checkbox) -->
                  <DxColumn
                    data-field="esMarcado"
                    caption="Bandera"
                    data-type="boolean"
                    min-width="100"
                    :allow-editing="true"
                    alignment="center"
                  >
                    <template #cellTemplate="{ data }">
                      <q-checkbox
                        v-model="data.esMarcado"
                        @update:model-value="onMarcadoChange(data)"
                        color="primary"
                        dense
                      />
                    </template>
                  </DxColumn>
                  <!-- Campos nuevos: nombreCompleto, direccion, telefono, observaciones -->
                  <DxColumn
                    data-field="nombreCompleto"
                    caption="Nombre Completo"
                    data-type="string"
                    :allow-sorting="true"
                  />
                  <DxColumn
                    data-field="direccion"
                    caption="Dirección"
                    data-type="string"
                    :allow-sorting="true"
                    :visible="false"
                  />
                  <DxColumn
                    data-field="telefono"
                    caption="Teléfono"
                    data-type="string"
                    :allow-sorting="true"
                    width="120px"
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
          <!-- Pestaña Configuraciones -->
          <!--  -->
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, reactive, onMounted, watch } from "vue";
import { useQuasar, Notify } from "quasar";
import { storeToRefs } from "pinia";

// **Stores**
import { useCrearUsuariosStore } from "../stores/crearUsuarios";
import { useAuthStore } from "../stores/auth";
import { useOrganizacionStore } from "../stores/organizacionStore";
import { useEspecialidadMedicaStore } from "../stores/ConfiMedicasStores";

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

// **date-fns** para formatear fechas
import { format } from "date-fns";

// **Notificaciones Quasar**
const $q = useQuasar();

// Emitir eventos si lo necesitas
const emit = defineEmits(["cerrar"]);

// Tab activa
const activeTab = ref("crearUsuarios");

// Instancia Stores
const crearUsuariosStore = useCrearUsuariosStore();
const organizacionStore = useOrganizacionStore();
const especialidadMedicaStore = useEspecialidadMedicaStore();
const authStore = useAuthStore();

// Desestructurar states
const { users, horariosAtencion } = storeToRefs(crearUsuariosStore);
const { organizaciones } = storeToRefs(organizacionStore);
const { user, userId, tenant_id, role, isAuthenticated } =
  storeToRefs(authStore);
const { especialidades } = storeToRefs(especialidadMedicaStore);

// Roles
const rolesOptions = ref([
  { value: "admin", text: "Admin" },
  { value: "medico", text: "Médico" },
  { value: "secretario", text: "Secretario(a)" },
  { value: "paciente", text: "Paciente" },
]);

// Horarios
const formHorario = reactive({
  id: null,
  dia_semana: "",
  hora_inicio: "",
  hora_fin: "",
  intervalo_min: 15,
});
const esEditar = ref(false);
const diasSemana = ref([
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
  "Domingo",
]);
const abrirModalHorario = ref(false);

/** Formatea fecha en la grilla */
const formatDate = (dateString) => {
  try {
    return format(new Date(dateString), "dd/MM/yyyy hh:mm a");
  } catch {
    return "Fecha no válida";
  }
};

/**
 * Genera una contraseña aleatoria con mayúsculas, minúsculas, dígitos y símbolos.
 * @param {number} length - Longitud de la contraseña, por defecto 12
 */
function generateRandomPassword(length = 12) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+{}:<>?,./";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * onRowInserting: Crear usuario con password aleatorio.
 * Llama a crearUsuarioConPassword(...) en la store.
 */
const onRowInserting = async (e) => {
  const { data } = e;
  try {
    if (!data.email) {
      throw new Error("Debes ingresar un correo electrónico.");
    }

    // Generar una contraseña aleatoria robusta
    const generatedPassword = generateRandomPassword(12);
    console.log("Contraseña generada:", generatedPassword);

    // Debug: Verificar los datos antes de enviar a la store
    console.log("Datos de Usuario a Crear:", {
      email: data.email,
      role: data.role,
      nombreCompleto: data.nombreCompleto,
      direccion: data.direccion,
      telefono: data.telefono,
      observaciones: data.observaciones,
      especialidadMedica: data.especialidadMedica,
      esMarcado: data.esMarcado, // Nuevo campo
      userId: userId.value,
    });

    // Llamar a la función de la store
    await crearUsuariosStore.crearUsuario(data.email, generatedPassword, {
      role: data.role,
      nombreCompleto: data.nombreCompleto,
      direccion: data.direccion,
      telefono: data.telefono,
      observaciones: data.observaciones,
      especialidadMedica: data.especialidadMedica, // Asegurar que la especialidad se guarda
      esMarcado: data.esMarcado, // Asegurar que la bandera se guarda
      userId: userId.value,
    });

    // Cancelamos la inserción local para no duplicar
    e.cancel = true;

    // Refrescamos la lista
    await crearUsuariosStore.cargarUsuarios();

    $q.notify({
      type: "positive",
      message: `Usuario creado con contraseña generada: ${generatedPassword}`,
      position: "top-right",
    });
  } catch (err) {
    e.cancel = true;
    $q.notify({
      type: "negative",
      message: err.message || "Error al crear el usuario.",
      position: "top-right",
    });
  }
};

/** Actualizar usuario en la tabla 'users' (no confundir con supabase.auth) */
const onRowUpdating = async (e) => {
  const { key, newData } = e;
  try {
    // Debug: Verificar los datos antes de actualizar
    console.log("Datos de Usuario a Actualizar:", { id: key, ...newData });

    await crearUsuariosStore.actualizarUsuario({ id: key, ...newData });
    e.cancel = true;
    await crearUsuariosStore.cargarUsuarios();
    $q.notify({
      type: "positive",
      message: "Usuario actualizado exitosamente.",
      position: "top-right",
    });
  } catch (err) {
    e.cancel = true;
    $q.notify({
      type: "negative",
      message: err.message || "Error al actualizar el usuario.",
      position: "top-right",
    });
  }
};

/** Eliminar usuario */
const onRowDeleting = async (e) => {
  const { key } = e;
  try {
    await crearUsuariosStore.eliminarUsuario(key);
    e.cancel = true;
    await crearUsuariosStore.cargarUsuarios();
    $q.notify({
      type: "positive",
      message: "Usuario eliminado exitosamente.",
      position: "top-right",
    });
  } catch (err) {
    e.cancel = true;
    $q.notify({
      type: "negative",
      message: err.message || "Error al eliminar el usuario.",
      position: "top-right",
    });
  }
};

/** Watch: Cargar organización y horarios al cambiar tenant_id */
watch(
  () => tenant_id.value,
  async (newTenantId) => {
    if (newTenantId) {
      await organizacionStore.cargarOrganizaciones();
      await crearUsuariosStore.cargarHorariosAtencion(newTenantId);
    } else {
      organizacionStore.organizaciones = [];
      organizacionStore.horariosAtencion = [];
      $q.notify({
        type: "negative",
        message: "Error: tenant_id no está definido o es inválido.",
        position: "top-right",
      });
    }
  },
  { immediate: true }
);

/** onMounted: cargarUsuarios, cargarOrganizaciones */
onMounted(async () => {
  await crearUsuariosStore.cargarUsuarios();
  await crearUsuariosStore.cargarHorariosAtencion();

  await organizacionStore.cargarOrganizaciones();
  await especialidadMedicaStore.cargarEspecialidades();

  // Debug: Verificar las especialidades cargadas
  console.log("Especialidades Cargadas (onMounted):", especialidades.value);

  console.log("User Auth:", users[0].value.nombreCompleto);
  console.log("Organizaciones: ", organizaciones.value);
  console.log("tenant_id onMounted:", tenant_id.value);
  console.log("ESPECIALIDADES MEDICAS: ", especialidades.value);
  console.log("Nombre del medico: ", users.nombreCompleto);
  if (tenant_id.value) {
    await crearUsuariosStore.cargarHorariosAtencion(tenant_id.value);
  } else {
    $q.notify({
      type: "negative",
      message: "Error: tenant_id no está definido o es inválido.",
      position: "top-right",
    });
  }
});

/** Método para depurar DxLookup */
const onLookupContentReady = () => {
  console.log("DxLookup de Especialidad Médica listo.");
  console.log("Datos de Especialidades en Lookup:", especialidades.value);
};

/** Manejar cambios en el checkbox de bandera */
const onFlaggedChange = async (user) => {
  try {
    await crearUsuariosStore.actualizarUsuario({
      id: user.id,
      esMarcado: user.esMarcado,
    });
    await crearUsuariosStore.cargarUsuarios();
    $q.notify({
      type: "positive",
      message: `Bandera actualizada para ${user.nombreCompleto}.`,
      position: "top-right",
    });
  } catch (error) {
    console.error("Error actualizando bandera:", error);
    $q.notify({
      type: "negative",
      message: "Error al actualizar la bandera.",
      position: "top-right",
    });
  }
};
</script>

<style scoped>
.main-container {
  background-color: #ffffff;
  padding: 20px;
  border-radius: 8px;
  width: 100%;
  margin-right: 150px;
  position: relative;
  left: 120px;
  /* height: 100vh; */
  height: 100%;
}

.custom-data-grid {
  width: 100%;
}

.menu-container {
  background: #f8f9fa;
  border-radius: 8px;
  height: 86vh;
  width: 200px;
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
  color: #fff;
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

.widthModalHorarios {
  width: 40%;
  height: auto;
  max-width: 1400px;
}

.row-horizontal {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}

.time-picker {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.time-picker label {
  margin-bottom: 4px;
  font-weight: bold;
}

.time-picker input[type="time"] {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
}

.horarios-container {
  margin-top: 10px;
}

.horarios-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.horarios-header h6 {
  font-size: 18px;
  color: #2c3e50;
}

.horarios-header .q-btn {
  min-width: 150px;
}

@media (max-width: 768px) {
  .row-horizontal {
    flex-direction: column;
    gap: 10px;
  }
  .time-picker input[type="time"] {
    width: 100%;
  }
  .horarios-header {
    flex-direction: column;
    align-items: flex-start;
  }
  .horarios-header .q-btn {
    width: 100%;
    margin-top: 10px;
  }
  .custom-data-grid {
    min-height: 300px;
  }
}

.required {
  color: red;
  margin-left: 4px;
}

.text-h6 {
  font-size: 1.25rem;
}
</style>
