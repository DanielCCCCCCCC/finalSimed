<template>
  <div class="login-organizaciones">
    <q-card class="form-card">
      <q-card-section>
        <h1>Login de Organizaciones</h1>

        <q-form @submit.prevent="handleLogin">
          <div class="q-mb-lg">
            <q-input
              v-model="email"
              label="Correo Electrónico"
              type="email"
              outlined
              dense
              required
              :class="{ 'input-error': error }"
            />
          </div>

          <div class="q-mb-lg">
            <q-input
              v-model="password"
              label="Contraseña"
              type="password"
              outlined
              dense
              required
              :class="{ 'input-error': error }"
            />
          </div>

          <div class="flex justify-center q-mt-lg">
            <q-btn
              type="submit"
              :label="cargando ? 'Iniciando...' : 'Iniciar Sesión'"
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
import { useAuthStore } from "../stores/auth";
import { useRouter } from "vue-router";
import { Notify } from "quasar";

const email = ref("");
const password = ref("");

const cargando = ref(false);
const error = ref(null);
const mensajeExito = ref(null);

const authStore = useAuthStore();
const router = useRouter();

const handleLogin = async () => {
  error.value = null;
  mensajeExito.value = null;
  cargando.value = true;

  if (!validarCampos()) {
    cargando.value = false;
    return;
  }

  try {
    await authStore.signIn(email.value, password.value);
    Notify.create({
      message: "Inicio de sesión exitoso",
      color: "positive",
      position: "top-right",
    });
    router.push({ name: "dashboard" });
  } catch (err) {
    error.value = err.message || "Error al iniciar sesión.";
    Notify.create({
      message: "Credenciales inválidas",
      color: "negative",
      position: "top-right",
    });
  } finally {
    cargando.value = false;
  }
};

const validarCampos = () => {
  if (!email.value.trim()) {
    error.value = "El email es obligatorio.";
    return false;
  }

  if (!password.value.trim()) {
    error.value = "La contraseña es obligatoria.";
    return false;
  }

  return true;
};
</script>
<style scoped>
/* Fondo que cubre toda la página */
body {
  margin: 0; /* Elimina márgenes del body */
  overflow: hidden; /* Evita barras de desplazamiento */
}

.login-organizaciones {
  position: relative;
  min-height: 100vh; /* Asegura que el contenedor abarque toda la pantalla */
  background: linear-gradient(
    135deg,
    #3f51b5,
    #2196f3
  ); /* Fondo en toda la página */
  display: flex;
  justify-content: center;
  align-items: center;
}

.form-card {
  top: -50px;
  width: 100%;
  max-width: 500px; /* Ancho máximo de la tarjeta */
  padding: 30px;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

h1 {
  font-size: 1.8rem;
  padding: -50px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
  color: #3f51b5;
}

.q-input {
  width: 100%;
}

.q-input input {
  font-size: 0.9rem;
  color: #333;
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
