<template>
  <div class="flex flex-center">
    <q-card class="q-pa-md" style="width: 400px">
      <q-card-section>
        <div class="text-h6">Restablecer Contraseña</div>
        <div class="text-subtitle2">
          Ingresa una nueva contraseña para tu cuenta.
        </div>
      </q-card-section>

      <q-card-section>
        <q-form @submit.prevent="handleReset">
          <q-input
            v-model="password"
            label="Nueva Contraseña"
            type="password"
            required
          />
          <div
            v-if="password.value && password.value.length < 6"
            class="text-red q-mt-sm"
          >
            La contraseña debe tener al menos 6 caracteres.
          </div>

          <div class="q-mt-md">
            <q-btn type="submit" label="Restablecer" color="primary" />
          </div>
        </q-form>

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
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { supabase } from "../supabaseClient";

const password = ref("");
const success = ref(false);
const error = ref("");
const accessToken = ref("");

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
  if (password.value.length < 6) {
    error.value = "La contraseña debe tener al menos 6 caracteres.";
    return;
  }

  if (!accessToken.value) {
    error.value = "Enlace inválido o expirado.";
    return;
  }

  try {
    const { error: supabaseError } = await supabase.auth.updateUser({
      password: password.value,
    });

    if (supabaseError) throw supabaseError;

    success.value = true;
    error.value = "";
  } catch (err) {
    error.value = err.message;
    success.value = false;
  }
};
</script>
