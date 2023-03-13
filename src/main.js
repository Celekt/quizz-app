import {createApp} from "vue";
import App from "./App.vue";
import {createWebHistory, createRouter, createWebHashHistory} from "vue-router";
import QuizzEditor from "./components/QuizzEditor.vue";
import {h} from 'vue'
import Home from "./components/Home.vue";
import QuizzGame from "./components/QuizzGame.vue";

const routes = [
    {
        path: "/",
        component: Home,
        name: "home",
    },
    {
        path: "/quizz-game/:id",
        component: QuizzGame,
        name: "quizz-game",
    },
    {
        path: "/quizz-error/",
        component: h('h1', "Ce quizz n'existe pas ou vous n'avez pas accès"),
        name: "quizz-error",
    },
    {
        path: "/new-quizz/",
        component: QuizzEditor,
        name: "new-quizz",
        beforeEnter: () => {
            let quizzes = JSON.parse(localStorage.getItem("quizzes"))
            if (!quizzes || quizzes.length === 0) {
                localStorage.setItem("quizzes",
                    JSON.stringify([{
                            id: 0,
                            title: 'Votre premier quizz !',
                            quizzItems: []
                        }]
                    )
                )
                return `/quizz-editor/0`;
            }
            const id = Number(quizzes[quizzes.length - 1].id) + 1;
            quizzes.push({
                id: id,
                title: 'Quizz #' + (id+1),
                quizzItems: []
            })
            localStorage.setItem("quizzes", JSON.stringify(quizzes));
            return `/quizz-editor/${id}`;
        }
    },
    {
        path: "/quizz-editor/:id",
        component: QuizzEditor,
        name: "quizz-editor",
        beforeEnter: (to) => {
            let quizzes = JSON.parse(localStorage.getItem("quizzes"));
            if (!quizzes || !quizzes[to.params.id]) {
                return '/quizz-error/'
            }
        }
    },
];

export const router = createRouter({
    history: createWebHistory(),
    // history: createWebHashHistory(),
    // mode: 'hash',
    routes,
});

const app = createApp(App);
app.use(router);
app.mount("#app");
