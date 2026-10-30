<script setup lang="ts">
import type { User } from "../types/user"; // ปรับ Path ตามโครงสร้างโปรเจกต์ของคุณ

defineProps<{
  activePage: string;
  user: User | null;
}>();

const emit = defineEmits<{
  (e: "goTo", page: "home" | "journal" | "profile"): void;
  (e: "logout"): void;
}>();
</script>

<template>
  <aside class="sidebar">
    <div class="brand">
      <div class="brand-symbol"><span>✿</span></div>
      <span>MY MEMORIES</span>
    </div>

    <div class="sidebar-label">YOUR SPACE</div>
    <nav class="side-nav" aria-label="เมนูหลัก">
      <button
        type="button"
        class="nav-item"
        :class="{ active: activePage === 'home' }"
        @click="emit('goTo', 'home')"
      >
        <span class="nav-icon">⌂</span><span>Home</span>
      </button>
      <button
        type="button"
        class="nav-item"
        :class="{ active: activePage === 'journal' }"
        @click="emit('goTo', 'journal')"
      >
        <span class="nav-icon">▤</span><span>Memory Journal</span>
      </button>
      <button
        type="button"
        class="nav-item"
        :class="{ active: activePage === 'profile' }"
        @click="emit('goTo', 'profile')"
      >
        <span class="nav-icon">♡</span><span>Profile</span>
      </button>
    </nav>

    <div class="sidebar-bottom">
      <div class="account-mini" v-if="user">
        <div class="account-avatar">
          {{ user.name?.charAt(0).toUpperCase() || "M" }}
        </div>
        <div class="account-info">
          <strong>{{ user.name }}</strong
          ><small>{{ user.email }}</small>
        </div>
      </div>
      <button type="button" class="logout-button" @click="emit('logout')">
        ↪ &nbsp; Sign Out
      </button>
    </div>
  </aside>
</template>
