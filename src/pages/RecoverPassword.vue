<!-- src/pages/RecoverPassword.vue -->
<template>
  <div class="flex flex-center">
    <q-card class="q-pa-md" style="width: 400px">
      <q-card-section>
        <div class="text-h6">Recuperar Contraseña</div>
        <div class="text-subtitle2">
          Ingresa tu correo electrónico para restablecer tu contraseña.
        </div>
      </q-card-section>

      <q-card-section>
        <q-form @submit.prevent="handleRecover">
          <q-input
            v-model="email"
            label="Correo Electrónico"
            type="email"
            required
            :rules="[
              (val) => (val && val.length > 0) || 'Correo es requerido',
              (val) => /.+@.+\..+/.test(val) || 'Correo inválido',
            ]"
          />

          <div class="q-mt-md">
            <q-btn type="submit" label="Enviar" color="primary" />
          </div>
        </q-form>

        <div v-if="success" class="q-mt-md">
          <q-banner class="bg-green text-white">
            Se ha enviado un correo para restablecer tu contraseña.
          </q-banner>
        </div>

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
