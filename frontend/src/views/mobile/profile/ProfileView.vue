<template>
  <MobileLayout title="我的">
    <div class="profile-container">
      <!-- 个人信息卡片 -->
      <div class="profile-card">
        <div class="avatar-section" @click="showAvatarUpload = !showAvatarUpload">
          <img v-if="userStore.user?.avatar" :src="userStore.user.avatar" class="avatar" alt="头像" />
          <div v-else class="avatar-placeholder">
            {{ userStore.user?.username?.charAt(0).toUpperCase() || '?' }}
          </div>
          <div class="avatar-edit-icon">
            <Icon icon="mdi:camera" />
          </div>
        </div>
        <div class="user-info">
          <h2 class="username">{{ userStore.user?.username || '用户' }}</h2>
          <p class="user-email">{{ userStore.user?.email || '未设置邮箱' }}</p>
        </div>
      </div>

      <!-- 头像上传面板 -->
      <div v-if="showAvatarUpload" class="avatar-upload-panel">
        <div class="upload-card">
          <h3>更换头像</h3>
          <div class="upload-btn-hand-drawn" @click="fileInput.click()">
            选择图片
          </div>
          <input type="file" ref="fileInput" @change="handleFileSelect" accept="image/*" class="file-input"
            style="display: none;" />
          <div v-if="previewImage" class="preview-container">
            <img :src="previewImage" class="preview-image" alt="预览" />
          </div>
          <div class="upload-actions">
            <button class="btn-hand-drawn btn-secondary" @click="showAvatarUpload = false">取消</button>
            <button class="btn-hand-drawn" @click="handleUploadAvatar" :disabled="!selectedFile || uploading">
              {{ uploading ? '上传中...' : '上传' }}
            </button>
          </div>
        </div>
      </div>

      <!-- 功能列表 -->
      <div class="function-list">
        <div class="function-category">
          <h4 class="category-title">账户设置</h4>
          <div class="function-items">
            <div class="function-item">
              <div class="function-icon">📧</div>
              <div class="function-info">
                <h5 class="function-name">修改邮箱</h5>
                <p class="function-description">更新你的邮箱地址</p>
              </div>
              <div class="function-arrow">
                <Icon icon="mdi:chevron-right" />
              </div>
            </div>
            <div class="function-item">
              <div class="function-icon">🔒</div>
              <div class="function-info">
                <h5 class="function-name">修改密码</h5>
                <p class="function-description">更改你的账户密码</p>
              </div>
              <div class="function-arrow">
                <Icon icon="mdi:chevron-right" />
              </div>
            </div>
          </div>
        </div>

        <div class="function-category">
          <h4 class="category-title">应用设置</h4>
          <div class="function-items">
            <div class="function-item">
              <div class="function-icon">🌙</div>
              <div class="function-info">
                <h5 class="function-name">深色模式</h5>
                <p class="function-description">切换应用主题</p>
              </div>
              <div class="function-toggle">
                <label class="toggle-switch">
                  <input type="checkbox" v-model="darkMode" />
                  <span class="toggle-slider"></span>
                </label>
              </div>
            </div>
            <div class="function-item">
              <div class="function-icon">🔔</div>
              <div class="function-info">
                <h5 class="function-name">通知设置</h5>
                <p class="function-description">管理应用通知</p>
              </div>
              <div class="function-arrow">
                <Icon icon="mdi:chevron-right" />
              </div>
            </div>
          </div>
        </div>

        <div class="function-category">
          <h4 class="category-title">关于</h4>
          <div class="function-items">
            <div class="function-item">
              <div class="function-icon">ℹ️</div>
              <div class="function-info">
                <h5 class="function-name">关于应用</h5>
                <p class="function-description">版本信息和使用说明</p>
              </div>
              <div class="function-arrow">
                <Icon icon="mdi:chevron-right" />
              </div>
            </div>
            <div class="function-item">
              <div class="function-icon">📞</div>
              <div class="function-info">
                <h5 class="function-name">联系我们</h5>
                <p class="function-description">获取帮助和支持</p>
              </div>
              <div class="function-arrow">
                <Icon icon="mdi:chevron-right" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 退出登录按钮 -->
      <button class="logout-button" @click="showLogoutModal = true">
        <Icon icon="mdi:logout" />
        <span>退出登录</span>
      </button>

      <!-- 退出登录模态框 -->
      <Modal v-model:visible="showLogoutModal" title="退出登录" size="small" @close="cancelLogout" @cancel="cancelLogout"
        @confirm="confirmLogout" :confirm-text="'确定'" :cancel-text="'取消'">
        <p class="logout-message">确定要退出登录吗？</p>
      </Modal>
    </div>
  </MobileLayout>
</template>

