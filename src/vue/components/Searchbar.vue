<template>
  <component
    :is="component"
    ref="elRef"
    :class="c.base"
    @blur-capture="onGlobalBlur"
    @focus-capture="onGlobalFocus"
  >
    <div :class="c.inner">
      <span :class="c.searchIconWrap">
        <SearchIcon :theme="theme" :class="c.searchIcon" />
      </span>
      <input
        :id="inputId"
        ref="searchElRef"
        :class="cls(c.input)"
        :style="inputStyle"
        type="text"
        name="search"
        :placeholder="placeholder"
        :value="value"
        @input="handleInput"
        @change="handleChange"
        @focus="handleFocus"
        @blur="handleBlur"
      />
      <button
        v-if="value && clearButton"
        :class="c.clearButton"
        type="button"
        @click="onClear"
      >
        <DeleteIcon :theme="theme" :class="c.deleteIcon" />
      </button>
    </div>
    <template v-if="disableButton">
      <button
        v-if="theme === 'ios'"
        ref="disableButtonRef"
        type="button"
        :style="{
          marginRight: isEnabled ? 0 : `-${disableButtonWidth}px`,
          transitionDuration: !allowTransition ? '0ms' : '',
        }"
        :class="c.cancelButton"
        @click="handleDisableButton"
        @pointerdown.prevent
      >
        {{ disableButtonText }}
      </button>
      <BackIcon
        v-else
        :class="cls(c.cancelButton)"
        :theme="theme"
        @click="handleDisableButton"
        @pointerdown.prevent
      />
    </template>
  </component>
</template>
<script>
  import { ref, computed, onMounted } from 'vue';
  import { cls } from '../../shared/cls.js';
  import { useTheme } from '../shared/use-theme.js';
  import { useThemeClasses } from '../shared/use-theme-classes.js';
  import { useDarkClasses } from '../shared/use-dark-classes.js';

  import { SearchbarClasses } from '../../shared/classes/SearchbarClasses.js';
  import { SearchbarColors } from '../../shared/colors/SearchbarColors.js';
  import { useTouchRipple } from '../shared/use-touch-ripple.js';
  import DeleteIcon from './icons/DeleteIcon.vue';
  import SearchIcon from './icons/SearchIcon.vue';
  import BackIcon from './icons/BackIcon.vue';

  export default {
    name: 'k-searchbar',
    components: { DeleteIcon, BackIcon, SearchIcon },
    props: {
      component: {
        type: String,
        default: 'div',
      },
      colors: {
        type: Object,
      },
      ios: {
        type: Boolean,
        default: undefined,
      },
      material: {
        type: Boolean,
        default: undefined,
      },
      placeholder: {
        type: String,
        default: 'Search',
      },
      value: [String, Number],
      inputId: String,
      inputStyle: [String, Object],
      disableButton: {
        type: Boolean,
        default: false,
      },
      disableButtonText: {
        type: String,
        default: 'Cancel',
      },
      clearButton: {
        type: Boolean,
        default: true,
      },
    },
    emits: [
      'change',
      'input',
      'focus',
      'blur',
      'clear',
      'blur-capture',
      'focus-capture',
      'disable',
    ],
    setup(props, ctx) {
      const elRef = ref(null);
      const searchElRef = ref(null);
      const disableButtonRef = ref(null);
      const disableButtonWidth = ref(0);
      const disableTimeout = ref(null);
      const allowTransition = ref(false);
      const isEnabled = ref(false);
      const theme = useTheme(props);

      useTouchRipple(elRef, props);

      const colors = computed(() =>
        SearchbarColors(props.colors || {}, useDarkClasses)
      );

      const handleChange = (e) => {
        ctx.emit('change', e);
      };

      const handleInput = (e) => {
        ctx.emit('input', e);
      };

      const onClear = (e) => {
        ctx.emit('clear', e);
      };

      const handleFocus = (e) => {
        isEnabled.value = true;
        ctx.emit('focus', e);
      };

      const handleBlur = (e) => {
        ctx.emit('blur', e);
      };

      const onGlobalBlur = () => {
        const { value } = props;
        if (!value) {
          disableTimeout.value = setTimeout(() => {
            isEnabled.value = false;
          });
        }
      };

      const onGlobalFocus = () => {
        clearTimeout(disableTimeout.value);
      };

      const handleDisableButton = (e) => {
        e.preventDefault();
        isEnabled.value = false;
        if (searchElRef.value) {
          searchElRef.value.blur();
        }
        ctx.emit('disable', e);
        if (onClear) onClear();
      };

      onMounted(() => {
        if (disableButtonRef.value) {
          disableButtonWidth.value = disableButtonRef.value.offsetWidth;
        }
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            allowTransition.value = true;
          });
        });
      });

      const c = useThemeClasses(props, () =>
        SearchbarClasses({ ...props }, colors.value, {
          isEnabled: isEnabled.value,
          darkClasses: useDarkClasses,
        })
      );

      return {
        elRef,
        searchElRef,
        onGlobalBlur,
        onGlobalFocus,
        handleInput,
        handleChange,
        handleFocus,
        handleBlur,
        onClear,
        handleDisableButton,
        disableButtonRef,
        disableButtonWidth,
        allowTransition,
        isEnabled,
        c,
        theme,
        cls,
      };
    },
  };
</script>
