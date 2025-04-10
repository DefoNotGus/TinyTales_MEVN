<template>
    <div class="auth-form">
        <h2 v-if="title === 'Login'">COME WITHIN</h2>
        <h2 v-else>DECLARE YOURSELF</h2>

      <form @submit.prevent="onSubmit">
        <!-- Username input (optional) -->
        <div v-if="showUsername" class="mb-3">
          <input
            :value="username"
            @input="onUsernameInput"
            type="text"
            class="form-control"
            placeholder="Username"
            required
          />
        </div>
  
        <div class="mb-3">
          <input
            :value="email"
            @input="onEmailInput"
            type="email"
            class="form-control"
            placeholder="Email"
            required
          />
        </div>
  
        <div class="mb-3">
          <input
            :value="password"
            @input="onPasswordInput"
            type="password"
            class="form-control"
            placeholder="Password"
            required
          />
        </div>
  
        <button type="submit" class="btn btn-teal w-100 submit-btn">{{ buttonLabel }} </button>
      </form>
      <p v-if="error" class="text-danger mt-2">{{ error }}</p>
    </div>
  </template>
  
  <script setup>
  const props = defineProps({
    title: String,
    buttonLabel: String,
    email: String,
    password: String,
    username: String,
    error: String,
    showUsername: Boolean, // 🔁 New prop
  });
  
  const emit = defineEmits([
    'submit',
    'update:email',
    'update:password',
    'update:username', // 🔁 New event
  ]);
  
  const onSubmit = () => {
    emit('submit');
  };
  
  const onEmailInput = (event) => {
    emit('update:email', event.target.value);
  };
  
  const onPasswordInput = (event) => {
    emit('update:password', event.target.value);
  };
  
  const onUsernameInput = (event) => {
    emit('update:username', event.target.value);
  };
  </script>
  
  <style scoped>
  .auth-form {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    max-width: 400px;
    margin: 4rem auto;
    padding: 1.5rem 2rem;
    background: white;
    border-radius: 10px;
    box-shadow: 0 0 12px rgba(0, 0, 0, 0.1);
    height: 30vh;
  }
  /* Teal Bootstrap-style button */
.btn-teal {
  background-color: #006A6A;
  color: white;
  font-weight: 600;
  border: none;
  transition: background-color 0.3s ease;
}

.btn-teal:hover {
  background-color: #005353;
}

/* Stick button to bottom of form container */
.submit-btn {
  margin-top: auto;
  margin-bottom: 0;
  align-self: stretch;
}
.auth-form h2 {
  text-align: center;
  font-size: 1.8rem;
  font-weight: 700;
  color: #472c47;
font-family: 'Times New Roman', Times, serif;}
  </style>
  