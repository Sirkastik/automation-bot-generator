<script setup lang="ts">
const task = ref('Take out the trash!')

const todoList = ref([
  {
    index: 1,
    task: 'Collect parcel from town',
    completed: false,
  },
  {
    index: 2,
    task: 'Return books to the library',
    completed: false,
  },
  {
    index: 3,
    task: 'Call mom',
    completed: false,
  },
  {
    index: 4,
    task: 'Get groceries from the market',
    completed: false,
  },
])

const addTodo = (task: string) => {
  todoList.value.push({
    index: todoList.value.length + 1,
    completed: false,
    task,
  })
}

const deleteTodo = (index: number) => {
  todoList.value.splice(
    todoList.value.findIndex((t) => t.index === index),
    1,
  )
}
</script>

<template>
  <section
    class="todo mx-auto mt-10 h-[65vh] w-[40vw] rounded-lg bg-gray-100 p-8 shadow-md"
  >
    <h1 class="pb-6 pt-2 text-xl">TodoList</h1>
    <form class="py-2" v-for="_ in 3" @submit.prevent="addTodo(task)">
      <div class="flex gap-4">
        <input
          type="text"
          placeholder="What do you need to do?"
          v-model="task"
          class="w-full rounded border border-gray-300 px-2 py-1"
        />
        <button class="rounded bg-blue-500 px-3 py-1 text-white" type="submit">
          +
        </button>
      </div>
    </form>
    <h1 class="pb-2 pt-6 text-xl">Things I need to do</h1>
    <ul class="space-y-2 py-2">
      <li
        v-for="todo in todoList"
        :key="todo.index"
        class="flex items-center gap-2 rounded bg-gray-200 pl-3"
      >
        <input type="checkbox" v-model="todo.completed" class="text-lg" />
        <span class="w-full" :class="{ 'line-through': todo.completed }">
          {{ todo.task }}
        </span>
        <button
          class="rounded bg-red-400 px-3 py-1 text-white"
          @click="deleteTodo(todo.index)"
        >
          x
        </button>
      </li>
    </ul>
  </section>
</template>
