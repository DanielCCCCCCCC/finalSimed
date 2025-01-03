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

                  <!-- Campos nuevos: nombreCompleto, direccion, telefono, observaciones -->
                  <DxColumn
                    data-field="nombreCompleto"
                    caption="nombreCompleto"
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

                <!-- Nueva Sección: Horarios de Atención -->
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
                    <!-- Definir las columnas -->
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

            <!-- Modal para Agregar/Editar Horario de Atención -->
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
                      <!-- Hora de Inicio y Hora de Fin en la misma fila -->
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
                        <label for="intervalo_min"
                          >Intervalo entre Citas (minutos)</label
                        >

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

// **Librería para formateo de fechas**
import { format } from "date-fns";

// **Notificaciones de Quasar**
const $q = useQuasar();

// **Emitir eventos (si se necesita cerrar el modal desde un componente padre)**
const emit = defineEmits(["cerrar"]);

// **Estado reactivo para la pestaña activa**
const activeTab = ref("crearUsuarios");

// **Instancia de las stores**
const crearUsuariosStore = useCrearUsuariosStore();
const organizacionStore = useOrganizacionStore();
const authStore = useAuthStore();

// **Desestructurar propiedades reactivas de las stores**
const { users } = storeToRefs(crearUsuariosStore);
const { organizaciones, horariosAtencion } = storeToRefs(organizacionStore);
const { user, tenant_id, role, isAuthenticated } = storeToRefs(authStore);

// **Opciones para los roles**
const rolesOptions = ref([
  { value: "admin", text: "Admin" },
  { value: "medico", text: "Médico" },
  { value: "secretario", text: "Secretario(a)" },
  { value: "paciente", text: "Paciente" },
]);

// **Estado reactivo para el formulario de Horario de Atención**
const formHorario = reactive({
  id: null, // Para edición
  dia_semana: "",
  hora_inicio: "",
  hora_fin: "",
  intervalo_min: 15, // Valor por defecto
});

// **Estado para determinar si se está editando o creando**
const esEditar = ref(false);

// **Opciones para los días de la semana**
const diasSemana = ref([
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
  "Domingo",
]);

// **Estado para controlar el modal de horarios de atención**
const abrirModalHorario = ref(false);

/**
 * Función para formatear fechas
 */
const formatDate = (dateString) => {
  try {
    return format(new Date(dateString), "dd/MM/yyyy hh:mm a");
  } catch {
    return "Fecha no válida";
  }
};

/**
 * Función para formatear horas (HH:MM a formato AM/PM)
 */
// const formatTime = (time) => {
//   try {
//     const [hour, minute] = time.split(":").map(Number);
//     const period = hour >= 12 ? "PM" : "AM";
//     const formattedHour = hour % 12 || 12;
//     return `${formattedHour}:${minute.toString().padStart(2, "0")} ${period}`;
//   } catch {
//     return "Hora no válida";
//   }
// };

/**
 * Función para actualizar la organización existente
 * (si necesitas editar los detalles de la organización)
 */
// Se asume que tienes una función en organizacionStore para actualizar la organización
const actualizarOrganizacion = async () => {
  try {
    await organizacionStore.actualizarOrganizacion(formOrganizacion);
    $q.notify({
      type: "positive",
      message: "Organización actualizada exitosamente.",
      position: "top-right",
    });
    // Resetear el formulario si es necesario
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
      position: "top-right",
    });
  }
};

/**
 * Funciones para manejar los usuarios en el DxDataGrid
 */

/**
 * Crear usuario (cuando se presiona "Agregar" en el DataGrid)
 */
