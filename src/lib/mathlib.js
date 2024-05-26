export function floatRange (from, to, length) {
  const span = to - from
  const step = span / length
  console.log(step)
  const range = []
  let count = 0
  for (let i = 0; i < length; i++) {
    range.push(count)
    count += step
  }
  return range
}

export function constrain (n, min, max) {
  if (n >= max) n = max
  if (n <= min) n = min
  return n
}

export function random (val1, val2 = 0) {
  if (val2 === 0) return Math.random() * val1
  return val1 + Math.random() * val2
}

export function norm (v, min, max) {
  return (v - min) / (max - min)
}

export function lerp (norm, min, max) {
  return (max - min) * norm + min
}

export function map (val, sourceMin, sourceMax, destMin, destMax) {
  let n = norm(val, sourceMin, sourceMax)
  return lerp(n, destMin, destMax)
}

function memoize (f) {
  const cache = new Map() // Value cache stored in the closure.
  return function (...args) {
    // Create a string version of the arguments to use as a cache key.
    let key = args.length + args.join('+')
    if (cache.has(key)) {
      return cache.get(key)
    } else {
      let result = f.apply(this, args)
      cache.set(key, result)
      return result
    }
  }
}

 // Return the Greatest Common Divisor of two integers using the Euclidian
 // algorithm: http://en.wikipedia.org/wiki/Euclidean_algorithm
 function gcd(a,b) {  // Type checking for a and b has been omitted
  if (a < b) {           
 // Ensure that a >= b when we start
  [a, b] = [b, a];   // Destructuring assignment to swap variables
  }
  while(b !== 0) {       
 [a, b] = [b, a%b];
  }
  return a;
  }
  
export const gcdmemo = memoize(gcd);
//gcdmemo(85, 187)  // => 17
