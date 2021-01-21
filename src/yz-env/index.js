// components/yz-env/index.js
let startPoint
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    envName: {
      type: String,
      value: 'dev'
    },
    columnsKey: {
      type: String,
      value: 'text'
    },
    columns: {
      type: Array,
      value: [{
        text: '开发环境',
        env: 'dev'
      },
      {
        text: '测试环境',
        env: 'fat'
      },
      {
        text: '预发布环境',
        env: 'uat'
      },
      {
        text: '线上环境',
        env: 'pro'
      }]
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    // 按钮位置参数
    index: 0,
    buttonTop: 0,
    buttonLeft: 0,
    windowHeight: '',
    windowWidth: '',
    // 角标显示数字
    corner_data: 'dev',
    corner_index: 0,
  },
  attached() {
    // 定义角标数字
    this.setData({
      corner_data: this.properties.envName || this.data.corner_data,
    })
    // 获取购物车控件适配参数
    const that = this
    wx.getSystemInfo({
      success: (res) => {
        if (res.platform === 'android') {
          this.setData({
            isIos: false
          })
        }
        // console.log(res)
        // 屏幕宽度、高度
        // console.log('height=' + res.windowHeight)
        // console.log('width=' + res.windowWidth)
        // 高度,宽度 单位为px
        that.setData({
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth,
          buttonTop: res.windowHeight * 0.70, // 这里定义按钮的初始位置
          buttonLeft: res.windowWidth * 0.70, // 这里定义按钮的初始位置
        })
      }
    })
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 以下是按钮拖动事件
    buttonStart(e) {
      startPoint = e.touches[0] // 获取拖动开始点
    },
    buttonMove(e) {
      const endPoint = e.touches[e.touches.length - 1] // 获取拖动结束点
      // 计算在X轴上拖动的距离和在Y轴上拖动的距离
      const translateX = endPoint.clientX - startPoint.clientX
      const translateY = endPoint.clientY - startPoint.clientY
      startPoint = endPoint // 重置开始位置
      let buttonTop = this.data.buttonTop + translateY
      let buttonLeft = this.data.buttonLeft + translateX
      // 判断是移动否超出屏幕
      if (buttonLeft + 50 >= this.data.windowWidth) {
        buttonLeft = this.data.windowWidth - 50
      }
      if (buttonLeft <= 0) {
        buttonLeft = 0
      }
      if (buttonTop <= 0) {
        buttonTop = 0
      }
      if (buttonTop + 50 >= this.data.windowHeight) {
        buttonTop = this.data.windowHeight - 50
      }
      this.setData({
        buttonTop,
        buttonLeft
      })
    },
    bindPickerChange(e) {
    //   console.log('picker发送选择改变，携带值为', e.detail)
      const data = this.data.columns[e.detail.value]
      this.setData({
        corner_index: e.detail.value,
        corner_data: data.env,
      })
      const myEventOption = {} // 触发事件的选项
      this.triggerEvent('envEvent', data, myEventOption)
    },
  }
})
