<script setup lang="ts">
import type { Memory } from "../types/memory";

defineProps<{
  memories: Memory[];
  search: string;
  loading: boolean;
}>();

const emit = defineEmits<{
  "update:search": [value: string];
  edit: [memory: Memory];
  delete: [id: number];
}>();

function handleSearch(event: Event) {
  emit("update:search", (event.target as HTMLInputElement).value);
}

function formatDate(date: string | Date) {
  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "No Date Specified";
  }

  return parsed.toLocaleDateString("th-TH", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
</script>

<template>
  <section class="memories-section">
    <!-- HEADER -->
    <div class="memories-header">
      <div>
        <span class="section-eyebrow">MY COLLECTION</span>
        <h2>My Memories<span>♡</span></h2>
        <p class="section-description">
          Every precious story deserves a special place of its own.
        </p>
      </div>

      <div class="memory-count">
        <span class="count-number">{{ memories.length }}</span>
        <span class="count-label">Items Displayed</span>
      </div>
    </div>

    <!-- SEARCH -->
    <div class="search-area">
      <div class="search-box">
        <svg
          class="search-icon"
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>

        <input
          type="search"
          :value="search"
          @input="handleSearch"
          placeholder="Search memories by title or story..."
          aria-label="Search memories"
        />
      </div>
    </div>

    <!-- LOADING -->
    <div v-if="loading" class="state-box" role="status">
      <div class="loading-spinner"></div>
      <h3>Loading Memories...</h3>
      <p>Just a moment, please 💜</p>
    </div>

    <!-- EMPTY STATE -->
    <div v-else-if="!memories.length" class="state-box">
      <div class="empty-icon">♡</div>

      <h3>
        {{ search ? "No matching memories found" : "No memories yet" }}
      </h3>

      <p>
        {{
          search
            ? "Try searching with different keywords."
            : "Start capturing your beautiful memories today."
        }}
      </p>
    </div>

    <!-- MEMORY CARDS -->
    <div v-else class="memory-grid">
      <article v-for="memory in memories" :key="memory.id" class="memory-card">
        <div class="card-top">
          <div class="memory-icon" aria-hidden="true">♡</div>

          <span class="memory-date">
            {{ formatDate(memory.memoryDate) }}
          </span>
        </div>

        <div class="card-content">
          <h3>{{ memory.title }}</h3>

          <p class="memory-description">
            {{ memory.description }}
          </p>
        </div>

        <div class="card-footer">
          <span class="memory-label">
            <span class="label-dot"></span>
            My Memory
          </span>

          <div class="card-actions">
            <button
              type="button"
              class="edit-btn"
              :aria-label="`แก้ไข ${memory.title}`"
              @click="emit('edit', memory)"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
              </svg>
              Edit
            </button>

            <button
              type="button"
              class="delete-btn"
              :aria-label="`Delete ${memory.title}`"
              @click="emit('delete', memory.id)"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <path d="M3 6h18" />
                <path d="M8 6V4h8v2" />
                <path d="M19 6l-1 14H6L5 6" />
                <path d="M10 10v7M14 10v7" />
              </svg>
              Delete
            </button>
          </div>
        </div>
      </article>
    </div>

    <!-- FOOTER -->
    <div v-if="memories.length && !loading" class="memories-footer">
      <span>♡</span>
      Every memory is a little piece of your story.
    </div>
  </section>
</template>

<style scoped>
.memories-section {
  background: #ffffff;
  border: 1px solid #f0eaf5;
  border-radius: 24px;
  padding: 32px;
  box-shadow: 0 6px 28px rgba(73, 43, 118, 0.05);
}

/* Header */
.memories-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
  margin-bottom: 26px;
}

.section-eyebrow {
  display: block;
  font-size: 11px;
  letter-spacing: 2px;
  font-weight: 700;
  color: #aa81c5;
  margin-bottom: 10px;
}

.memories-header h2 {
  color: #33233e;
  font-size: 26px;
  margin: 0 0 9px;
}

.memories-header h2 span {
  color: #e49ab7;
}

.section-description {
  color: #95899e;
  font-size: 14px;
  margin: 0;
}

.memory-count {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 100px;
  padding: 13px 20px;
  background: #f8f2fc;
  border-radius: 15px;
}

.count-number {
  color: #8454b1;
  font-size: 25px;
  font-weight: 700;
}

.count-label {
  color: #9784a5;
  font-size: 11px;
}

/* Search */
.search-area {
  margin-bottom: 30px;
}

