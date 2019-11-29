


export default function Scheduler(ctx, bpm, lookAhead) {
    if (!ctx) throw 'Scheduler needs an AudioContext!'
    var self = this


    // API and config
    this.bpm = bpm || 60
    this.playing = false
    this.context = ctx
    this.beatsToSeconds = num => +num * 60 / self.bpm


    // client overrides this
    this.onBeat = () => { }


    // internals
    lookAhead = lookAhead || 0.2
    var interval = lookAhead * 1000 / 3
    var lastBeat = +0


    // core loop
    setInterval(() => {
        if (!self.playing) return
        var now = ctx.currentTime
        var beatLength = 60 / self.bpm
        var nextBeat = lastBeat + beatLength
        while (nextBeat <= now + lookAhead) {
            // emit
            var t = (nextBeat <= now) ? now + 0.01 : nextBeat
            self.onBeat(t - now)
            lastBeat = t
            nextBeat = t + beatLength
        }
    }, interval)

}



