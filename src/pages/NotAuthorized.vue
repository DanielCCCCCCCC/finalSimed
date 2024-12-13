<template>
  <div class="not-authorized">
    <h1>No Autorizado</h1>
    <p>No tienes permisos para acceder a esta página.</p>
  </div>
</template>

<script setup></script>

<style scoped>
.not-authorized {
  text-align: center;
  margin-top: 50px;
  color: #ff4d4f;
}

.not-authorized h1 {
  font-size: 2rem;
  font-weight: bold;
}

.not-authorized p {
  font-size: 1.2rem;
  margin-top: 10px;
}
</style>
