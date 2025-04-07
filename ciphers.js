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
  var outputs = Array.of(n)

  for (let i = 0; i < n; i++) {
    let inChar = inputText.charCodeAt(i)
    var outChar
    if (inChar >= 65 && inChar <= 90) {
      let inInt = inChar - 65
      let outInt = (inInt + shiftInt) % 26
      outChar = outInt + 65
    } else {
      outChar = inChar
    }
    outputs[i] = String.fromCharCode(outChar)
  }

  return outputs.join("")
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
