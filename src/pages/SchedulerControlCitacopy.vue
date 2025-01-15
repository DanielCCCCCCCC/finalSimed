<template>
  <div class="scheduler-container">
    <DxScheduler
      :key="schedulerKey"
      :data-source="computedAppointments"
      :current-view="currentView"
      :current-date="currentDate"
      :time-zone="'America/Tegucigalpa'"
      :height="800"
      hoursInterval="{0.5}"
      :show-all-day-panel="true"
      :cell-duration="cellDurationConfig"
      :start-day-hour="startDayHourConfig"
      :end-day-hour="endDayHourConfig"
      :show-current-time-indicator="true"
      :cross-scrolling-enabled="true"
      :views="views"
      :first-day-of-week="1"
      :onAppointmentAdded="onAppointmentAdded"
      :onAppointmentUpdated="onAppointmentUpdated"
      :onAppointmentDeleted="onAppointmentDeleted"
      @appointmentFormOpening="onAppointmentFormOpening"
      @appointmentRendered="onAppointmentRendered"
      key-expr="id"
    >
      <DxView type="day" name="Día" />
      <DxView type="workWeek" name="Días Laborales" />
      <DxView type="week" name="Semana" />
      <DxView type="month" name="Mes" />
      <DxView type="agenda" name="Agenda" />
    </DxScheduler>

    <!-- Modal para buscar pacientes -->
    <q-dialog v-model="isModalOpen" persistent>
      <q-card style="width: 80%; max-width: 800px">
        <q-card-section>
          <div class="text-h6">Seleccionar Paciente</div>
        </q-card-section>
        <q-card-section>
          <DxDataGrid
            :data-source="formIdentificacion"
            :show-borders="true"
            :height="400"
            @selection-changed="onPatientSelected"
          >
            <DxSearchPanel
              :width="300"
              :visible="true"
              placeholder="Buscar nombres, Apellido o Cédula"
            />
            <DxSelection mode="single" />
            <DxColumn data-field="Nombre" caption="Nombres" />
            <DxColumn
              data-field="PacienteIdentificacion"
              caption="PacienteIdentificacion"
            />
          </DxDataGrid>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cerrar" @click="isModalOpen = false" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Modal para buscar médicos -->
    <q-dialog v-model="isDoctorModalOpen" persistent>
      <q-card style="width: 80%; max-width: 800px">
        <q-card-section>
          <div class="text-h6">Seleccionar Médico</div>
        </q-card-section>
        <q-card-section>
          <template v-if="isMedicosLoading || isEspecialidadesLoading">
            <div class="q-pa-md">
              <q-spinner-dots color="primary" size="40px" />
              <div class="text-center q-mt-md">Cargando médicos...</div>
            </div>
          </template>
          <template v-else>
            <DxDataGrid
              :data-source="medicosConEspecialidad"
              :show-borders="true"
              :height="400"
              @selection-changed="onDoctorSelected"
            >
              <DxSearchPanel
                :width="300"
                :visible="true"
                placeholder="Buscar Médico o Especialidad"
              />
              <DxSelection mode="single" />
              <DxColumn data-field="nombre" caption="Nombre" />
              <!-- Corrección aquí -->
              <DxColumn
                data-field="especialidadDescripcion"
                caption="Especialidad"
              />
            </DxDataGrid>
          </template>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cerrar" @click="isDoctorModalOpen = false" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Modal para crear nuevo paciente -->
    <q-dialog v-model="isCreatePatientModalOpen" persistent>
      <q-card style="width: 90%; max-width: 500px">
        <q-card-section>
          <div class="text-h6">Crear Nuevo Paciente</div>
        </q-card-section>
        <q-card-section>
          <form @submit.prevent="submitNewPatient" class="patient-form">
            <!-- Código de Paciente -->
            <div class="mb-3">
              <label for="codigo" class="form-label fs-14 text-dark">
                Código de Paciente<span class="required">*</span>
              </label>
              <div class="input-group">
                <div class="input-group-text">
                  <i class="ri-id-card-line"></i>
                </div>
                <input
                  type="text"
                  id="codigo"
                  v-model="newPatient.codigo"
                  class="form-control"
                  placeholder="Ingrese el código de paciente"
                  required
                />
              </div>
            </div>

            <!-- Nombres -->
            <div class="mb-3">
              <label for="nombres" class="form-label fs-14 text-dark">
                Nombre<span class="required">*</span>
              </label>
              <div class="input-group">
                <div class="input-group-text">
                  <i class="ri-user-line"></i>
                </div>
                <input
                  type="text"
                  id="nombres"
                  v-model="newPatient.nombres"
                  class="form-control"
                  placeholder="Ingrese el nombre"
                  required
                />
              </div>
            </div>

            <!-- PacienteIdentificacion -->
            <div class="mb-3">
              <label
                for="PacienteIdentificacion"
                class="form-label fs-14 text-dark"
                >PacienteIdentificacion</label
              >
              <div class="input-group">
                <div class="input-group-text">
                  <i class="ri-file-user-line"></i>
                </div>
                <input
                  type="text"
                  id="PacienteIdentificacion"
                  v-model="newPatient.PacienteIdentificacion"
                  class="form-control"
                  placeholder="Ingrese el PacienteIdentificacion"
                />
              </div>
            </div>

            <!-- Fecha de Nacimiento -->
            <div class="mb-3">
              <label for="fechaNacimiento" class="form-label fs-14 text-dark">
                Fecha de Nacimiento<span class="required">*</span>
              </label>
              <div class="input-group">
                <div class="input-group-text">
                  <i class="ri-calendar-line"></i>
                </div>
                <input
                  type="date"
                  id="fechaNacimiento"
                  v-model="newPatient.fechaNacimiento"
                  class="form-control"
                  required
                />
              </div>
            </div>

            <!-- Sexo -->
            <div class="mb-3">
              <label for="sexo" class="form-label fs-14 text-dark">
                Seleccione un sexo<span class="required">*</span>
              </label>
              <div class="input-group">
                <div class="input-group-text">
                  <i class="ri-genderless-line"></i>
                </div>
                <select
                  id="sexo"
                  v-model="newPatient.sexo"
                  class="form-control"
                  required
                >
                  <option value="" disabled>Seleccione un sexo</option>
                  <option
                    v-for="option in sexOptions"
                    :key="option.value"
                    :value="option.value"
                  >
                    {{ option.label }}
                  </option>
                </select>
              </div>
            </div>

            <!-- Teléfono -->
            <div class="mb-3">
              <label for="telPersonal" class="form-label fs-14 text-dark"
                >Teléfono</label
              >
              <div class="input-group">
                <div class="input-group-text">
                  <i class="ri-phone-line"></i>
                </div>
                <input
                  type="tel"
                  id="telPersonal"
                  v-model="newPatient.telPersonal"
                  class="form-control"
                  placeholder="Ingrese el teléfono personal"
                />
              </div>
            </div>

            <!-- Botones -->
            <div class="d-flex justify-content-end mt-3">
              <button
                type="button"
                @click="isCreatePatientModalOpen = false"
                class="btn btn-outline-secondary me-2"
              >
                Cancelar
              </button>
              <button type="submit" class="btn btn-primary">Crear</button>
            </div>
          </form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>
