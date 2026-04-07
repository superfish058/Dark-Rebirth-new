<template>
  <div v-if="visible" class="modal-overlay" @click.self="handleClose">
    <div class="modal-content" :class="size">
      <div class="modal-header">
        <h3 v-if="title" class="modal-title">{{ title }}</h3>
        <button class="close-btn" @click="handleClose" aria-label="关闭">
          <i class="fas fa-times close-icon"></i>
        </button>
      </div>
      <div class="modal-body">
        <slot></slot>
      </div>
      <div v-if="showActions" class="modal-actions">
        <button v-if="showCancel" class="btn-hand-drawn btn-cancel" @click="handleCancel">
          {{ cancelText }}
        </button>
        <button class="btn-hand-drawn" @click="handleConfirm" :disabled="loading">
          {{ loading ? loadingText : confirmText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  },
  showActions: {
    type: Boolean,
    default: true
  },
  showCancel: {
    type: Boolean,
    default: true
  },
  confirmText: {
    type: String,
    default: '确认'
  },
  cancelText: {
    type: String,
    default: '取消'
  },
  loading: {
    type: Boolean,
    default: false
  },
  loadingText: {
    type: String,
    default: '处理中...'
  },
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  }
})

const emit = defineEmits(['close', 'cancel', 'confirm'])

function handleClose() {
  emit('close')
}

function handleCancel() {
  emit('cancel')
}

function handleConfirm() {
  emit('confirm')
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 150;
  padding: 20px;
}

.modal-content {
  background: white;
  padding: 30px;
  border-radius: 12px;
  border: 3px solid var(--border);
  width: 100%;
  max-width: 400px;
  box-shadow: 8px 8px 0 rgba(0,0,0,0.1);
  position: relative;
}

.modal-content.small {
  max-width: 300px;
}

.modal-content.medium {
  max-width: 400px;
}

.modal-content.large {
  max-width: 500px;
  padding: 40px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.modal-title {
  margin: 0;
  text-align: center;
  color: var(--text-primary);
  font-family: 'Comic Sans MS', 'Marker Felt', 'Arial Rounded MT Bold', sans-serif;
  font-size: 20px;
  flex: 1;
}

.close-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  background: none;
  border: none;
  font-size: 28px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 8px;
  transition: all 0.2s;
  z-index: 10;
}

.close-btn:hover {
  background: var(--bg-secondary);
  transform: scale(1.1);
}

.close-icon {
  display: block;
  line-height: 1;
  color: var(--text-secondary);
  font-size: 24px;
  transition: all 0.2s ease;
}

.close-btn:hover .close-icon {
  color: var(--error);
}

.modal-body {
  margin-bottom: 32px;
}

.modal-body input {
  margin-bottom: 24px;
}

.modal-actions {
  display: flex;
  gap: 16px;
  justify-content: flex-end;
  margin-top: 8px;
}

.btn-hand-drawn {
  border-radius: 8px;
  transform: none;
}

.btn-hand-drawn:hover {
  transform: scale(1.05);
  box-shadow: 4px 4px 0 rgba(0,0,0,0.15);
}

.btn-cancel {
  background: white;
  border-color: var(--text-primary);
  color: var(--text-primary);
}
</style>