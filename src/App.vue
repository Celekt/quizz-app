<script>
import {useRoute, useRouter} from "vue-router";
export default {
  data()
  {
    return {
      router: useRouter(),
      route: useRoute(),
    }
  }
,
}
</script>

<template>
  <div id="nav-wrap">
    <router-link to="/">Mes Quizz</router-link>
    <router-link to="/new-quizz/"><span style="color: greenyellow; font-weight: bolder">+</span> Nouveau Quizz</router-link>
  </div>

  <router-view :key="$route.path"></router-view>
</template>

<style scoped>
a {
  color: white;
  font-size: 25px;
  margin: 20px;
  text-decoration: none;
  font-weight: bold;
}
a:visited {
  text-decoration: none;
}
a:hover{
  background-color: rgba(0, 0, 0, 0.1);
}

#nav-wrap {
  background-color: #9c78d7;
  display: inline-flex;
  width: 100%;
}
</style>

<style>
* {
  /*box-sizing: border-box;*/
  font-family: 'Montserrat', sans-serif;
}

body {
  background-color: #271c36;
  color: #FFF;
  margin: 0;
}

.container {
  width: 50%;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 30px;
}
</style>
