<script setup lang="ts">
import { ref, watch, computed } from "vue";
import type { User } from "../types/memory";

const props = defineProps<{
  user: User;
  loading: boolean;
  error: string;
  success: string;
}>();

const emit = defineEmits<{
  (e: "save", name: string): void;
}>();

const name = ref(props.user.name);
const editing = ref(false);

const initials = computed(() => {
  const text = props.user.name.trim();
  return text ? text.charAt(0).toUpperCase() : "M";
});

watch(
  () => props.user.name,
  (newName) => {
    name.value = newName;
    editing.value = false;
  },
);

function saveProfile() {
  const trimmedName = name.value.trim();

  if (!trimmedName || trimmedName.length > 100) {
    return;
  }

  emit("save", trimmedName);
}

function cancelEdit() {
  name.value = props.user.name;
  editing.value = false;
}
</script>

<template>
  <section class="profile-page">
    <!-- PROFILE HEADER -->
    <div class="profile-banner">
      <div class="banner-decoration decoration-one"></div>
      <div class="banner-decoration decoration-two"></div>

      <div class="banner-content">
        <div class="profile-avatar">
          {{ initials }}
        </div>

        <div class="banner-text">
          <span class="profile-tag">MY PROFILE</span>
          <h2>{{ user.name }}</h2>
          <p>A personal space to cherish every precious memory. 💜</p>
        </div>
      </div>
    </div>

    <!-- PROFILE CARD -->
    <div class="profile-card">
      <div class="profile-heading">
        <div>
          <span class="section-label">ACCOUNT INFORMATION</span>
          <h3>Personal Information</h3>
          <p class="profile-subtitle">
            View and manage your My Memories account information.
          </p>
        </div>

        <button
          v-if="!editing"
          type="button"
          class="edit-profile-btn"
          @click="editing = true"
        >
          <span>✎</span>
          Edit Profile
        </button>
      </div>

      <!-- EDIT MODE -->
      <form v-if="editing" class="profile-form" @submit.prevent="saveProfile">
        <div class="form-field">
          <label for="profile-name">Username</label>
          <input
            id="profile-name"
            v-model="name"
            type="text"
            maxlength="100"
            placeholder="Enter your username"
            autocomplete="name"
            required
            :disabled="loading"
          />
        </div>

        <div class="form-field">
          <label for="profile-email">Email</label>
          <input id="profile-email" :value="user.email" type="email" disabled />
          <span class="field-hint">
            Email address cannot be changed at this time.
          </span>
        </div>

        <p v-if="error" class="profile-error" role="alert">
          {{ error }}
        </p>

        <div class="form-actions">
          <button
            type="submit"
            class="save-btn"
            :disabled="loading || !name.trim()"
          >
            {{ loading ? "Saving..." : "✓ Save Changes" }}
          </button>

          <button
            type="button"
            class="cancel-btn"
            :disabled="loading"
            @click="cancelEdit"
          >
            Cancel
          </button>
        </div>
      </form>

      <!-- VIEW MODE -->
      <div v-else class="profile-info">
        <div class="info-item">
          <div class="info-icon">👤</div>
          <div class="info-content">
            <span class="info-label">Username</span>
            <strong>{{ user.name }}</strong>
          </div>
        </div>

        <div class="info-item">
          <div class="info-icon">✉</div>
          <div class="info-content">
            <span class="info-label">Email</span>
            <strong>{{ user.email }}</strong>
          </div>
        </div>

        <div class="info-item">
          <div class="info-icon">♡</div>
          <div class="info-content">
            <span class="info-label">Account</span>
            <strong>My Memories Member</strong>
          </div>
        </div>
      </div>

      <p v-if="success" class="profile-success" role="status">
        ✓ {{ success }}
      </p>
    </div>

    <!-- FOOTER MESSAGE -->
    <div class="profile-note">
      <span class="note-heart">♡</span>
      <div>
        <strong>Every memory matters.</strong>
        <p>Every moment is meaningful, and every memory is precious.</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.profile-page {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 26px;
  padding-bottom: 30px;
}

/* Banner */
.profile-banner {
  position: relative;
  overflow: hidden;
  border-radius: 24px;
  padding: 38px;
  background: linear-gradient(120deg, #7650a4 0%, #a779c3 55%, #e5a0bb 100%);
  box-shadow: 0 12px 30px rgba(105, 68, 143, 0.13);
}

.banner-decoration {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.12);
  pointer-events: none;
}

.decoration-one {
  width: 240px;
  height: 240px;
  right: -55px;
  top: -125px;
}

.decoration-two {
  width: 150px;
  height: 150px;
  right: 120px;
  bottom: -95px;
}

.banner-content {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 24px;
}

