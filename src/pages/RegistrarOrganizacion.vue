<template>
  <div class="registrar-organizacion">
    <q-card class="form-card">
      <q-card-section>
        <h1>Registrar Nueva Organización</h1>

        <q-form @submit.prevent="handleSubmit">
          <!-- Campos de la organización -->
          <div class="q-mb-md">
            <q-input
              v-model="nombre"
              label="Nombre de la Organización"
              outlined
              dense
              required
            />
          </div>

          <div class="q-mb-md">
            <q-input
              v-model="direccion"
              label="Dirección"
              outlined
              dense
              required
            />
          </div>

          <div class="q-mb-md">
            <q-input
              v-model="email_contacto"
              label="Email de Contacto"
              type="email"
              outlined
              dense
              required
            />
          </div>

          <div class="q-mb-md">
            <q-input
              v-model="numero_telefono"
              label="Número de Teléfono"
              type="text"
              outlined
              dense
            />
          </div>

          <div class="q-mb-md">
            <q-input
              v-model="sitio_web"
              label="Sitio Web"
              type="url"
              outlined
              dense
            />
          </div>

          <!-- Campos del administrador -->
          <h2 class="q-mt-lg q-mb-md">Datos del Administrador</h2>

          <div class="q-mb-md">
            <q-input
              v-model="admin_email"
              label="Email del Administrador"
              type="email"
              outlined
              dense
              required
            />
          </div>

          <div class="q-mb-md">
            <q-input
              v-model="admin_password"
              label="Contraseña del Administrador"
              type="password"
              outlined
              dense
              required
            />
          </div>

          <div class="flex justify-center q-mt-lg">
            <q-btn
              type="submit"
              :label="cargando ? 'Registrando...' : 'Registrar Organización'"
              color="primary"
              :disable="cargando"
              unelevated
              rounded
              class="btn-login"
            />
          </div>
        </q-form>

        <div v-if="error" class="error-message">
          <q-banner class="bg-negative text-white" dense>
            {{ error }}
          </q-banner>
        </div>

        <div v-if="mensajeExito" class="success-message">
          <q-banner class="bg-positive text-white" dense>
            {{ mensajeExito }}
          </q-banner>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useOrganizacionStore } from "../stores/organizacionStore";
import { useRouter } from "vue-router";

// Campos de la organización
const nombre = ref("");
const direccion = ref("");
const email_contacto = ref("");
const numero_telefono = ref("");
const sitio_web = ref("");

// Campos del administrador
const admin_email = ref("");
const admin_password = ref("");

// Estado del formulario
const organizacionStore = useOrganizacionStore();
const router = useRouter();
const error = ref(null);
const mensajeExito = ref(null);
const cargando = ref(false);

const handleSubmit = async () => {
  cargando.value = true;
  error.value = null;

  const datosOrganizacion = {
    nombre: nombre.value,
    direccion: direccion.value,
    email_contacto: email_contacto.value,
    numero_telefono: numero_telefono.value || null,
    sitio_web: sitio_web.value || null,
  };

  const datosAdmin = {
    email: admin_email.value,
    password: admin_password.value,
  };

  try {
    await organizacionStore.registrarOrganizacion(
      datosOrganizacion,
      datosAdmin
    );
    mensajeExito.value = "Organización registrada exitosamente.";
    router.push({ name: "dashboard" });
  } catch (err) {
    error.value =
      err.message || "Ocurrió un error al registrar la organización.";
  } finally {
    cargando.value = false;
  }
};
</script>

<style scoped>
/* Fondo que cubre toda la página */
body {
  margin: 0;
  overflow: hidden;
}

.registrar-organizacion {
  position: relative;
  min-height: 100vh;
  background: linear-gradient(135deg, #3f51b5, #2196f3);
  display: flex;
  justify-content: center;
  align-items: center;
}

.form-card {
  width: 100%;
  max-width: 600px;
  padding: 30px;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

h1 {
  font-size: 1.8rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
  color: #3f51b5;
}

h2 {
  font-size: 1.4rem;
  font-weight: bold;
  color: #3f51b5;
}

.q-input {
  width: 100%;
}

.q-btn {
  width: 100%;
  font-size: 1rem;
  padding: 0.75rem;
}

.error-message,
.success-message {
  margin-top: 20px;
}

.error-message .q-banner,
.success-message .q-banner {
  padding: 12px;
  border-radius: 8px;
}

.error-message {
  color: #f44336;
}

.success-message {
  color: #4caf50;
}
</style>
