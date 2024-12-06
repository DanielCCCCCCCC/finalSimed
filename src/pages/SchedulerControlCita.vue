<template>
  <div class="scheduler-container">
    <DxScheduler
      :data-source="computedAppointments"
      :current-view="currentView"
      :current-date="currentDate"
      :time-zone="'America/Tegucigalpa'"
      :height="650"
      :cell-duration="30"
      :start-day-hour="8"
      :end-day-hour="21"
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
  </div>
</template>

<script setup>
import { DxScheduler, DxView } from "devextreme-vue/scheduler";
import { useAppointmentsStore } from "../stores/AppointmentsStore";
import { useMedicoStore } from "../stores/MedicoStores";
import { useTiposCitasStore } from "src/stores/ConfiMedicasStores";
import { onMounted, ref, computed } from "vue";
import { storeToRefs } from "pinia";
import CitasAgendadas from "src/components/CitasAgendadas.vue";

// Usamos la tienda de citas y de médicos
const store = useAppointmentsStore();
const MedicoStore = useMedicoStore();
const TiposCitasStore = useTiposCitasStore();

const { medicos } = storeToRefs(MedicoStore); // Obtenemos la lista de médicos de la tienda
const { citas } = storeToRefs(TiposCitasStore);

const appointments = computed(() => store.appointments);
const currentDate = ref(new Date());
const currentView = ref("month");
const views = ["day", "week", "workWeek", "month", "agenda"];

// Computed property para concatenar título y nombre del paciente y usar `id` como clave única
const computedAppointments = computed(() =>
  store.appointments.map((appointment) => ({
    ...appointment,
    text: `${appointment.title} - ${appointment.nombrePaciente}`, // Concatenación del título y nombre del paciente
  }))
);

// Ejecutamos la función de fetch al montar el componente
onMounted(() => {
  store.fetchAppointments();
  MedicoStore.cargarMedicos(); // Carga de los médicos
  TiposCitasStore.cargarCitas();
});

// Personalizar el formulario de citas
const onAppointmentFormOpening = (e) => {
  console.log("Configurando el formulario de citas...");

  e.popup.option("showTitle", true);
  e.popup.option("title", e.appointmentData.text || "Crear una nueva cita");

  const form = e.form;

  form.updateData("medico", e.appointmentData.medico || "");
  form.updateData("tipoCita", e.appointmentData.tipoCita || "");

  const mainGroupItems = form.itemOption("mainGroup").items || [];

  if (!mainGroupItems.find((i) => i.dataField === "nombrePaciente")) {
    mainGroupItems.push({
      dataField: "nombrePaciente",
      editorType: "dxTextBox",
      colSpan: 2,
      label: { text: "Nombre del Paciente" },
    });
  }

  if (!mainGroupItems.find((i) => i.dataField === "medico")) {
    mainGroupItems.push({
      dataField: "medico",
      editorType: "dxSelectBox",
      colSpan: 2,
      label: { text: "Médico" },
      editorOptions: {
        dataSource: medicos.value,
        displayExpr: "nombre",
        valueExpr: "id",
        value: e.appointmentData.medico,
        placeholder: "Selecciona un médico",
      },
    });
  }

  if (!mainGroupItems.find((i) => i.dataField === "tipoCita")) {
    mainGroupItems.push({
      dataField: "tipoCita",
      editorType: "dxSelectBox",
      colSpan: 2,
      label: { text: "Tipo de Cita" },
      editorOptions: {
        dataSource: citas.value,
        displayExpr: "descripcion",
        valueExpr: "id",
        value: e.appointmentData.tipoCita,
        placeholder: "Selecciona un tipo de cita",
      },
    });
  }

  form.itemOption("mainGroup", "items", mainGroupItems);
};

// Manejo de eventos del Scheduler
const onAppointmentAdded = async (e) => {
  try {
    const newAppointment = {
      title: e.appointmentData.title || e.appointmentData.text,
      startDate: e.appointmentData.startDate,
      endDate: e.appointmentData.endDate,
      allDay: e.appointmentData.allDay,
      repeat: e.appointmentData.repeat,
      description: e.appointmentData.description,
      nombrePaciente: e.appointmentData.nombrePaciente,
      medico: e.appointmentData.medico,
      tipoCita: e.appointmentData.tipoCita,
    };

    const { data, error } = await store.addAppointment(newAppointment);

    if (error) {
      console.error("Error al guardar la cita en Supabase:", error.message);
    } else if (data && data[0]) {
      console.log("Cita agregada exitosamente:", data[0]);
    } else {
      console.error("No se pudo obtener la cita creada de Supabase.");
    }
  } catch (error) {
    console.error("Error al agregar la cita:", error);
  }
};
// Evento para actualizar la cita
const onAppointmentUpdated = async (e) => {
  try {
    const updatedAppointment = {
      title: e.appointmentData.title || e.appointmentData.text,
      startDate: e.appointmentData.startDate,
      endDate: e.appointmentData.endDate,
      allDay: e.appointmentData.allDay,
      repeat: e.appointmentData.repeat,
      description: e.appointmentData.description,
      nombrePaciente: e.appointmentData.nombrePaciente,
      medico: e.appointmentData.medico,
      tipoCita: e.appointmentData.tipoCita,
    };

    if (e.appointmentData.id) {
      await store.updateAppointment(e.appointmentData.id, updatedAppointment);
      console.log("Cita actualizada exitosamente:", updatedAppointment);
    } else {
      console.error("No se encontró el ID de la cita para actualizar");
    }
  } catch (error) {
    console.error("Error al actualizar la cita:", error);
  }
};
</script>

<style scoped>
.scheduler-container {
  background-color: #f9fafc;
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