<script setup>
/* -------------------------------------
   Imports y librerías
------------------------------------- */
import { DxScheduler, DxView } from "devextreme-vue/scheduler";
import {
  DxDataGrid,
  DxColumn,
  DxSelection,
  DxSearchPanel,
} from "devextreme-vue/data-grid";

import { Notify } from "quasar";
import { onMounted, ref, computed, watch } from "vue";
import { storeToRefs } from "pinia";
import { supabase } from "../supabaseClient"; // Ajusta la ruta si es necesario

/* -------------------------------------
   Imports de Stores (Pinia)
------------------------------------- */
import { useAppointmentsStore } from "../stores/AppointmentsStore";
import { useMedicoStore } from "../stores/DirMedico";
import {
  useEspecialidadMedicaStore,
  useTiposCitasStore,
} from "../stores/ConfiMedicasStores";
import { useDirPacientesStore } from "../stores/fichaIdentificacionStores";
import { useCrearUsuariosStore } from "../stores/crearUsuarios";
import { useAuthStore } from "../stores/auth"; // Importación de useAuthStore
import { useOrganizacionStore } from "../stores/organizacionStore";

/* -------------------------------------
   Inicializar authStore y fichaIdentificacionStore
------------------------------------- */
const authStore = useAuthStore();
const dirPacientesStore = useDirPacientesStore();

/* -------------------------------------
   Variables reactivas para modales
------------------------------------- */
const isModalOpen = ref(false);
const isDoctorModalOpen = ref(false);
const isCreatePatientModalOpen = ref(false); // Nueva variable para el modal de creación de pacientes
const selectedPatient = ref(null);
const selectedPatientId = ref(null);
const selectedDoctor = ref(null);
const selectedDoctorId = ref(null);

