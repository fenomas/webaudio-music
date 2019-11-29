
import SoundPlayer from './soundPlayer'
import Part from './part'


/*
 * 
 *      Loads and manages song modules
 * 
*/


export default function Core(engine) {
    var ctx = engine.context
    var dest = engine.input

    // sound player class instance
    var player = new SoundPlayer(engine)


    // abstracted part creation
    var parts = {}
    var createPart = (moduleName, params, callback) => {
        var p = params || {}
        var part = new Part(ctx, dest, player, p.gain, p.pan, p.comp)
        parts[moduleName] = parts[moduleName] || []
        parts[moduleName].push(part)
        callback(part)
        return part
    }



    // logic for initializing a song module
    var sharedState = {}
    var initSongModule = (name, Mod) => {
        var partMaker = (params, cb) => createPart(name, params, cb)
        var mod = new Mod(sharedState, partMaker)
        return mod
    }



    // song module loading, storage, disposal
    var modules = {}
    setupHMR((name, mod) => {
        if (parts[name]) {
            while (parts[name].length) parts[name].pop().dispose()
        }
        modules[name] = initSongModule(name, mod.default || mod)
    })




    /*
     * 
     *      internal beat loop
     * 
    */
    var beatCount = 0

    engine.onBeat = (t) => {
        player.timeUntilNextBeat = t
        var bar = Math.floor(beatCount / 4)
        var beat = beatCount % 4
        Object.keys(parts).forEach(key => {
            parts[key].forEach(p => p.beforeBeat(bar, beat))
        })
        Object.keys(parts).forEach(key => {
            parts[key].forEach(p => p.onBeat(bar, beat))
        })
        beatCount++
    }
}









/*
 * 
 *      loads modules, triggers callback on HMR reloads
 * 
*/

var getReq = () => require.context('../song', true, /\.js$/)

function setupHMR(callback) {
    var cached = {}
    var req = getReq()

    var getModule = (key) => {
        var id = req.resolve(key)
        var mod = req(key)
        if (mod === cached[id]) return
        callback(id, mod, cached[id] || null)
        cached[id] = mod
    }

    // initial require
    req.keys().forEach(key => getModule(key))

    // HMR events
    if (module.hot) module.hot.accept(req.id, () => {
        req = getReq()
        req.keys().forEach(key => {
            // try block prevents webpack from reloading page on module error
            try { getModule(key) } catch (err) { }
        })
    })
}

