<template>
  <div class="message_form">
    <input type="text" v-model="firstName" placeholder="First Name">
    <input type="text" v-model="lastName" placeholder="Last Name">
    <button @click="submit" :disabled="done">Submit</button>
  </div>
</template>

<script>
export default {
  props: {
    questionContent: {
      type: String,
      required: true
    }
  },
  data: function() {
    return {
      firstName: '',
      lastName: '',
      done: false
    }
  },
  methods: {
    submit: function() {
      if (this.done) {
        return false;
      }
      this.$parent.$emit('submited', {
        question: this.questionContent,
        anwser: `${this.lastName} ${this.firstName}`,
        isName: true
      });
      this.done = true;
    }
  }
}
</script>

<style scoped>
.message_form {
  display: flex;
  flex-direction: column;
}
</style>
