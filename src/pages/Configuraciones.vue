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
              <i class="ri-medical-line"></i>
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

                <!-- Sección: Horarios de Atención -->
                <q-separator class="q-my-md" />
                <div class="horarios-container">
                  <div class="horarios-header">
                    <h6 class="text-primary">Horarios de Atención</h6>
                    <q-btn
                      label="Agregar Horario"
                      color="primary"
                      icon="add"
                      @click="abrirModalCrearHorario()"
                      flat
                    />
                  </div>

                  <!-- DxDataGrid para Horarios de Atención -->
                  <DxDataGrid
                    :data-source="horariosAtencion"
                    :allow-column-reordering="true"
                    :row-alternation-enabled="true"
                    :show-borders="true"
                    key-expr="id"
                    :column-auto-width="true"
                    :column-min-width="90"
                    class="custom-data-grid"
                  >
                    <DxEditing
                      :allow-updating="false"
                      :allow-adding="false"
                      :allow-deleting="false"
                      mode="row"
                    />
                    <DxPaging :enabled="true" :page-size="7" />

                    <!-- Columnas Horarios -->
                    <DxColumn
                      data-field="dia_semana"
                      caption="Día de la Semana"
                      data-type="string"
                      min-width="150"
                    />
                    <DxColumn
                      data-field="hora_inicio"
                      caption="Hora de Inicio"
                      data-type="time"
                      min-width="120"
                    />
                    <DxColumn
                      data-field="hora_fin"
                      caption="Hora de Fin"
                      data-type="time"
                      min-width="120"
                    />
                    <DxColumn
                      data-field="intervalo_min"
                      caption="Intervalo (min)"
                      data-type="number"
                      min-width="120"
                    />

                    <!-- Botones de acción -->
                    <DxColumn type="buttons" width="150">
                      <DxButton
                        name="edit"
                        icon="edit"
                        hint="Editar Horario"
                        @click="editarHorarioAtencion(row)"
                      />
                      <DxButton
                        name="delete"
                        icon="delete"
                        hint="Eliminar Horario"
                        @click="eliminarHorarioAtencion(row)"
                      />
                    </DxColumn>
                  </DxDataGrid>
                </div>
              </q-card-section>
            </q-card>

            <!-- Modal para Agregar/Editar Horario -->
            <q-dialog v-model="abrirModalHorario" persistent>
              <q-card class="form-container widthModalHorarios">
                <q-card-section>
                  <div class="text-h6">
                    {{ esEditar ? "Editar" : "Agregar" }} Horario de Atención
                  </div>
                </q-card-section>

                <q-card-section>
                  <q-form
                    @submit.prevent="
                      esEditar ? actualizarHorario() : crearHorario()
                    "
                  >
                    <div class="q-gutter-md">
                      <!-- Día de la Semana -->
                      <div>
                        <label for="dia_semana">Día de la Semana</label>
                        <select
                          id="dia_semana"
                          name="dia_semana"
                          v-model="formHorario.dia_semana"
                          required
                          class="form-select custom-select-height"
                        >
                          <option value="" disabled>Seleccionar un día</option>
                          <option
                            v-for="dia in diasSemana"
                            :key="dia"
                            :value="dia"
                          >
                            {{ dia }}
                          </option>
                        </select>
                      </div>

                      <!-- Hora de Inicio y Hora de Fin -->
                      <div class="row-horizontal">
                        <div class="time-picker">
                          <label for="hora_inicio">Hora de Inicio</label>
                          <input
                            type="time"
                            id="hora_inicio"
                            v-model="formHorario.hora_inicio"
                            required
                          />
                        </div>
                        <div class="time-picker">
                          <label for="hora_fin">Hora de Fin</label>
                          <input
                            type="time"
                            id="hora_fin"
                            v-model="formHorario.hora_fin"
                            required
                          />
                        </div>
                      </div>

                      <!-- Intervalo entre Citas -->
                      <div>
                        <label for="intervalo_min">Intervalo (minutos)</label>
                        <input
                          id="intervalo_min"
                          name="intervalo_min"
                          type="number"
                          min="5"
                          v-model.number="formHorario.intervalo_min"
                          class="form-control"
                          required
                          placeholder="Intervalo entre Citas (minutos)"
                        />
                      </div>
                    </div>
                  </q-form>
                </q-card-section>

                <q-card-actions align="right">
                  <q-btn flat label="Cancelar" @click="cerrarModalHorario" />
                  <q-btn
                    label="Guardar"
                    color="primary"
                    @click="esEditar ? actualizarHorario() : crearHorario()"
                  />
                </q-card-actions>
              </q-card>
            </q-dialog>
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
import { ref, reactive, onMounted, watch } from "vue";
import { useQuasar } from "quasar";
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
const { users } = storeToRefs(crearUsuariosStore);
const { organizaciones, horariosAtencion } = storeToRefs(organizacionStore);
const { user, tenant_id, role, isAuthenticated } = storeToRefs(authStore);
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
      tenant_id: tenant_id.value,
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
      tenant_id: tenant_id.value,
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

/** Abrir el modal de nuevo horario */
const abrirModalCrearHorario = () => {
  esEditar.value = false;
  formHorario.id = null;
  formHorario.dia_semana = "";
  formHorario.hora_inicio = "";
  formHorario.hora_fin = "";
  formHorario.intervalo_min = 15;
  abrirModalHorario.value = true;
};

/** Editar horario existente */
const editarHorarioAtencion = (row) => {
  esEditar.value = true;
  formHorario.id = row.data.id;
  formHorario.dia_semana = row.data.dia_semana;
  formHorario.hora_inicio = row.data.hora_inicio;
  formHorario.hora_fin = row.data.hora_fin;
  formHorario.intervalo_min = row.data.intervalo_min;
  abrirModalHorario.value = true;
};

