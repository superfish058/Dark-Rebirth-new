<template>
  <header class="top-navbar">
    <div class="top-navbar__container">
      <div class="top-navbar__logo">
        <h1>Dark Rebirth</h1>
      </div>
      <div class="top-navbar__actions">
        <el-dropdown v-if="userStore.isAuthenticated" @command="handleCommand">
          <div class="top-navbar__user">
            <el-avatar :size="36" :src="userStore.userAvatar">
              {{ userStore.userNickname.charAt(0) }}
            </el-avatar>
            <span class="top-navbar__username">{{ userStore.userNickname }}</span>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="profile">个人资料</el-dropdown-item>
              <el-dropdown-item command="settings">设置</el-dropdown-item>
              <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <el-button v-else type="primary" @click="handleLogin">登录</el-button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

function handleLogin() {
  router.push('/auth/login')
}

function handleCommand(command: string) {
  switch (command) {
    case 'profile':
      ElMessage.info('个人资料功能开发中')
      break
    case 'settings':
      ElMessage.info('设置功能开发中')
      break
    case 'logout':
      handleLogout()
      break
  }
}

async function handleLogout() {
  try {
    await userStore.logout()
    ElMessage.success('退出登录成功')
    router.push('/auth/login')
  } catch (error) {
    ElMessage.error('退出登录失败')
  }
}
</script>

<style scoped lang="scss">
@use "@/assets/styles/variables.scss" as *;
@use "@/assets/styles/mixins.scss" as *;

.top-navbar {
  background: $bg-secondary;
  border-bottom: 1px solid $border-primary;
  height: 64px;
  box-shadow: $shadow-sm;

  &__container {
    @include flex-between;
    margin: 0 auto;
    padding: 0 $spacing-6;
    height: 100%;
  }

  &__logo {
    h1 {
      font-size: $font-size-xl;
      font-weight: $font-weight-bold;
      background: $primary-gradient;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
  }

  &__actions {
    display: flex;
    align-items: center;
    gap: $spacing-4;
  }

  &__user {
    @include flex-center;
    gap: $spacing-3;
    cursor: pointer;
    padding: $spacing-2 $spacing-3;
    border-radius: $radius-base;
    transition: background $duration-fast $ease-out;

    &:hover {
      background: $bg-hover;
    }
  }

  &__username {
    font-size: $font-size-sm;
    color: $text-primary;
  }
}
</style>