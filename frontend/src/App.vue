<script setup lang="ts">
import { ref, onMounted, watch, computed, nextTick } from "vue";
import AuthForm from "./components/AuthForm.vue";
import MemoryForm from "./components/MemoryForm.vue";
import MemoryList from "./components/MemoryList.vue";
import ProfileForm from "./components/ProfileForm.vue";
import Home from "./components/Home.vue";
import Sidebar from "./components/Sidebar.vue";
import { useAuth } from "./composables/useAuth";
import { apiRequest, ApiError } from "./services/api";
import type { Memory, MemoryInput } from "./types/memory";

const { token, user, login, register, updateProfile, logout, restoreSession } =
  useAuth();
type Page = "home" | "journal" | "profile";
const activePage = ref<Page>("journal");
const showMemoryForm = ref(false);
const profileLoading = ref(false);
const profileError = ref("");
const profileSuccess = ref("");
const memories = ref<Memory[]>([]);
const search = ref("");
const editingMemory = ref<Memory | null>(null);
const error = ref("");
const authError = ref("");
const loading = ref(false);
const authLoading = ref(false);
const initializing = ref(true);
const memoryForm = ref<InstanceType<typeof MemoryForm> | null>(null);
const authForm = ref<InstanceType<typeof AuthForm> | null>(null);
const memoryCount = computed(() => memories.value.length);
const firstName = computed(() => user.value?.name || "คุณ");

async function handleLogin(email: string, password: string) {
  authLoading.value = true;
  authError.value = "";
  try {
    await login(email, password);
    activePage.value = "journal";
    await loadMemories();
  } catch (err) {
    authError.value =
      err instanceof Error ? err.message : "เข้าสู่ระบบไม่สำเร็จ";
  } finally {
    authLoading.value = false;
  }
}

async function handleRegister(name: string, email: string, password: string) {
  authLoading.value = true;
  authError.value = "";
  try {
    await register(name, email, password);
    authForm.value?.showLogin();
    authError.value = "Registration successful. Please log in.";
  } catch (err) {
    authError.value =
      err instanceof Error ? err.message : "Registration failed";
  } finally {
    authLoading.value = false;
  }
}

function handleLogout() {
  logout();
  memories.value = [];
  editingMemory.value = null;
  search.value = "";
  error.value = "";
  profileError.value = "";
  profileSuccess.value = "";
  showMemoryForm.value = false;
  activePage.value = "journal";
}

function handleApiError(err: unknown, fallback: string) {
  if (err instanceof ApiError && err.status === 401) {
    handleLogout();
    authError.value = "เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่";
    return;
  }
  error.value = err instanceof Error ? err.message : fallback;
}

async function handleUpdateProfile(name: string) {
  profileLoading.value = true;
  profileError.value = "";
  profileSuccess.value = "";
  try {
    await updateProfile(name);
    profileSuccess.value = "Username updated successfully 🎉";
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) {
      handleLogout();
      authError.value = "Your session has expired. Please log in again";
      return;
    }
    profileError.value =
      err instanceof Error ? err.message : "Failed to update profile";
  } finally {
    profileLoading.value = false;
  }
}

async function loadMemories() {
  if (!token.value) return;
  const currentToken = token.value;
  loading.value = true;
  try {
    const result = await apiRequest<Memory[]>(
      `/memories?search=${encodeURIComponent(search.value)}`,
      {},
      currentToken,
    );
    if (token.value === currentToken) {
      memories.value = result;
      error.value = "";
    }
  } catch (err) {
    handleApiError(err, "โหลดข้อมูลไม่สำเร็จ");
  } finally {
    loading.value = false;
  }
}

