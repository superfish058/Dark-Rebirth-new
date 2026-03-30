<template>
  <div id="app">
    <router-view />
    <Notification />
  </div>
</template>

<script setup>
import Notification from './components/Notification.vue'
</script>

<style>
#app {
  min-height: 100vh;
}
</style>
