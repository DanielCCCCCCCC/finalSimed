<template>
  <div class="scheduler-container">
    <DxScheduler
      :data-source="computedAppointments"
      :current-view="currentView"
      :current-date="currentDate"
      :time-zone="'America/Tegucigalpa'"
      :height="800"
      :cell-duration="30"
      :start-day-hour="0"
      :end-day-hour="24"
      :views="views"
      :first-day-of-week="1"
      :onAppointmentAdded="onAppointmentAdded"
      :onAppointmentUpdated="onAppointmentUpdated"
      :onAppointmentDeleted="onAppointmentDeleted"
      @appointmentFormOpening="onAppointmentFormOpening"
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
              placeholder="Buscar Nombre, Apellido o Cédula"
            />

            <DxSelection mode="single" />
            <DxColumn data-field="nombres" caption="Nombres" />
            <DxColumn data-field="apellidos" caption="Apellidos" />
            <DxColumn data-field="dni" caption="DNI" />
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
  </div>
</template>

<script setup>
import { DxScheduler, DxView } from "devextreme-vue/scheduler";

import { useAppointmentsStore } from "../stores/AppointmentsStore";
import { useMedicoStore } from "../stores/MedicoStores";
import { useEspecialidadMedicaStore } from "../stores/ConfiMedicasStores"; // Asegúrate de que esta ruta es correcta
import { useTiposCitasStore } from "src/stores/ConfiMedicasStores";
import { useFichaIdentificacionStore } from "src/stores/fichaIdentificacionStores";
import { onMounted, ref, computed } from "vue";
import { storeToRefs } from "pinia";
// import CitasAgendadas from "src/components/CitasAgendadas.vue";
import {
  DxDataGrid,
  DxColumn,
  DxSelection,
  DxSearchPanel,
} from "devextreme-vue/data-grid";
import { supabase } from "../supabaseClient";
import { Notify } from "quasar"; // Importar Notify de Quasar

// Variables reactivas para modales y selección
const isModalOpen = ref(false);
const selectedPatient = ref(null);
const selectedPatientId = ref(null);
const isDoctorModalOpen = ref(false);
const selectedDoctor = ref(null);
const selectedDoctorId = ref(null);
const appointmentForm = ref(null);
const currentAppointmentData = ref(null);
const isMedicosLoading = ref(true); // Variable para indicar carga de médicos
const isEspecialidadesLoading = ref(true); // Variable para indicar carga de especialidades
const isPacientesLoading = ref(false); // Variable para indicar carga de pacientes (si aplica)

// Acceder a las stores
const appointmentsStore = useAppointmentsStore();
const medicoStore = useMedicoStore();
const especialidadMedicaStore = useEspecialidadMedicaStore(); // Instancia de la store de especialidades
const tiposCitasStore = useTiposCitasStore();
const fichaIdentificacionStore = useFichaIdentificacionStore();

// Desestructurar las variables reactivas desde las stores
const { medicos } = storeToRefs(medicoStore);
const { especialidades } = storeToRefs(especialidadMedicaStore); // Desestructurar 'especialidades'
const { citas } = storeToRefs(tiposCitasStore);
const { formIdentificacion } = storeToRefs(fichaIdentificacionStore);

// Computed property para mapear la descripción de la especialidad a cada médico
const medicosConEspecialidad = computed(() => {
  if (!medicos.value || !especialidades.value) {
    return [];
  }

  return medicos.value.map((medico) => {
    const especialidad = especialidades.value.find(
      (esp) => esp.id === medico.especialidadId
    );
    return {
      ...medico,
      especialidadDescripcion: especialidad
        ? especialidad.descripcion
        : "Especialidad no encontrada",
    };
  });
});

// Fecha y vista del Scheduler
const appointments = computed(() => appointmentsStore.appointments);
const currentDate = ref(new Date());
const currentView = ref("day");
const views = ["day", "week", "workWeek", "month", "agenda"];

// Computed property para concatenar título y nombre del paciente
const computedAppointments = computed(() =>
  appointments.value.map((appointment) => {
    const paciente = formIdentificacion.value.find(
      (p) => p.id === parseInt(appointment.nombre)
    );
    const nombrePaciente = paciente
      ? `${paciente.nombres} ${paciente.apellidos}`
      : "Paciente no asignado";

    return {
      ...appointment,
      text: `${appointment.title} - ${nombrePaciente}`,
      startDate: new Date(appointment.startDate),
      endDate: new Date(appointment.endDate),
    };
  })
);

// Funciones para abrir los modales
const openPatientModal = () => {
  isModalOpen.value = true;
};

const openDoctorModal = () => {
  isDoctorModalOpen.value = true;
};

