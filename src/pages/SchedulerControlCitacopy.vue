<template>
  <div class="scheduler-container">
    <DxScheduler
      :data-source="computedAppointments"
      :current-view="currentView"
      :current-date="currentDate"
      :time-zone="'America/Tegucigalpa'"
      :height="800"
      :cell-duration="15"
      :start-day-hour="8"
      :end-day-hour="18"
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
              placeholder="Buscar Nombre, Apellido o Cédula"
            />
            <DxSelection mode="single" />
            <DxColumn data-field="nombres" caption="Nombres" />
            <!-- <DxColumn data-field="apellidos" caption="Apellidos" /> -->
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
import { supabase } from "../supabaseClient";
import { Notify } from "quasar";

import { onMounted, ref, computed } from "vue";
import { storeToRefs } from "pinia";

import {
  DxDataGrid,
  DxColumn,
  DxSelection,
  DxSearchPanel,
} from "devextreme-vue/data-grid";

// Stores
import { useAppointmentsStore } from "../stores/AppointmentsStore";
import { useMedicoStore } from "../stores/MedicoStores";
import { useEspecialidadMedicaStore } from "../stores/ConfiMedicasStores";
import { useTiposCitasStore } from "../stores/ConfiMedicasStores";
import { useFichaIdentificacionStore } from "../stores/fichaIdentificacionStores";

// Variables reactivas para modales
const isModalOpen = ref(false);
const isDoctorModalOpen = ref(false);
const selectedPatient = ref(null);
const selectedPatientId = ref(null);
const selectedDoctor = ref(null);
const selectedDoctorId = ref(null);

// Form y datos de la cita actual
const appointmentForm = ref(null);
const currentAppointmentData = ref(null);

const isMedicosLoading = ref(true);
const isEspecialidadesLoading = ref(true);
const isPacientesLoading = ref(false);

// Acceder a las stores
const appointmentsStore = useAppointmentsStore();
const medicoStore = useMedicoStore();
const especialidadMedicaStore = useEspecialidadMedicaStore();
const tiposCitasStore = useTiposCitasStore();
const fichaIdentificacionStore = useFichaIdentificacionStore();

// Desestructurar las variables reactivas
const { medicos } = storeToRefs(medicoStore);
const { especialidades } = storeToRefs(especialidadMedicaStore);
const { citas } = storeToRefs(tiposCitasStore);
const { formIdentificacion } = storeToRefs(fichaIdentificacionStore);

