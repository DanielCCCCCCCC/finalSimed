<template>
  <div class="page main-signin-wrapper">
    <!-- Row Principal -->
    <div class="row signpages text-center">
      <div class="col-md-12 my-auto">
        <div class="card bg-primary">
          <div class="row row-sm">
            <!-- Columna de Detalles (Solo para pantallas grandes) -->
            <div
              class="col-lg-6 col-xl-5 d-none d-lg-block text-center bg-primary details"
            >
              <div class="mt-3 pt-3 p-2 position-absolute">
                <router-link :to="`${url}login`">
                  <img
                    src="../assets/icons/recoverPassIcon.png"
                    class="header-brand-img mb-4"
                    alt="logo"
                  />
                </router-link>
                <div class="clearfix"></div>
                <img
                  src="../assets/icons/Imagen2.png"
                  class="ht-100 mb-0"
                  alt="user"
                />
                <h5 class="mt-4 text-fixed-white">Restablece tu contraseña</h5>
                <span class="fs-white-6 fs-13 mb-5 mt-xl-0">
                  Signup to create, discover and connect with the global
                  community
                </span>
              </div>
            </div>

            <!-- Columna del Formulario -->
            <div class="col-lg-6 col-xl-7 col-xs-12 col-sm-12 login_form">
              <div class="main-container container-fluid">
                <div class="row row-sm justify-content-center">
                  <div class="col-md-10 col-lg-8">
                    <div class="card-body mt-2 mb-2">
                      <div class="clearfix"></div>
                      <h5 class="text-start mb-2">Restablecer Contraseña</h5>
                      <p class="mb-4 text-muted fs-13 ms-0 text-start">
                        Ingresa una nueva contraseña para tu cuenta.
                      </p>

                      <!-- Formulario de Restablecimiento de Contraseña -->
                      <form @submit.prevent="handleReset">
                        <div class="form-group text-start mb-3">
                          <label
                            for="password"
                            class="form-label fs-14 text-dark"
                            >Nueva Contraseña</label
                          >
                          <div class="input-group">
                            <span class="input-group-text">
                              <i class="ri-lock-line"></i>
                            </span>
                            <input
                              id="password"
                              v-model="password"
                              type="password"
                              placeholder="Ingresa tu nueva contraseña"
                              class="form-control"
                              autofocus
                              @keyup.enter="handleReset"
                              @blur="validatePassword"
                              required
                            />
                          </div>
                          <div
                            v-if="passwordError"
                            class="text-danger fs-13 mt-1"
                          ></div>
                          {{ passwordError }}
                          <div
                            v-if="passwordError"
                            class="text-danger fs-13 mt-1"
                          >
                            {{ passwordError }}
                          </div>
                        </div>

                        <div class="form-group text-start mb-3">
                          <button type="submit" class="btn btn-primary w-100">
                            Restablecer
                          </button>
                        </div>
                      </form>

                      <!-- Mensajes de Éxito y Error -->
                      <div v-if="success" class="q-mt-md">
                        <q-banner class="bg-green text-white">
                          Tu contraseña ha sido restablecida exitosamente.
                        </q-banner>
                      </div>

                      <div v-if="error" class="q-mt-md">
                        <q-banner class="bg-red text-white">
                          {{ error }}
                        </q-banner>
                      </div>

                      <!-- Footer del Formulario -->
                      <div
                        class="card-footer border-top-0 ps-0 mt-3 text-start"
                      >
                        <p>¿Ya recordaste tu contraseña?</p>
                        <p class="mb-0">
                          Intenta
                          <router-link :to="`${url}login`"
                            >Iniciar Sesión</router-link
                          >
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- Fin de main-container -->
            </div>
            <!-- Fin de login_form -->
          </div>
          <!-- Fin de row-sm -->
        </div>
        <!-- Fin de card -->
      </div>
      <!-- Fin de col-md-12 -->
    </div>
    <!-- Fin de row signpages -->
  </div>
  <!-- Fin de page main-signin-wrapper -->
</template>

<script setup>
import { ref, onMounted } from "vue";
import { supabase } from "../supabaseClient";

const password = ref("");
const success = ref(false);
const error = ref("");
const passwordError = ref(""); // Para manejar errores de validación
const accessToken = ref("");

const url = import.meta.env.BASE_URL; // Asegurarse de definir 'url'

onMounted(() => {
  const urlParams = new URLSearchParams(window.location.search);
  accessToken.value = urlParams.get("access_token");

  // Si no está en la cadena de consulta, buscar en el fragmento de hash
  if (!accessToken.value) {
    const hashParams = new URLSearchParams(window.location.hash.substring(1)); // Eliminar el '#'
    accessToken.value = hashParams.get("access_token");
  }

  console.log("Access Token Capturado:", accessToken.value);

  if (!accessToken.value) {
    error.value = "Enlace inválido o expirado.";
  }
});

const handleReset = async () => {
  // Resetear mensajes de error
  passwordError.value = "";
  error.value = "";
  success.value = false;

  // Validaciones
  if (!password.value) {
    passwordError.value = "La contraseña es requerida.";
    return;
  }
  if (password.value.length < 8) {
    passwordError.value = "La contraseña debe tener al menos 8 caracteres.";
    return;
  }

  if (!accessToken.value) {
    error.value = "Enlace inválido o expirado.";
    return;
  }

  try {
    const { data, error: supabaseError } = await supabase.auth.updateUser(
      { password: password.value },
      { access_token: accessToken.value }
    );

    if (supabaseError) throw supabaseError;

    success.value = true;
    error.value = "";
  } catch (err) {
    error.value = err.message;
    success.value = false;
  }
};
</script>

<style scoped>
/* Estilos Personalizados */

.page.main-signin-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8f9fa; /* Fondo claro */
}

.card {
  border: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* .bg-primary {
  background-color: #007bff !important;
} */

.text-fixed-white {
  color: #ffffff !important;
}

.details {
  position: relative;
  height: 100%;
}

.login_form {
  padding: 30px;
}

.header-brand-img {
  width: 150px;
}

.ht-100 {
  height: 100px;
}

/* .btn-primary {
  background-color: #007bff;
  border-color: #007bff;
} */

/* .btn-primary:hover {
  background-color: #0056b3;
  border-color: #0056b3;
} */

.text-start {
  text-align: left;
}

.input-group-text {
  background-color: #e9ecef;
  border: 1px solid #ced4da;
}

.form-control {
  border-left: none;
}

.q-banner {
  padding: 10px;
  border-radius: 4px;
}

.bg-green {
  background-color: #28a745 !important;
}

.bg-red {
  background-color: #dc3545 !important;
}

.text-danger {
  color: #dc3545 !important;
}
</style>