.search-box {
  position: relative;
}

.search-icon {
  position: absolute;
  left: 17px;
  top: 50%;
  transform: translateY(-50%);
  color: #a698b2;
  pointer-events: none;
}

.search-box input {
  width: 100%;
  padding: 16px 18px 16px 50px;
  border: 1px solid #e8e0ee;
  border-radius: 14px;
  background: #fff;
  color: #382744;
  font-size: 14px;
  font-family: inherit;
  outline: none;
  transition: 0.2s ease;
}

.search-box input:focus {
  border-color: #a77dc8;
  box-shadow: 0 0 0 4px rgba(167, 125, 200, 0.11);
}

.search-box input::placeholder {
  color: #aaa1b1;
}

/* Grid */
.memory-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 280px), 1fr));
  gap: 20px;
}

.memory-card {
  display: flex;
  flex-direction: column;
  min-width: 0;
  background: #fff;
  border: 1px solid #eee5f4;
  border-radius: 18px;
  padding: 22px;
  transition: 0.25s ease;
  box-shadow: 0 3px 14px rgba(73, 43, 118, 0.035);
}

.memory-card:hover {
  transform: translateY(-4px);
  border-color: #dfc9ed;
  box-shadow: 0 12px 26px rgba(104, 67, 139, 0.1);
}

/* Card Top */
.card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 22px;
}

.memory-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 45px;
  height: 45px;
  border-radius: 13px;
  background: #f3e8fa;
  color: #a36cc4;
  font-size: 26px;
}

.memory-date {
  font-size: 12px;
  color: #9987a6;
  text-align: right;
}

/* Card Content */
.card-content {
  flex: 1;
  min-width: 0;
}

.card-content h3 {
  margin: 0 0 12px;
  font-size: 19px;
  color: #382744;
  line-height: 1.45;
  overflow-wrap: anywhere;
}

.memory-description {
  color: #82748d;
  font-size: 14px;
  line-height: 1.8;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 4;
  line-clamp: 4;
  overflow: hidden;
}

/* Footer */
.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 25px;
  padding-top: 17px;
  border-top: 1px solid #f2edf6;
}

.memory-label {
  display: flex;
  align-items: center;
  gap: 7px;
  color: #9b83ab;
  font-size: 11px;
  font-weight: 600;
}

.label-dot {
  width: 7px;
  height: 7px;
  background: #e6a3be;
  border-radius: 50%;
}

.card-actions {
  display: flex;
  gap: 8px;
}

.edit-btn,
.delete-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 9px 11px;
  border: none;
  border-radius: 9px;
  font-size: 12px;
  font-family: inherit;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s;
}

.edit-btn {
  background: #f0e7f8;
  color: #8254a7;
}

.edit-btn:hover {
  background: #e5d5f1;
}

.delete-btn {
  background: #fceaf0;
  color: #c05b80;
}

.delete-btn:hover {
  background: #f8dce7;
}

/* Empty & Loading */
.state-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 65px 20px;
  background: #fcfaff;
  border: 1px dashed #e7d9ef;
  border-radius: 17px;
}

.empty-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #f2e6f9;
  color: #aa79c7;
  font-size: 48px;
  margin-bottom: 18px;
}

.state-box h3 {
  color: #584368;
  font-size: 18px;
  margin: 0 0 9px;
}

.state-box p {
  color: #9a8ba5;
  font-size: 14px;
}

.loading-spinner {
  width: 36px;
  height: 36px;
  border: 3px solid #eadcf3;
  border-top-color: #9d6cc2;
  border-radius: 50%;
  margin-bottom: 20px;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.memories-footer {
  text-align: center;
  color: #a18cad;
  font-size: 12px;
  margin-top: 30px;
}

.memories-footer span {
  color: #d994b4;
  font-size: 18px;
  margin-right: 6px;
}

/* Responsive */
@media (max-width: 650px) {
  .memories-section {
    padding: 22px 16px;
    border-radius: 18px;
  }

  .memories-header h2 {
    font-size: 22px;
  }

  .memory-count {
    align-items: flex-start;
  }

  .memory-card {
    padding: 18px;
  }

  .card-footer {
    align-items: flex-start;
  }
}

@media (prefers-reduced-motion: reduce) {
  .memory-card,
  .edit-btn,
  .delete-btn,
  .search-box input {
    transition: none;
  }

  .memory-card:hover {
    transform: none;
  }

  .loading-spinner {
    animation: none;
  }
}
</style>