/* -------------------------------------
   Form y datos de la cita actual
------------------------------------- */
const appointmentForm = ref(null);
const currentAppointmentData = ref(null);

/* -------------------------------------
   Estados de carga
------------------------------------- */
const isMedicosLoading = ref(true);
const isEspecialidadesLoading = ref(true);
const isPacientesLoading = ref(false);

/* -------------------------------------
   Acceder a las stores
------------------------------------- */
const appointmentsStore = useAppointmentsStore();
const medicoStore = useMedicoStore();
const especialidadMedicaStore = useEspecialidadMedicaStore();
const tiposCitasStore = useTiposCitasStore();
const crearUsuariosStore = useCrearUsuariosStore();
const organizacionStore = useOrganizacionStore();

/* -------------------------------------
   Desestructuramos las variables reactivas
------------------------------------- */
const { medicos } = storeToRefs(medicoStore);
const { especialidades } = storeToRefs(especialidadMedicaStore);
const { citas } = storeToRefs(tiposCitasStore);
const { formIdentificacion } = storeToRefs(dirPacientesStore);
const {
  users,
  horariosAtencion,
  cellDurationConfig,
  startDayHourConfig,
  endDayHourConfig,
} = storeToRefs(crearUsuariosStore);
const { appointments } = storeToRefs(appointmentsStore);

/* -------------------------------------
   Opciones para el campo "sexo"
------------------------------------- */
const sexOptions = [
  { label: "Masculino", value: "Masculino" },
  { label: "Femenino", value: "Femenino" },
  { label: "Otro", value: "Otro" },
];

/* -------------------------------------
   Mapeamos especialidad con cada médico
------------------------------------- */
const medicosConEspecialidad = computed(() => {
  if (!users.value || !especialidades.value) return [];
  return users.value
    .filter((usuario) => usuario.role === "medico" || usuario.EsMedico)
    .map((medico) => {
      const especialidad = especialidades.value.find(
        (esp) => esp.id === parseInt(medico.especialidadMedica)
      );
      return {
        ...medico,
        nombre: medico.nombreCompleto,
        especialidadDescripcion: especialidad
          ? especialidad.descripcion
          : "Especialidad no encontrada",
      };
    });
});

/* -------------------------------------
   Configuración del Scheduler
------------------------------------- */
const currentDate = ref(new Date());
const currentView = ref("day");

function convertirHoraANumero(hora) {
  if (!hora) return 0;
  const [h, m] = hora.split(":");
  return parseFloat(h) + parseFloat(m) / 60;
}

// Escuchamos cambios de fecha para ajustar la configuración
watch(currentDate, (nuevaFecha) => {
  const opciones = { weekday: "long" };
  const diaSemana = nuevaFecha
    .toLocaleDateString("es-ES", opciones)
    .replace(/^\w/, (c) => c.toUpperCase());

  const horarioDelDia = horariosAtencion.value.find(
    (h) => h.dia_semana.toLowerCase() === diaSemana.toLowerCase()
  );

  if (horarioDelDia) {
    if (horarioDelDia.intervalo_min) {
      cellDurationConfig.value = horarioDelDia.intervalo_min;
    }
    if (horarioDelDia.hora_inicio) {
      startDayHourConfig.value = convertirHoraANumero(
        horarioDelDia.hora_inicio
      );
    }
    if (horarioDelDia.hora_fin) {
      endDayHourConfig.value = convertirHoraANumero(horarioDelDia.hora_fin);
    }
  }
});

/* --- NUEVA SECCIÓN: clave reactiva para Scheduler --- */
const schedulerKey = computed(() => {
  return `${cellDurationConfig.value}-${startDayHourConfig.value}-${endDayHourConfig.value}`;
});

/**
 * NOTA IMPORTANTE:
 * - DevExtreme (Scheduler) utiliza internamente las propiedades `startDate`, `endDate`, `allDay`, etc.
 * - Tus columnas en BD ahora son `CitaFechaInicio`, `CitaFechaFinal`, `CitaTodoElDia`, `CitaRepetir`.
 * Por eso, mapeamos de un lado a otro:
 *   - Para mostrar en el scheduler → `startDate`, `endDate`, `allDay`, ...
 *   - Para guardar en BD → `CitaFechaInicio`, `CitaFechaFinal`, `CitaTodoElDia`, ...
 */
