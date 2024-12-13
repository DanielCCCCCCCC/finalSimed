<!-- src/pages/AdminPanel.vue -->
<template>
  <h1>Hola mundo admin</h1>
</template>

<script setup>
// import { ref, onMounted } from "vue";
// import { useQuasar, Notify } from "quasar";
// import { DxDataGrid, DxColumn, DxButton } from "devextreme-vue/data-grid";
// import { supabase } from "../supabaseClient"; // Asegúrate de ajustar la ruta si es necesario
// import { useAuthStore } from "../stores/auth";

// // Inicializar Quasar
// const $q = useQuasar();

// // Acceder al store de autenticación
// const authStore = useAuthStore();

// // Estado para almacenar la lista de usuarios
// const users = ref([]);

// // Función para cargar la lista de usuarios desde Supabase
// const loadUsers = async () => {
//   try {
//     const { data, error } = await supabase
//       .from("users")
//       .select("id, email, tenantId, role");

//     if (error) {
//       throw error;
//     }

//     users.value = data;
//   } catch (error) {
//     console.error("Error al cargar usuarios:", error.message);
//     Notify.create({
//       type: "negative",
//       message: `Error al cargar usuarios: ${error.message}`,
//       position: "top-right",
//     });
//   }
// };

// // Función para cerrar sesión
// const signOut = async () => {
//   try {
//     await authStore.signOut();
//     Notify.create({
//       type: "positive",
//       message: "Sesión cerrada exitosamente",
//       position: "top-right",
//     });
//   } catch (error) {
//     console.error("Error al cerrar sesión:", error.message);
//     Notify.create({
//       type: "negative",
//       message: `Error al cerrar sesión: ${error.message}`,
//       position: "top-right",
//     });
//   }
// };

// // Función para agregar un nuevo usuario (placeholder)
// const addUser = () => {
//   // Aquí puedes abrir un diálogo/modal para agregar un usuario
//   Notify.create({
//     type: "info",
//     message: "Funcionalidad de agregar usuario no implementada aún.",
//     position: "top-right",
//   });
// };

// // Función para editar un usuario (placeholder)
// const editUser = (e) => {
//   const user = e.row.data;
//   // Aquí puedes abrir un diálogo/modal para editar el usuario
//   Notify.create({
//     type: "info",
//     message: `Funcionalidad de editar usuario (ID: ${user.id}) no implementada aún.`,
//     position: "top-right",
//   });
// };

// // Función para eliminar un usuario
// const deleteUser = async (e) => {
//   const user = e.row.data;
//   if (confirm(`¿Estás seguro de eliminar al usuario con ID: ${user.id}?`)) {
//     try {
//       const { error } = await supabase.from("users").delete().eq("id", user.id);

//       if (error) {
//         throw error;
//       }

//       // Actualizar la lista de usuarios después de eliminar
//       loadUsers();

//       Notify.create({
//         type: "positive",
//         message: "Usuario eliminado exitosamente",
//         position: "top-right",
//       });
//     } catch (error) {
//       console.error("Error al eliminar usuario:", error.message);
//       Notify.create({
//         type: "negative",
//         message: `Error al eliminar usuario: ${error.message}`,
//         position: "top-right",
//       });
//     }
//   }
// };

// // Cargar los usuarios al montar el componente
// onMounted(() => {
//   loadUsers();
// });
</script>

<style scoped>
/* Estilos personalizados para el AdminPanel */

.q-page {
  min-height: 100vh;
}

.q-header {
  position: sticky;
  top: 0;
  z-index: 10;
}

.q-card {
  /* Puedes ajustar el ancho y otros estilos según tus necesidades */
}

.dx-datagrid {
  /* Asegúrate de que el DataGrid ocupe el espacio disponible */
  height: 400px;
}

.dx-button {
  /* Estilos personalizados para los botones del DataGrid */
}
</style>
