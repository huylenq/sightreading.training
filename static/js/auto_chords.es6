
export default class AutoChords {
  constructor(song) {
    this.song = song
  }

  findChordBlocks() {
    let beatsPerMeasure = this.song.metadata.beatsPerMeasure

    if (!beatsPerMeasure) {
      throw "Missing beats per measure for autochords"
    }

    if (!this.song.autoChords) {
      throw "Song missing autochords"
    }

    let chords = [...this.song.autoChords]
    chords.reverse()
    let chordBlocks = []

    let chordsUntil = null

    for (let [position, chord] of chords) {
      let start = position
      let stop = (Math.floor((position / beatsPerMeasure)) + 1) * beatsPerMeasure

      if (chordsUntil) {
        stop = Math.min(stop, chordsUntil)
      }

      if (start >= stop) {
        console.warn("rejecting chord", chord, start, stop)
        continue
      }

      chordBlocks.push({
        start, stop, chord
      })
      chordsUntil = start
    }

    chordBlocks.reverse()
    return chordBlocks
  }

  addChords() {
    this.findChordBlocks()
  }

  notesInRange(left, right) {
    let notes = []
    return this.map(note => note.inRange(left, right))
  }
}