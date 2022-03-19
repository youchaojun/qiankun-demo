<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <HelloWorld msg="Welcome to Your Vue.js + TypeScript App" />
    <div className="test">样式隔离测试, 主应用是绿色，子应用使用红色</div>
  </div>
</template>

<script lang="ts">
import HelloWorld from "@/components/HelloWorld.vue";
import { defineComponent } from "vue";
export default defineComponent({
  components: {
    HelloWorld,
  },
});
</script>
<style>
.test {
  color: rgb(16, 33, 190);
}
</style>
