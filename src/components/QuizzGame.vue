<template>
  <div class="container">
    <h1>{{ title }}</h1>

    <div id="item-wrap">
      <h2 id="item-question">{{ quizzItems[index].question }}</h2>

<!--         ///   V-FOR   ///  -->
      <div class="answers-wrap">
        <button v-for="(answer,key) in quizzItems[index].answers" :key="key" :value="key"
                :disabled="successState !== 'question'"
                :class="{failed: (selected === key) && successState === 'failed',
                         success: (selected === key) && successState === 'success'}"
                class="answer-button" type="button" @click="chooseAnswer">
          {{ answer }}
        </button>
      </div>
<!--         ////////////////   -->

      <div class="item-footer">
        <button class="next-button" :disabled="successState === 'question'"
                type="button" @click="nextQuestion">{{ nextButton }}</button>
        <span class="answer-text" :class="{failed: successState === 'failed'}">{{ answerText }}</span>
      </div>
    </div>

    <div id="finished">
      <h2>Quizz terminé !</h2>
      <h3>{{ "Avec un score de " + this.score + "/" + this.quizzItems.length }}</h3>
      <button class="next-button" type="button" @click="router.push('/')">Retourner à la liste</button>
    </div>
  </div>
</template>

<script>
import {useRoute, useRouter} from "vue-router";

export default {
  name: "QuizzGame",
  data() {
    return {
      route: useRoute(),
      router: useRouter(),
      id: 0,
      title: "",
      quizzItems: [],
      solutions: {},
      index: 0,
      selected: -1,
      score: 0,

      //question, success, failed, finished
      successState: "question",

      answerText: "",
    }
  },
  beforeMount() {
    this.initialize();
  },
  methods: {
    initialize() {
      //Chargement des données du quizz
      this.id = this.route.params.id;
      const data = JSON.parse(localStorage.getItem("quizzes"));

      let content = data.find(elem => elem.id == this.id);

      if (content) {
        this.title = content.title;
        if (content.quizzItems) {
          this.quizzItems = content.quizzItems;
        }
        else{
          alert("Le quizz actuel est vide")
        }
      }

      //Chargement des solutions
      this.solutions = JSON.parse(localStorage.getItem("solution-" + this.id));
    },
    chooseAnswer(event) {
      if(event.target.value === this.solutions[this.index])
      {
        this.successState = "success";
        event.target.classList.add("success");
        this.score++;
      }
      else {
        this.successState = "failed";
        event.target.classList.add("failed");
      }
      this.selected = event.target.value;
    },
    nextQuestion() {
      if(this.index + 1 >= this.quizzItems.length)
      {
        //fin du quizz
        document.getElementById("item-wrap").style.display = "none";
        document.getElementById("finished").style.display = "block";
        return;
      }
      this.index++;
      this.selected = -1;
      this.successState = "question"
    }
  },
  computed: {
    nextButton() {
      switch(this.successState) {
        case "question":
          return "Choisir une option";
        case "success":
        case "failed":
          if(this.index + 1 >= this.quizzItems.length)
            return "Terminer";
          else
            return "Question suivante";
        // case "finished":
        //   return "Terminer";
      }
    },
  },
  watch: {
    successState(next, prev) {
      if(next === "success")
        this.answerText = "Bonne réponse !";
      if(next === "failed")
        this.answerText = "Oups ...";
      if(next === "question")
        this.answerText = "";
      this.answerText += " "+ this.score +"/"+ this.quizzItems.length
    },
    index: {
      handler() {

      },
      immediate: true
    }
  },
}
</script>

<style scoped>

h1 {
  text-align: center;
  font-size: 40px;
}

#item-wrap {
  background-color: #382a4b;
  margin-top: 20px;
  border-radius: 10px;
  padding: 20px;
}

#item-question {
  font-size: 35px;
  color: #8F8F8F;
  margin: 10px 0 10px 0;
}

.answers-wrap {
  padding-left: 10px;
  padding-right: 10px;
}

.answer-button {
  /*display: flex;*/
  /*align-items: center;*/
  width: 100%;
  position: relative;
  border: none;
  background-color: #271c36;
  font-size: 30px;
  text-align: left;
  padding: 20px;
  border-radius: 10px;
  color: white;
  margin-top: 10px;
  transition: transform 300ms;
}

.answer-button:hover:enabled {
  background-color: #2d213f;
  transform: translateX(30px);
}

.answer-button.success {
  background-color: greenyellow;
  color: #271c36;
  transform: translateX(30px);
}

.answer-button.failed {
  background-color: #b60644;
  transform: translateX(30px);
}

.item-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
}

.next-button {
  background-color: #67a800;
  font-size: 30px;
  border: none;
  border-radius: 10px;
  padding: 10px;
  font-weight: bold;
  color: black;
}

.next-button:hover {
  background-color: #78c200;
}

.next-button:disabled {
  pointer-events: none;
  box-shadow: inset 0 0 0 500px rgba(0,0,0,0.3);
}

.answer-text {
  font-size: 30px;
  font-weight: bold;
  color: greenyellow;
}

.answer-text.failed{
  color: #b60644;
}

#finished {
  display: none;
  text-align: center;
}
</style>