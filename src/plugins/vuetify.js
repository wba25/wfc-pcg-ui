/**
 * plugins/vuetify.js
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Composables
import { createVuetify } from 'vuetify'

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    themes: {
      defaultTheme: 'dark',
      light: {
        colors: {
          primary: '#2F3C7E',
          secondary: '#FBEAEB',
        },
      },
      dark: {
        colors: {
          primary: '#2F3C7E',
          secondary: '#FBEAEB',
        },
      },
    },
  },
})