const computedAppointments = computed(() =>
  appointments.value
    .filter((appt) => appt.CitaStatus === "Aceptada")
    .map((appointment) => {
      // Buscar datos del paciente
      const pacienteId = parseInt(appointment.PacienteNombreId, 10);
      const paciente = dirPacientesStore.formIdentificacion.find(
        (p) => p.PacienteId === pacienteId
      );
      const nombresPaciente = paciente
        ? paciente.Nombre
        : "Paciente no asignado";

      // Buscar datos del médico
      const UsuarioMedicoId = appointment.UsuarioMedicoId;
      const medico = users.value.find(
        (m) =>
          (m.role === "medico" || m.role === "admin") &&
          m.id === UsuarioMedicoId
      );
      const nombreMedico = medico
        ? medico.nombreCompleto
        : "Médico no asignado";

      return {
        ...appointment,
        // Asignamos las propiedades que usa el Scheduler (frontend)
        startDate: new Date(appointment.CitaFechaInicio),
        endDate: new Date(appointment.CitaFechaFinal),
        allDay: appointment.CitaTodoElDia,
        repeat: appointment.CitaRepetir,

        // Lo que se mostrará en la tarjeta/label de la cita
        text: `${appointment.CitaTitulo} - ${nombresPaciente} - ${nombreMedico}`,
      };
    })
);

// Escuchar cambios en appointments
watch(appointments, (newVal) => {
  console.log("Citas actualizadas:", newVal);
});

/* -------------------------------------
   Helpers de fecha
------------------------------------- */
const getStartOfDay = (date) => {
  const newDate = new Date(date);
  newDate.setHours(0, 0, 0, 0);
  return newDate;
};
const getEndOfDay = (date) => {
  const newDate = new Date(date);
  newDate.setHours(23, 59, 59, 999);
  return newDate;
};
const formatDate = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  const seconds = String(d.getSeconds()).padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

/* -------------------------------------
   Verificar superposiciones (paciente y/o médico)
------------------------------------- */
const checkAppointmentOverlap = async (appointment) => {
  // Ajustamos para las nuevas columnas
  const {
    CitaFechaInicio,
    CitaFechaFinal,
    UsuarioMedicoId,
    PacienteNombreId,
    id,
  } = appointment;
  const start = formatDate(CitaFechaInicio);
  const end = formatDate(CitaFechaFinal);

  // Busca cualquier cita (excepto la actual, si es edición) que comparta
  // el mismo paciente o médico y se solape en horario
  const { data: overlappingAppointments, error } = await supabase
    .from("Appointments")
    .select("*")
    .neq("id", id || 0)
    .or(
      `UsuarioMedicoId.eq.${UsuarioMedicoId},PacienteNombreId.eq.${PacienteNombreId}`
    )
    .lt("CitaFechaInicio", end)
    .gt("CitaFechaFinal", start);

  if (error) {
    console.error("Error al verificar superposiciones:", error);
    throw error;
  }
  return overlappingAppointments.length > 0;
};

