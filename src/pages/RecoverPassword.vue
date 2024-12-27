<template>
  <div class="flex flex-center">
    <q-card class="q-pa-md" style="width: 500px">
      <q-card-section>
        <div class="text-h6 mb-2">Recuperar Contraseña</div>
        <div class="text-subtitle2 mb-4">
          Ingresa tu correo electrónico para restablecer tu contraseña.
        </div>
      </q-card-section>

      <q-card-section>
        <form @submit.prevent="handleRecover">
          <!-- Campo de Correo Electrónico con Icono -->
          <div class="mb-3">
            <label for="email" class="form-label fs-14 text-dark"
              >Correo Electrónico</label
            >
            <div class="input-group">
              <span class="input-group-text">
                <i class="ri-mail-line"></i>
              </span>
              <q-input
                id="email"
                v-model="email"
                type="email"
                placeholder="Ingresa tu correo electrónico"
                class="form-control"
                dense
                autofocus
                :rules="[
                  (val) => (val && val.length > 0) || 'Correo es requerido',
                  (val) => /.+@.+\..+/.test(val) || 'Correo inválido',
                ]"
                @keyup.enter="handleRecover"
              />
            </div>
            <div v-if="emailError" class="text-danger fs-13 mt-1">
              {{ emailError }}
            </div>
          </div>

          <!-- Botón de Envío -->
          <div class="mb-3">
            <button type="submit" class="btn btn-primary w-100">Enviar</button>
          </div>
        </form>

        <!-- Mensaje de Éxito -->
        <div v-if="success" class="q-mt-md">
          <q-banner class="bg-green text-white">
            Se ha enviado un correo para restablecer tu contraseña.
          </q-banner>
        </div>

        <!-- Mensaje de Error -->
        <div v-if="error" class="q-mt-md">
          <q-banner class="bg-red text-white">
            {{ error }}
          </q-banner>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>
<script setup>
import { ref } from "vue";
import { useQuasar } from "quasar";
import { supabase } from "../supabaseClient"; // Asegúrate de que la configuración de Supabase esté correcta

const email = ref("");
const success = ref(false);
const error = ref("");

const $q = useQuasar();

const handleRecover = async () => {
  try {
    const { error: supabaseError } = await supabase.auth.resetPasswordForEmail(
      email.value,
      {
        redirectTo: window.location.origin + "/reset-password", // La URL a la que el usuario será redirigido después de hacer clic en el enlace
      }
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
/* Agrega estilos personalizados si es necesario */
</style>