// Mapeamos especialidad con cada médico
const medicosConEspecialidad = computed(() => {
  if (!medicos.value || !especialidades.value) return [];
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

// Desde la appointmentsStore
const { appointments } = storeToRefs(appointmentsStore);

// Vista del Scheduler
const currentDate = ref(new Date());
const currentView = ref("day");
const views = ["day", "week", "workWeek", "month", "agenda"];

// Filtramos SOLO las "Aceptadas"
const computedAppointments = computed(() =>
  appointments.value
    .filter((appt) => appt.status === "Aceptada")
    .map((appointment) => {
      const paciente = formIdentificacion.value.find(
        (p) => p.id === parseInt(appointment.nombre)
      );
      const nombrePaciente = paciente
        ? `${paciente.nombres}`
        : "Paciente no asignado";

      return {
        ...appointment,
        text: `${appointment.title} - ${nombrePaciente}`,
        startDate: new Date(appointment.startDate),
        endDate: new Date(appointment.endDate),
      };
    })
);

// Mapeo de colores por tipo de cita
const colorMapping = {
  "Primera vez": "#E0F7FA",
  Seguimiento: "#FFF9C4",
  Consulta: "#FFECB3",
  // ... etc
};

// Abrir modales
const openPatientModal = () => {
  isModalOpen.value = true;
};
const openDoctorModal = () => {
  isDoctorModalOpen.value = true;
};

// Helpers de fecha
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

// Verificar superposiciones (paciente y/o médico)
const checkAppointmentOverlap = async (appointment) => {
  const { startDate, endDate, medico, nombre, id } = appointment;

  const start = formatDate(startDate);
  const end = formatDate(endDate);

  const { data: overlappingAppointments, error } = await supabase
    .from("appointments")
    .select("*")
    .neq("id", id || 0)
    // EJEMPLO: or(`medico.eq.${medico},nombre.eq.${nombre}`)
    .or(`medico.eq.${medico}`)
    .lt("startDate", end)
    .gt("endDate", start);

  if (error) {
    console.error("Error al verificar superposiciones:", error);
    throw error;
  }

  return overlappingAppointments.length > 0;
};

// Form de cita
const onAppointmentFormOpening = (e) => {
  const form = e.form;
  appointmentForm.value = form;
  currentAppointmentData.value = e.appointmentData;

  const isAllDay = e.appointmentData.allDay || false;

  // Cargar info de paciente/doctor si ya viene en la cita
  if (currentAppointmentData.value.nombre) {
    const pac = formIdentificacion.value.find(
      (p) => p.id === parseInt(currentAppointmentData.value.nombre)
    );
    // if (pac) {
    //   selectedPatient.value = `${pac.nombres} ${pac.apellidos}`;
    //   selectedPatientId.value = pac.id;
    // } else {
    //   selectedPatient.value = "No seleccionado";
    //   selectedPatientId.value = null;
    // }
  }
  if (currentAppointmentData.value.medico) {
    const doc = medicosConEspecialidad.value.find(
      (d) => d.id === parseInt(currentAppointmentData.value.medico)
    );
    if (doc) {
      selectedDoctor.value = doc.nombre;
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

// Al agregar (el médico crea una nueva cita)
const onAppointmentAdded = async (e) => {
  try {
    const appointmentData = e.appointmentData;

    // Validar selección de paciente/médico
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

    // Tomar tenant_id y userId del authStore (médico actual)
    const { useAuthStore } = await import("../stores/auth");
    const authStore = useAuthStore();
    const tenant_id = authStore.tenant_id;
    const userId = authStore.user?.id;

    if (!tenant_id || !userId) {
      Notify.create({
        message: "No se encontraron datos de usuario o tenant.",
        color: "negative",
        position: "top-right",
      });
      throw new Error("tenant_id o userId faltante.");
    }

    // Armamos el objeto de cita
    const newAppointment = {
      title: appointmentData.title || appointmentData.text,
      startDate: appointmentData.allDay
        ? formatDate(getStartOfDay(appointmentData.startDate))
        : formatDate(appointmentData.startDate),
      endDate: appointmentData.allDay
        ? formatDate(getEndOfDay(appointmentData.startDate))
        : formatDate(appointmentData.endDate),
      allDay: appointmentData.allDay || false,
      repeat: appointmentData.repeat || false,
      description: appointmentData.description || "",
      nombre: selectedPatientId.value, // ID del paciente
      medico: selectedDoctorId.value, // ID del médico (puede ser el mismo user? o distinto)
      tipoCita: appointmentData.tipoCita,
      tenant_id: tenant_id,
      userId: userId, // El ID del médico que registra la cita
      status: "Aceptada",
    };

    // Verificar superposición
    const hasOverlap = await checkAppointmentOverlap({
      ...newAppointment,
      id: 0,
    });
    if (hasOverlap) {
      Notify.create({
        message: "El médico o el paciente ya tiene una cita en este rango.",
        color: "negative",
        position: "top-right",
      });
      throw new Error("Superposición de citas detectada.");
    }

    // Opción A: Insert directo a Supabase
    // const { data, error } = await supabase
    //   .from("appointments")
    //   .insert([newAppointment])
    //   .select();

    // Opción B: Usar el store (más limpio)
    const data = await appointmentsStore.addAppointment(newAppointment);

    if (!data) {
      Notify.create({
        message: "No se pudo obtener la cita creada.",
        color: "negative",
        position: "top-right",
      });
      return;
    }

    Notify.create({
      message: "Cita agregada exitosamente.",
      color: "positive",
      position: "top-right",
    });

    // Al refrescar
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

// Actualizar la cita
const onAppointmentUpdated = async (e) => {
  try {
    const appointmentData = e.appointmentData;

    const updatedAppointment = {
      title: appointmentData.title || appointmentData.text,
      startDate: appointmentData.allDay
        ? formatDate(getStartOfDay(appointmentData.startDate))
        : formatDate(appointmentData.startDate),
      endDate: appointmentData.allDay
        ? formatDate(getEndOfDay(appointmentData.startDate))
        : formatDate(appointmentData.endDate),
      allDay: appointmentData.allDay || false,
      repeat: appointmentData.repeat || false,
      description: appointmentData.description || "",
      nombre: selectedPatientId.value || appointmentData.nombre,
      medico: selectedDoctorId.value || appointmentData.medico,
      tipoCita: appointmentData.tipoCita,
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

    // Opción A: update directo
    // const { data, error } = await supabase
    //   .from("appointments")
    //   .update(updatedAppointment)
    //   .eq("id", appointmentData.id)
    //   .select();

    // Opción B: Usar store
    await appointmentsStore.updateAppointment(
      appointmentData.id,
      updatedAppointment
    );

    Notify.create({
      message: "Cita actualizada exitosamente.",
      color: "positive",
      position: "top-right",
    });
    // Volvemos a cargar la lista
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

// Eliminar
const onAppointmentDeleted = async (e) => {
  try {
    const { id } = e.appointmentData;

    // Opción A: directo
    // const { error } = await supabase.from("appointments").delete().eq("id", id);

    // Opción B: store
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

// Seleccionar paciente
const onPatientSelected = (e) => {
  const patient = e.selectedRowsData[0];
  if (patient) {
    const { nombres, id } = patient;
    selectedPatient.value = `${nombres} `;
    selectedPatientId.value = id;

    if (appointmentForm.value && currentAppointmentData.value) {
      currentAppointmentData.value.nombre = id;
      appointmentForm.value.updateData(
        "selectedPatientName",
        selectedPatient.value
      );
    }
    isModalOpen.value = false;
  }
};

// Seleccionar médico
const onDoctorSelected = (e) => {
  const doctor = e.selectedRowsData[0];
  if (doctor) {
    const { nombre, id } = doctor;
    selectedDoctor.value = nombre;
    selectedDoctorId.value = id;

    if (appointmentForm.value && currentAppointmentData.value) {
      currentAppointmentData.value.medico = id;
      appointmentForm.value.updateData(
        "selectedDoctorName",
        selectedDoctor.value
      );
    }
    isDoctorModalOpen.value = false;
  }
};

// Colorear la cita según el tipo
const onAppointmentRendered = (e) => {
  const appointmentData = e.appointmentData;
  const appointmentElement = e.appointmentElement;

  const tipoCitaId = parseInt(appointmentData.tipoCita, 10);
  const tipoCitaObj = citas.value.find((c) => c.id === tipoCitaId);

  let descripcionTipoCita = tipoCitaObj ? tipoCitaObj.descripcion : null;
  const bgColor = colorMapping[descripcionTipoCita] || "#FFFFFF";
  appointmentElement.style.backgroundColor = bgColor;
  appointmentElement.style.color = "#000";
};

// onMounted: cargar datos iniciales
onMounted(async () => {
  try {
    const { useAuthStore } = await import("../stores/auth");
    const authStore = useAuthStore();
    await authStore.initialize();

    if (!authStore?.user) {
      throw new Error("El usuario no está autenticado.");
    }

    const tenant_id = authStore?.tenant_id;
    const userId = authStore?.user?.id;

    if (!tenant_id) {
      Notify.create({
        message: "No se encontraron datos de usuario o tenant.",
        color: "negative",
        position: "top-right",
      });
      throw new Error("tenant_id o userId faltante.");
    }

    // Cargamos citas, especialidades, médicos, etc.
    await appointmentsStore.fetchAppointments();
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
  position: relative;
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
</style>
