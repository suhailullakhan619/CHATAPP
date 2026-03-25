// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Vuetify
import { createVuetify } from 'vuetify'
const myThemeColor={
  dark:false,
  colors:{
  primary:'#6366f1'
  }
}
export default createVuetify({
  theme:{
    defaultTheme:'myThemeColor',
    themes:{
      myThemeColor:myThemeColor,
    }
  }
}
)
