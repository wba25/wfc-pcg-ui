import emitter from 'tiny-emitter/instance';

export function $on (...args) { return emitter.on(...args) }
export function $once (...args) { return emitter.once(...args) }
export function $off (...args) { return emitter.off(...args) }
export function $emit (...args) { return emitter.emit(...args) }