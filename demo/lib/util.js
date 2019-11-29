


export function randf(a, b) {
    return a + (b - a) * Math.random()
}

export function rand(a, b) {
    return Math.floor(randf(a, b))
}

export function select(arr) {
    return arr[rand(0, arr.length)]
}

export function clamp(a, v, b) {
    return Math.max(a, Math.min(b, v))
}


