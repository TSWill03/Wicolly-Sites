import { startInfiniteScene } from './scene-engine.js'

const responsive = document.createElement('link')
responsive.rel = 'stylesheet'
responsive.href = '/shared/v6/responsive.css'
document.head.append(responsive)

startInfiniteScene()
