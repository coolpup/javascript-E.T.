/*
;============================================================================
; T I A - M U S I C  C O N S T A N T S
;============================================================================
 
SOUND_CHANNEL_SAW       = 1         ; sounds similar to a saw waveform
SOUND_CHANNEL_ENGINE    = 3         ; many games use this for an engine sound
SOUND_CHANNEL_SQUARE    = 4         ; a high pitched square waveform
SOUND_CHANNEL_BASS      = 6         ; fat bass sound
SOUND_CHANNEL_PITFALL   = 7         ; log sound in pitfall, low and buzzy
SOUND_CHANNEL_NOISE     = 8         ; white noise
SOUND_CHANNEL_LEAD      = 12        ; lower pitch square wave sound
SOUND_CHANNEL_BUZZ      = 15        ; atonal buzz, good for percussion
 
themeMusicNoteDelay     = $EE
themeMusicFreqIndex     = $EF

PlayThemeMusic
   lda #7
   sta AUDV1
   lda #SOUND_CHANNEL_LEAD
   sta AUDC1
   ldx themeMusicNoteDelay          ; get theme music note delay value
   dex
   bpl .playCurrentThemeNote        ; hold note if not negative
   ldx #11                          ; initial hold note delay
   ldy themeMusicFreqIndex          ; get theme music frequency index
   iny                              ; increment frequency index
   cpy #55
   bcc .setThemeMusicFreqIndex
   ldy #0
.setThemeMusicFreqIndex
   sty themeMusicFreqIndex
.playCurrentThemeNote
   stx themeMusicNoteDelay
   ldy themeMusicFreqIndex
   lda ThemeMusicFrequencyTable,y
   sta AUDF1
   lda #0
   sta AUDV0
   jmp .donePlayingSoundChannel1
.donePlayingSoundChannel1
   lda currentScreenId              ; get the current screen id
   cmp #ID_ET_HOME                  ; compare it with value of home screen id
   bne .checkIfOnTitleScreen        ; goto checkIfOnTitleScreen if comparison fails
   jmp SetSpecialSpriteForPit

.checkIfOnTitleScreen
   cmp #ID_TITLE_SCREEN
   bne CheckForTimeToLandMothership
   jmp SetCurrentObjectXYCoordinates

  WebAudio API help:
  http://modernweb.com/2014/03/31/creating-sound-with-the-web-audio-api-and-oscillators/
 */

/**
 * These are some of the defined audio related constants from th ET Source code
 */
var audio_constants = {
  LEAD_F4_SHARP            : 13,
  LEAD_E4                  : 15,
  LEAD_D4_SHARP            : 16,
  LEAD_D4                  : 17,
  LEAD_C4_SHARP            : 18,
  LEAD_H3                  : 20,
  LEAD_A3                  : 23,
  LEAD_G3_SHARP            : 24,
  LEAD_F3_SHARP            : 27,
  LEAD_E3_2                : 31
};

/**
 * Wrote a 
 * @param  {[type]} str [description]
 * @return {[type]}     [description]
 */
function replaceConstatns (str) {
  function repl(match, p1) {
    return audio_constants[p1] ? audio_constants[p1] : p1;
  }
  return str.trim().replace(/(LEAD_[a-z]{1}\d{1}(_SHARP|_2)?)/gi, repl);
}
var orig_ThemeMusicFrequencyTable = `
   .byte LEAD_A3,LEAD_A3,LEAD_A3,LEAD_A3,LEAD_E4,LEAD_E4,LEAD_E4,LEAD_E4
   .byte LEAD_D4,LEAD_C4_SHARP,LEAD_H3,LEAD_C4_SHARP,LEAD_A3,LEAD_A3,LEAD_A3
   .byte LEAD_A3,LEAD_E3_2,LEAD_E3_2,LEAD_E3_2,LEAD_E3_2,LEAD_E3_2,LEAD_E3_2
   .byte LEAD_E3_2,LEAD_E3_2,LEAD_F3_SHARP,LEAD_F3_SHARP,LEAD_F3_SHARP
   .byte LEAD_F3_SHARP,LEAD_F4_SHARP,LEAD_F4_SHARP,LEAD_F4_SHARP,LEAD_F4_SHARP
   .byte LEAD_E4,LEAD_D4_SHARP,LEAD_C4_SHARP,LEAD_D4_SHARP,LEAD_H3,LEAD_H3
   .byte LEAD_H3,LEAD_H3,LEAD_F3_SHARP,LEAD_F3_SHARP,LEAD_F3_SHARP
   .byte LEAD_F3_SHARP,LEAD_G3_SHARP,LEAD_G3_SHARP,LEAD_G3_SHARP,LEAD_H3
   .byte LEAD_C4_SHARP,LEAD_A3,LEAD_E3_2,LEAD_E3_2,LEAD_E3_2,LEAD_E3_2
   .byte LEAD_E3_2
`;

var ThemeMusicFrequencyTable = replaceConstatns(orig_ThemeMusicFrequencyTable);