
import Scheduler from './scheduler'



/*
 * 
 *      simple audio engine, manages scheduler and
 *      audio context / output chain
 * 
*/


export default function Engine(ctx) {
    if (!ctx) ctx = new AudioContext()

    // scheduler is encapsulated
    var scheduler = new Scheduler(ctx, 60)
    scheduler.onBeat = (t) => this.onBeat(t)

    // audio chain
    var comp = setupCompressor(ctx)
    var master = ctx.createGain()
    comp.connect(master)
    master.connect(ctx.destination)
    this.input = comp
    this.output = master

    // master volume setter
    var setVol = v => {
        var gain = (v < 1) ? v * v : v
        var t = ctx.currentTime
        master.gain.cancelScheduledValues(0)
        master.gain.setTargetAtTime(gain, t, 0.04)
    }

    // animate volume on start/stop
    var setPlaying = p => {
        if (p) {
            this.context.resume()
            setVol(this.volume)
        } else {
            setVol(0)
            setTimeout(() => { this.context.suspend() }, 100)
        }
        scheduler.playing = p
    }






    /*
     * 
     *      API
     * 
    */

    this.context = ctx       // expose for hacking
    this.beat = 0            // just a beat counter
    this.swing = 0           // how much to swing eighth notes
    this.playing = false
    this.volume = 1
    this.bpm = 60


    // override some props with getter/setters
    defineProp(this, 'playing', this.playing, setPlaying)
    defineProp(this, 'volume', this.volume, setVol)
    defineProp(this, 'bpm', this.bpm, v => scheduler.bpm = v)






    /*
     * 
     *      accessors for client
     * 
    */

    this.onBeat = (timeUntilBeat) => {
        // client overrides this
    }

    this.beatsToSeconds = (n) => {
        n = +n
        // adjust fractional part of depending on swing
        var whole = Math.floor(n)
        if (n > whole) {
            var frac = n - whole
            n = whole + Math.pow(frac, 1 - 0.75 * this.swing)
        }
        return scheduler.beatsToSeconds(n)
    }



}







/*
 * 
 *      helpers
 * 
*/

function setupCompressor(ctx) {
    var comp = ctx.createDynamicsCompressor()
    comp.threshold.value = -30    // -24
    comp.knee.value = 25          // 30
    comp.ratio.value = 12         // 12
    comp.attack.value = 0.003     // 0.003
    comp.release.value = 0.25     // 0.25
    return comp
}

function defineProp(obj, prop, value, callback) {
    var type = typeof value
    callback = callback || (() => { })
    Object.defineProperty(obj, prop, {
        get: () => value,
        set: (v) => {
            if (type === 'number') v = +v
            if (type === 'boolean') v = !!v
            value = v
            callback(value)
        },
    })
}

