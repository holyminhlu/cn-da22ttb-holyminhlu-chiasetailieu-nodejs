<template>
  <div class="profile-tabs">
    <div class="tabs-header" role="tablist" aria-label="Profile sections">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        :class="['tab-button', { active: activeTab === tab.id }]"
        :aria-selected="activeTab === tab.id"
        :aria-controls="`tabpanel-${tab.id}`"
        :id="`tab-${tab.id}`"
        role="tab"
        @click="handleTabClick(tab.id)"
        @keydown.enter="handleTabClick(tab.id)"
        @keydown.space.prevent="handleTabClick(tab.id)"
      >
        <span v-if="tab.icon" class="tab-icon">{{ tab.icon }}</span>
        <span class="tab-label">{{ tab.label }}</span>
      </button>
    </div>

    <div class="tabs-content">
      <div
        v-for="tab in tabs"
        :key="tab.id"
        v-show="activeTab === tab.id"
        :id="`tabpanel-${tab.id}`"
        :aria-labelledby="`tab-${tab.id}`"
        role="tabpanel"
        class="tab-panel"
      >
        <slot :name="tab.id"></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProfileTabs',
  props: {
    tabs: {
      type: Array,
      required: true
    },
    activeTab: {
      type: String,
      required: true
    }
  },
  emits: ['tab-change'],
  setup(props, { emit }) {
    const handleTabClick = (tabId) => {
      emit('tab-change', tabId)
    }

    return {
      handleTabClick
    }
  }
}
</script>

<style scoped>
.profile-tabs {
  display: flex;
  flex-direction: column;
}

.tabs-header {
  display: flex;
  gap: 0.5rem;
  padding: 0 2rem;
  border-bottom: 2px solid #E2E8F0;
  overflow-x: auto;
  scrollbar-width: none;
}

.tabs-header::-webkit-scrollbar {
  display: none;
}

.tab-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  background: transparent;
  border: none;
  border-bottom: 3px solid transparent;
  color: #64748B;
  font-size: 0.9375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
  position: relative;
  bottom: -2px;
}

.tab-button:hover {
  color: #0B6EFD;
  background: #F8FAFF;
}

.tab-button.active {
  color: #0B6EFD;
  border-bottom-color: #0B6EFD;
}

.tab-button:focus {
  outline: 2px solid #0B6EFD;
  outline-offset: 2px;
  border-radius: 6px 6px 0 0;
}

.tab-icon {
  font-size: 1.125rem;
}

.tabs-content {
  min-height: 400px;
}

.tab-panel {
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .tab-panel {
    animation: none;
  }
}

@media (max-width: 599px) {
  .tabs-header {
    padding: 0 1rem;
  }

  .tab-button {
    padding: 0.75rem 1rem;
    font-size: 0.875rem;
  }

  .tab-icon {
    display: none;
  }
}
</style>

