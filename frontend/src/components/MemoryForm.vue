<script setup lang="ts">
import { ref, watch } from "vue";
import type { Memory, MemoryInput } from "../types/memory";

const props = defineProps<{
  editingMemory: Memory | null;
  loading: boolean;
}>();

const emit = defineEmits<{
  save: [data: MemoryInput];
  cancel: [];
}>();

const title = ref("");
const description = ref("");
const memoryDate = ref("");

watch(
  () => props.editingMemory,
  (memory) => {
    title.value = memory?.title || "";
    description.value = memory?.description || "";
    memoryDate.value = memory?.memoryDate.slice(0, 10) || "";
  },
  { immediate: true },
);

function submit() {
  if (!title.value.trim() || !memoryDate.value) return;

  emit("save", {
    title: title.value.trim(),
    description: description.value,
    memoryDate: new Date(memoryDate.value).toISOString(),
  });
}

function reset() {
  title.value = "";
  description.value = "";
  memoryDate.value = "";
}

defineExpose({ reset });
</script>

<template>
  <section class="memory-form-panel">
    <!-- Decorative Header -->
    <div class="form-banner">
      <div class="banner-circle circle-one"></div>
      <div class="banner-circle circle-two"></div>

      <div class="banner-content">
        <div class="banner-icon" aria-hidden="true">♡</div>

        <div>
          <span class="banner-eyebrow">
            {{ editingMemory ? "EDIT YOUR STORY" : "CREATE A MEMORY" }}
          </span>

          <h2>
            {{ editingMemory ? "Edit Memory" : "Create a New Memory" }}
          </h2>

          <p>
            {{
              editingMemory
                ? "Make your story reflect your memories."
                : "Keep your special moments in your own space 💜"
            }}
          </p>
        </div>
      </div>
    </div>

    <!-- Form Content -->
    <div class="form-body">
      <div class="form-intro">
        <h3>Memory Details</h3>
        <p>Fill your journal with beautiful memories.</p>
      </div>

      <form @submit.prevent="submit">
        <!-- Title -->
        <div class="form-group">
          <label for="memory-title">
            <span class="label-icon">✦</span>
            Memory Title
            <span class="required">*</span>
          </label>

          <input
            id="memory-title"
            v-model="title"
            type="text"
            placeholder="e.g., The first day of a special journey..."
            autocomplete="off"
            required
            :disabled="loading"
          />
        </div>

        <!-- Date -->
        <div class="form-group">
          <label for="memory-date">
            <span class="label-icon">▦</span>
            Memory Date
            <span class="required">*</span>
          </label>

          <input
            id="memory-date"
            v-model="memoryDate"
            type="date"
            required
            :disabled="loading"
          />

          <span class="field-hint">
            Select the date when this memory took place.
          </span>
        </div>

        <!-- Description -->
        <div class="form-group">
          <label for="memory-description">
            <span class="label-icon">♡</span>
            Your Story
          </label>

          <textarea
            id="memory-description"
            v-model="description"
            rows="6"
            placeholder="What happened today? What made you smile, or was there a moment you want to remember? Write your story here... ♡"
            :disabled="loading"
          ></textarea>

          <div class="textarea-footer">
            <span>Write freely, in your own unique way.</span>
            <span>{{ description.length }} Characters</span>
          </div>
        </div>

        <!-- Actions -->
        <div class="form-actions">
          <button
            type="submit"
            class="submit-btn"
            :disabled="loading || !title.trim() || !memoryDate"
          >
            <span aria-hidden="true">♡</span>
            {{
              loading
                ? "Saving..."
                : editingMemory
                  ? "Save Changes"
                  : "Save Memory"
            }}
          </button>

          <button
            v-if="editingMemory"
            type="button"
            class="cancel-btn"
            :disabled="loading"
            @click="emit('cancel')"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>

    <!-- Footer Message -->
    <div class="form-footer">
      <span>✦</span>
      Every beautiful moment deserves to be remembered.
      <span>✦</span>
    </div>
  </section>
</template>

<style scoped>
.memory-form-panel {
  background: #ffffff;
  border: 1px solid #f0e8f5;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 8px 30px rgba(82, 52, 115, 0.06);
  margin-bottom: 30px;
}

