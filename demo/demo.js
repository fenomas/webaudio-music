
import Engine from '../src'
import Manager from './lib/manager'
import Viz from 'webaudio-viz'





/*
 * 
 *      core setup
 * 
*/

var engine = new Engine()
var manager = new Manager(engine)

engine.volume = 0.75
engine.swing = 0
engine.bpm = 100

var togglePlaying = () => {
    if (engine.context.state === 'suspended') engine.context.resume()
    engine.playing = !engine.playing
    vm.playMsg = (engine.playing) ? 'Stop' : 'Start'
    vm.log = (engine.playing) ? '(playing)' : ''
}










/*
 * 
 *      UI bindings
 * 
*/

var Vue = window.Vue
var vm = new Vue({
    data: {
        playMsg: 'Start',
        volume: engine.volume,
        swing: engine.swing,
        bpm: engine.bpm,
        log: '',
        vizLabel: '(click to toggle visualizer)',
    },
    methods: {
        setVolume: ev => { engine.volume = vm.volume },
        setSwing: ev => { engine.swing = vm.swing },
        setBPM: ev => { engine.bpm = vm.bpm },
        play: () => togglePlaying(),
        cycleViz: () => cycleViz(),
    },
}).$mount(`#ui`)



// play on spacebar
window.onkeydown = ev => {
    if (ev.key === ' ') {
        ev.preventDefault()
        togglePlaying()
    }
}






/*
 * 
 *      visualization
 * 
*/


var vizMode = 0
var canvas = document.querySelector('.viz')
var viz = new Viz(engine.context, canvas, engine.output, 20, 0)
viz.paused = true
viz.clear('#FFF')

function cycleViz() {
    vizMode = (vizMode + 1) % 4
    viz.mode = vizMode - 1
    viz.paused = (vizMode === 0)
    if (vizMode === 0) viz.clear('#FFF')
    vm.vizLabel = (vizMode === 0) ? '(click to toggle visualizer)' : ''
}





window.vm = vm
window.viz = viz
window.engine = engine
window.manager = manager

