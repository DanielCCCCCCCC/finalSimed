<template>
  <q-page class="profile-page">
    <div class="profile-container">
      <!-- Sección principal del perfil -->
      <div class="profile-main">
        <!-- Avatar y nombre -->
        <div class="profile-header">
          <q-avatar size="150px" class="profile-avatar">
            <img src="../assets/icons/profileMedico.jpg" alt="Doctor" />
          </q-avatar>
          <h3 class="profile-name">Dr. Sonia Taylor</h3>
        </div>

        <!-- Pestañas debajo de la foto de perfil -->
        <div class="q-pa-md flex justify-center">
          <q-tabs
            v-model="tab"
            class="bg-primary profile-nav-line tabs-menu custom-tabs"
            dense
            align="justify"
            active-color="white"
          >
            <q-tab name="info" label="Información del médico" />
            <q-tab name="qr" label="Código QR" />
          </q-tabs>
        </div>
      </div>

      <!-- Contenido de las Pestañas -->
      <q-card class="custom-card main-content-body-profile">
        <q-tab-panels animated v-model="tab">
          <!-- Pestaña de Información del Médico -->
          <q-tab-panel name="info">
            <q-card-section class="doctor-info">
              <h4 class="fs-15 text-uppercase mb-3">Información del Médico</h4>

              <!-- Estado de carga -->
              <div v-if="loading">
                <q-spinner size="50px" color="primary" />
                <p>Cargando información del médico...</p>
              </div>

              <!-- Tabla con la información del usuario -->
              <div v-else-if="users[0]" class="table-responsive">
                <q-list dense bordered separator>
                  <q-item>
                    <q-item-section>
                      <q-item-label><strong>ID:</strong></q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-item-label>{{ users[0]?.id }}</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section>
                      <q-item-label
                        ><strong>Nombre Completo:</strong></q-item-label
                      >
                    </q-item-section>
                    <q-item-section side>
                      <q-item-label>{{
                        users[0]?.nombreCompleto
                      }}</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section>
                      <q-item-label><strong>Rol:</strong></q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-item-label>{{ users[0]?.role }}</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section>
                      <q-item-label><strong>Email:</strong></q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-item-label>{{ users[0]?.email }}</q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-item>
                    <q-item-section>
                      <q-item-label><strong>Dirección:</strong></q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-item-label>{{ users[0]?.direccion }}</q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-item>
                    <q-item-section>
                      <q-item-label><strong>Observación:</strong></q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-item-label>{{
                        users[0]?.observaciones || "Sin observaciones."
                      }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </div>

              <!-- Manejo de errores -->
              <div v-else-if="error">
                <q-banner class="bg-red text-white" dense>
                  {{ error }}
                </q-banner>
              </div>
            </q-card-section>
          </q-tab-panel>

          <!-- Pestaña de Código QR -->
          <q-tab-panel name="qr">
            <q-card-section class="q-pa-md flex flex-center">
              <div class="qr-container">
                <h2>Código QR de Agenda</h2>

                <div v-if="loadingQR" class="spinner">
                  <q-spinner size="50px" color="primary" />
                  <p>Cargando código QR...</p>
                </div>

                <div v-else-if="qrCodeUrl">
                  <img
                    :src="qrCodeUrl"
                    alt="Código QR"
                    width="200"
                    height="200"
                  />
                  <p>Escanea el código QR para agendar una cita.</p>

                  <!-- Contenedor para el campo de URL y botones -->
                  <div class="url-container">
                    <q-input
                      filled
                      v-model="fullUrl"
                      readonly
                      class="url-input"
                      label="URL de Agenda"
                    />
                    <div class="buttons-container">
                      <q-btn
                        icon="content_copy"
                        label="Copiar URL"
                        color="primary"
                        class="anchoBotonesQR"
                        @click="copyToClipboard"
                      />
                      <q-btn
                        icon="download"
                        label="Descargar QR"
                        color="info"
                        class="anchoBotonesQR"
                        @click="downloadQRCode"
                      />
                    </div>
                  </div>

                  <!-- Mensaje de Éxito al Copiar -->
                  <q-banner
                    v-if="copySuccess"
                    class="bg-green text-white"
                    dense
                    inline-actions
                  >
                    URL copiada al portapapeles.
                    <template v-slot:action>
                      <q-btn
                        flat
                        dense
                        icon="close"
                        @click="copySuccess = false"
                      />
                    </template>
                  </q-banner>
                </div>

                <div v-else-if="errorMsgQR" class="alert alert-danger">
                  {{ errorMsgQR }}
                </div>
              </div>
            </q-card-section>
          </q-tab-panel>
        </q-tab-panels>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import QRCode from "qrcode";
import { useAuthStore } from "../stores/auth"; // Asegúrate de ajustar la ruta según tu estructura
import { useCrearUsuariosStore } from "../stores/crearUsuarios";
import { useQuasar } from "quasar";
import { storeToRefs } from "pinia";

const crearUsuariosStore = useCrearUsuariosStore();
const { users, loading, error } = storeToRefs(crearUsuariosStore);

const $q = useQuasar();

const tab = ref("info");

// Acceder a la store de autenticación
const authStore = useAuthStore();
const organizationId = ref(authStore.tenant_id || "defaultOrgId"); // Proporciona un valor por defecto si es necesario
const doctorId = ref(authStore.userId || "defaultDoctorId"); // Proporciona un valor por defecto si es necesario

// Estado para el código QR
const qrCodeUrl = ref("");
const loadingQR = ref(true);
const errorMsgQR = ref("");

// Estado para la copia del URL
const copySuccess = ref(false);

// Definir la base URL
const baseUrl =
  import.meta.env.VITE_BASE_URL || "http://localhost:9000/schedule"; // Configura correctamente en producción

// URL completa: /schedule/:organizationId/:doctorId
const fullUrl = ref(`${baseUrl}/${organizationId.value}/${doctorId.value}`);

// Genera el QR
async function generateQRCode() {
  try {
    const urlString = fullUrl.value;
    console.log("Generando QR para:", urlString);

    qrCodeUrl.value = await QRCode.toDataURL(urlString, {
      width: 300,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#ffffff",
      },
    });
  } catch (err) {
    console.error("Error al generar el código QR:", err);
    errorMsgQR.value = "No se pudo generar el código QR. Inténtalo de nuevo.";
  } finally {
    loadingQR.value = false;
  }
}

