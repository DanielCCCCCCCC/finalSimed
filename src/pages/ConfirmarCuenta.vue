<template>
  <div class="page main-signin-wrapper">
    <div class="row signpages text-center">
      <div class="col-md-12 my-auto">
        <div class="card bg-primary">
          <div class="row row-sm">
            <!-- Columna Izquierda (opcional) -->
            <div
              class="col-lg-6 col-xl-5 d-none d-lg-block text-center bg-primary details"
            >
              <div class="mt-3 pt-3 p-2 position-absolute">
                <!-- Tu logo o imagen -->
                <img
                  src="../assets/icons/recoverPassIcon.png"
                  class="header-brand-img mb-4"
                  alt="logo"
                />
                <div class="clearfix"></div>
                <img
                  src="../assets/icons/Imagen2.png"
                  class="ht-100 mb-0"
                  alt="user"
                />
                <h5 class="mt-4 text-fixed-white">Confirma tu Cuenta</h5>
                <span class="fs-white-6 fs-13 mb-5 mt-xl-0">
                  ¡Bienvenido! Solo falta establecer tu contraseña.
                </span>
              </div>
            </div>

            <!-- Columna Derecha: Formulario -->
            <div class="col-lg-6 col-xl-7 col-xs-12 col-sm-12 login_form">
              <div class="main-container container-fluid">
                <div class="row row-sm justify-content-center">
                  <div class="col-md-10 col-lg-8">
                    <div class="card-body mt-2 mb-2">
                      <div class="clearfix"></div>
                      <h5 class="text-start mb-2">Establecer Contraseña</h5>
                      <p class="mb-4 text-muted fs-13 ms-0 text-start">
                        Por favor, elige una contraseña para tu nueva cuenta.
                      </p>

                      <!-- Formulario para Establecer Contraseña -->
                      <form @submit.prevent="handleConfirm">
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
                              placeholder="Ingresa tu contraseña"
                              class="form-control"
                              autofocus
                              @keyup.enter="handleConfirm"
                              @blur="validatePassword"
                              required
                            />
                          </div>
                          <div
                            v-if="passwordError"
                            class="text-danger fs-13 mt-1"
                          >
                            {{ passwordError }}
                          </div>
                        </div>

                        <div class="form-group text-start mb-3">
                          <button type="submit" class="btn btn-primary w-100">
                            Confirmar
                          </button>
                        </div>
                      </form>

                      <!-- Mensaje de Éxito -->
                      <div v-if="success" class="q-mt-md">
                        <q-banner class="bg-green text-white">
                          Tu contraseña ha sido establecida exitosamente.
                        </q-banner>
                        <p class="mt-3">
                          Ya puedes
                          <router-link :to="`${url}login`"
                            >Iniciar Sesión</router-link
                          >.
                        </p>
                      </div>

                      <!-- Mensaje de Error -->
                      <div v-if="errorMsg" class="q-mt-md">
                        <q-banner class="bg-red text-white">
                          {{ errorMsg }}
                        </q-banner>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- Fin main-container -->
            </div>
            <!-- Fin login_form -->
          </div>
          <!-- Fin row-sm -->
        </div>
        <!-- Fin card -->
      </div>
      <!-- Fin col-md-12 -->
    </div>
    <!-- Fin row signpages -->
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { supabase } from "../supabaseClient"; // Ajusta la ruta a tu init
// Si usas Quasar, devtools, etc. agrégalos

const password = ref("");
const success = ref(false);
const errorMsg = ref("");
const passwordError = ref("");
const accessToken = ref("");

// RUTA BASE para redirecciones (p.ej. /login)
const url = import.meta.env.BASE_URL || "/";

onMounted(() => {
  // 1. Recuperar el access_token de la URL
  const urlParams = new URLSearchParams(window.location.search);
  accessToken.value = urlParams.get("access_token");

  if (!accessToken.value) {
    // Si no está en query, mirar en el fragmento (#)
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    accessToken.value = hashParams.get("access_token");
  }

  if (!accessToken.value) {
    errorMsg.value = "Enlace inválido o expirado.";
    return;
  }

  console.log("Access Token Capturado:", accessToken.value);
});

const validatePassword = () => {
  passwordError.value = "";
  if (!password.value) {
    passwordError.value = "La contraseña es requerida.";
  } else if (password.value.length < 8) {
    passwordError.value = "La contraseña debe tener al menos 8 caracteres.";
  }
};

const handleConfirm = async () => {
  // Limpiar mensajes previos
  errorMsg.value = "";
  success.value = false;
  validatePassword();

  if (passwordError.value) return;

  if (!accessToken.value) {
    errorMsg.value = "Token inválido o expirado.";
    return;
  }

  try {
    // Llamada a supabase.auth.updateUser para fijar la contraseña
    // Nota: pasamos { access_token } en el 2do arg si no hay sesión actual
    const { data, error: supabaseError } = await supabase.auth.updateUser(
      { password: password.value },
      { access_token: accessToken.value }
    );

    if (supabaseError) throw supabaseError;

    success.value = true;
  } catch (err) {
    errorMsg.value = err.message;
  }
};
</script>

<style scoped>
.page.main-signin-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8f9fa;
}

.card {
  border: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

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
