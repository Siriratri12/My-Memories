<script setup lang="ts">
import { ref } from "vue";

const emit = defineEmits<{
  login: [email: string, password: string];
  register: [name: string, email: string, password: string];
}>();

defineProps<{
  loading: boolean;
  error: string;
}>();

const mode = ref<"login" | "register">("login");
const name = ref("");
const email = ref("");
const password = ref("");
const showPassword = ref(false);

function submit() {
  if (mode.value === "register") {
    emit("register", name.value, email.value, password.value);
  } else {
    emit("login", email.value, password.value);
  }
}

function switchMode() {
  mode.value = mode.value === "login" ? "register" : "login";
  password.value = "";
  showPassword.value = false;
}

defineExpose({
  showLogin() {
    mode.value = "login";
    password.value = "";
    showPassword.value = false;
  },
});
</script>

<template>
  <main class="auth-page">
    <div class="auth-layout">
      <!-- LEFT: WELCOME -->
      <section class="welcome-panel">
        <div class="welcome-decoration circle-one"></div>
        <div class="welcome-decoration circle-two"></div>
        <div class="welcome-decoration circle-three"></div>

        <div class="brand">
          <div class="brand-icon">♡</div>
          <span>MY MEMORIES</span>
        </div>

        <div class="welcome-content">
          <div class="welcome-art" aria-hidden="true">
            <div class="art-orbit orbit-one"></div>
            <div class="art-orbit orbit-two"></div>
            <div class="art-heart">♡</div>
            <span class="art-star star-one">✦</span>
            <span class="art-star star-two">✧</span>
            <span class="art-star star-three">✦</span>
          </div>

          <span class="welcome-eyebrow"> YOUR PERSONAL MEMORY SPACE </span>

          <h1>
            Every memory<br />
            <span>tells a story.</span>
          </h1>

          <p>
            Cherish every meaningful moment<br />
            Capture your beautiful stories and revisit<br />
            your precious memories anytime.
          </p>
        </div>

        <div class="welcome-footer">
          <span>✦</span>
          A little place for your precious moments
          <span>✦</span>
        </div>
      </section>

      <!-- RIGHT: AUTH FORM -->
      <section class="form-panel">
        <div class="auth-card">
          <div class="mobile-brand"><span>♡</span> My Memories</div>

          <div class="form-heading">
            <span class="form-eyebrow">
              {{ mode === "login" ? "WELCOME BACK" : "CREATE YOUR ACCOUNT" }}
            </span>

            <h2>
              {{
                mode === "login"
                  ? "Welcome Back ♡"
                  : "Start Your Memory Journey ♡"
              }}
            </h2>

            <p>
              {{
                mode === "login"
                  ? "Log in to return to your personal memory space."
                  : "Sign up to start capturing your beautiful memories."
              }}
            </p>
          </div>

          <form @submit.prevent="submit">
            <!-- NAME -->
            <div v-if="mode === 'register'" class="form-group">
              <label for="auth-name">Username</label>

              <div class="input-wrap">
                <span class="input-icon" aria-hidden="true">♙</span>
                <input
                  id="auth-name"
                  v-model="name"
                  type="text"
                  placeholder="Your name"
                  autocomplete="name"
                  maxlength="100"
                  required
                  :disabled="loading"
                />
              </div>
            </div>

            <!-- EMAIL -->
            <div class="form-group">
              <label for="auth-email">Email</label>

              <div class="input-wrap">
                <span class="input-icon" aria-hidden="true">✉</span>
                <input
                  id="auth-email"
                  v-model="email"
                  type="email"
                  placeholder="example@email.com"
                  autocomplete="email"
                  required
                  :disabled="loading"
                />
              </div>
            </div>

            <!-- PASSWORD -->
            <div class="form-group">
              <label for="auth-password">Password</label>

              <div class="input-wrap">
                <span class="input-icon" aria-hidden="true">♢</span>

                <input
                  id="auth-password"
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  :autocomplete="
                    mode === 'login' ? 'current-password' : 'new-password'
                  "
                  placeholder="At least 8 characters"
                  minlength="8"
                  required
                  :disabled="loading"
                />

                <button
                  type="button"
                  class="password-toggle"
                  :aria-label="showPassword ? 'Hide Password' : 'Show Password'"
                  :aria-pressed="showPassword"
                  @click="showPassword = !showPassword"
                >
                  {{ showPassword ? "Hide" : "Show" }}
                </button>
              </div>

              <span v-if="mode === 'register'" class="field-hint">
                At least 8 characters
              </span>
            </div>

            <!-- ERROR / MESSAGE -->
            <p
              v-if="error"
              class="auth-message"
              :class="{
                'success-message': error.includes('Registration Successful'),
              }"
              role="status"
            >
              {{ error }}
            </p>

            <!-- SUBMIT -->
            <button type="submit" class="submit-btn" :disabled="loading">
              {{
                loading
                  ? "Processing..."
                  : mode === "login"
                    ? "Log In"
                    : "Sign Up"
              }}
              <span aria-hidden="true">→</span>
            </button>
          </form>

          <!-- SWITCH LOGIN / REGISTER -->
          <div class="switch-section">
            <p>
              {{
                mode === "login"
                  ? "Don't have an account yet?"
                  : "Already have an account?"
              }}
            </p>

            <button
              type="button"
              class="switch-btn"
              :disabled="loading"
              @click="switchMode"
            >
              {{ mode === "login" ? "Sign Up" : "Log In" }}
            </button>
          </div>

          <div class="form-footer">
            <span>♡</span>
            Your memories, your special place.
          </div>
        </div>
      </section>
    </div>
  </main>
