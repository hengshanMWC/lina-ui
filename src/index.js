import { version } from '../package.json'
import config from './config'
import * as packages from '@/packages'

import './styles/index.scss' // 样式

let packagesList = config.packages
let components = {} // 组件
let methods = {} // 方法 $挂载

packagesList.map(item => {
  const pkg = packages[item.name]

  if (!pkg) {
    return
  }
  if (/component/.test(item.type)) {
    // console.log(pkg.component.name)
    components[pkg.component.name] = pkg.component
  }
  if (/method/.test(item.type)) {
    methods[item.name] = pkg.method
  }
})

// console.log('components', components)
// console.log('methods', methods)

let install = function (Vue, options = {}) {
  if (install.installed) return

  /**
   * 安装方法，附加在Vue的原型链，以$ + 名字（小写）暴露出来
   */
  for (let methodKey in methods) {
    Object.defineProperty(Vue.prototype, `$${methodKey.toLowerCase()}`, { value: methods[methodKey] })
  }
  /**
   * 安装组件，便于全局直接引用在template中
   */
  // console.log(components)
  for (const componentKey in components) {
    components[componentKey] && components[componentKey].name && Vue.component(components[componentKey].name, components[componentKey])
  }

  console.info(`lina-ui has been installed， version： ${version} `)

  install.installed = true
}

typeof window !== 'undefined' && window.Vue && install(window.Vue)

export default {
  version,
  install,
  // ...components,
  components: {
    ...components
  },
  // methods: {
  //   ...methods
  // }
  ...methods
}
