class AudioRhythm extends Phaser.Scene {
  constructor() {
    super()
  }

  preload() {
    this.load.audio('music', 'assets/audio/123.mp3')
  }

  create() {
    // this.add.image(this.center.x, this.center.y, 'wizball')
    this.music = this.sound.add('music')
    this.music.play()
    this.i = 0
    this.timePassed = 0
    this.updateInterval = 100 // 调用间隔时间（毫秒）

    this.randomColorArr = this.randomColor()

    // 创建音频分析器
    this.analyser = this.sound.context.createAnalyser()
    this.analyser.smoothingTimeConstant = 1 // 平滑处理，值越小，变化越明显
    this.analyser.fftSize = 512 // 必须是2的幂次方，且在32-32768之间，值越大，频率分辨率越高，但是计算量也越大，建议使用32-2048，一般使用128，256，512
    // this.analyser.minDecibels = -90
    // this.analyser.maxDecibels = -10
    this.sound.masterVolumeNode.connect(this.analyser)
    this.analyser.connect(this.sound.context.destination)

    this.input.on('pointerdown', this.startAudioContext, this)

    // // 创建画布和绘图对象
    this.graphics = this.add.graphics()
  }

  startAudioContext() {
    if (this.sound.context.state === 'suspended') {
      this.sound.context.resume().then(() => {
        console.log('Audio context resumed.')
      })
    }
  }

  update(time, delta) {
    this.timePassed += delta
    if (this.sound.context.state === 'running' && this.timePassed >= this.updateInterval) {
      const data = this.getAudioData()
      this.renderAudioData(data)
      this.timePassed -= this.updateInterval
    }
  }

  /**
   * 获取音频数据
   * @returns Uint8Array
   */
  getAudioData() {
    const data = new Uint8Array(this.analyser.frequencyBinCount)
    this.analyser.getByteTimeDomainData(data)
    return data
  }

  randomColor() {
    // 生成一系列渐变颜色数组
    const colors = Phaser.Display.Color.HSVColorWheel()
    return colors
  }

  renderAudioData(data) {
    this.graphics.clear()

    const centerX = this.cameras.main.centerX
    const centerY = this.cameras.main.centerY
    const angle = (Math.PI * 6) / data.length

    this.graphics.save()
    this.graphics.fillStyle(this.randomColorArr[this.i].color, 0.5)
    this.graphics.translateCanvas(centerX, centerY)

    data.forEach((value, index) => {
      this.graphics.save()

      this.graphics.rotateCanvas(angle * index)

      const barHeight = value

      this.graphics.fillRect(0, 0, 4, barHeight < 4 ? 4 : barHeight)

      this.graphics.restore()
    })
    this.graphics.restore()
    this.i++
    if (this.i >= this.randomColorArr.length) {
      this.i = 0
    }
  }
}

export default AudioRhythm