// Funciones auxiliares para fechas
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

// Función para verificar superposición de citas
const checkAppointmentOverlap = async (appointment) => {
  const { startDate, endDate, medico, nombre, id } = appointment;

  // Formatear las fechas
  const start = formatDate(startDate);
  const end = formatDate(endDate);

  // Construir la consulta
  const { data: overlappingAppointments, error } = await supabase
    .from("appointments")
    .select("*")
    .neq("id", id || 0)
    .or(`medico.eq.${medico},nombre.eq.${nombre}`)
    .lt("startDate", end)
    .gt("endDate", start);

  if (error) {
    console.error("Error al verificar superposiciones:", error);
    throw error;
  }

  return overlappingAppointments.length > 0;
};

// Manejar apertura del formulario de citas
const onAppointmentFormOpening = (e) => {
  const form = e.form;
  appointmentForm.value = form;
  currentAppointmentData.value = e.appointmentData;
  const isAllDay = e.appointmentData.allDay || false;

  // Inicializar selectedPatient y selectedPatientId al editar una cita
  if (currentAppointmentData.value.nombre) {
    const paciente = formIdentificacion.value.find(
      (p) => p.id === parseInt(currentAppointmentData.value.nombre)
    );
    if (paciente) {
      selectedPatient.value = `${paciente.nombres} ${paciente.apellidos}`;
      selectedPatientId.value = paciente.id;
    } else {
      selectedPatient.value = "No seleccionado";
      selectedPatientId.value = null;
    }
  } else {
    selectedPatient.value = "No seleccionado";
    selectedPatientId.value = null;
  }

  // Inicializar selectedDoctor y selectedDoctorId al editar una cita
  if (currentAppointmentData.value.medico) {
    const doctor = medicosConEspecialidad.value.find(
      (d) => d.id === parseInt(currentAppointmentData.value.medico)
    );
    if (doctor) {
      selectedDoctor.value = doctor.nombre;
      selectedDoctorId.value = doctor.id;
    } else {
      selectedDoctor.value = "No seleccionado";
      selectedDoctorId.value = null;
    }
  } else {
    selectedDoctor.value = "No seleccionado";
    selectedDoctorId.value = null;
  }

  // Configurar los elementos del formulario
  form.option("items", [
    {
      itemType: "group",
      caption: "Detalles de la Cita",
      colCount: 1,
      items: [
        {
          dataField: "title",
          editorType: "dxTextBox",
          label: { text: "Asunto de la cita" },
          editorOptions: {
            value: e.appointmentData.title || e.appointmentData.text,
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
          label: { text: "Fecha y Hora Inicial" },
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
          label: { text: "Fecha y Hora Final" },
          editorOptions: {
            type: "datetime",
            displayFormat: "dd/MM/yyyy hh:mm a",
            value: e.appointmentData.endDate,
            disabled: isAllDay,
          },
        },
        {
          dataField: "tipoCita",
          editorType: "dxSelectBox",
          label: { text: "Tipo de Cita" },
          editorOptions: {
            dataSource: citas.value,
            displayExpr: "descripcion",
            valueExpr: "id",
            value: parseInt(e.appointmentData.tipoCita),
            placeholder: "Selecciona un tipo de cita",
          },
        },
      ],
    },
    {
      itemType: "group",
      caption: "Información del Paciente y Médico",
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

            // Botón para abrir el modal de pacientes
            const button = document.createElement("button");
            button.textContent = "Seleccionar Paciente";
            button.className = "btn btn-primary";
            button.onclick = () => openPatientModal();

            container.appendChild(button);
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

            // Botón para abrir el modal de médicos
            const button = document.createElement("button");
            button.textContent = "Seleccionar Médico";
            button.className = "btn btn-primary";
            button.onclick = () => openDoctorModal();

            container.appendChild(button);
            return container;
          },
        },
        {
          dataField: "description",
          editorType: "dxTextArea",
          label: { text: "Descripción" },
          editorOptions: {
            value: e.appointmentData.description,
          },
        },
      ],
    },
  ]);
};

