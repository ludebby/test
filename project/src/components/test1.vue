
<template>
<div id="app">
  <p>{{ msg }}</p>
  <input v-model="message">
</div>
</template>
<script>
export default {
  el: '#app',
  data () {
    return {
      msg: 'Welcome to Your '
    }
  }
}
</script>