async function saveMemory(data: MemoryInput) {
  if (!token.value) return;
  loading.value = true;
  error.value = "";
  try {
    const path = editingMemory.value
      ? `/memories/${editingMemory.value.id}`
      : "/memories";
    await apiRequest<Memory>(
      path,
      {
        method: editingMemory.value ? "PUT" : "POST",
        body: JSON.stringify(data),
      },
      token.value,
    );
    editingMemory.value = null;
    memoryForm.value?.reset();
    showMemoryForm.value = false;
    await loadMemories();
  } catch (err) {
    handleApiError(err, "บันทึกไม่สำเร็จ");
  } finally {
    loading.value = false;
  }
}

async function openMemoryForm() {
  activePage.value = "journal";
  editingMemory.value = null;
  showMemoryForm.value = true;
  await nextTick();
  memoryForm.value?.reset();
  document
    .getElementById("memory-editor")
    ?.scrollIntoView({ behavior: "smooth", block: "start" });
}

async function editMemory(memory: Memory) {
  activePage.value = "journal";
  editingMemory.value = memory;
  showMemoryForm.value = true;
  await nextTick();
  document
    .getElementById("memory-editor")
    ?.scrollIntoView({ behavior: "smooth", block: "start" });
}

async function deleteMemory(id: number) {
  if (!confirm("ต้องการลบบันทึกนี้หรือไม่?")) return;
  try {
    await apiRequest<void>(
      `/memories/${id}`,
      { method: "DELETE" },
      token.value,
    );
    await loadMemories();
  } catch (err) {
    handleApiError(err, "ลบข้อมูลไม่สำเร็จ");
  }
}

function cancelEdit() {
  editingMemory.value = null;
  memoryForm.value?.reset();
  showMemoryForm.value = false;
}

function goTo(page: Page) {
  activePage.value = page;
  if (page !== "journal") cancelEdit();
}

watch(search, () => {
  if (token.value) loadMemories();
});

onMounted(async () => {
  try {
    await restoreSession();
    if (token.value) await loadMemories();
  } finally {
    initializing.value = false;
  }
});
</script>

<template>
  <p v-if="initializing" class="loading-page">กำลังตรวจสอบการเข้าสู่ระบบ...</p>

  <AuthForm
    v-else-if="!token"
    ref="authForm"
    :loading="authLoading"
    :error="authError"
    @login="handleLogin"
    @register="handleRegister"
  />

  <div v-else class="app-shell">
    <!-- เรียกใช้งาน Sidebar Component -->
    <Sidebar
      :active-page="activePage"
      :user="user"
      @go-to="goTo"
      @logout="handleLogout"
    />

    <main class="main-area">
      <div class="topbar">
        <span class="breadcrumb"
          >My Memories <span>/</span>
          {{
            activePage === "home"
              ? "Home"
              : activePage === "profile"
                ? "Profile"
                : "Memory Journal"
          }}</span
        >
        <span class="topbar-greeting">Hello there, {{ firstName }} 🌷</span>
      </div>

      <div class="content-area">
        <template v-if="activePage === 'journal'">
          <section class="hero-card">
            <div class="hero-heading">
              <div class="hero-heading-left">
                <div class="hero-logo">✿</div>
                <div>
                  <p class="eyebrow">YOUR PERSONAL SPACE</p>
                  <h1>Memory Journal</h1>
                  <p class="subtitle">
                    Capture and cherish every moment that matters to you.
                  </p>
                </div>
              </div>
              <button
                type="button"
                class="add-memory-btn"
                @click="openMemoryForm"
              >
                <span>＋</span> Add Memory
              </button>
            </div>
            <div class="prompt-card">
              <div class="prompt-heading">
                <span>✧</span><strong>Today's Memory Prompt</strong>
              </div>
              <p>
                “Think back to your happiest moment. What made that day so
                special, and who was there by your side?”
              </p>
              <button
                type="button"
                class="prompt-button"
                @click="openMemoryForm"
              >
                Save This Memory ♡
              </button>
            </div>
          </section>

          <section
            v-if="showMemoryForm"
            id="memory-editor"
            class="editor-wrapper"
          >
            <div class="section-heading">
              <h2>
                {{ editingMemory ? "✎ Edit Memory" : "✦ Add New Memory" }}
              </h2>
              <button type="button" class="text-button" @click="cancelEdit">
                Close ✕
              </button>
            </div>
            <MemoryForm
              ref="memoryForm"
              :editing-memory="editingMemory"
              :loading="loading"
              @save="saveMemory"
              @cancel="cancelEdit"
            />
          </section>

          <section class="memories-section">
            <p v-if="error" class="error" role="alert">{{ error }}</p>
            <MemoryList
              v-model:search="search"
              :memories="memories"
              :loading="loading"
              @edit="editMemory"
              @delete="deleteMemory"
            />
          </section>
        </template>

        <template v-else-if="activePage === 'home'">
          <Home
            :first-name="firstName"
            :memory-count="memoryCount"
            @open-memory-form="openMemoryForm"
            @go-to-journal="goTo('journal')"
          />
        </template>

        <template v-else>
          <section class="hero-card profile-hero">
            <p class="eyebrow">ACCOUNT SETTINGS</p>
            <h1>My Profile ♡</h1>
            <p class="subtitle">Manage your personal information.</p>
          </section>
          <ProfileForm
            v-if="user"
            :user="user"
            :loading="profileLoading"
            :error="profileError"
            :success="profileSuccess"
            @save="handleUpdateProfile"
          />
        </template>
      </div>
    </main>
  </div>
