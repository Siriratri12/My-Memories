<script setup lang="ts">
defineProps<{
  firstName: string;
  memoryCount: number;
}>();

const emit = defineEmits<{
  (e: "openMemoryForm"): void;
  (e: "goToJournal"): void;
}>();
</script>

<template>
  <div>
    <section class="hero-card home-welcome">
      <p class="eyebrow">WELCOME BACK ✨</p>
      <h1>Hello there, {{ firstName }} 🌷</h1>
      <p class="subtitle">Every beautiful memory has a special place here. ♡</p>
      <button
        type="button"
        class="add-memory-btn"
        @click="emit('openMemoryForm')"
      >
        ＋ Add Memory
      </button>
    </section>

    <div class="stat-grid">
      <section class="stat-card">
        <span class="stat-icon">♡</span><strong>{{ memoryCount }}</strong
        ><span>♡ All Memories</span>
      </section>
      <section class="stat-card">
        <span class="stat-icon">✧</span><strong>My Journal</strong
        ><span>A Place to Capture Your Stories</span>
      </section>
    </div>

    <!-- เปลี่ยนเป็นพื้นหลังสีขาวตามคำขอ -->
    <section class="memories-section home-shortcut white-shortcut">
      <h2>Your Memories</h2>
      <p>Revisit your favorite moments or create new memories anytime.</p>
      <button type="button" class="prompt-button" @click="emit('goToJournal')">
        Open Memory Journal →
      </button>
    </section>
  </div>
</template>

<style scoped>
.white-shortcut {
  background: #fff !important;
  border: 1px solid #f1edf3;
  box-shadow: 0 4px 18px #39213e0c;
}

.white-shortcut h2 {
  color: #292235;
}

.white-shortcut p {
  color: #807087;
  margin-bottom: 22px;
}
</style>
