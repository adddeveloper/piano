// index.js — correctly positions black keys between the white keys
(async function(){
  const resp = await fetch('piano.json');
  const { piano } = await resp.json();
  const layout = piano.keyboardLayout; // array in correct sequential order
  const sounds = piano.sounds;
  const pianoDiv = document.getElementById('piano');

  const WHITE_WIDTH = 46; // must match CSS --white-w for visual alignment

  // helper: detect black key (flats use 'b' char in your JSON like "Bb1", "Db2")
  const isBlack = note => /[A-G]b/.test(note); // matches 'Bb','Db','Eb','Gb','Ab'

  // iterate over layout and create white wrappers; create a black key inside the wrapper if next element is a black note
  for (let i = 0; i < layout.length; i++) {
    const note = layout[i];
    if (isBlack(note)) {
      // black notes are created together with the preceding white wrapper; skip if encountered alone
      continue;
    }

    // create wrapper for this white key
    const wrapper = document.createElement('div');
    wrapper.className = 'white-wrapper';

    // create white key
    const whiteKey = document.createElement('div');
    whiteKey.className = 'key white';
    whiteKey.dataset.note = note;
    const wlabel = document.createElement('div');
    wlabel.className = 'label';
    wlabel.textContent = note;
    whiteKey.appendChild(wlabel);
    wrapper.appendChild(whiteKey);

    // if next note exists and is a black key, create the black key inside this wrapper so it sits between this white and the next white
    const next = layout[i + 1];
    if (next && isBlack(next)) {
      const blackKey = document.createElement('div');
      blackKey.className = 'key black';
      blackKey.dataset.note = next;
      const blabel = document.createElement('div');
      blabel.className = 'label';
      blabel.textContent = next;
      blackKey.appendChild(blabel);
      wrapper.appendChild(blackKey);
    }

    pianoDiv.appendChild(wrapper);
  }

  // Play note function
  function playNote(note) {
    const filename = sounds[note];
    if (!filename) return;
    const audio = new Audio(`/piano/${filename}`);
    const el = document.querySelector(`[data-note="${note}"]`);
    if (el) {
      el.classList.add('playing');
      audio.play().catch(()=>{}); // ignore play errors
      audio.addEventListener('ended', ()=> el.classList.remove('playing'));
      // also remove playing if user triggers repeat quickly
      setTimeout(()=> el.classList.remove('playing'), 400);
    } else {
      // fallback: search for wrapper's child
      const alt = document.querySelector(`.white-wrapper [data-note="${note}"]`);
      if (alt) alt.classList.add('playing');
      audio.play().catch(()=>{});
      setTimeout(()=> alt && alt.classList.remove('playing'), 400);
    }
  }

  // click handlers (delegation)
  pianoDiv.addEventListener('click', (e) => {
    const key = e.target.closest('.key');
    if (!key) return;
    const note = key.dataset.note;
    if (!note) return;
    playNote(note);
  });

  // simple keyboard mapping (centered around middle C)
  const keyMap = {
    'a': 'C4', 'w': 'Db4', 's': 'D4', 'e': 'Eb4', 'd': 'E4',
    'f': 'F4', 't': 'Gb4', 'g': 'G4', 'y': 'Ab4', 'h': 'A4',
    'u': 'Bb4', 'j': 'B4', 'k': 'C5'
  };
  document.addEventListener('keydown', (ev) => {
    if (ev.repeat) return;
    const mapped = keyMap[ev.key];
    if (mapped) {
      playNote(mapped);
      ev.preventDefault();
    }
  });

})();