</template>

<style scoped>
.auth-page {
  min-height: 100vh;
  min-height: 100dvh;
  padding: 24px;
  display: grid;
  place-items: center;
  background:
    radial-gradient(
      circle at 10% 15%,
      rgba(213, 184, 235, 0.5),
      transparent 35%
    ),
    radial-gradient(
      circle at 90% 90%,
      rgba(248, 199, 219, 0.5),
      transparent 35%
    ),
    #f8f4fb;
}

.auth-layout {
  width: min(1100px, 100%);
  min-height: 680px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  background: #fff;
  border-radius: 28px;
  overflow: hidden;
  box-shadow: 0 20px 65px rgba(84, 55, 112, 0.12);
}

/* Left Panel */
.welcome-panel {
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 35px 42px 28px;
  background: linear-gradient(145deg, #7650a5 0%, #a87ac4 55%, #e5a0bc 100%);
  color: #fff;
}

.welcome-decoration {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.09);
  pointer-events: none;
}

.circle-one {
  width: 340px;
  height: 340px;
  top: -160px;
  right: -150px;
}

.circle-two {
  width: 250px;
  height: 250px;
  bottom: -110px;
  left: -120px;
}

.circle-three {
  width: 100px;
  height: 100px;
  top: 42%;
  right: -40px;
}

.brand {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  font-weight: 800;
  letter-spacing: 2px;
}

.brand-icon {
  width: 42px;
  height: 42px;
  display: grid;
  place-items: center;
  border-radius: 13px;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  font-size: 30px;
}

.welcome-content {
  position: relative;
  z-index: 1;
  text-align: center;
  padding: 25px 0;
}

.welcome-art {
  width: 240px;
  height: 240px;
  margin: 0 auto 25px;
  position: relative;
  display: grid;
  place-items: center;
}

.art-orbit {
  position: absolute;
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 50%;
}

.orbit-one {
  width: 210px;
  height: 210px;
}

.orbit-two {
  width: 165px;
  height: 165px;
  border-style: dashed;
}

.art-heart {
  width: 135px;
  height: 135px;
  display: grid;
  place-items: center;
  border-radius: 38px;
  background: rgba(255, 255, 255, 0.22);
  border: 1px solid rgba(255, 255, 255, 0.4);
  box-shadow: 0 15px 35px rgba(72, 42, 102, 0.12);
  color: #fff;
  font-size: 100px;
  line-height: 1;
  transform: rotate(-8deg);
}

.art-star {
  position: absolute;
  color: #fff;
}

.star-one {
  top: 25px;
  right: 15px;
  font-size: 32px;
}

.star-two {
  bottom: 20px;
  left: 10px;
  font-size: 30px;
}

.star-three {
  top: 50px;
  left: 15px;
  font-size: 20px;
}

.welcome-eyebrow {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 2.5px;
}

.welcome-content h1 {
  color: #fff;
  font-size: clamp(34px, 3.8vw, 47px);
  line-height: 1.25;
  margin: 15px 0 20px;
  letter-spacing: -1px;
}

.welcome-content h1 span {
  color: #ffe1ed;
}

.welcome-content p {
  color: rgba(255, 255, 255, 0.94);
  font-size: 14px;
  line-height: 2;
  margin: 0;
}

