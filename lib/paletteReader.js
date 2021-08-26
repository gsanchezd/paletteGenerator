import fs from 'fs'
import {PNG} from 'pngjs'

function chunkSubstr(str, size) {
  const numChunks = Math.ceil(str.length / size)
  const chunks = new Array(numChunks)

  for (let i = 0, o = 0; i < numChunks; ++i, o += size) {
    chunks[i] = str.substr(o, size)
  }

  return chunks
}

const paletteReader = (img, cb) => {
  fs.createReadStream(img)
  .pipe(
    new PNG()
  )
  .on("parsed", function () {
    const colorCounter = {}
    const colorHex = this.data.toString('hex') //000000ff
    const pixelColors = chunkSubstr(colorHex, 8).map(color => color.substr(0,6)) // Group by color && Remove alpha channel
    const palette = new Set(pixelColors)

    for (let color of palette){
      colorCounter[color] = pixelColors.filter(pixelColor => pixelColor === color).length
    }
    return cb(colorCounter)
  })
}

export default paletteReader
