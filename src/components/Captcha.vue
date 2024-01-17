<template>
  <div ref="puzzle" class="relative overflow-hidden bg-slate-200">
    <span ref="piece" class="absolute top-0 z-10" :style="pieceStyle">
      <img draggable="false" :src="`data:image/png;base64,${context.piece}`" alt />
    </span>
    <img :src="`data:image/png;base64,${context.puzzle}`" draggable="false" alt />
  </div>
  <FormKit v-model="percent" :ignore="true" type="slider" :delay="0"
           :tooltip="false" :disabled="isFinished"
           :sections-schema="{
            handles: {
              attrs: {
                onpointerdown: (event) => event.target.setPointerCapture(event.pointerId),
                onpointerup: submitValue
              }
            }
           }"
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
</template>

<script setup>
import {computed, onMounted, ref} from "vue";
import {Icon} from "@iconify/vue";

const props = defineProps({
  context: Object,
});

const node = props.context.node;

const piece = ref();
const puzzle = ref();

const puzzleWidth = 283;
const pieceWidth = 55;
const startingPosition = 14;
const scale = ref(1);
const percent = ref(calculatePercent(startingPosition)); // Starts Left 10px

const isFinished = ref(false);

const pieceStyle = computed(() => ({
  filter: 'drop-shadow(1px 1px 1px black)',
  transform: `translateY(${props.context.y/2*scale.value}px)`,
  width: `${(pieceWidth * scale.value)}px`,
  height: `${(pieceWidth * scale.value)}px`,
}));

onMounted(() => {
  scale.value = (1 - (puzzleWidth - puzzle.value.getBoundingClientRect().width) / puzzleWidth);
})

watch(() => percent.value, (value) => {
  piece.value.style.left = calculatePixels(value) + 'px';
});

function calculatePixels (percent) {
  return ((percent / 100) * ((puzzleWidth - pieceWidth) * scale.value));
}

function calculatePercent (pixels) {
  return ((pixels * scale.value / ((puzzleWidth - pieceWidth) * scale.value)) * 100);
}

function submitValue (event) {
  if (percent.value <= calculatePercent(startingPosition)) {
    percent.value = calculatePercent(startingPosition);
    return;
  }

  isFinished.value = true;
  node.input(percent.value);
  event.target.releasePointerCapture(event.pointerId);
}
</script>