.profile-avatar {
  width: 100px;
  height: 100px;
  flex-shrink: 0;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #fff;
  color: #8055a6;
  font-size: 43px;
  font-weight: 700;
  border: 5px solid rgba(255, 255, 255, 0.45);
  box-shadow: 0 6px 20px rgba(67, 35, 91, 0.16);
}

.banner-text {
  min-width: 0;
}

.profile-tag {
  display: inline-block;
  margin-bottom: 10px;
  color: #fff;
  font-size: 11px;
  letter-spacing: 2px;
  font-weight: 700;
}

.banner-text h2 {
  color: #fff;
  font-size: clamp(25px, 3vw, 34px);
  margin: 0 0 10px;
  overflow-wrap: anywhere;
}

.banner-text p {
  color: #fff;
  opacity: 0.92;
  font-size: 14px;
  margin: 0;
}

/* Main Card */
.profile-card {
  background: #fff;
  border-radius: 22px;
  padding: 32px;
  box-shadow: 0 6px 28px rgba(73, 43, 118, 0.06);
  border: 1px solid #f0eaf6;
}

.profile-heading {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
  flex-wrap: wrap;
  padding-bottom: 25px;
  border-bottom: 1px solid #f0eaf6;
}

.section-label {
  color: #9b77bb;
  font-size: 11px;
  letter-spacing: 1.5px;
  font-weight: 700;
}

.profile-heading h3 {
  margin: 9px 0;
  color: #382445;
  font-size: 25px;
}

.profile-subtitle {
  color: #92849d;
  font-size: 14px;
  margin: 0;
}

.edit-profile-btn {
  border: none;
  border-radius: 12px;
  padding: 13px 20px;
  background: #e99ab9;
  color: #fff;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s;
}

.edit-profile-btn:hover {
  background: #d87fa5;
  transform: translateY(-2px);
}

/* Profile Information */
.profile-info {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
  margin-top: 26px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 20px;
  background: #faf7fd;
  border: 1px solid #f0e8f7;
  border-radius: 15px;
  min-width: 0;
}

.info-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 46px;
  height: 46px;
  flex-shrink: 0;
  background: #efe3f7;
  color: #8452ae;
  border-radius: 13px;
  font-size: 22px;
}

.info-content {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}

.info-label {
  font-size: 12px;
  color: #9686a3;
}

.info-content strong {
  color: #3c2b49;
  font-size: 14px;
  overflow-wrap: anywhere;
}

/* Form */
.profile-form {
  margin-top: 25px;
}

.form-field {
  margin-bottom: 22px;
}

.form-field label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 10px;
  color: #493457;
}

.form-field input {
  width: 100%;
  padding: 14px 16px;
  border: 1px solid #e5dbea;
  border-radius: 12px;
  background: #fff;
  font: inherit;
  color: #382445;
  transition: 0.2s;
}

.form-field input:focus {
  outline: none;
  border-color: #a47cc4;
  box-shadow: 0 0 0 4px rgba(164, 124, 196, 0.12);
}

.form-field input:disabled {
  background: #f8f6fa;
  color: #94889d;
  cursor: not-allowed;
}

.field-hint {
  display: block;
  margin-top: 9px;
  font-size: 12px;
  color: #a195aa;
}

.form-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 25px;
}

.save-btn {
  border: none;
  border-radius: 12px;
  background: #8555b2;
  color: #fff;
  padding: 13px 22px;
  font-weight: 600;
  cursor: pointer;
}

.save-btn:hover {
  background: #70429e;
}

.cancel-btn {
  border: none;
  border-radius: 12px;
  background: #f0eaf5;
  color: #684e7e;
  padding: 13px 22px;
  cursor: pointer;
}

.save-btn:disabled,
.cancel-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.profile-error {
  color: #b42343;
  margin-top: 12px;
}

.profile-success {
  background: #edf9f0;
  color: #267348;
  border-radius: 12px;
  padding: 14px 18px;
  margin-top: 20px;
  font-size: 14px;
}

/* Footer Note */
.profile-note {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 22px 26px;
  border-radius: 18px;
  background: linear-gradient(110deg, #f5edfb, #fceef4);
}

.note-heart {
  font-size: 35px;
  color: #b27cba;
}

.profile-note strong {
  color: #704c8c;
  font-size: 15px;
}

.profile-note p {
  color: #9684a3;
  margin: 5px 0 0;
  font-size: 13px;
}

/* Responsive */
@media (max-width: 650px) {
  .profile-banner {
    padding: 25px 20px;
  }

  .banner-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .profile-avatar {
    width: 78px;
    height: 78px;
    font-size: 32px;
  }

  .profile-card {
    padding: 22px 18px;
  }

  .profile-info {
    grid-template-columns: 1fr;
  }

  .edit-profile-btn {
    width: 100%;
  }

  .form-actions {
    flex-direction: column;
  }

  .form-actions button {
    width: 100%;
  }
}
</style>