/* -------------------------------------
   Form de la cita (Appointment Form)
------------------------------------- */
const onAppointmentFormOpening = (e) => {
  const form = e.form;
  appointmentForm.value = form;
  currentAppointmentData.value = e.appointmentData;

  // Nota: DevExtreme usa `allDay` internamente
  const isAllDay = e.appointmentData.allDay || false;

  // Cargar info de paciente/doctor si ya viene en la cita
  if (currentAppointmentData.value?.PacienteNombreId) {
    const pacienteId = parseInt(
      currentAppointmentData.value.PacienteNombreId,
      10
    );
    const pac = dirPacientesStore.formIdentificacion.find(
      (p) => p.PacienteId === pacienteId
    );
    if (pac) {
      selectedPatient.value = pac.Nombre;
      selectedPatientId.value = pac.PacienteId;
    } else {
      selectedPatient.value = "No seleccionado";
      selectedPatientId.value = null;
    }
  }
  if (currentAppointmentData.value?.UsuarioMedicoId) {
    const doc = medicosConEspecialidad.value.find(
      (d) => d.id === currentAppointmentData.value.UsuarioMedicoId
    );
    if (doc) {
      selectedDoctor.value = doc.nombreCompleto;
      selectedDoctorId.value = doc.id;
    } else {
      selectedDoctor.value = "No seleccionado";
      selectedDoctorId.value = null;
    }
  }

  form.option("items", [
    {
      itemType: "group",
      caption: "Detalles de la Cita",
      colCount: 1,
      items: [
        {
          dataField: "CitaTitulo",
          editorType: "dxTextBox",
          label: { text: "Asunto de la cita" },
          editorOptions: {
            value: e.appointmentData.CitaTitulo || e.appointmentData.text,
          },
        },
        {
          dataField: "allDay",
          editorType: "dxCheckBox",
          label: { text: "Todo el día" },
          editorOptions: {
            value: isAllDay,
            onValueChanged: (args) => {
              const isChecked = args.value;
              form.getEditor("startDate").option("disabled", isChecked);
              form.getEditor("endDate").option("disabled", isChecked);

              if (isChecked) {
                const startDate = getStartOfDay(
                  form.getEditor("startDate").option("value")
                );
                const endDate = getEndOfDay(
                  form.getEditor("startDate").option("value")
                );
                form.updateData("startDate", startDate);
                form.updateData("endDate", endDate);
              }
            },
          },
        },
        {
          dataField: "startDate",
          editorType: "dxDateBox",
          label: { text: "Fecha/Hora Inicio" },
          editorOptions: {
            type: "datetime",
            displayFormat: "dd/MM/yyyy hh:mm a",
            value: e.appointmentData.startDate,
            disabled: isAllDay,
            onValueChanged: (args) => {
              const startDate = args.value;
              const endDate = new Date(startDate);
              endDate.setMinutes(endDate.getMinutes() + 30);
              form.updateData("endDate", endDate);
            },
          },
        },
        {
          dataField: "endDate",
          editorType: "dxDateBox",
          label: { text: "Fecha/Hora Final" },
          editorOptions: {
            type: "datetime",
            displayFormat: "dd/MM/yyyy hh:mm a",
            value: e.appointmentData.endDate,
            disabled: isAllDay,
          },
        },
        {
          dataField: "TipoId",
          editorType: "dxSelectBox",
          label: { text: "Tipo de Cita" },
          editorOptions: {
            dataSource: citas.value,
            displayExpr: "descripcion",
            valueExpr: "id",
            value: parseInt(e.appointmentData.TipoId),
            placeholder: "Selecciona un tipo de cita",
          },
        },
      ],
    },
    {
      itemType: "group",
      colCount: 1,
      items: [
        {
          dataField: "selectedPatientName",
          editorType: "dxTextBox",
          label: { text: "Paciente Seleccionado" },
          editorOptions: {
            readOnly: true,
            value: selectedPatient.value,
          },
        },
        {
          itemType: "simple",
          template: () => {
            const container = document.createElement("div");
            container.style.display = "flex";
            container.style.justifyContent = "flex-start";
            container.style.gap = "8px";

            const selectButton = document.createElement("button");
            selectButton.textContent = "Seleccionar ";
            selectButton.className = "btn btn-primary fs-6 w-100 me-2";
            selectButton.onclick = () => openPatientModal();

            const createButton = document.createElement("button");
            createButton.textContent = "Crear ";
            createButton.className = "btn btn-success";
            createButton.onclick = () => openCreatePatientModal();

            container.appendChild(selectButton);
            container.appendChild(createButton);
            return container;
          },
        },
        {
          dataField: "selectedDoctorName",
          editorType: "dxTextBox",
          label: { text: "Médico Seleccionado" },
          editorOptions: {
            readOnly: true,
            value: selectedDoctor.value,
          },
        },
        {
          itemType: "simple",
          template: () => {
            const container = document.createElement("div");
            const button = document.createElement("button");
            button.textContent = "Seleccionar Médico";
            button.className = "btn btn-primary";
            button.onclick = () => openDoctorModal();
            container.appendChild(button);
            return container;
          },
        },
        {
          dataField: "CitaDescripcion",
          editorType: "dxTextArea",
          label: { text: "Descripción" },
          editorOptions: {
            value: e.appointmentData.CitaDescripcion,
          },
        },
      ],
    },
  ]);
};

/* -------------------------------------
   Checkbox 'EsMedico' (opcional)
------------------------------------- */
const onMarcadoChange = async (usuario) => {
  try {
    await crearUsuariosStore.actualizarUsuario({
      id: usuario.id,
      EsMedico: usuario.EsMedico,
    });
    await crearUsuariosStore.cargarUsuarios();
    Notify.create({
      type: "positive",
      message: `Bandera actualizada para ${usuario.nombreCompleto}.`,
      position: "top-right",
    });
  } catch (error) {
    console.error("Error actualizando bandera:", error);
    Notify.create({
      type: "negative",
      message: "Error al actualizar la bandera.",
      position: "top-right",
    });
  }
};

/* -------------------------------------
   CRUD de citas (Scheduler)
------------------------------------- */

