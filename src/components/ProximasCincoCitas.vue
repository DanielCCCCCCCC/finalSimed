<template>
  <div class="card custom-card w-100">
    <!-- Mostrar mensaje de carga si está cargando -->
    <div v-if="cargando" class="card-body">
      <p class="text-center">Cargando...</p>
    </div>

    <!-- Contenido principal de la tarjeta cuando ya no está cargando -->
    <div v-else class="card-body d-flex flex-column align-items-start w-100">
      <!-- Sección de texto -->
      <div class="title w-100">
        <label class="main-content-label mb-1 pt-1"> PRÓXIMAS 5 CITAS </label>
        <span class="d-block fs-12 mb-2 text-muted">
          Listado de las 5 citas más cercanas
        </span>

        <!-- Listado de próximas 5 citas -->
        <div v-if="enrichedAppointments.length > 0" class="mt-2 w-100">
          <div
            v-for="(appt, index) in enrichedAppointments"
            :key="appt.id"
            class="mb-2 p-2 border-bottom d-flex align-items-start"
          >
            <!-- Icono de la cita -->
            <q-icon name="event" size="24px" class="me-2 text-primary" />
            <div>
              <p class="mb-0 fs-14">
                <b>{{ appt.title }}</b>
              </p>
              <p class="mb-0 fs-12 text-muted">
                Fecha: {{ formatDate(appt.startDate) }}
              </p>
              <p class="mb-0 fs-12 text-muted">Médico: {{ appt.medicoName }}</p>
              <p class="mb-0 fs-12 text-muted">
                Paciente: {{ appt.pacienteName }}
              </p>
              <p class="mb-0 fs-12 text-muted">
                Tipo de Cita: {{ appt.tipoCitaDesc }}
              </p>
            </div>
          </div>
        </div>
        <!-- Mostrar un mensaje si no hay citas próximas -->
        <div v-else>
          <p class="fs-14">No hay citas próximas</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useAppointmentsStore } from "../stores/AppointmentsStore";
import { useMedicoStore } from "../stores/MedicoStores";
import { useTiposCitasStore } from "../stores/ConfiMedicasStores";
import { useFichaIdentificacionStore } from "../stores/fichaIdentificacionStores";

// Inicializar stores
const store = useAppointmentsStore();
const MedicoStore = useMedicoStore();
const TiposCitasStore = useTiposCitasStore();
const FichaIdentificacionStore = useFichaIdentificacionStore();

// Estado de carga
const cargando = ref(true);

// Al montar el componente, se obtienen las citas y otros datos relacionados
onMounted(async () => {
  await store.fetchAppointments();
  await MedicoStore.cargarMedicos();
  await TiposCitasStore.cargarCitas();
  await FichaIdentificacionStore.cargarDatos();

  cargando.value = false;
});

// Funciones para obtener datos relacionados
const getCita = (id) => {
  const tipoCita = TiposCitasStore.citas.find((p) => p.id == id);
  return tipoCita ? tipoCita.descripcion : "Desconocido";
};

const getPacienteName = (id) => {
  const paciente = FichaIdentificacionStore.formIdentificacion.find(
    (p) => p.id == id
  );
  return paciente ? `${paciente.nombres} ${paciente.apellidos}` : "Desconocido";
};

const getMedicoName = (id) => {
  const medico = MedicoStore.medicos.find((m) => m.id == id);
  return medico ? medico.nombre : "Desconocido";
};
const enrichedAppointments = computed(() => {
  return nextAppointments.value.map((appt) => ({
    ...appt,
    medicoName: getMedicoName(appt.medico),
    pacienteName: getPacienteName(appt.pacienteId),
    tipoCitaDesc: getCita(appt.tipoCitaId),
  }));
});

/**
 * Computed: Devuelve las próximas 5 citas.
 */
const nextAppointments = computed(() => {
  const futureAppointments = store.appointments.filter(
    (appt) => new Date(appt.startDate) > new Date()
  );
  futureAppointments.sort(
    (a, b) => new Date(a.startDate) - new Date(b.startDate)
  );
  const sliced = futureAppointments.slice(0, 5);
  console.log("Next Appointments:", sliced);
  return sliced;
});

/**
 * Formatear fecha (puedes ajustar este formato a tu gusto).
 */
function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleString(); // Ejemplo: 20/12/2024, 10:30:00
}
</script>

<style scoped>
.card {
  border: none; /* Elimina todos los bordes */
  height: 100%; /* Mantiene la altura similar a tu ejemplo */
  border-bottom: 10px solid #31d30887; /* Solo borde inferior de 10px */
  /* Ajusta el ancho según tus necesidades */
  max-width: 600px; /* Por ejemplo, 600px de ancho máximo */
  margin: 0 auto; /* Centra la tarjeta horizontalmente */
}

.title {
  position: relative;
  /* Elimina o ajusta el top si es necesario */
  top: 0;
}

/* Opcional: Ajustes adicionales para el icono principal */
.q-icon {
  width: 36px;
  height: 36px;
}

/* Ajustes para los iconos de las citas */
.q-icon.me-2 {
  margin-right: 0.5rem; /* Espacio entre el icono y el texto */
}
</style>
