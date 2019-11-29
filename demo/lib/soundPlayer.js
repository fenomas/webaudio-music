

// import SoundGen from 'soundgen'
import SoundGen from '../../../soundgen'



export default class SoundPlayer {

    constructor(engine) {
        this.gen = new SoundGen(engine.context, engine.input, true)
        this.timeUntilNextBeat = 0
        this._bts = engine.beatsToSeconds
    }


    playSound(note, prog, dest, duration, delay, vel) {
        delay = delay || 0
        duration = duration || 0.75
        var baseTime = this.gen.now() + this.timeUntilNextBeat
        var t0 = baseTime + this._bts(delay)
        var t1 = baseTime + this._bts(delay + duration)

        vel = vel || 1
        var freq = 440 * Math.pow(2, (note - 69) / 12)
        this.gen.play(prog, freq, vel, t0, t1, dest)
    }

}