// Manejar el agregado de citas
const onAppointmentAdded = async (e) => {
  try {
    const appointmentData = e.appointmentData;

    // Validar que se haya seleccionado un paciente y un médico
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

    // Validar `tenantId` y `userId`
    const { useAuthStore } = await import("../stores/auth");
    const authStore = useAuthStore();
    const tenantId = authStore.tenantId;
    const userId = authStore.user?.id;
    console.log("tenantId: ", tenantId);
    console.log("userId: ", userId);

    if (!tenantId || !userId) {
      Notify.create({
        message: "No se encontraron datos de usuario o tenant.",
        color: "negative",
        position: "top-right",
      });
      throw new Error("tenantId o userId faltante.");
    }

    // Preparar nueva cita con fechas formateadas
    const newAppointment = {
      title: appointmentData.title || appointmentData.text,
      startDate: appointmentData.allDay
        ? formatDate(getStartOfDay(appointmentData.startDate))
        : formatDate(appointmentData.startDate),
      endDate: appointmentData.allDay
        ? formatDate(getEndOfDay(appointmentData.startDate))
        : formatDate(appointmentData.endDate),
      allDay: appointmentData.allDay,
      repeat: appointmentData.repeat,
      description: appointmentData.description,
      nombre: selectedPatientId.value, // ID del paciente seleccionado
      medico: selectedDoctorId.value, // ID del médico seleccionado
      tipoCita: appointmentData.tipoCita,
      tenantId: tenantId,
      userId: userId,
    };

    // Verificar superposición de citas
    const hasOverlap = await checkAppointmentOverlap({
      ...newAppointment,
      id: 0, // ID 0 para nuevas citas
    });

    if (hasOverlap) {
      // Notificar al usuario
      Notify.create({
        message:
          "El médico o el paciente ya tiene una cita en este rango de tiempo.",
        color: "negative",
        position: "top-right",
      });
      // Cancelar la operación
      throw new Error("Superposición de citas detectada.");
    }

    // Guardar la cita en Supabase
    const { data, error } = await supabase
      .from("appointments")
      .insert([newAppointment])
      .select();

    if (error) {
      console.error("Error al guardar la cita en Supabase:", error.message);
      Notify.create({
        message: `Error al guardar la cita: ${error.message}`,
        color: "negative",
        position: "top-right",
      });
      throw error;
    }

    if (data && data.length > 0) {
      console.log("Cita agregada exitosamente:", data[0]);
      Notify.create({
        message: "Cita agregada exitosamente.",
        color: "positive",
        position: "top-right",
      });
      // Actualizar las citas mostradas
      computedAppointments.value.push({
        ...data[0],
        text: `${data[0].title} - ${selectedPatient.value}`,
        startDate: new Date(data[0].startDate),
        endDate: new Date(data[0].endDate),
      });
      // Opcional: Actualizar la store de citas si es necesario
      appointmentsStore.fetchAppointments(); // Asegúrate de que esta función actualiza las citas
    } else {
      console.error("No se pudo obtener la cita creada de Supabase.");
      Notify.create({
        message: "No se pudo obtener la cita creada.",
        color: "negative",
        position: "top-right",
      });
    }
  } catch (error) {
    console.error("Error al agregar la cita:", error);
    Notify.create({
      message: `Error al agregar la cita: ${error.message}`,
      color: "negative",
      position: "top-right",
    });
  }
};

// Manejar la actualización de citas
const onAppointmentUpdated = async (e) => {
  try {
    const appointmentData = e.appointmentData;

    // Preparar cita actualizada con fechas formateadas
    const updatedAppointment = {
      id: appointmentData.id,
      title: appointmentData.title || appointmentData.text,
      startDate: appointmentData.allDay
        ? formatDate(getStartOfDay(appointmentData.startDate))
        : formatDate(appointmentData.startDate),
      endDate: appointmentData.allDay
        ? formatDate(getEndOfDay(appointmentData.startDate))
        : formatDate(appointmentData.endDate),
      allDay: appointmentData.allDay,
      repeat: appointmentData.repeat,
      description: appointmentData.description,
      nombre: selectedPatientId.value || appointmentData.nombre,
      medico: selectedDoctorId.value || appointmentData.medico,
      tipoCita: appointmentData.tipoCita,
    };

    // Verificar superposición de citas
    const hasOverlap = await checkAppointmentOverlap(updatedAppointment);

    if (hasOverlap) {
      // Notificar al usuario
      Notify.create({
        message:
          "El médico o el paciente ya tiene una cita en este rango de tiempo.",
        color: "negative",
        position: "top",
      });
      // Cancelar la operación
      throw new Error("Superposición de citas detectada.");
    }

    // Actualizar la cita en Supabase
    const { data, error } = await supabase
      .from("appointments")
      .update(updatedAppointment)
      .eq("id", appointmentData.id)
      .select();

    if (error) {
      console.error("Error al actualizar la cita en Supabase:", error.message);
      Notify.create({
        message: `Error al actualizar la cita: ${error.message}`,
        color: "negative",
        position: "top-right",
      });
      throw error;
    }

    if (data && data.length > 0) {
      console.log("Cita actualizada exitosamente:", data[0]);
      Notify.create({
        message: "Cita actualizada exitosamente.",
        color: "positive",
        position: "top-right",
      });
      // Actualizar la cita en computedAppointments
      const index = computedAppointments.value.findIndex(
        (item) => item.id === data[0].id
      );
      if (index !== -1) {
        computedAppointments.value[index] = {
          ...data[0],
          text: `${data[0].title} - ${selectedPatient.value}`,
          startDate: new Date(data[0].startDate),
          endDate: new Date(data[0].endDate),
        };
      }
      // Opcional: Actualizar la store de citas si es necesario
      appointmentsStore.fetchAppointments();
    } else {
      console.error("No se pudo obtener la cita actualizada de Supabase.");
      Notify.create({
        message: "No se pudo obtener la cita actualizada.",
        color: "negative",
        position: "top-right",
      });
    }
  } catch (error) {
    console.error("Error al actualizar la cita:", error);
    Notify.create({
      message: `Error al actualizar la cita: ${error.message}`,
      color: "negative",
      position: "top-right",
    });
  }
};