const onRowInserting = async (e) => {
  const { data } = e;
  try {
    // data contendrá { email, password, role, nombreCompleto, direccion, telefono, observaciones }
    await crearUsuariosStore.crearUsuario(data);
    e.cancel = true;
    await crearUsuariosStore.cargarUsuarios();
    $q.notify({
      type: "positive",
      message: "Usuario creado exitosamente.",
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

/**
 * Funciones para manejar los Horarios de Atención
 */

/**
 * Abrir el modal para crear un nuevo horario
 */
const abrirModalCrearHorario = () => {
  esEditar.value = false;
  formHorario.id = null;
  formHorario.dia_semana = "";
  formHorario.hora_inicio = "";
  formHorario.hora_fin = "";
  formHorario.intervalo_min = 15;
  abrirModalHorario.value = true;
};

/**
 * Abrir el modal para editar un horario existente
 * @param {Object} row - Datos del horario a editar
 */
const editarHorarioAtencion = (row) => {
  esEditar.value = true;
  formHorario.id = row.data.id;
  formHorario.dia_semana = row.data.dia_semana;
  formHorario.hora_inicio = row.data.hora_inicio;
  formHorario.hora_fin = row.data.hora_fin;
  formHorario.intervalo_min = row.data.intervalo_min;
  abrirModalHorario.value = true;
};

/**
 * Cerrar el modal de horarios de atención
 */
const cerrarModalHorario = () => {
  abrirModalHorario.value = false;
};

/**
 * Crear un nuevo horario de atención
 */
const crearHorario = async () => {
  // Validaciones básicas
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

  // Validar que la hora_fin sea mayor que hora_inicio
  if (formHorario.hora_fin <= formHorario.hora_inicio) {
    $q.notify({
      type: "negative",
      message: "La hora de fin debe ser mayor que la hora de inicio.",
      position: "top-right",
    });
    return;
  }

  // Verificar que tenant_id esté definido y sea válido
  if (!tenant_id.value) {
    $q.notify({
      type: "negative",
      message: "Error: La organización no está definida o es inválida.",
      position: "top-right",
    });
    return;
  }

  // Construir el objeto de horario (incluyendo tenant_id)
  const nuevoHorario = {
    dia_semana: formHorario.dia_semana,
    hora_inicio: formHorario.hora_inicio,
    hora_fin: formHorario.hora_fin,
    intervalo_min: formHorario.intervalo_min,
    tenant_id: tenant_id.value, // Asignación automática desde authStore
  };

  try {
    await organizacionStore.crearHorarioAtencion(nuevoHorario);
    cerrarModalHorario();
    // Recargar los horarios de atención
    await organizacionStore.cargarHorariosAtencion(tenant_id.value);
    $q.notify({
      type: "positive",
      message: "Horario de atención creado exitosamente.",
      position: "top-right",
    });
  } catch (error) {
    console.error("Error creando horario de atención:", error);
    $q.notify({
      type: "negative",
      message: "Error al crear el horario de atención.",
      position: "top-right",
    });
  }
};

/**
 * Actualizar un horario de atención existente
 */
const actualizarHorario = async () => {
  // Validaciones básicas
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

  // Validar que la hora_fin sea mayor que hora_inicio
  if (formHorario.hora_fin <= formHorario.hora_inicio) {
    $q.notify({
      type: "negative",
      message: "La hora de fin debe ser mayor que la hora de inicio.",
      position: "top-right",
    });
    return;
  }

  // Verificar que tenant_id esté definido y sea válido
  if (!tenant_id.value) {
    $q.notify({
      type: "negative",
      message: "Error: La organización no está definida o es inválida.",
      position: "top-right",
    });
    return;
  }

  // Construir el objeto de horario actualizado (incluyendo tenant_id)
  const horarioActualizado = {
    dia_semana: formHorario.dia_semana,
    hora_inicio: formHorario.hora_inicio,
    hora_fin: formHorario.hora_fin,
    intervalo_min: formHorario.intervalo_min,
    tenant_id: tenant_id.value, // Asegurar que tenant_id se mantenga
  };

  try {
    await organizacionStore.actualizarHorarioAtencion(
      formHorario.id,
      horarioActualizado
    );
    cerrarModalHorario();
    // Recargar los horarios de atención
    await organizacionStore.cargarHorariosAtencion(tenant_id.value);
    $q.notify({
      type: "positive",
      message: "Horario de atención actualizado exitosamente.",
      position: "top-right",
    });
  } catch (error) {
    console.error("Error actualizando horario de atención:", error);
    $q.notify({
      type: "negative",
      message: "Error al actualizar el horario de atención.",
      position: "top-right",
    });
  }
};

/**
 * Eliminar un horario de atención existente
 * @param {Object} row - Datos del horario a eliminar
 */
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
      // Recargar los horarios de atención
      await organizacionStore.cargarHorariosAtencion(tenant_id.value);
      $q.notify({
        type: "positive",
        message: "Horario de atención eliminado exitosamente.",
        position: "top-right",
      });
    } catch (error) {
      console.error("Error eliminando horario de atención:", error);
      $q.notify({
        type: "negative",
        message: "Error al eliminar el horario de atención.",
        position: "top-right",
      });
    }
  }
};

/**
 * Monitorear cambios en tenant_id para cargar organizaciones y horarios
 */
watch(
  () => tenant_id.value,
  async (newTenantId) => {
    if (newTenantId) {
      await organizacionStore.cargarOrganizaciones();
      await organizacionStore.cargarHorariosAtencion(newTenantId);
    } else if (newTenantId === "undefined" || newTenantId === undefined) {
      organizacionStore.organizaciones = [];
      organizacionStore.horariosAtencion = [];
      if (newTenantId === "undefined") {
        $q.notify({
          type: "negative",
          message: "Error: tenant_id es 'undefined'.",
          position: "top-right",
        });
      } else {
        $q.notify({
          type: "negative",
          message: "Error: tenant_id no está definido.",
          position: "top-right",
        });
      }
    }
  },
  { immediate: true }
);

/**
 * Cargar usuarios y organizaciones al montar el componente
 */
onMounted(async () => {
  await crearUsuariosStore.cargarUsuarios();
  await organizacionStore.cargarOrganizaciones();
  console.log("User Auth:", user.value?.email);
  console.log("Organizaciones: ", organizaciones.value);
  console.log("tenant_id onMounted:", tenant_id.value); // Log para depuración
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
  color: rgb(255, 255, 255);
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
  width: 40%; /* Aumenta el ancho al 80% del viewport */
  height: auto;
  max-width: 1400px; /* Ancho máximo para evitar que sea demasiado grande */
}
/* Eliminamos la regla global de .q-time para evitar afectar otros componentes */
.q-time {
  /* width: 70%; */ /* Esta línea se elimina o comenta */
}
/* Contenedor para alinear los campos horizontalmente */
.row-horizontal {
  display: flex;
  gap: 20px; /* Espacio entre los campos */
  flex-wrap: wrap; /* Permite que los campos se ajusten en pantallas pequeñas */
  margin-bottom: 16px; /* Espacio inferior para separar de otros campos */
}

/* Estilos para cada campo de tiempo */
.time-picker {
  display: flex;
  flex-direction: column;
  flex: 1; /* Permite que los campos crezcan igualmente */
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

/* Responsividad para dispositivos pequeños */
@media (max-width: 768px) {
  .row-horizontal {
    flex-direction: column;
    gap: 10px; /* Reduce el espacio entre elementos en pantallas pequeñas */
  }

  .time-picker input[type="time"] {
    width: 100%;
  }
}
/* Sección de Horarios de Atención */
.horarios-container {
  margin-top: 10px;
}
.row-horizontal {
  display: flex;
  gap: 16px; /* Espacio entre los elementos */
  align-items: center; /* Alinea verticalmente */
}
.time-picker {
  flex: 1; /* Ajusta el ancho de los time pickers proporcionalmente */
}
.horarios-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px; /* Reducido de 150px a 20px para evitar superposición */
}

.horarios-header h6 {
  font-size: 18px;
  color: #2c3e50;
}

.horarios-header .q-btn {
  min-width: 150px;
}

/* Contenedor de los Componentes de Tiempo */
.horarios-row {
  display: flex;
  gap: 16px; /* Espacio entre los elementos */
  flex-wrap: wrap;
  margin-bottom: 20px; /* Espacio inferior para separar del siguiente campo */
}

.horarios-row .horario-item {
  flex: 1;
  min-width: 150px;
}

.horarios-row .q-time {
  height: 40px; /* Reducir el tamaño del componente */
  width: 100%; /* Asegura que ocupe todo el ancho dentro del horario-item */
}

/* Responsividad para Horarios de Atención */
@media (max-width: 768px) {
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

  /* Stack verticalmente los horarios en pantallas pequeñas */
  .horarios-row {
    flex-direction: column;
    gap: 10px; /* Reduce el espacio entre elementos para pantallas pequeñas */
  }

  .horarios-row .horario-item {
    min-width: 100%;
  }
}
</style>
