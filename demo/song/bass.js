
import { rand, select, clamp } from '../lib/util'


export default function (state, createPart) {


    createPart({
        pan: -0.5,
    }, part => {

        part.program = bassProg
        var note = 40

        part.onBeat = (bar, beat) => {

            note += rand(1, 5) * select([1, -1])
            note = clamp(36, note, 45)

            part.playSound(note, 0.8)
        }

    })

}



var bassProg = [{
    type: 'sine',
    freq: {
        type: 'sine',
        freq: { t: 3 },
        gain: { t: 4, a: 0.02, h: 0.01, d: 0.3, s: 0, r: 0.05 },
    },
    gain: { t: 0.5, a: 0, h: 0.01, d: 0.3, s: 0, r: 0.2 },
}]

