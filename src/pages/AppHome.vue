<template>
  <div class="home">
    <router-link to="/form-demo1">demo1 - form</router-link>
    <router-link to="/form-demo3">demo3 - function valid</router-link>
    <router-link to="/form-demo4">demo4 - async valid</router-link>
    <router-link to="/form-demo5">demo5 - form inline</router-link>
    <router-link to="/form-demo6">demo6 - deep data</router-link>
    <router-link to="/form-demo7">demo7 - add minus</router-link>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      msg: "💄You're visiting home page~"
    };
  },
  mounted() {
    // DELETE WHEN CODING
    console.log(`process.env.NODE_ENV="${process.env.NODE_ENV}"`);
  }
};
</script>

<style scoped>
h2 {
  margin: 0;
}
a {
  display: block;
  padding: 10px;
  font-size: 14px;
  width: 300px;
  text-align: left;
  margin: auto;
}
.home {
  padding: 15px 0;
  background-color: rgba(255, 153, 0, 0.3);
}
</style>
