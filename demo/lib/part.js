


export default class Part {

    constructor(ctx, output, soundPlayer, gain, pan, comp) {

        // internals
        this._now = () => ctx.currentTime
        this._gain = null
        this._comp = null
        this._pan = null
        this._player = soundPlayer

        // public
        this.dest = null

        // to be overridden
        this.program = [{}]
        this.beforeBeat = (beat) => { }
        this.onBeat = (beat) => { }

        // construct extra nodes and audio chain,
        var dest = output
        if (typeof pan === 'number') dest = this._pan = makePanner(ctx, pan, dest)
        if (gain) dest = this._gain = makeGain(ctx, gain, dest)
        if (comp) dest = this._comp = makeCompressor(ctx, comp, dest)
        this.dest = dest

    }



    // param value setters
    setPan(v, k) {
        if (this._pan) this._pan.pan.setTargetAtTime(v, this._now(), k || 0.05)
    }
    setGain(v, k) {
        if (this._gain) this._gain.gain.setTargetAtTime(v, this._now(), k || 0.05)
    }



    /*
     * 
     *      sound playing from note or pattern
     * 
    */

    playSound(note, duration, delay, vel, prog, dest) {
        prog = prog || this.program
        dest = dest || this.dest
        this._player.playSound(note, prog, dest, duration, delay, vel)
    }


    playPattern(bar, beat, note, pattern) {
        var bits = pattern.split(/\s+/)
        var bit = bits[bar % bits.length]
        var charsPerBeat = bit.length / 4
        var i0 = beat * charsPerBeat
        var i1 = (beat + 1) * charsPerBeat
        var duration = 1 / charsPerBeat
        for (var i = Math.ceil(i0 - 0.01); i < (i1 - 0.01); i++) {
            if (bit[i] === '-') continue
            var delay = i * duration - beat
            this.playSound(note, duration, delay)
        }
    }





    /*
     * 
     *      disposal
     * 
    */

    dispose() {
        setTimeout(part => {
            var nodes = [part._pan, part._gain, part._comp]
            nodes.forEach(node => {
                if (node) node.disconnect()
            })
            for (var s in part) part[s] = null
        }, 1000, this)
    }
}









function makeGain(ctx, value, target) {
    var node = ctx.createGain()
    node.gain.setValueAtTime(value, 0)
    node.connect(target)
    return node
}

function makePanner(ctx, value, target) {
    var node = ctx.createStereoPanner()
    node.pan.setValueAtTime(value, 0)
    node.connect(target)
    return node
}

function makeCompressor(ctx, params, target) {
    //           params and defaults:
    // threshold  [-100, 0]  -24
    // knee        [0, 40]    30
    // ratio       [1, 20]    12
    // attack      [0, 1]     0.003
    // release     [0, 1]     0.25
    var node = ctx.createDynamicsCompressor(params || null)
    node.connect(target)
    return node
}

