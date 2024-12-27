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
const tenantId = ref(authStore.tenant_id); // Asegúrate de que 'tenant_id' está disponible

// Estado para el código QR
const qrCodeUrl = ref("");
const loading = ref(true);
const errorMsg = ref("");

// Estado para la copia del URL
const copySuccess = ref(false);

// Definir la base URL
const baseUrl = "http://localhost:9000/schedule/"; // Cambia esto en producción

// Computar la URL completa
const fullUrl = ref(`${baseUrl}${tenantId.value}`);

// Función para generar el código QR
const generateQRCode = async () => {
  try {
    const fullUrlString = `${baseUrl}${tenantId.value}`;
    fullUrl.value = fullUrlString;
    console.log("Generando QR para:", fullUrlString);

    // Generar el código QR como Data URL
    qrCodeUrl.value = await QRCode.toDataURL(fullUrlString, {
      width: 300, // Tamaño del QR
      margin: 2, // Margen
      color: {
        dark: "#000000", // Color de los módulos
        // light: "#df5a5a",
        light: "ffffff",
      },
    });
    console.log("QR generado:", qrCodeUrl.value);
  } catch (err) {
    console.error("Error al generar el código QR:", err);
    errorMsg.value = "No se pudo generar el código QR. Inténtalo de nuevo.";
  } finally {
    loading.value = false;
  }
};

// Función para copiar el URL al portapapeles
const copyToClipboard = async () => {
  if (!navigator.clipboard) {
    // Fallback para navegadores que no soportan la Clipboard API
    const textArea = document.createElement("textarea");
    textArea.value = fullUrl.value;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand("copy");
      copySuccess.value = true;
      console.log("URL copiado:", fullUrl.value);

      // Ocultar el mensaje de éxito después de 3 segundos
      setTimeout(() => {
        copySuccess.value = false;
      }, 3000);
    } catch (err) {
      console.error("Error al copiar el URL:", err);
      errorMsg.value = "No se pudo copiar el URL. Inténtalo de nuevo.";
    }
    document.body.removeChild(textArea);
    return;
  }

  // Usar la Clipboard API si está disponible
  try {
    await navigator.clipboard.writeText(fullUrl.value);
    copySuccess.value = true;
    console.log("URL copiado:", fullUrl.value);

    // Ocultar el mensaje de éxito después de 3 segundos
    setTimeout(() => {
      copySuccess.value = false;
    }, 3000);
  } catch (err) {
    console.error("Error al copiar el URL:", err);
    errorMsg.value = "No se pudo copiar el URL. Inténtalo de nuevo.";
  }
};

// Función para descargar el código QR
const downloadQRCode = () => {
  if (!qrCodeUrl.value) {
    errorMsg.value = "No hay código QR para descargar.";
    return;
  }

  // Crear un elemento de enlace temporal
  const link = document.createElement("a");
  link.href = qrCodeUrl.value;
  link.download = `codigo_qr_${tenantId.value}.png`; // Nombre del archivo descargado
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Ejecutar la generación del QR al montar el componente
onMounted(() => {
  generateQRCode();
});

// Vigilar cambios en tenant_id y regenerar el QR si cambia
watch(
  () => authStore.tenant_id,
  (newTenantId) => {
    tenantId.value = newTenantId;
    fullUrl.value = `${baseUrl}${tenantId.value}`;
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
