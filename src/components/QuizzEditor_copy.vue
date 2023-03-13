<template>
  <div class="container">
    <h1>Rédigez votre quizz</h1>
    <hr>
    <div class="input-append">
      <span class="input-append-wrap">
        <img class="input-icon" src="../assets/edit.svg">
      </span>
      <input id="quizz-title" type="text" v-model="title" @change="updateTitle">
    </div>

    <div id="quizz-wrap">
      <template v-if="!quizzItems">
        <QuizzItem v-for="item in quizzItems"
                   @updateItemEvent="updateItemHandler"
                   @sendSolutionEvent="sendSolutionHandler"
                   :quizz-part="{id: 0}"
                   :quizz-id="id"/>
      </template>
      <template v-else>
        <QuizzItem @updateItemEvent="updateItemHandler"
                   @sendSolutionEvent="sendSolutionHandler"
                   v-for="(item) in quizzItems"
                   :key="item.id"
                   :quizz-part="item"
                   :quizz-id="id"/>
      </template>
    </div>
  </div>
</template>

<script>
import {useRoute} from "vue-router";
import QuizzItem from "./QuizzItem.vue";
import {nextTick} from "vue";

export default {
  name: "QuizzEditor",
  components: {QuizzItem},
  data() {
    return {
      route: useRoute(),
      id: 0,
      title: "",
      quizzItems: [],
    }
  },
  methods: {
    initialize() {
      this.id = this.route.params.id;
      const data = JSON.parse(localStorage.getItem("quizzes"));

      let content = data.find(elem => elem.id == this.id);

      if (content) {
        this.title = content.title;
        if (content.quizzItems) {
          this.quizzItems = content.quizzItems;
        }
      }
    },
    updateTitle(event) {
      if (event.target.value === "") {
        this.title = "Saisissez le titre du quizz";
      }
      this.updateItemHandler();
    },
    updateItemHandler(updated = null) {
      //ATTENTION : ID ne coincide pas avec INDEX des array
      if(updated) {
        let updatedIndex = this.quizzItems.findIndex(elem => elem.id == updated.id)
        if(updatedIndex === -1)
          this.quizzItems.push(updated)
        else
          this.quizzItems[updatedIndex] = updated;
      }

      let loadedQuizzes = JSON.parse(localStorage.getItem("quizzes"));
      let currentQuizz = {
        id: this.id,
        title: this.title,
        quizzItems: this.quizzItems
      }
      let quizzIndex = loadedQuizzes.findIndex(elem => elem.id == this.id)
      if (quizzIndex === -1) {
        loadedQuizzes.push(currentQuizz);
      } else {
        loadedQuizzes[quizzIndex] = currentQuizz;
      }

      localStorage.setItem("quizzes", JSON.stringify(loadedQuizzes));
    },

    sendSolutionHandler(id, solution) {
      let loaded = JSON.parse(localStorage.getItem("solution-" + this.id));
      loaded = {...loaded, ...{[id]: solution}}
      localStorage.setItem("solution-" + this.id, JSON.stringify(loaded));
    },
  },
  mounted() {
    this.initialize();
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.initialize();
    })
  },
  beforeRouteLeave() {
    //insérer ici du code pour empecher de quitter la page
  }

}
</script>

<style scoped>

h1 {
  font-size: 40px;
}

#quizz-title {
  position: relative;
  flex-grow: 1;
  border: none;
  background-color: transparent;
  font-size: 35px;
  padding-left: 50px;
  border-radius: 10px;
  color: #8F8F8F;
}

#quizz-title:focus {
  outline: 2px groove rgba(150, 150, 150, 0.4);
  background-color: rgba(100, 100, 100, 0.25);
  color: white;
}

.input-append {
  position: relative;
  margin-top: 20px;
  display: flex;
}

.input-append-wrap {
  position: absolute;
  left: 0px;
  top: 0px;
  height: 100%;
  max-width: 45px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  box-sizing: border-box;
}

.input-append img {
  height: 100%;
  width: auto;
  padding: 5px;
  box-sizing: border-box;
}

#quizz-wrap {
  /*background-color: #382a4b;*/
  /*margin-top: 20px;*/
  /*padding: 10px;*/
  /*border-radius: 10px;*/
}
</style>