<script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useUserStore } from '../../../stores/user'
  import MobileLayout from '../components/MobileLayout.vue'
  import Modal from '../../../components/Modal.vue'
  import { Icon } from '@iconify/vue'

  const router = useRouter()
  const userStore = useUserStore()

  // 响应式数据
  const showAvatarUpload = ref(false)
  const selectedFile = ref(null)
  const previewImage = ref('')
  const uploading = ref(false)
  const showLogoutModal = ref(false)
  const darkMode = ref(false)

  // 引用
  const fileInput = ref(null)

  // 方法
  function handleFileSelect(event) {
    const file = event.target.files[0]
    if (file) {
      selectedFile.value = file
      const reader = new FileReader()
      reader.onload = (e) => {
        previewImage.value = e.target.result
      }
      reader.readAsDataURL(file)
    }
  }

  async function handleUploadAvatar() {
    if (!selectedFile.value) return

    uploading.value = true
    try {
      await userStore.updateAvatar(selectedFile.value)
      showAvatarUpload.value = false
      selectedFile.value = null
      previewImage.value = ''
    } catch (err) {
      console.error('上传头像失败', err)
    } finally {
      uploading.value = false
    }
  }

  function handleLogout() {
    userStore.logout()
    router.push('/login')
  }

  function confirmLogout() {
    showLogoutModal.value = false
    handleLogout()
  }

  function cancelLogout() {
    showLogoutModal.value = false
  }
</script>

<style scoped>
  .profile-container {
    padding: 0 16px;
  }

  .profile-card {
    background: white;
    padding: 24px;
    border-radius: 16px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    margin-bottom: 24px;
    display: flex;
    align-items: center;
    gap: 20px;
  }

  .avatar-section {
    position: relative;
    cursor: pointer;
  }

  .avatar {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    object-fit: cover;
    border: 3px solid var(--primary);
  }

  .avatar-placeholder {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: var(--primary);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 32px;
    font-weight: bold;
    border: 3px solid var(--primary);
  }

  .avatar-edit-icon {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 28px;
    height: 28px;
    background: var(--primary);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    border: 2px solid white;
  }

  .avatar-edit-icon :deep(.iconify) {
    font-size: 14px;
    width: 14px;
    height: 14px;
  }

  .user-info h2 {
    margin: 0 0 8px;
    font-size: 20px;
    color: var(--text-primary);
  }

  .user-email {
    margin: 0;
    font-size: 14px;
    color: var(--text-secondary);
  }

  .avatar-upload-panel {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 200;
    padding: 20px;
  }

  .upload-card {
    background: white;
    padding: 30px;
    border-radius: 30px 4px 30px 4px;
    border: 3px solid var(--border);
    width: 100%;
    max-width: 360px;
  }

  .upload-card h3 {
    margin: 0 0 20px;
    text-align: center;
    color: var(--text-primary);
  }

  .upload-btn-hand-drawn {
    width: 100%;
    padding: 12px 20px;
    border: 2px solid var(--primary);
    border-radius: 20px 4px 20px 4px;
    background: white;
    color: var(--primary);
    text-align: center;
    cursor: pointer;
    font-family: 'Comic Sans MS', 'Marker Felt', 'Arial Rounded MT Bold', sans-serif;
    font-weight: 600;
    font-size: 16px;
    transition: all 0.2s;
    margin-bottom: 16px;
    transform: rotate(-0.5deg);
  }



  .file-input {
    display: none;
  }

  .preview-container {
    text-align: center;
    margin-bottom: 16px;
  }

  .preview-image {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    object-fit: cover;
    border: 3px solid var(--primary);
  }

  .upload-actions {
    display: flex;
    gap: 12px;
    justify-content: flex-end;
  }

  .function-list {
    margin-bottom: 32px;
  }

  .function-category {
    margin-bottom: 24px;
  }

  .category-title {
    font-size: 16px;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0 0 12px;
    padding-left: 8px;
    border-left: 4px solid var(--primary);
  }

  .function-items {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .function-item {
    background: white;
    padding: 16px;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    gap: 12px;
    cursor: pointer;
    transition: all 0.2s;
  }



  .function-icon {
    font-size: 24px;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--bg-secondary);
    border-radius: 10px;
  }

  .function-info {
    flex: 1;
  }

  .function-name {
    font-size: 16px;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0 0 4px;
  }

  .function-description {
    font-size: 12px;
    color: var(--text-secondary);
    margin: 0;
  }

  .function-arrow :deep(.iconify) {
    color: var(--text-secondary);
    font-size: 16px;
    width: 16px;
    height: 16px;
  }

  .function-toggle {
    display: flex;
    align-items: center;
  }

  .toggle-switch {
    position: relative;
    display: inline-block;
    width: 50px;
    height: 24px;
  }

  .toggle-switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  .toggle-slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    transition: .4s;
    border-radius: 24px;
  }

  .toggle-slider:before {
    position: absolute;
    content: "";
    height: 18px;
    width: 18px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    transition: .4s;
    border-radius: 50%;
  }

  input:checked + .toggle-slider {
    background-color: var(--primary);
  }

  input:checked + .toggle-slider:before {
    transform: translateX(26px);
  }

  .logout-button {
    width: 100%;
    padding: 16px;
    background: white;
    border: 2px solid var(--error);
    border-radius: 12px;
    color: var(--error);
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: all 0.2s;
    margin-bottom: 32px;
  }

  .logout-button :deep(.iconify) {
    font-size: 18px;
    width: 18px;
    height: 18px;
  }



  .logout-message {
    text-align: center;
    color: var(--text-primary);
    font-size: 16px;
    margin: 0;
    padding: 20px 0;
    font-family: 'Comic Sans MS', 'Marker Felt', 'Arial Rounded MT Bold', sans-serif;
  }
</style>