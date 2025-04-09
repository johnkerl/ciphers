// This is a library for some classical ciphers:
// * Caesar and rot13, which are both shift ciphers with a single letter of keytext:
//   namely, C and N, respectively.
// * Permutation cipher, where the key is a permutation of A-Z (WIP).
// * Vigenere (WIP).
// * Playfair (WIP).
// * Foursquare (WIP).
"use strict"

// Applies a shift cipher to the input text.
// The input text and shift letter are both uppercased.
// Characters outside the range A-Z are left as-is.
export function shiftCrypt(
  inputText,
  shiftLetter,
  encryptOrDecrypt) {

  if (inputText == "") {
    return inputText
  }

  const forward = getForward(encryptOrDecrypt)
  let shiftInt = getShiftInt(shiftLetter, forward)

  inputText = inputText.toUpperCase()
  const n = inputText.length
  let outputs = new Array(n)

  for (let i = 0; i < n; i++) {
    let inCode = inputText.charCodeAt(i)
    let outCode
    if (inCode >= 65 && inCode <= 90) {
      let inInt = inCode - 65
      let outInt = (inInt + shiftInt) % 26
      outCode = outInt + 65
    } else {
      outCode = inCode
    }
    outputs[i] = String.fromCharCode(outCode)
  }

  return outputs.join("")
}

// Applies a Vigenere cipher to the input text.
// The input text and shift letter are both uppercased.
// Characters outside the range A-Z are left as-is.
export function vigenereCrypt(
  inputText,
  keyText,
  encryptOrDecrypt) {

  if (inputText == "") {
    return inputText
  }
  if (keyText.length < 1) {
    return ""
  }

  const forward = getForward(encryptOrDecrypt)

  inputText = inputText.toUpperCase()
  const n = inputText.length
  const m = keyText.length
  let outputs = new Array(n)

  for (let i = 0; i < n; i++) {
    let inCode = inputText.charCodeAt(i)
    let keyChar = keyText[i % m]
    let shiftInt = getShiftInt(keyChar, forward)
    let outCode
    if (inCode >= 65 && inCode <= 90) {
      let inInt = inCode - 65
      let outInt = (inInt + shiftInt) % 26
      outCode = outInt + 65
    } else {
      outCode = inCode
    }
    outputs[i] = String.fromCharCode(outCode)
  }

  return outputs.join("")
}

// Applies a permutation cipher to the input text.  The input text and key text
// are both uppercased.  The key text must be a permutation of the letters A-Z.
// Characters outside the range A-Z are left as-is.
export function permutationCrypt(
  inputText,
  keyText,
  encryptOrDecrypt) {

  if (inputText == "") {
    return inputText
  }

  const forward = getForward(encryptOrDecrypt)

  keyText = keyText.toUpperCase()
  let permutationMap = makePermutationMap(keyText, forward)

  inputText = inputText.toUpperCase()
  const n = inputText.length
  let outputs = new Array(n)

  for (let i = 0; i < n; i++) {
    let x = inputText[i]
    if (x in permutationMap) {
      outputs[i] = permutationMap[x]
    } else {
      outputs[i] = x
    }
  }

  return outputs.join("")
}

export const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

export function isPermutationOfAZ(letters) {
  const actual = letters.split("").sort().join("")
  const expect = ALPHABET
  return actual == expect
}

function makePermutationMap(letters, forward) {
  if (!isPermutationOfAZ(letters)) {
    throw new Error('ciphers.js: permutation keytext "' + letters + '" is not a permutation of A-Z')
  }
  let permutationMap = {}
  if (forward) {
    for (let i = 0; i < ALPHABET.length; i++) {
      permutationMap[ALPHABET[i]] = letters[i]
    }
  } else {
    for (let i = 0; i < ALPHABET.length; i++) {
      permutationMap[letters[i]] = ALPHABET[i]
    }
  }
  return permutationMap
}

export function randomPermutationOf(letters) {
  let array = letters.split("")
  let permuted = randomPermutationOfArray(array)
  return permuted.join("")
}

function randomPermutationOfArray(input) {
  const n = input.length
  let output = [...input]

  let unused_start = 0
  let num_unused = n-1

  for (let k = 0; k < n; k++) {

    // Select a pseudorandom element from the pool of unused images.
    // Python's randint(a, b) includes both endpoints.
    let u = randomInt(unused_start, unused_start + num_unused - 1)

    // Swap it into place.
    let temp = output[u]
    output[u] = output[k]
    output[k] = temp

    // Decrease the size of the pool by 1.
    // (Yes, unused_start and k always have the same value.  Using two
    // variables wastes neglible memory and makes the code easier to
    // understand.)
    unused_start += 1
    num_unused   -= 1
  }

  return output
}

function randomInt(lo, hi) {
  lo = Math.ceil(lo);
  hi = Math.floor(hi);
  return lo + Math.floor(Math.random() * (hi - lo + 1))
}


// Given a single letter between a-z/A-Z:
// * Throws if the input doesn't satisfy that
// * Uppercases it
// * If forward: sends A to 0, B to 1, C to 2, ..., Y to 24, Z to 25
// * If reverse: sends A to 0, B to 25, C to 24, ..., Y to 2, Z to 1
function getShiftInt(shiftLetter, forward) {
  shiftLetter = shiftLetter.toUpperCase()
  if (shiftLetter.length != 1) {
    throw new Error('ciphers.js: shift text "' + shiftLetter + '" must be of length 1; got ' + shiftLetter.length)
  }
  if (shiftLetter < "A" || shiftLetter > "Z") {
    throw new Error('ciphers.js: shift text "' + shiftLetter + '" must be in the range A-Z')
  }
  let shiftInt = shiftLetter.charCodeAt(0) - 65
  if (shiftInt == 0) {
    return 0
  }
  if (forward) {
    return shiftInt
  }
  return 26 - shiftInt
}

// Maps "encrypt" to true, "decrypt" to false, or throws
function getForward(encryptOrDecrypt) {
  const lookup = {"encrypt": true, "decrypt": false}
  if (encryptOrDecrypt in lookup) {
    return lookup[encryptOrDecrypt]
  }
  throw new Error('ciphers.js: value "' + encryptOrDecrypt + '" is not any of ' + Object.keys(lookup).join(', '))
}