// Manejar la eliminación de citas
const onAppointmentDeleted = async (e) => {
  try {
    const { id } = e.appointmentData;

    // Eliminar la cita en Supabase
    const { error } = await supabase.from("appointments").delete().eq("id", id);

    if (error) {
      console.error("Error al eliminar la cita en Supabase:", error.message);
      Notify.create({
        message: `Error al eliminar la cita: ${error.message}`,
        color: "negative",
        position: "top-right",
      });
      throw error;
    }

    console.log("Cita eliminada exitosamente.");
    Notify.create({
      message: "Cita eliminada exitosamente.",
      color: "positive",
      position: "top-right",
    });

    // Remover la cita de computedAppointments
    const index = computedAppointments.value.findIndex(
      (item) => item.id === id
    );
    if (index !== -1) {
      computedAppointments.value.splice(index, 1);
    }
    // Opcional: Actualizar la store de citas si es necesario
    appointmentsStore.fetchAppointments();
  } catch (error) {
    console.error("Error al eliminar la cita:", error);
    Notify.create({
      message: `Error al eliminar la cita: ${error.message}`,
      color: "negative",
      position: "top-right",
    });
  }
};

// Manejar selección de paciente desde el modal
const onPatientSelected = (e) => {
  const patient = e.selectedRowsData[0];
  if (patient) {
    const { nombres, apellidos, id } = patient;
    selectedPatient.value = `${nombres} ${apellidos}`;
    selectedPatientId.value = id;

    // Actualizar datos del formulario sin sobrescribir otros campos
    if (appointmentForm.value && currentAppointmentData.value) {
      currentAppointmentData.value.nombre = id; // Almacena el ID del paciente
      appointmentForm.value.updateData(
        "selectedPatientName",
        selectedPatient.value
      );
    }

    isModalOpen.value = false;
  }
};

// Manejar selección de médico desde el modal
const onDoctorSelected = (e) => {
  const doctor = e.selectedRowsData[0];
  if (doctor) {
    const { nombre, id } = doctor;
    selectedDoctor.value = nombre;
    selectedDoctorId.value = id;

    // Actualizar datos del formulario sin sobrescribir otros campos
    if (appointmentForm.value && currentAppointmentData.value) {
      currentAppointmentData.value.medico = id; // Almacena el ID del médico
      appointmentForm.value.updateData(
        "selectedDoctorName",
        selectedDoctor.value
      );
    }

    isDoctorModalOpen.value = false;
  }
};

// Cargar datos al montar el componente
onMounted(async () => {
  try {
    const { useAuthStore } = await import("../stores/auth");
    const authStore = useAuthStore();

    await authStore.initialize();

    // Verifica que 'user' no sea null o undefined
    if (!authStore?.user) {
      throw new Error("El usuario no está autenticado.");
    }

    const tenantId = authStore?.tenantId;
    const userId = authStore?.user?.id;

    console.log("Linea 753 el tenantId " + tenantId);
    console.log("Linea 754 el userId " + userId);

    if (!tenantId) {
      Notify.create({
        message: "No se encontraron datos de usuario o tenant.",
        color: "negative",
        position: "top-right",
      });
      throw new Error("tenantId o userId faltante.");
    }

    // Continuar con la carga de datos
    await appointmentsStore.fetchAppointments(); // Cargar citas
    await especialidadMedicaStore.cargarEspecialidades();
    await medicoStore.cargarMedicos();
    await tiposCitasStore.cargarCitas();
    await fichaIdentificacionStore.cargarDatos();

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
</script>

<style scoped>
.scheduler-container {
  background-color: #ffffff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
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
</style>