// Agregar cita
const onAppointmentAdded = async (e) => {
  try {
    const appointmentData = e.appointmentData;

    // Validar paciente/médico
    if (!selectedPatientId.value) {
      Notify.create({
        message: "Por favor, selecciona un paciente.",
        color: "warning",
        position: "top-right",
      });
      throw new Error("Paciente no seleccionado.");
    }
    if (!selectedDoctorId.value) {
      Notify.create({
        message: "Por favor, selecciona un médico.",
        color: "warning",
        position: "top-right",
      });
      throw new Error("Médico no seleccionado.");
    }

    // Obtener tenant_id y userId del authStore
    const tenant_id_val = authStore.tenant_id;
    const userId_val = authStore.userId;

    if (!tenant_id_val || !userId_val) {
      Notify.create({
        message: "No se encontraron datos de usuario o tenant.",
        color: "negative",
        position: "top-right",
      });
      throw new Error("tenant_id o userId faltante.");
    }

    // Armamos el objeto de cita con las columnas nuevas
    const newAppointment = {
      CitaTitulo: appointmentData.CitaTitulo || appointmentData.text,
      CitaFechaInicio: appointmentData.allDay
        ? formatDate(getStartOfDay(appointmentData.startDate))
        : formatDate(appointmentData.startDate),
      CitaFechaFinal: appointmentData.allDay
        ? formatDate(getEndOfDay(appointmentData.startDate))
        : formatDate(appointmentData.endDate),
      CitaTodoElDia: appointmentData.allDay || false,
      CitaRepetir: appointmentData.repeat || false,
      CitaDescripcion: appointmentData.CitaDescripcion || "",
      PacienteNombreId: selectedPatientId.value.toString(),
      UsuarioMedicoId: selectedDoctorId.value.toString(),
      TipoId: appointmentData.TipoId,
      tenant_id: tenant_id_val,
      userId: userId_val,
      CitaStatus: "Aceptada", // Por defecto
    };

    // Verificar superposición de citas (paciente/médico)
    const hasOverlap = await checkAppointmentOverlap({
      ...newAppointment,
      id: 0, // es nuevo
    });
    if (hasOverlap) {
      Notify.create({
        message: "El médico o el paciente ya tiene una cita en este rango.",
        color: "negative",
        position: "top-right",
      });
      throw new Error("Superposición de citas detectada.");
    }

    // Guardar en BD (usando el store)
    await appointmentsStore.addAppointment(newAppointment);

    Notify.create({
      message: "Cita agregada exitosamente.",
      color: "positive",
      position: "top-right",
    });

    // Refrescar listado de citas
    await appointmentsStore.fetchAppointments();
  } catch (error) {
    console.error("Error al agregar la cita:", error);
    Notify.create({
      message: `Error al agregar la cita: ${error.message}`,
      color: "negative",
      position: "top-right",
    });
  }
};

// Actualizar cita
const onAppointmentUpdated = async (e) => {
  try {
    const appointmentData = e.appointmentData;

    // Armamos el objeto con las nuevas columnas
    const updatedAppointment = {
      CitaTitulo: appointmentData.CitaTitulo || appointmentData.text,
      CitaFechaInicio: appointmentData.allDay
        ? formatDate(getStartOfDay(appointmentData.startDate))
        : formatDate(appointmentData.startDate),
      CitaFechaFinal: appointmentData.allDay
        ? formatDate(getEndOfDay(appointmentData.startDate))
        : formatDate(appointmentData.endDate),
      CitaTodoElDia: appointmentData.allDay || false,
      CitaRepetir: appointmentData.repeat || false,
      CitaDescripcion: appointmentData.CitaDescripcion || "",
      // Si no se han vuelto a seleccionar, dejamos los que ya existen
      PacienteNombreId: selectedPatientId.value
        ? selectedPatientId.value.toString()
        : appointmentData.PacienteNombreId,
      UsuarioMedicoId: selectedDoctorId.value
        ? selectedDoctorId.value.toString()
        : appointmentData.UsuarioMedicoId,
      TipoId: appointmentData.TipoId,
    };

    // Verificar superposición
    const hasOverlap = await checkAppointmentOverlap({
      ...updatedAppointment,
      id: appointmentData.id,
    });
    if (hasOverlap) {
      Notify.create({
        message: "Ya hay una cita en ese horario.",
        color: "negative",
        position: "top",
      });
      throw new Error("Superposición de citas detectada.");
    }

    // Actualizar en la BD
    await appointmentsStore.updateAppointment(
      appointmentData.id,
      updatedAppointment
    );

    Notify.create({
      message: "Cita actualizada exitosamente.",
      color: "positive",
      position: "top-right",
    });
    await appointmentsStore.fetchAppointments();
  } catch (error) {
    console.error("Error al actualizar la cita:", error);
    Notify.create({
      message: `Error al actualizar la cita: ${error.message}`,
      color: "negative",
      position: "top-right",
    });
  }
};

