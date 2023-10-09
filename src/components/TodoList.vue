<script setup lang="ts">
import { ref } from "vue";

const task = ref("Take out the trash!");

const todoList = ref([
  {
    index: 1,
    task: "Collect parcel from town",
    completed: false,
  },
  {
    index: 2,
    task: "Return books to the library",
    completed: false,
  },
  {
    index: 3,
    task: "Call mom",
    completed: false,
  },
  {
    index: 4,
    task: "Get groceries from the market",
    completed: false,
  },
]);

const addTodo = (task: string) => {
  todoList.value.push({
    index: todoList.value.length + 1,
    completed: false,
    task,
  });
};

const deleteTodo = (index: number) => {
  todoList.value.splice(
    todoList.value.findIndex((t) => t.index === index),
    1
  );
};
</script>

<template>
  <section
    class="bg-gray-100 p-8 h-[65vh] w-[40vw] mx-auto mt-10 rounded-lg shadow-md"
  >
    <h1 class="text-xl pt-2 pb-6">TodoList</h1>
    <form class="py-2" v-for="_ in 3" @submit.prevent="addTodo(task)">
      <div class="flex gap-4">
        <input
          type="text"
          placeholder="What do you need to do?"
          v-model="task"
          class="w-full px-2 py-1 border border-gray-300 rounded"
        />
        <button class="bg-blue-500 text-white px-3 py-1 rounded" type="submit">
          +
        </button>
      </div>
    </form>
    <h1 class="text-xl pb-2 pt-6">Things I need to do</h1>
    <ul class="py-2 space-y-2">
      <li
        v-for="todo in todoList"
        :key="todo.index"
        class="flex items-center pl-3 gap-2 bg-gray-200 rounded"
      >
        <input type="checkbox" v-model="todo.completed" class="text-lg" />
        <span class="w-full" :class="{ 'line-through': todo.completed }">
          {{ todo.task }}
        </span>
        <button
          class="text-white bg-red-400 px-3 py-1 rounded"
          @click="deleteTodo(todo.index)"
        >
          x
        </button>
      </li>
    </ul>
  </section>
</template>

<style>
body {
  background: lightgoldenrodyellow;
}
</style>