</template>

<style>
/* คงสไตล์ CSS ส่วนกลางไว้ทั้งหมด */
:root {
  font-family:
    Inter,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    sans-serif;
  color: #34253e;
  background: #f7f6f9;
  font-synthesis: none;
}
body {
  margin: 0;
}
button,
input,
textarea,
select {
  font: inherit;
}
button {
  cursor: pointer;
}
button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}
.app-shell {
  min-height: 100vh;
  display: flex;
}
.sidebar {
  width: 268px;
  flex: 0 0 268px;
  background: #fff;
  border-right: 1px solid #eee9f0;
  padding: 30px 20px 22px;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  position: sticky;
  top: 0;
  height: 100vh;
}
.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 20px;
  font-weight: 850;
  letter-spacing: -0.7px;
  color: #35203e;
  white-space: nowrap;
}
.brand-symbol,
.hero-logo {
  background: linear-gradient(145deg, #a46ab5, #e6a3c4 58%, #f8cbd9);
  color: #fff;
  display: grid;
  place-items: center;
  box-shadow: 0 5px 18px #c99ac244;
}
.brand-symbol {
  width: 43px;
  height: 43px;
  border-radius: 15px;
  font-size: 29px;
}
.sidebar-label {
  color: #a9a0b0;
  font-size: 11px;
  letter-spacing: 1.8px;
  font-weight: 750;
  margin: 55px 12px 16px;
}
.side-nav {
  display: flex;
  flex-direction: column;
  gap: 9px;
}
.nav-item {
  display: flex;
  align-items: center;
  gap: 15px;
  width: 100%;
  text-align: left;
  padding: 15px 17px;
  border: 0;
  border-radius: 12px;
  background: transparent;
  color: #4b3b52;
  font-size: 15px;
  font-weight: 600;
  transition: 0.18s;
}
.nav-item:hover {
  background: #f7eef8;
}
.nav-item.active {
  color: #fff;
  background: linear-gradient(110deg, #d98bae, #ed9dbb);
  box-shadow: 0 7px 15px #e99dbb3b;
}
.nav-icon {
  width: 25px;
  font-size: 23px;
  line-height: 1;
  text-align: center;
  font-weight: 400;
}
.sidebar-bottom {
  margin-top: auto;
  border-top: 1px solid #f1edf2;
  padding-top: 20px;
}
.account-mini {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 5px 5px 18px;
  min-width: 0;
}
.account-avatar {
  background: #ead8f4;
  color: #713c8e;
  border-radius: 50%;
  width: 42px;
  height: 42px;
  flex: 0 0 42px;
  display: grid;
  place-items: center;
  font-weight: 800;
}
.account-info {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.account-info strong {
  font-size: 13px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.account-info small {
  font-size: 11px;
  color: #96899d;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.logout-button {
  background: #f7f2f8;
  color: #795484;
  border: 0;
  border-radius: 11px;
  padding: 12px 16px;
  width: 100%;
  text-align: left;
  font-weight: 650;
}
.logout-button:hover {
  background: #f0e4f4;
}
.main-area {
  flex: 1;
  min-width: 0;
}
.topbar {
  height: 70px;
  padding: 0 38px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  border-bottom: 1px solid #eee9f0;
  gap: 12px;
}
.breadcrumb {
  font-size: 13px;
  color: #8c8093;
}
.breadcrumb span {
  margin: 0 8px;
  color: #d2c8d5;
}
.topbar-greeting {
  font-size: 13px;
  font-weight: 650;
  color: #65446e;
}
.content-area {
  max-width: 1390px;
  margin: 0 auto;
  padding: 32px 36px 70px;
}
.hero-card,
.memories-section,
.stat-card,
.editor-wrapper {
  background: #fff;
  border-radius: 21px;
  padding: 32px;
  box-shadow: 0 4px 18px #39213e0c;
  border: 1px solid #f1edf3;
}
.hero-card {
  margin-bottom: 28px;
}
.hero-heading {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
  margin-bottom: 30px;
}
.hero-heading-left {
  display: flex;
  align-items: center;
  gap: 18px;
  min-width: 0;
}
.hero-logo {
  width: 74px;
  height: 74px;
  border-radius: 50%;
  font-size: 45px;
  flex: 0 0 74px;
}
.eyebrow {
  color: #af7da9;
  font-size: 11px;
  letter-spacing: 1.8px;
  font-weight: 800;
  margin: 0 0 9px;
}
h1 {
  margin: 0 0 7px;
  font-size: clamp(27px, 3vw, 39px);
  color: #34203d;
  letter-spacing: -0.9px;
}
h2 {
  margin: 0;
  font-size: 25px;
  color: #292235;
  letter-spacing: -0.4px;
}
.subtitle {
  margin: 0;
  color: #7b6d83;
  font-size: 15px;
  line-height: 1.7;
}
.add-memory-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  background: #e895b6;
  color: #fff;
  border: 0;
  border-radius: 12px;
  padding: 14px 22px;
  font-weight: 700;
  white-space: nowrap;
  box-shadow: 0 5px 12px #e895b62b;
}
.add-memory-btn span {
  font-size: 24px;
  line-height: 0.8;
  font-weight: 300;
}
.add-memory-btn:hover {
  background: #d77da4;
}
.prompt-card {
  background: linear-gradient(105deg, #faf2ff 0%, #eef4ff 100%);
  border-radius: 15px;
  padding: 28px 30px;
}
.prompt-heading {
  display: flex;
  align-items: center;
  gap: 13px;
  color: #2c2536;
  font-size: 20px;
}
.prompt-heading span {
  font-size: 27px;
  color: #8e37d9;
}
.prompt-card p {
  font-size: 17px;
  line-height: 1.8;
  color: #514658;
  margin: 18px 0 20px;
}
.prompt-button {
  background: #9339dc;
  color: #fff;
  border: 0;
  padding: 12px 19px;
  border-radius: 10px;
  font-weight: 700;
}
.prompt-button:hover {
  background: #7e27c6;
}
.memories-section {
  padding: 30px;
  background: linear-gradient(135deg, #c18dba 0%, #d29dbf 50%, #dfacc6 100%);
}
.section-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 24px;
}
.heading-heart {
  color: #e48db3;
}
.count-pill {
  border-radius: 50px;
  background: #f8edf6;
  color: #8c638d;
  padding: 8px 13px;
  font-size: 12px;
  white-space: nowrap;
}
.editor-wrapper {
  margin-bottom: 28px;
  scroll-margin-top: 22px;
}
.text-button {
  border: 0;
  background: transparent;
  color: #8b6b93;
  padding: 8px;
}
.error {
  color: #b42343;
}
.loading-page {
  text-align: center;
  margin-top: 100px;
  color: #7042a7;
}
.panel,
.card {
  background: #fff;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 3px 16px #492b7612;
}
.panel {
  margin-bottom: 24px;
}
label {
  display: block;
  margin: 14px 0 7px;
}
input,
textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #e4d9e8;
  border-radius: 9px;
  background: #fff;
}
input:focus,
textarea:focus {
  outline: 2px solid #cba3e2;
}
button {
  transition:
    background 0.15s,
    opacity 0.15s;
}
.panel button,
.card button {
  background: #8850ba;
  color: #fff;
  border: 0;
  border-radius: 9px;
  padding: 10px 17px;
}
.panel button.secondary,
.card button.secondary,
button.secondary {
  background: #f0e6f5;
  color: #684178;
}
.panel button.danger,
.card button.danger,
button.danger {
  background: #fce1e6;
  color: #a62c4b;
}
.actions {
  display: flex;
  gap: 10px;
  margin-top: 16px;
  flex-wrap: wrap;
}
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 18px;
  margin-top: 18px;
}
.card p {
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}
.card h3 {
  overflow-wrap: anywhere;
}
.card small {
  color: #866ba6;
}
.stat-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
  margin-bottom: 28px;
}
.stat-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.stat-card strong {
  font-size: 27px;
  color: #4a2b58;
}
.stat-card > span:last-child {
  color: #8b7b91;
  font-size: 14px;
}
.stat-icon {
  color: #ae6dca;
  font-size: 31px;
}
.home-welcome .add-memory-btn {
  margin-top: 24px;
}
.home-shortcut p {
  color: #807087;
  margin-bottom: 22px;
}
.profile-hero {
  padding: 38px;
}
@media (max-width: 950px) {
  .sidebar {
    width: 220px;
    flex-basis: 220px;
    padding: 24px 12px;
  }
  .brand {
    font-size: 16px;
  }
  .content-area {
    padding: 24px 20px 55px;
  }
  .topbar {
    padding: 0 20px;
  }
  .hero-card,
  .memories-section {
    padding: 24px;
  }
}
@media (max-width: 700px) {
  .app-shell {
    display: block;
  }
  .sidebar {
    position: static;
    height: auto;
    min-height: 0;
    width: 100%;
    padding: 15px;
    border-right: 0;
    border-bottom: 1px solid #eee9f0;
  }
  .brand {
    font-size: 18px;
  }
  .sidebar-label,
  .sidebar-bottom {
    display: none;
  }
  .side-nav {
    flex-direction: row;
    margin-top: 16px;
    gap: 7px;
  }
  .nav-item {
    flex: 1;
    padding: 11px 6px;
    justify-content: center;
    font-size: 12px;
    gap: 5px;
  }
  .nav-icon {
    font-size: 18px;
    width: auto;
  }
  .topbar {
    height: 50px;
    padding: 0 16px;
  }
  .topbar-greeting {
    max-width: 48%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .content-area {
    padding: 16px 12px 35px;
  }
  .hero-card,
  .memories-section,
  .editor-wrapper {
    padding: 19px;
    border-radius: 16px;
  }
  .hero-heading {
    flex-direction: column;
    align-items: stretch;
  }
  .hero-logo {
    width: 52px;
    height: 52px;
    flex-basis: 52px;
    font-size: 32px;
  }
  .hero-heading-left {
    gap: 12px;
  }
  .add-memory-btn {
    align-self: flex-start;
  }
  .prompt-card {
    padding: 19px;
  }
  .prompt-card p {
    font-size: 15px;
  }
  .prompt-heading {
    font-size: 17px;
  }
  .stat-grid {
    grid-template-columns: 1fr;
  }
  .section-heading {
    align-items: flex-start;
  }
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>
