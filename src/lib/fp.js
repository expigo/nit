const curry = f => x => y => f(x,y)
const compose = (f, g)=> x => f(g(x))
const flip = f => (x, y) => f(y, x)
const first = xs => x[0]

module.exports = { curry, compose, flip, first}