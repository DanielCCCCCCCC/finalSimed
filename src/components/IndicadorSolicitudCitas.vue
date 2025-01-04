<template>
  <div class="citas-agendadas-container">
    <h5 class="title">Últimas 8 Solicitudes de Citas (autoCita) - Filtradas</h5>

    <!-- Botones para filtrar según status -->
    <div class="filter-buttons">
      <q-btn label="Todas" color="info" @click="cargarCitas('Todas')" />
      <q-btn
        label="Pendientes"
        color="dark"
        @click="cargarCitas('Pendiente')"
      />
      <q-btn
        label="Aceptadas"
        color="positive"
        @click="cargarCitas('Aceptada')"
      />
      <q-btn
        label="Rechazadas"
        color="negative"
        @click="cargarCitas('Rechazada')"
      />
    </div>

    <!-- Sección con 2 columnas (4 ítems en cada una) -->
    <div class="appointments-list">
      <!-- Columna 1: los primeros 4 -->
      <div class="column">
        <h6>Columna 1</h6>
        <ul>
          <li
            v-for="item in last8AutoAppointments.slice(0, 4)"
            :key="item.id"
            class="appointment-item"
          >
            <strong>{{ item.title }}</strong
            ><br />
            <!-- <span class="status">{{ item.status }}</span> -->
            <span class="date">{{ item.startDate }}</span>
          </li>
        </ul>
      </div>

      <!-- Columna 2: los siguientes 4 -->
      <div class="column">
        <h6>Columna 2</h6>
        <ul>
          <li
            v-for="item in last8AutoAppointments.slice(4, 8)"
            :key="item.id"
            class="appointment-item"
          >
            <strong>{{ item.title }}</strong
            ><br />
            <span class="status">{{ item.status }}</span
            ><br />
            <span class="date">{{ item.startDate }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script setup>
import { onMounted } from "vue";
import { useAppointmentsStore } from "../stores/AppointmentsStore"; // Ajusta la ruta si es necesario
import { storeToRefs } from "pinia";

// Instancia de la store
const appointmentsStore = useAppointmentsStore();
const { last8AutoAppointments } = storeToRefs(appointmentsStore);

/**
 * Método para cargar las últimas 8 autoCitas filtradas por status,
 * sin recargar la página, solo actualizando el array last8AutoAppointments.
 */
const cargarCitas = async (status) => {
  await appointmentsStore.fetchLast8AutoAppointmentsByStatus(status);
};

// Al montar el componente, llamamos a "Todas"
onMounted(() => {
  cargarCitas("Todas");
});
</script>
<style scoped>
.citas-agendadas-container {
  padding: 20px;
  background-color: #ffffff;
  border-radius: 12px;
  /* box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); */
  /* Ajusta el ancho según el grid del dashboard */
  width: 100%;
  box-sizing: border-box;
}

.title {
  margin-bottom: 16px;
  font-size: 1.25rem;
  color: #333;
  text-align: center;
}

.filter-buttons {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.appointments-list {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.column {
  flex: 1;
  min-width: 250px; /* Para asegurar responsividad */
}

.column h6 {
  margin-bottom: 10px;
  font-size: 1rem;
  color: #555;
  border-bottom: 1px solid #eee;
  padding-bottom: 5px;
}

ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.appointment-item {
  background-color: #f9f9f9;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 10px;
  transition: background-color 0.3s;
}

.appointment-item:hover {
  background-color: #f1f1f1;
}

.appointment-item .status {
  display: inline-block;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.85rem;
  color: #fff;
  margin-top: 4px;
}

/* Colores para diferentes estados */
.appointment-item .status:contains("Pendiente") {
  background-color: #ff9800;
}

.appointment-item .status:contains("Aceptada") {
  background-color: #4caf50;
}

.appointment-item .status:contains("Rechazada") {
  background-color: #f44336;
}

.appointment-item .date {
  display: block;
  font-size: 0.85rem;
  color: #777;
  margin-top: 2px;
}

/* Responsividad */
@media (max-width: 768px) {
  .appointments-list {
    flex-direction: column;
  }
}
</style>
