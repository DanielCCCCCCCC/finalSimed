<!-- https://www.npmjs.com/package/qrcode -->
<!--  -->
<template>
  <div class="qr-container">
    <h1>Generar Código QR</h1>

    <div v-if="loading" class="spinner">
      <p>Cargando código QR...</p>
    </div>

    <div v-else-if="qrCodeUrl">
      <img :src="qrCodeUrl" alt="Código QR" />
      <p>Escanea el código QR para agendar una cita.</p>

      <!-- Contenedor para el campo de URL y botones -->
      <div class="url-container">
        <input
          type="text"
          :value="fullUrl"
          readonly
          class="url-input"
          @click="copyToClipboard"
        />
        <button
          @click="copyToClipboard"
          class="btn btn-primary btn-sm q-ml-xs btn-wave"
        >
          📋 Copiar URL
        </button>
        <button
          @click="downloadQRCode"
          class="btn btn-info btn-sm q-ml-xs btn-wave"
        >
          📥 Descargar QR
        </button>
      </div>

      <!-- Mensaje de Éxito al Copiar -->
      <div v-if="copySuccess" class="copy-success">
        URL copiado al portapapeles.
      </div>
    </div>

    <div v-else-if="errorMsg" class="alert alert-danger">
      {{ errorMsg }}
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, watch } from "vue";
import QRCode from "qrcode";
import { useAuthStore } from "../stores/auth"; // Ajusta la ruta según tu estructura

// Acceder a la store de autenticación
const authStore = useAuthStore();
const organizationId = ref(authStore.tenant_id);
const doctorId = ref(authStore.userId);

// Estado para el código QR
const qrCodeUrl = ref("");
const loading = ref(true);
const errorMsg = ref("");

// Estado para la copia del URL
const copySuccess = ref(false);

// Definir la base URL
const baseUrl = "http://localhost:9000/schedule"; // Cambia esto en producción

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
    errorMsg.value = "No se pudo generar el código QR. Inténtalo de nuevo.";
  } finally {
    loading.value = false;
  }
}

// Copiar portapapeles
async function copyToClipboard() {
  try {
    await navigator.clipboard.writeText(fullUrl.value);
    copySuccess.value = true;
    setTimeout(() => {
      copySuccess.value = false;
    }, 3000);
  } catch (err) {
    console.error("Error al copiar:", err);
    errorMsg.value = "No se pudo copiar el URL. Inténtalo de nuevo.";
  }
}

// Descargar
function downloadQRCode() {
  if (!qrCodeUrl.value) {
    errorMsg.value = "No hay código QR para descargar.";
    return;
  }
  const link = document.createElement("a");
  link.href = qrCodeUrl.value;
  link.download = `codigo_qr_${doctorId.value}.png`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
// Ejecutar la generación del QR al montar el componente
onMounted(() => {
  generateQRCode();
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
.qr-container {
  text-align: center;
  padding: 20px;
}

.spinner {
  margin-top: 20px;
}

img {
  margin-top: 20px;
  width: 300px;
  height: 300px;
}

.alert {
  margin-top: 20px;
  color: red;
}
</style>