/** Cerrar modal */
const cerrarModalHorario = () => {
  abrirModalHorario.value = false;
};

/** Crear horario */
const crearHorario = async () => {
  if (
    !formHorario.dia_semana ||
    !formHorario.hora_inicio ||
    !formHorario.hora_fin ||
    !formHorario.intervalo_min
  ) {
    $q.notify({
      type: "negative",
      message: "Por favor, completa todos los campos.",
      position: "top-right",
    });
    return;
  }
  if (formHorario.hora_fin <= formHorario.hora_inicio) {
    $q.notify({
      type: "negative",
      message: "La hora de fin debe ser mayor que la hora de inicio.",
      position: "top-right",
    });
    return;
  }
  if (!tenant_id.value) {
    $q.notify({
      type: "negative",
      message: "Error: La organización no está definida o es inválida.",
      position: "top-right",
    });
    return;
  }

  const nuevoHorario = {
    dia_semana: formHorario.dia_semana,
    hora_inicio: formHorario.hora_inicio,
    hora_fin: formHorario.hora_fin,
    intervalo_min: formHorario.intervalo_min,
    tenant_id: tenant_id.value,
  };

  try {
    await organizacionStore.crearHorarioAtencion(nuevoHorario);
    cerrarModalHorario();
    await organizacionStore.cargarHorariosAtencion(tenant_id.value);
    $q.notify({
      type: "positive",
      message: "Horario de atención creado exitosamente.",
      position: "top-right",
    });
  } catch (error) {
    console.error("Error creando horario:", error);
    $q.notify({
      type: "negative",
      message: "Error al crear el horario de atención.",
      position: "top-right",
    });
  }
};

/** Actualizar horario */
const actualizarHorario = async () => {
  if (
    !formHorario.dia_semana ||
    !formHorario.hora_inicio ||
    !formHorario.hora_fin ||
    !formHorario.intervalo_min
  ) {
    $q.notify({
      type: "negative",
      message: "Por favor, completa todos los campos.",
      position: "top-right",
    });
    return;
  }
  if (formHorario.hora_fin <= formHorario.hora_inicio) {
    $q.notify({
      type: "negative",
      message: "La hora de fin debe ser mayor que la hora de inicio.",
      position: "top-right",
    });
    return;
  }
  if (!tenant_id.value) {
    $q.notify({
      type: "negative",
      message: "Error: La organización no está definida o es inválida.",
      position: "top-right",
    });
    return;
  }

  const horarioActualizado = {
    dia_semana: formHorario.dia_semana,
    hora_inicio: formHorario.hora_inicio,
    hora_fin: formHorario.hora_fin,
    intervalo_min: formHorario.intervalo_min,
    tenant_id: tenant_id.value,
  };

  try {
    await organizacionStore.actualizarHorarioAtencion(
      formHorario.id,
      horarioActualizado
    );
    cerrarModalHorario();
    await organizacionStore.cargarHorariosAtencion(tenant_id.value);
    $q.notify({
      type: "positive",
      message: "Horario de atención actualizado exitosamente.",
      position: "top-right",
    });
  } catch (error) {
    console.error("Error actualizando horario:", error);
    $q.notify({
      type: "negative",
      message: "Error al actualizar el horario de atención.",
      position: "top-right",
    });
  }
};

/** Eliminar horario */
const eliminarHorarioAtencion = async (row) => {
  const horario = row.data;
  if (
    confirm(
      `¿Estás seguro de eliminar el horario de ${
        horario.dia_semana
      } de ${formatTime(horario.hora_inicio)} a ${formatTime(
        horario.hora_fin
      )}?`
    )
  ) {
    try {
      await organizacionStore.eliminarHorarioAtencion(horario.id);
      await organizacionStore.cargarHorariosAtencion(tenant_id.value);
      $q.notify({
        type: "positive",
        message: "Horario de atención eliminado exitosamente.",
        position: "top-right",
      });
    } catch (error) {
      console.error("Error eliminando horario:", error);
      $q.notify({
        type: "negative",
        message: "Error al eliminar el horario de atención.",
        position: "top-right",
      });
    }
  }
};

/** Formatea la hora HH:mm a AM/PM */
const formatTime = (timeStr) => {
  try {
    const [hour, minute] = timeStr.split(":").map(Number);
    const suffix = hour >= 12 ? "PM" : "AM";
    const adjHour = hour % 12 || 12;
    return `${adjHour}:${minute.toString().padStart(2, "0")} ${suffix}`;
  } catch {
    return timeStr;
  }
};

/** Watch: Cargar organización y horarios al cambiar tenant_id */
watch(
  () => tenant_id.value,
  async (newTenantId) => {
    if (newTenantId) {
      await organizacionStore.cargarOrganizaciones();
      await organizacionStore.cargarHorariosAtencion(newTenantId);
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
  await organizacionStore.cargarOrganizaciones();
  await especialidadMedicaStore.cargarEspecialidades();

  // Debug: Verificar las especialidades cargadas
  console.log("Especialidades Cargadas (onMounted):", especialidades.value);

  console.log("User Auth:", user.value?.email);
  console.log("Organizaciones: ", organizaciones.value);
  console.log("tenant_id onMounted:", tenant_id.value);
  console.log("ESPECIALIDADES MEDICAS: ", especialidades.value);

  if (tenant_id.value) {
    await organizacionStore.cargarHorariosAtencion(tenant_id.value);
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
  width: 99%;
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
