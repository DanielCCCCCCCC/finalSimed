<template>
  <div class="page main-signin-wrapper">
    <!-- Icono de Configuración en el Encabezado -->
    <div
      class="d-flex header-setting-icon"
      data-bs-toggle="offcanvas"
      data-bs-target="#switcher-canvas"
    >
      <a class="nav-link icon" href="javascript:;">
        <i class="fe text-dark"></i>
      </a>
    </div>

    <!-- Row Principal -->
    <div class="row signpages text-center">
      <div class="col-md-12 my-auto">
        <div class="card">
          <div class="row row-sm">
            <!-- Columna Izquierda (Detalles) -->
            <div
              class="col-lg-6 col-xl-5 d-none d-lg-block text-center bg-primary details"
            >
              <div class="mt-5 pt-4 p-2 position-absolute">
                <router-link :to="{ name: 'dashboard' }">
                  <img
                    src="../assets/icons/asistencia-medica (1).png"
                    class="header-brand-img mb-4 tamano"
                    alt="logo"
                  />
                </router-link>
                <h5 class="mt-4 text-fixed-white">Inicia Sesión tu cuenta</h5>
                <span class="fs-white-6 fs-13 mb-5 mt-xl-0">
                  Inicia Sesión para adminisitrar tu centro médico.
                </span>
              </div>
            </div>

            <!-- Columna Derecha (Formulario de Login) -->
            <div class="col-lg-6 col-xl-7 col-xs-12 col-sm-12 login_form">
              <div class="main-container container-fluid">
                <div class="row row-sm">
                  <div class="card-body mt-2 mb-2">
                    <q-form @submit.prevent="handleLogin">
                      <h5 class="text-start mb-2">Inicia Sesión</h5>
                      <p class="mb-4 text-muted fs-13 ms-0 text-start">
                        Inicia sesión para adminisitrar tu centro médico.
                      </p>
                      <!-- Email Input -->
                      <div class="form-group text-start">
                        <label for="email">Email</label>
                        <div class="input-group">
                          <span class="input-group-text">
                            <i class="ri-mail-line"></i>
                          </span>
                          <input
                            id="email"
                            v-model="email"
                            type="email"
                            placeholder="Enter your email"
                            class="form-control"
                            :class="{ 'is-invalid': !!error }"
                            required
                          />
                        </div>
                        <div v-if="!!error" class="invalid-feedback">
                          Correo inválido
                        </div>
                      </div>

                      <!-- Password Input -->
                      <div class="form-group text-start">
                        <label for="password">Password</label>
                        <div class="input-group">
                          <span class="input-group-text">
                            <i class="ri-lock-line"></i>
                          </span>
                          <input
                            id="password"
                            v-model="password"
                            :type="showPassword ? 'text' : 'password'"
                            placeholder="Enter your password"
                            class="form-control"
                            :class="{ 'is-invalid': !!error }"
                            required
                          />
                          <button
                            type="button"
                            class="btn btn-outline-secondary"
                            @click="togglePasswordVisibility"
                          >
                            <i
                              :class="
                                showPassword ? 'ri-eye-off-line' : 'ri-eye-line'
                              "
                            ></i>
                          </button>
                        </div>
                        <div v-if="!!error" class="invalid-feedback">
                          Contraseña inválida
                        </div>
                      </div>

                      <!-- Submit Button -->
                      <div class="flex justify-center q-mt-lg">
                        <button
                          type="submit"
                          class="btn ripple btn-primary d-grid"
                          :disabled="cargando"
                        >
                          {{ cargando ? "Iniciando..." : "Iniciar Sesión" }}
                        </button>
                      </div>
                    </q-form>

                    <!-- Links and Messages -->
                    <div class="text-start mt-5 ms-0">
                      <div>
                        He olvidado la contraseña,
                        <router-link :to="{ name: 'RecoverPassword' }"
                          >has clic aqui!!</router-link
                        >
                      </div>
                      <div>
                        No tienes una cuenta?
                        <router-link :to="{ name: 'registrarOrganizacion' }"
                          >Registrate aqui</router-link
                        >
                      </div>
                    </div>
                    <div v-if="error" class="error-message">
                      <div class="alert alert-danger">{{ error }}</div>
                    </div>
                    <div v-if="mensajeExito" class="success-message">
                      <div class="alert alert-success">{{ mensajeExito }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- Fin de row-sm -->
        </div>
        <!-- Fin de card -->
      </div>
      <!-- Fin de col-md-12 -->
    </div>
    <!-- Fin de row signpages -->
  </div>
  <!-- Fin de main-signin-wrapper -->
</template>

<script setup>
import { ref } from "vue";
import { useAuthStore } from "../stores/auth";
import { useRouter } from "vue-router";
import { Notify } from "quasar";

const email = ref("");
const password = ref("");
const showPassword = ref(false); // Estado para alternar visibilidad
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

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};
</script>

<style scoped>
input {
  height: 50px;
  padding: 10px;
  font-size: 1rem;
}

.tamano {
  width: 50%;
  height: 50%;
}
</style>
