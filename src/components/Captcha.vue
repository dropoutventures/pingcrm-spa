<template>
  <div :style="{ width: `${puzzleWidth}px` }">
    <div class="relative overflow-hidden bg-slate-200">
      <img ref="piece" class="absolute inset-0 z-10" draggable="false" :src="`data:image/png;base64,${context.piece}`" :style="pieceStyle" alt />
      <img :src="`data:image/png;base64,${context.puzzle}`" :style="puzzleStyle" draggable="false" alt />
    </div>
    <div @pointerup="submitValue">
      <FormKit v-model="percent" type="slider" :delay="0"
               :tooltip="false" :disabled="isFinished"
               outerClass="$remove:formkit-disabled:opacity-50"
               trackWrapperClass="h-[10px] bg-gray-200"
               trackInnerClass="h-[10px]"
               :handleClass="`w-auto h-auto px-0.5 py-0.5 ${isFinished ? '$remove:bg-white bg-green-500 text-white' : ''}`"
      >
        <template #handleMaxInner>
          <Icon icon="radix-icons:check" v-if="isFinished" />
          <slot name="icon" v-else>
            <Icon icon="radix-icons:drag-handle-dots-2" />
          </slot>
        </template>
      </FormKit>
    </div>
  </div>
</template>

<script setup>
import {computed, onMounted, ref} from "vue";
import {Icon} from "@iconify/vue";

const props = defineProps({
  context: Object,
});

const node = props.context.node;

const piece = ref();

const puzzleWidth = 283;
const pieceWidth = 55; 

const isFinished = ref(false);
const percent = ref(calculatePercent(14)); // Starts Left 10px

const scale = ref(1);

const puzzleStyle = computed(() => ({
  transform: `scale(${scale})`,
}));
const pieceStyle = computed(() => ({
  width: `${pieceWidth}px`,
  height: `${pieceWidth}px`,
  filter: 'drop-shadow(1px 1px 1px black)',
  transform: `translateY(${props.context.y/2}px)`,
}));

onMounted(() => {
  scale.value = document.body.offsetWidth <= puzzleWidth ? (1 - (puzzleWidth - document.body.offsetWidth) / puzzleWidth) : 1
})

watch(() => percent.value, (value) => {
  piece.value.style.left = calculatePixels(value) + 'px';
});

function calculatePixels (percent) {
  return ((percent / 100) * (puzzleWidth - pieceWidth));
}

function calculatePercent (pixels) {
  return ((pixels / (puzzleWidth - pieceWidth)) * 100);
}

function submitValue () {
  isFinished.value = true;
  node.input(percent.value);
}
</script>