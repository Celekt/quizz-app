<template>
  <div class="container">
    <h1>Liste des quizz</h1>

    <hr>

    <div id="quizzes">
      <div v-for="quizz in quizzes"
           class="quizz-wrap"
           @mousemove="hoverGo"
           @mouseleave="hoverEnd"
           @click="goToQuizz(quizz.id)">

        <h2>{{ quizz.title }}</h2>

        <div class="quizz-left-part">
          <h3 style="color: greenyellow">{{ "Nombre de questions : " + quizz.quizzItems.length }}</h3>
          <button class="edit-quizz" type="button"
                  @click.stop="editQuizz(quizz.id)"
                  @mouseover="hoverText = 'EDIT!'"
                  @mouseout="hoverText = 'GO!'">
            <img class="edit-quizz-img" src="../assets/edit_white.svg">
          </button>
        </div>
      </div>

      <div class="quizz-wrap new-quizz" @mousemove="hoverGo" @mouseleave="hoverEnd" @click="newQuizz">
        <h2 style="color: greenyellow">Nouveau quizz</h2>
        <img src="../assets/add_circle.svg">
      </div>
    </div>
  </div>

  <div id="cursor-go">
    <h3>{{ hoverText }}</h3>
  </div>
</template>

<script>
import {useRouter} from "vue-router";

export default {
  name: "Home",
  data() {
    return {
      router: useRouter(),
      hoverText: "GO!"
    }
  },
  methods: {
    hoverGo(event) {
      const cursor = document.getElementById("cursor-go");
      cursor.style.top = event.pageY.toString()+"px";
      cursor.style.left = event.pageX.toString()+"px";
      cursor.style.display = "block";
    },
    hoverEnd() {
      document.getElementById("cursor-go").style.display = "none";
    },
    newQuizz() {
      this.router.push('/new-quizz/')
    },
    editQuizz(id) {
      this.router.push('/quizz-editor/' + id)
    },
    goToQuizz(id) {
      this.router.push('/quizz-game/' + id)
    },
  },
  computed: {
    quizzes() {
      return JSON.parse(localStorage.getItem("quizzes"));
    }
  },
}
</script>

<style scoped>
@keyframes zoom-in-zoom-out {
  0% {
    transform: scale(1, 1);
  }
  50% {
    transform: scale(1.25, 1.25) translate(10%, 30%);
  }
  100% {
    transform: scale(1, 1);
  }
}

.quizz-wrap {
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  background-color: #382a4b;
  margin-top: 20px;
  padding: 10px 40px;
  border-radius: 10px;
  box-sizing: border-box;
  width: 100%;
}

.quizz-wrap:hover {
  background-color: #5a4277;
  cursor: pointer;
}

.new-quizz {
  border: 4px solid rgb(90, 66, 119);
}

#cursor-go {
  display: none;
  position: absolute;
  height: 25px;
  pointer-events: none;

  animation: zoom-in-zoom-out 1s ease infinite;
}

#cursor-go h3{
  position: relative;
  bottom: 100%;
  margin: 0;
  transform: translate(-50%,-10px);
}

.quizz-left-part {
  display: inline-flex;
  align-items: center;
}

.edit-quizz {
  background-color: #6a509b;
  border: 2px solid white;
  border-radius: 10px;
  /*padding: 5px;*/
  margin-left: 20px;
  width: 40px;
  height: 40px;
  transition: background-color 0.3s;
}

.edit-quizz:hover {
  border: 2px solid #c6a6ff;
  background-color: #c6a6ff;
}

.edit-quizz-img {
  width: 30px;
  height: 30px;
}
</style>