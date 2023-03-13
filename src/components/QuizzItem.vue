<template>
<div class="question-wrap">
    <div class="question-append">
      <input class="question-title" type="text"
             v-model.lazy="question"
             :placeholder="'Question partie #' + (id+1)">

      <span class="question-append-wrap">
        <img class="question-icon" src="../assets/quiz.svg">
      </span>
      <img class="check-icon" src="../assets/check_circle.svg">
    </div>

    <hr class="style-five">

    <div class="answers-wrap">
        <div class="single-answer"
             v-for="(answer,key,index) in answers" :key="key">
          <span class="question-number">{{ '#' + (index + 1)}}</span>
          <input class="answer-text"
                 type="text"
                 :placeholder="'Réponse #' + (index + 1)"
                 v-model.lazy="answers[key]">
          <button class="delete-item" type="button" @click="deleteAnswer(key)">
            <img class="delete-icon" src="../assets/delete.svg">
          </button>
          <input class="radio-solution"
                 type="radio"
                 :name="'solution-' + id"
                 :value="key"
                 @change="sendSolution">
        </div>
      <div class="answer-footer">
        <button class="new-answer" type="button" @click="newAnswer"><span>+</span>Nouvelle réponse</button>
        <button class="delete-answer" type="button" @click="deleteItem"><span>x</span>Supprimer</button>
      </div>
    </div>
  </div>
</template>

<script>
import {nextTick} from "vue";

export default {
  name: "QuizzItem",
  props: {
    quizzPart: {
      type: Object,
      required: true
    },
    quizzId: {
      type: String,
      required: true
    },
  },
  emits: ["updateItemEvent", "sendSolutionEvent", "deleteItemEvent"],
  data() {
    return {
      id: 0,
      question: "",
      answers: {}
    }
  },
  computed: {
    maxAnswerKey() {
      return Math.max(...Object.keys(this.answers).map(elem => Number(elem)))
    }
  },
  mounted() {
      this.id = this.quizzPart.id;
      this.question = this.quizzPart.question ?? "Quelle est votre question ?";
      if(this.quizzPart.answers)
        Object.assign(this.answers, this.quizzPart.answers);
      else
          this.answers = {0: '',
                          1: ''};


    //----------------------------------------
    this.lateMounted();
  },
  methods: {
    updateItem() {
      this.$emit('updateItemEvent', { id: this.id,
        question: this.question,
        answers: this.answers});
    },
    test(event) {
      event.target.checked = true;
    },
    sendSolution(event) {
      this.$emit("sendSolutionEvent", this.id, event.target.value);
    },

    async lateMounted() {
      await nextTick();

      const solutions = JSON.parse(localStorage.getItem("solution-" + this.quizzId));
      if(!solutions)
        return;

      const solution = solutions[this.id];
      if(!solution)
        return;

      const query = "input[name='solution-" + this.id + "']"
                    + "[value='" + solution + "']";
      const radioSolution = document.querySelector(query);
      if(radioSolution)
        radioSolution.checked = true;
    },
    newAnswer() {
      this.answers[this.maxAnswerKey + 1] = '';
    },
    deleteAnswer(id) {
      delete this.answers[id];
    },
    deleteItem() {
      this.$emit('deleteItemEvent', this.id);
    }
  },
  watch: {
    answers: {
      handler() {
        this.updateItem();
      },
      deep: true
    },
    question() {
      this.updateItem();
    }
  },
}
</script>

<style scoped>
.question-wrap {
  background-color: #382a4b;
  margin-top: 20px;
  border-radius: 10px;
  padding: 10px;
}

.question-title {
  position: relative;
  flex-grow: 1;
  border: none;
  background-color: #271c36;
  font-size: 30px;
  padding-left: 50px;
  margin-right: 8px;
  border-radius: 10px;
  color: #8F8F8F;
}

.question-title:focus {
  outline: 2px groove #443564;
  background-color: #2d213f;
  color: white;
}

.question-append {
  position:relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.question-append-wrap {
  position: absolute;
  left: 0px;
  top: 0px;
  height: 100%;
  max-width: 45px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  box-sizing: border-box;
}

.question-icon {
  height: 100%;
  width: auto;
  padding: 5px;
  box-sizing: border-box;
}

.check-icon {
  width: 45px;
  height: 45px;
  margin-right: 7px;
}

.answers-wrap {
  /*margin-top: 20px;*/
}

.single-answer {
  display: flex;
  width: 100%;
  align-items: center;
}

.single-answer input:first-of-type {
 flex-grow: 1;
}

.answer-text {
  position: relative;
  border: none;
  background-color: #271c36;
  font-size: 25px;
  padding-left: 10px;
  border-radius: 10px;
  color: #8F8F8F;
}

.answer-text:focus {
  outline: 2px groove #443564;
  background-color: #2d213f;
  color: white;
}

.question-number {
  width: 25px;
  text-align: center;
  font-size: 20px;
  margin: 5px;
  padding: 5px;
  border-radius: 5px;
  background-color: #6a509b;
}

.delete-item {
  width: 35px;
  height: 35px;
  text-align: center;
  margin: 5px;
  padding: 5px;
  border-radius: 5px;
  background-color: #b60644;
  border: none;
}

.delete-item:hover {
  background-color: #e50a59;
}

.delete-icon {
  width: 20px;
  height: 20px;
}

.radio-solution{
  margin-left: 20px;
  margin-right: 20px;
}

input[type=radio] {
  /* Add if not using autoprefixer */
  -webkit-appearance: none;
  /* Remove most all native input styles */
  -moz-appearance: none;
  appearance: none;
  /* For iOS < 15 */
  /*background-color: var(--form-background);*/
  font: inherit;
  color: currentColor;
  width: 1.15em;
  height: 1.15em;
  border: 0.15em solid currentColor;
  border-radius: 50%;
  transform: translateY(-0.075em);
  display: grid;
  place-content: center;
}

input[type=radio]::before {
  content: "";
  width: 0.65em;
  height: 0.65em;
  border-radius: 50%;
  transform: scale(0);
  transition: 120ms transform ease-in-out;
  box-shadow: inset 1em 1em #00ff00;
}

input[type=radio]:checked::before {
  transform: scale(1);
}

input[type=radio]:focus {
  outline: max(2px, 0.15em) solid currentColor;
  outline-offset: max(2px, 0.15em);
}

hr.style-five {
  border: 0;
  height: 0; /* Firefox... */
  box-shadow: 0 0 10px 1px black;
  margin-top: 20px;
  margin-bottom: 15px;
}
hr.style-five:after {  /* Not really supposed to work, but does */
  content: "\00a0";  /* Prevent margin collapse */
}

.new-answer {
  display: inline-flex;
  align-items: center;
  border: none;
  font-size: 20px;
  margin: 5px;
  padding: 5px;
  border-radius: 5px;
  background-color: #6a509b;
  color: white;
  transition: background-color 0.3s;
}

.new-answer:hover {
  background-color: #8364c4;
}

.new-answer span{
  transition: transform 0.3s;
  margin-right: 5px;
}

.new-answer:hover span{
  transform: rotate(180deg) scale(1.3);
  display: inline-flex;
  color: greenyellow;
}

.answer-footer {
  display: flex;
  justify-content: space-between;
}

.delete-answer {
  display: inline-flex;
  align-items: center;
  border: none;
  font-size: 20px;
  margin: 5px;
  padding: 5px;
  border-radius: 5px;
  background-color: #b60644;
  color: white;
  transition: background-color 0.3s;
}

.delete-answer:hover {
  background-color: #ee0857;

}

.delete-answer span{
  margin-right: 5px;
}
</style>