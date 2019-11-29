
import { select } from '../lib/util'


export default function (state, createPart) {


    // kick
    createPart({}, part => {

        var pattern = '#------# #'

        part.program = kickProg
        part.onBeat = (bar, beat) => {
            part.playPattern(bar, beat, 45, pattern)
        }

    })



    // snare
    createPart({
        pan: -0.2,
    }, part => {

        var pattern = '-#-#'

        part.program = snareProg
        part.onBeat = (bar, beat) => {
            part.playPattern(bar, beat, 55, pattern)
        }

    })


    // hat
    createPart({
        pan: 0.3,
    }, part => {

        var pattern = '-#-#-#-#'
        var bits = [
            '-#-#',
            '#-#-',
            '--##',
            '##-#',
        ]

        part.program = hatProg
        part.onBeat = (bar, beat) => {

            if (beat === 0) pattern = select(bits) + select(bits)
            part.playPattern(bar, beat, 77, pattern)

        }

    })





}




var kickProg = [{
    type: 'sine',
    freq: { p: 0.3, q: 0.1 },
    gain: { a: 0.01, h: 0, s: 0, d: 0.1, r: 0.1 },
}, {
    type: 'square',
    freq: { t: 0.5 },
    gain: { t: 0.2, a: 0.01, h: 0, s: 0, d: 0.05, r: 0.02 },
},]


var snareProg = [{
    type: 'triangle',
    freq: { p: 0.5 },
    gain: { t: 0.3, a: 0, h: 0.03, d: 0.05, s: 0, r: 0.05 },
}, {
    type: 'n0',
    gain: { t: 0.6, a: 0, h: 0.02, d: 0.01, s: 0, r: 0.01 },
}]



var hatProg = [{
    type: 'n1',
    gain: { t: 0.2, a: 0, s: 0, h: 0, d: 0.04, r: 0.05 },
}, {
    type: 'highpass',
    freq: { t: 2 },
}]