.welcome-footer {
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.9);
  text-align: center;
}

/* Right Panel */
.form-panel {
  display: grid;
  place-items: center;
  padding: 50px 48px;
}

.auth-card {
  width: 100%;
  max-width: 390px;
}

.mobile-brand {
  display: none;
}

.form-heading {
  margin-bottom: 34px;
}

.form-eyebrow {
  display: block;
  color: #a57ac2;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 2px;
  margin-bottom: 13px;
}

.form-heading h2 {
  color: #382746;
  font-size: 27px;
  line-height: 1.4;
  margin: 0 0 12px;
}

.form-heading p {
  color: #95899f;
  font-size: 14px;
  line-height: 1.8;
  margin: 0;
}

.form-group {
  margin-bottom: 22px;
}

.form-group label {
  display: block;
  color: #493758;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 10px;
}

.input-wrap {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 15px;
  color: #ab8bc0;
  font-size: 19px;
  pointer-events: none;
}

.input-wrap input {
  width: 100%;
  min-width: 0;
  padding: 15px 16px 15px 45px;
  border: 1px solid #e7ddec;
  border-radius: 13px;
  background: #fcfaff;
  color: #3d2b4a;
  font-family: inherit;
  font-size: 14px;
  transition: 0.2s;
}

.input-wrap input:focus {
  outline: none;
  border-color: #a67bc4;
  box-shadow: 0 0 0 4px rgba(166, 123, 196, 0.12);
  background: #fff;
}

.input-wrap input::placeholder {
  color: #b0a3b8;
}

.input-wrap input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.input-wrap input[type="password"],
.input-wrap input[id="auth-password"] {
  padding-right: 75px;
}

.password-toggle {
  position: absolute;
  right: 9px;
  border: none;
  background: transparent;
  color: #8e6baa;
  padding: 9px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
}

.password-toggle:hover {
  color: #68418d;
}

.field-hint {
  display: block;
  margin-top: 8px;
  color: #a395ad;
  font-size: 12px;
}

.auth-message {
  color: #b42343;
  background: #fff0f3;
  border: 1px solid #f8d9e2;
  padding: 12px 14px;
  border-radius: 11px;
  font-size: 13px;
  line-height: 1.6;
}

.success-message {
  color: #267348;
  background: #eff9f1;
  border-color: #d5ebdb;
}

.submit-btn {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin-top: 28px;
  padding: 15px 20px;
  border: none;
  border-radius: 13px;
  background: linear-gradient(110deg, #8052ae, #b37bc5);
  color: #fff;
  font-family: inherit;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 7px 18px rgba(128, 82, 174, 0.2);
  transition: 0.2s;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 22px rgba(128, 82, 174, 0.26);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.switch-section {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 5px;
  margin-top: 26px;
}

.switch-section p {
  margin: 0;
  color: #95899f;
  font-size: 13px;
}

.switch-btn {
  border: none;
  background: transparent;
  color: #8755b0;
  font-size: 13px;
  font-weight: 700;
  padding: 7px;
  cursor: pointer;
}

.switch-btn:hover {
  color: #68418d;
  text-decoration: underline;
}

.form-footer {
  margin-top: 50px;
  padding-top: 22px;
  border-top: 1px solid #f1ebf5;
  text-align: center;
  color: #ad9eb7;
  font-size: 12px;
}

.form-footer span {
  color: #d69bb9;
  font-size: 17px;
  margin-right: 5px;
}

/* Responsive */
@media (max-width: 850px) {
  .auth-layout {
    grid-template-columns: 1fr;
    max-width: 520px;
    min-height: auto;
  }

  .welcome-panel {
    display: none;
  }

  .form-panel {
    padding: 45px 35px;
  }

  .mobile-brand {
    display: block;
    text-align: center;
    color: #8052ae;
    font-size: 22px;
    font-weight: 800;
    margin-bottom: 40px;
  }

  .mobile-brand span {
    color: #d99cbb;
    font-size: 30px;
    vertical-align: middle;
  }
}

@media (max-width: 480px) {
  .auth-page {
    padding: 14px;
  }

  .auth-layout {
    border-radius: 20px;
  }

  .form-panel {
    padding: 35px 22px;
  }

  .form-heading h2 {
    font-size: 23px;
  }

  .form-footer {
    margin-top: 35px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .input-wrap input,
  .submit-btn {
    transition: none;
  }

  .submit-btn:hover:not(:disabled) {
    transform: none;
  }
}
</style>