// Copiar al portapapeles
async function copyToClipboard() {
  try {
    await navigator.clipboard.writeText(fullUrl.value);
    copySuccess.value = true;
    setTimeout(() => {
      copySuccess.value = false;
    }, 3000);
  } catch (err) {
    console.error("Error al copiar:", err);
    $q.notify({
      type: "negative",
      message: "No se pudo copiar el URL. Inténtalo de nuevo.",
    });
  }
}

// Descargar QR
function downloadQRCode() {
  if (!qrCodeUrl.value) {
    $q.notify({
      type: "negative",
      message: "No hay código QR para descargar.",
    });
    return;
  }
  const link = document.createElement("a");
  link.href = qrCodeUrl.value;
  link.download = `codigo_qr_${doctorId.value}.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Obtener el usuario actual y generar QR al montar el componente
onMounted(async () => {
  await crearUsuariosStore.cargarUsuarioPerfil();
  console.log("USER DE PERFIL MEDICO: ", crearUsuariosStore.users.value);
  await generateQRCode();
});

// Si cambia tenant_id o userId en la store, regeneramos el QR
watch(
  () => authStore.tenant_id,
  (newOrg) => {
    organizationId.value = newOrg;
    fullUrl.value = `${baseUrl}/${organizationId.value}/${doctorId.value}`;
    generateQRCode();
  }
);

watch(
  () => authStore.userId,
  (newDoc) => {
    doctorId.value = newDoc;
    fullUrl.value = `${baseUrl}/${organizationId.value}/${doctorId.value}`;
    generateQRCode();
  }
);
</script>

<style scoped>
.profile-container {
  position: relative;
  top: -40px;
  max-width: 1900px;
  margin: 0 auto;
  background-color: #ffffff;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.profile-main {
  text-align: center;
  padding: 30px;
}

.profile-avatar {
  margin-top: -35px; /* Para superponer el avatar al banner */
  border: 5px solid #ffffff;
}

.profile-name {
  margin-top: 10px;
  font-size: 1.8rem;
  font-weight: bold;
}

.profile-buttons {
  margin-top: 15px;
}

.profile-stats {
  display: flex;
  justify-content: center;
  gap: 30px;
  margin-top: 20px;
}

.profile-stats div {
  text-align: center;
}

.profile-stats strong {
  display: block;
  font-size: 1.2rem;
}

.tabs-menu {
  margin-top: 20px;
  padding-top: 10px;
  width: 100%;
  border: #ffffff;
}

.custom-tabs {
  /* Mejora adicional para las pestañas */
  border-radius: 8px;
}

.q-tab--active .q-tab__content {
  font-weight: bold;
  color: #ffffff;
}

.q-tab {
  color: rgba(255, 255, 255, 0.75);
  transition: color 0.3s;
}

.q-tab:hover .q-tab__content {
  color: #ffffff;
}

.q-tab__indicator {
  height: 3px;
}

.qr-container {
  text-align: center;
  max-width: 350px;
  width: 100%;
}

.spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 250px;
}

.url-container {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 15px;
  flex-wrap: wrap;
  gap: 10px;
}

.url-input {
  flex: 1;
  min-width: 200px;
}

.buttons-container {
  display: flex;
  gap: 10px;
}
.anchoBotonesQR {
  width: 150px;
}
/* Estilos adicionales para la información del médico */
.doctor-info {
  width: 100%; /* Asegura que la tabla abarque todo el ancho */
}

.table-responsive {
  width: 100%;
  overflow-x: auto;
}

.info-table {
  width: 100%;
  border-collapse: collapse;
}

.info-table th,
.info-table td {
  padding: 12px 15px;
  text-align: left;
}

.info-table th {
  background-color: #1976d2; /* Color primario para los encabezados */
  color: #ffffff;
  width: 20%; /* Ajusta el ancho de las etiquetas según sea necesario */
}

.info-table tr:nth-child(even) {
  background-color: #f2f2f2;
}

.info-table tr:hover {
  background-color: #e6f7ff;
}

/* Responsividad */
@media (min-width: 600px) {
  .url-container {
    flex-wrap: nowrap;
    width: auto;
  }

  .url-input {
    margin-bottom: 0;
    min-width: 300px;
  }
}

/* Ajustes para el banner de éxito */
.bg-green {
  background-color: #4caf50 !important;
}

.bg-red {
  background-color: #f44336 !important;
}

/* Ajustes para mejorar la presentación de la información */
.q-item-section label {
  font-weight: bold;
  color: #555555;
}

.q-item-section q-item-label:last-child {
  color: #333333;
}
</style>
