const { MsEdgeTTS, OUTPUT_FORMAT } = require('msedge-tts');

async function testSSML() {
  const tts = new MsEdgeTTS();
  await tts.setMetadata('uz-UZ-SardorNeural', OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);
  const ssml = `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="uz-UZ">
    <voice name="uz-UZ-SardorNeural">Voybooo! Nega </voice>
    <voice name="en-US-GuyNeural">I am agree </voice>
    <voice name="uz-UZ-SardorNeural">deding?! To'g'risi </voice>
    <voice name="en-US-GuyNeural">I agree with you </voice>
    <voice name="uz-UZ-SardorNeural">bo'ladi!</voice>
  </speak>`;

  try {
    const { audioStream } = tts.rawToStream(ssml);
    const chunks = [];
    audioStream.on('data', c => chunks.push(c));
    audioStream.on('end', () => console.log('Multi-voice SSML success, size:', Buffer.concat(chunks).length));
    audioStream.on('error', e => console.log('Multi-voice SSML error:', e.message));
  } catch(e) {
    console.log('Catch Error:', e.message);
  }
}

testSSML();
