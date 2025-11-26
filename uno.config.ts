import { defineConfig, presetUno, presetAttributify, presetIcons } from 'unocss'

export default defineConfig({
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
      warn: true
    })
  ],
  shortcuts: {
    'btn': 'px-4 py-2 rounded inline-block bg-blue-500 text-white cursor-pointer hover:bg-blue-600 disabled:cursor-default disabled:bg-gray-600 disabled:opacity-50',
    'btn-secondary': 'px-4 py-2 rounded inline-block bg-gray-500 text-white cursor-pointer hover:bg-gray-600',
  }
})
