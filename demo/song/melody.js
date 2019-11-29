
import { rand, select, clamp } from '../lib/util'


export default function (state, createPart) {

    createPart({
        pan: 0.5,
    }, part => {

        part.program = melodyProg
        var note = 70

        part.onBeat = (bar, beat) => {

            note += rand(1, 3) * select([1, -1])
            note = clamp(62, note, 88)

            part.playSound(note, 0.35)

            if (select([0, 1])) {
                note += rand(-3, 4)
                part.playSound(note, 0.35, 0.5)
            }
        }

    })

}


var melodyProg = [{
    type: 'tri',
    gain: { t: 0.6, k: -0.2 },
}]