// Eliminar cita
const onAppointmentDeleted = async (e) => {
  try {
    const { id } = e.appointmentData;
    await appointmentsStore.deleteAppointment(id);

    Notify.create({
      message: "Cita eliminada exitosamente.",
      color: "positive",
      position: "top-right",
    });
    await appointmentsStore.fetchAppointments();
  } catch (error) {
    console.error("Error al eliminar la cita:", error);
    Notify.create({
      message: `Error al eliminar la cita: ${error.message}`,
      color: "negative",
      position: "top-right",
    });
  }
};

/* -------------------------------------
   Selección de paciente
------------------------------------- */
const onPatientSelected = (e) => {
  const patient = e.selectedRowsData[0];
  if (patient) {
    const { Nombre, PacienteId } = patient;
    selectedPatient.value = `${Nombre} `;
    selectedPatientId.value = PacienteId;

    if (appointmentForm.value && currentAppointmentData.value) {
      // Asignar la columna PacienteNombreId (ID)
      currentAppointmentData.value.PacienteNombreId = PacienteId.toString();
      appointmentForm.value.updateData(
        "selectedPatientName",
        selectedPatient.value
      );
    }
    isModalOpen.value = false;
  }
};

/* -------------------------------------
   Selección de médico
------------------------------------- */
const onDoctorSelected = (e) => {
  const doctor = e.selectedRowsData[0];
  if (doctor) {
    const { nombre, id } = doctor;
    selectedDoctor.value = nombre;
    selectedDoctorId.value = id;

    if (appointmentForm.value && currentAppointmentData.value) {
      currentAppointmentData.value.UsuarioMedicoId = id.toString();
      appointmentForm.value.updateData(
        "selectedDoctorName",
        selectedDoctor.value
      );
    }
    isDoctorModalOpen.value = false;
  }
};

/* -------------------------------------
   Colorear la cita según el tipo
------------------------------------- */
const onAppointmentRendered = (e) => {
  const appointmentData = e.appointmentData;
  const appointmentElement = e.appointmentElement;
  const TipoId = parseInt(appointmentData.TipoId, 10);
  const CitaTipoObj = citas.value.find((c) => c.id === TipoId);
  const bgColor =
    CitaTipoObj && CitaTipoObj.color ? CitaTipoObj.color : "#FFFFFF";

  appointmentElement.style.backgroundColor = bgColor;
  appointmentElement.style.color = "#000";
};

/* -------------------------------------
   onMounted: cargar datos iniciales
------------------------------------- */
onMounted(async () => {
  try {
    await authStore.initialize(); // Inicializar authStore

    if (!authStore?.user) {
      throw new Error("El usuario no está autenticado.");
    }

    const tenant_id_val = authStore.tenant_id;
    const userId_val = authStore.userId;

    if (!tenant_id_val) {
      Notify.create({
        message: "No se encontraron datos de usuario o tenant.",
        color: "negative",
        position: "top-right",
      });
      throw new Error("tenant_id o userId faltante.");
    }

    // Cargar datos de la BD
    await crearUsuariosStore.cargarConfiguraciones();
    await especialidadMedicaStore.cargarEspecialidades();
    await medicoStore.cargarMedicos();
    await tiposCitasStore.cargarCitas();
    await dirPacientesStore.cargarDatos();
    await crearUsuariosStore.cargarUsuarios();
    await appointmentsStore.fetchAppointments();

    console.log("Citas cargadas: ", appointments.value);
    console.log("Datos iniciales cargados correctamente.");
  } catch (error) {
    console.error("Error al cargar datos iniciales:", error);
    Notify.create({
      message: `Error al cargar datos iniciales: ${error.message}`,
      color: "negative",
      position: "top-right",
    });
  } finally {
    isMedicosLoading.value = false;
    isEspecialidadesLoading.value = false;
    isPacientesLoading.value = false;
  }
});

