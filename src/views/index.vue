<template>
  <div class="canvas_box" ref="canvasBox">
    <div ref="myCanvas"></div>
  </div>
</template>
<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as Phaser from 'Phaser'

import AudioRhythm from '../components/audioRhythm'

let myCanvas = ref(null)
let canvasBox = ref(null)
let game = null
let audioRhythmScene = null

onMounted(() => {
  // This is revert of https://github.com/photonstorm/phaser/commit/7cbf3840af296c2f1f510be15b39a2519f7a72cf
  // If remove below, safari doesn't play sounds
  Phaser.Scenes.SceneManager.prototype.loadComplete = function (loader) {
    const scene = loader.scene
    if (this.game.sound && this.game.sound.onBlurPausedSounds) {
      this.game.sound.unlock()
    }
    this.create(scene)
  }

  audioRhythmScene = new AudioRhythm(canvasBox.value.clientWidth, canvasBox.value.clientHeight)

  let config = {
    type: Phaser.AUTO,
    scale: {
      mode: Phaser.DOM.FIT, // 自适应
      parent: myCanvas.value,
      autoCenter: Phaser.DOM.CENTER_BOTH, // 自动居中
      width: canvasBox.value.clientWidth,
      height: canvasBox.value.clientHeight,
    },

    backgroundColor: '#2d2d2d',
    scene: [audioRhythmScene],
    pixelArt: true, //将 antialias 设置为 false 并将 roundPixels 设置为 true。 这是像素艺术游戏的最佳设置
    audio: {
      // 音频配置对象
      // disableWebAudio: true, // 禁用WebAudioAPI，强制使用HTML5 Audio
      // noAudio: true, // if this is true, it works, with audio enabled it fails
    },
    physics: {
      default: 'arcade',
    },
  }

  game = new Phaser.Game(config)
})

onUnmounted(() => {
  for (let key in game.scene.keys) {
    if (game.scene.keys.hasOwnProperty(key)) {
      game.scene.stop(key)
      game.scene.keys[key] = undefined
    }
  }
  // 暂停所有audio
  game.sound.stopAll()
})
</script>
<style lang="less" scoped>
.control {
  position: absolute;
}
.canvas_box {
  width: 100vw;
  height: 100vh;
}
</style>
