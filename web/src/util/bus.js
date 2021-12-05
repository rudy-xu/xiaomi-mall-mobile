/**
 * Global event
 */

/** vue2.x */
// import Vue from 'vue'
// const bus = new Vue()

/**
 * vue3.x has removed $on, $off, $once
 * So, it can not use above method
 * 'Mitt' is officially recommended instead
 */
import mitt from 'mitt'

const bus = mitt()

export default bus
