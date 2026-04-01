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
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  height: 100%;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
}

#app {
  height: 100%;
}
</style>
