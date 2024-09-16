const parse = require('./parse')
const calculateCheckDigit = require('./calculate_check_digit')

module.exports = source => {
  if (typeof source !== 'string' || source.length === 0) throw Error(`invalid input: ${source}`)

  const result = { source }
  const data = parse(source)
  result.validIsbn = data != null
  const clues = []
  const normalizedIsbn = normalize(source)

  if (data) {
    result.groupname = data.groupname
    if (normalizedIsbn.length === 13) {
      if (normalizedIsbn.startsWith('978')) considerAltPrefix(normalizedIsbn, '979', clues)
      else if (normalizedIsbn.startsWith('979')) considerAltPrefix(normalizedIsbn, '978', clues)
    }
  } else {
    if (normalizedIsbn.length === 13) {
      if (normalizedIsbn.startsWith('978')) {
        guessPrefixFromChecksum(normalizedIsbn, '979', clues)
        guessUnprefixedFromChecksum(normalizedIsbn, clues)
      } else if (normalizedIsbn.startsWith('979')) {
        guessPrefixFromChecksum(normalizedIsbn, '978', clues)
      }
    } else if (normalizedIsbn.length === 10) {
      guessMissingPrefixFromChecksum(normalizedIsbn, '978', clues)
      guessMissingPrefixFromChecksum(normalizedIsbn, '979', clues)
    }
  }

  result.clues = clues

  return result
}

const considerAltPrefix = (normalizedIsbn, altPrefix, clues) => {
  const candidateBase = `${altPrefix}${normalizedIsbn.substring(3, 12)}`
  const checkDigit = calculateCheckDigit(candidateBase)
  const candidateData = parse(`${candidateBase}${checkDigit}`)
  if (candidateData != null) {
    const { isbn13h, isbn13, groupname } = candidateData
    clues.push({ message: 'possible prefix error', candidate: isbn13h, isbn13, groupname })
  }
}

const guessPrefixFromChecksum = (normalizedIsbn, altPrefix, clues) => {
  const altPrefixIsbn = `${altPrefix}${normalizedIsbn.substring(3)}`
  const altPrefixData = parse(altPrefixIsbn)
  if (altPrefixData != null) {
    const { isbn13h, isbn13, groupname } = altPrefixData
    clues.push({ message: 'checksum hints different prefix', candidate: isbn13h, isbn13, groupname })
  }
}

const guessUnprefixedFromChecksum = (normalizedIsbn, clues) => {
  const unprefixedIsbn = normalizedIsbn.substring(3)
  const unprefixData = parse(unprefixedIsbn)
  if (unprefixData != null) {
    const { isbn10h, isbn13, groupname } = unprefixData
    clues.push({ message: 'checksum hints that a 978 was added to an ISBN-10 without updating the checksum', candidate: isbn10h, isbn13, groupname })
  }
}

const guessMissingPrefixFromChecksum = (normalizedIsbn, missingPrefix, clues) => {
  const prefixedIsbn = `${missingPrefix}${normalizedIsbn}`
  const prefixData = parse(prefixedIsbn)
  if (prefixData != null) {
    const { isbn13h, isbn13, groupname } = prefixData
    clues.push({ message: `checksum hints that it is an ISBN-13 without its ${missingPrefix} prefix`, candidate: isbn13h, isbn13, groupname })
  }
}

const normalize = input => input.replace(/[^\dX]/g, '')