/* -------------------------------------
   Funciones para abrir modales
------------------------------------- */
const openPatientModal = () => {
  isModalOpen.value = true;
};
const openDoctorModal = () => {
  isDoctorModalOpen.value = true;
};
const openCreatePatientModal = () => {
  newPatient.value = {
    codigo: "",
    nombres: "",
    PacienteIdentificacion: "",
    fechaNacimiento: "",
    sexo: "",
    telPersonal: "",
  };
  isCreatePatientModalOpen.value = true;
};

/* -------------------------------------
   Funciones para crear un nuevo paciente
------------------------------------- */
const newPatient = ref({
  codigo: "",
  nombres: "",
  PacienteIdentificacion: "",
  fechaNacimiento: "",
  sexo: "",
  telPersonal: "",
  activo: false,
});

const submitNewPatient = async () => {
  try {
    if (!newPatient.value.codigo.trim()) {
      Notify.create({
        message: "El código es obligatorio.",
        color: "warning",
        position: "top-right",
      });
      return;
    }
    if (!newPatient.value.nombres.trim()) {
      Notify.create({
        message: "El nombre es obligatorio.",
        color: "warning",
        position: "top-right",
      });
      return;
    }
    if (!newPatient.value.fechaNacimiento) {
      Notify.create({
        message: "La fecha de nacimiento es obligatoria.",
        color: "warning",
        position: "top-right",
      });
      return;
    }
    if (!newPatient.value.PacienteIdentificacion.trim()) {
      Notify.create({
        message: "La identificación es obligatoria.",
        color: "warning",
        position: "top-right",
      });
      return;
    }

    const patientToCreate = {
      codigo: newPatient.value.codigo.trim(),
      nombres: newPatient.value.nombres.trim(),
      fechaNacimiento: newPatient.value.fechaNacimiento,
      sexo: newPatient.value.sexo || null,
      PacienteIdentificacion: newPatient.value.PacienteIdentificacion.trim(),
      telPersonal: newPatient.value.telPersonal
        ? newPatient.value.telPersonal.trim()
        : null,
      tenant_id: authStore.tenant_id,
      userId: authStore.userId,
      activo: true,
    };

    const result = await dirPacientesStore.guardarDatos(patientToCreate);

    if (result) {
      Notify.create({
        message: "Paciente creado exitosamente.",
        color: "positive",
        position: "top-right",
      });

      // Cerrar el modal
      isCreatePatientModalOpen.value = false;

      // Volver a cargar los pacientes
      await dirPacientesStore.cargarDatos();

      // Tomar el último creado
      const createdPatient = dirPacientesStore.formIdentificacion.slice(-1)[0];
      if (createdPatient) {
        selectedPatient.value = `${createdPatient.nombres}`;
        selectedPatientId.value = createdPatient.id;

        // Si hay un form abierto, asignamos el paciente recien creado
        if (appointmentForm.value && currentAppointmentData.value) {
          currentAppointmentData.value.PacienteNombreId =
            createdPatient.id.toString();
          appointmentForm.value.updateData(
            "selectedPatientName",
            selectedPatient.value
          );
        }
      }
    } else {
      Notify.create({
        message: "No se pudo crear el paciente.",
        color: "negative",
        position: "top-right",
      });
    }
  } catch (error) {
    console.error("Error al crear el paciente:", error);
    Notify.create({
      message: `Error al crear el paciente: ${error.message}`,
      color: "negative",
      position: "top-right",
    });
  }
};
</script>

<style scoped>
.scheduler-container {
  background-color: #ffffff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  position: relative; /* Para posicionamiento absoluto dentro del contenedor */
  margin: 25px 50px 0px 130px;
}

.dx-scheduler .dx-scheduler-header-panel-cell {
  font-weight: bold;
  color: #333;
}

.dx-scheduler .dx-scheduler-time-panel-cell {
  font-size: 14px;
  color: #666;
}

.dx-scheduler .dx-scheduler-navigator-previous,
.dx-scheduler .dx-scheduler-navigator-next {
  color: #1976d2;
}

.dx-scheduler .dx-scheduler-navigator-caption {
  font-size: 18px;
  color: #1976d2;
  font-weight: bold;
}

.dx-scheduler-date-table-cell {
  border-bottom: 1px solid #e0e0e0; /* Línea divisoria entre celdas */
}

.dx-scheduler-all-day-appointment {
  background-color: #f0f8ff; /* Fondo para citas de todo el día */
}

.btnModalPaciente {
  font-size: 8px;
  width: 250px;
}
.btn-success {
  background-color: #4caf50;
  color: #fff;
}

.me-2 {
  margin-right: 8px;
}

.q-ml-sm {
  margin-left: 8px;
}
</style>
