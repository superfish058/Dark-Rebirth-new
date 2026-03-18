<template>
  <div class="profile-page">
    <div class="profile-page__header">
      <div class="profile-page__avatar">
        <van-image
          v-if="userStore.userAvatar"
          :src="userStore.userAvatar"
          round
          width="80"
          height="80"
        />
        <div v-else class="profile-page__default-avatar">
          {{ userStore.userNickname.charAt(0) }}
        </div>
      </div>
      <h2 class="profile-page__nickname">{{ userStore.userNickname }}</h2>
      <p v-if="userStore.isAuthenticated" class="profile-page__email">
        {{ userStore.userEmail }}
      </p>
      <van-button
        v-if="!userStore.isAuthenticated"
        type="primary"
        size="small"
        @click="handleLogin"
      >
        登录
      </van-button>
    </div>

    <van-cell-group v-if="userStore.isAuthenticated" class="profile-page__menu">
      <van-cell title="我的收藏" is-link to="/m/web-collection" icon="star-o" />
      <van-cell title="我的待办" is-link to="/m/todo" icon="todo-list-o" />
      <van-cell title="个人资料" is-link icon="user-o" />
      <van-cell title="设置" is-link icon="setting-o" />
    </van-cell-group>

    <van-cell-group v-else class="profile-page__menu">
      <van-cell title="登录" is-link to="/auth/login" icon="user-o" />
      <van-cell title="注册" is-link to="/auth/register" icon="add-o" />
    </van-cell-group>

    <van-button
      v-if="userStore.isAuthenticated"
      type="danger"
      block
      class="profile-page__logout"
      @click="handleLogout"
    >
      退出登录
    </van-button>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { showDialog } from 'vant'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

function handleLogin() {
  router.push('/auth/login')
}

async function handleLogout() {
  showDialog({
    title: '提示',
    message: '确定要退出登录吗？',
    showCancelButton: true
  }).then(async (action) => {
    if (action === 'confirm') {
      await userStore.logout()
      router.replace('/m/home')
    }
  })
}
</script>

<style scoped lang="scss">
@use "@/assets/styles/variables.scss" as *;
@use "@/assets/styles/mixins.scss" as *;

.profile-page {
  min-height: 100vh;
  background: $bg-primary;

  &__header {
    @include flex-column;
    align-items: center;
    padding: $spacing-8 $spacing-4;
    background: $bg-secondary;
    margin-bottom: $spacing-4;
  }

  &__avatar {
    margin-bottom: $spacing-4;
  }

  &__default-avatar {
    width: 80px;
    height: 80px;
    @include flex-center;
    background: $primary-gradient;
    border-radius: 50%;
    font-size: $font-size-3xl;
    font-weight: $font-weight-bold;
    color: $text-primary;
  }

  &__nickname {
    font-size: $font-size-xl;
    font-weight: $font-weight-semibold;
    margin-bottom: $spacing-2;
  }

  &__email {
    font-size: $font-size-sm;
    color: $text-secondary;
    margin-bottom: $spacing-4;
  }

  &__menu {
    margin-bottom: $spacing-4;
  }

  &__logout {
    margin: $spacing-4;
  }
}
</style>