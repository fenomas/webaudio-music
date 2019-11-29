
import Bind from 'bind.js'
import Engine from '../src'
import Manager from './lib/manager'

import Viz from 'webaudio-viz'


/*
 * 
 *      core setup
 * 
*/


var engine, viz

function init() {
    if (!engine) {
        engine = new Engine()
        engine.volume = state.volume
        engine.swing = state.swing
        engine.bpm = state.bpm
        window.manager = new Manager(engine)
    }
    initViz()
}

setTimeout(init, 1)









/*
 * 
 *      visualization
 * 
*/


var canvas = document.querySelector('.viz')
var vizMode = 0

function initViz() {
    if (!viz) {
        viz = new Viz(engine.context, canvas, engine.output, 20, 0)
        viz.paused = true
        viz.clear('#FFF')
        window.viz = viz
    }
}

canvas.addEventListener('click', ev => {
    initViz()
    vizMode = (vizMode + 1) % 4
    viz.mode = vizMode - 1
    viz.paused = (vizMode === 0)
    if (vizMode === 0) viz.clear('#FFF')
    state.vizLabel = (vizMode === 0) ? '(click to toggle visualizer)' : ''
})







/*
 * 
 *      set up UI
 * 
*/

var $ = s => document.querySelector(s)

// two-way bindings for params
var setVolume = v => { if (engine) engine.volume = v }
var setSwing = v => { if (engine) engine.swing = v }
var setBPM = v => { if (engine) engine.bpm = v }

var state = Bind({
    playMsg: 'Start',
    volume: 0.75,
    swing: 0,
    bpm: 100,
    log: '',
    vizLabel: '(click to toggle visualizer)',
}, {
    playMsg: '.play',
    volume: { dom: '.vol', callback: setVolume },
    swing: { dom: '.swing', callback: setSwing },
    bpm: { dom: '.bpm', callback: setBPM },
    log: '.log',
    vizLabel: '.vizLabel',
})



// play button
var togglePlaying = () => {
    init()
    engine.playing = !engine.playing
    state.playMsg = (engine.playing) ? 'Stop' : 'Start'
    state.log = (engine.playing) ? '(playing)' : '&nbsp;'
}

$('.play').onclick = togglePlaying
window.onkeydown = ev => {
    if (ev.key === ' ') {
        ev.preventDefault()
        togglePlaying()
    }
}