/* Banner */
.form-banner {
  position: relative;
  overflow: hidden;
  padding: 30px 34px;
  background: linear-gradient(115deg, #7953a5 0%, #aa7cc5 60%, #e6a0bb 100%);
}

.banner-circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.12);
  pointer-events: none;
}

.circle-one {
  width: 220px;
  height: 220px;
  right: -60px;
  top: -125px;
}

.circle-two {
  width: 130px;
  height: 130px;
  right: 130px;
  bottom: -95px;
}

.banner-content {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 20px;
}

.banner-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  flex-shrink: 0;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 18px;
  color: #fff;
  font-size: 40px;
}

.banner-eyebrow {
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 2px;
}

.banner-content h2 {
  color: #fff;
  font-size: clamp(23px, 3vw, 29px);
  margin: 8px 0;
}

.banner-content p {
  color: rgba(255, 255, 255, 0.95);
  font-size: 14px;
  margin: 0;
}

/* Form Body */
.form-body {
  padding: 34px;
}

.form-intro {
  margin-bottom: 26px;
  padding-bottom: 22px;
  border-bottom: 1px solid #f1eaf5;
}

.form-intro h3 {
  font-size: 21px;
  color: #382746;
  margin: 0 0 8px;
}

.form-intro p {
  font-size: 14px;
  color: #988aa2;
  margin: 0;
}

.form-group {
  margin-bottom: 25px;
}

.form-group label {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 11px;
  color: #4c385a;
  font-size: 14px;
  font-weight: 600;
}

.label-icon {
  color: #a778c4;
  font-size: 18px;
}

.required {
  color: #df8cac;
}

.form-group input,
.form-group textarea {
  display: block;
  width: 100%;
  border: 1px solid #e8dfed;
  border-radius: 13px;
  background: #fcfaff;
  color: #3c2c47;
  padding: 15px 17px;
  font-family: inherit;
  font-size: 14px;
  transition: 0.2s ease;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  background: #fff;
  border-color: #a87bc6;
  box-shadow: 0 0 0 4px rgba(168, 123, 198, 0.12);
}

.form-group input::placeholder,
.form-group textarea::placeholder {
  color: #afa3b7;
}

.form-group textarea {
  resize: vertical;
  min-height: 155px;
  line-height: 1.8;
}

.form-group input:disabled,
.form-group textarea:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.field-hint {
  display: block;
  margin-top: 9px;
  color: #a395ac;
  font-size: 12px;
}

.textarea-footer {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-top: 9px;
  color: #a395ac;
  font-size: 12px;
}

/* Actions */
.form-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 30px;
}

.submit-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 14px 25px;
  border: none;
  border-radius: 12px;
  background: linear-gradient(110deg, #8053ae, #b67bc6);
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  box-shadow: 0 5px 15px rgba(128, 83, 174, 0.2);
  transition: 0.2s ease;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(128, 83, 174, 0.25);
}

.submit-btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.cancel-btn {
  border: none;
  border-radius: 12px;
  background: #f0eaf5;
  color: #715585;
  padding: 14px 24px;
  font-family: inherit;
  font-weight: 600;
  cursor: pointer;
}

.cancel-btn:hover:not(:disabled) {
  background: #e6dced;
}

.cancel-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Footer */
.form-footer {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  padding: 18px;
  background: #fcf9fe;
  border-top: 1px solid #f3ecf7;
  color: #a18dad;
  font-size: 12px;
  text-align: center;
}

.form-footer span {
  color: #d89cbb;
}

/* Responsive */
@media (max-width: 650px) {
  .form-banner {
    padding: 25px 20px;
  }

  .banner-content {
    align-items: flex-start;
    gap: 14px;
  }

  .banner-icon {
    width: 48px;
    height: 48px;
    font-size: 30px;
  }

  .form-body {
    padding: 24px 18px;
  }

  .form-actions {
    flex-direction: column;
  }

  .form-actions button {
    width: 100%;
  }

  .textarea-footer {
    flex-direction: column;
    gap: 5px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .submit-btn,
  .form-group input,
  .form-group textarea {
    transition: none;
  }

  .submit-btn:hover:not(:disabled) {
    transform: none;
  }
}
</style>
