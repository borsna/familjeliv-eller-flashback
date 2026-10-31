var correct = 0;
var wrong = 0;

document.addEventListener('keydown', function (e) {
  if (e.altKey || e.ctrlKey || e.metaKey) return;
  if (document.querySelector('.game-state-game').hidden) return;
  var key = e.key.toLowerCase();
  if (key === 'a') guess('familjeliv');
  else if (key === 'b') guess('flashback');
});

document.addEventListener('click', function (e) {
  var el = e.target.closest('[data-state]');
  if (!el) return;
  e.preventDefault();
  setState(el.dataset.state);
});

function setState(state) {
  document.querySelectorAll('.game-state').forEach(function (el) {
    el.hidden = !el.classList.contains('game-state-' + state);
  });

  var menu = document.getElementById('menu');
  var offcanvas = window.bootstrap && bootstrap.Offcanvas.getInstance(menu);
  if (offcanvas) offcanvas.hide();

  if (state === 'game') startGame();
}

function flash(id) {
  var el = document.getElementById(id);
  el.classList.remove('flash');
  void el.offsetWidth;
  el.classList.add('flash');
}

function showFeedback(isCorrect, forum) {
  var fb = document.getElementById('feedback');
  var card = document.getElementById('game-card');
  fb.className = 'feedback ' + (isCorrect ? 'correct' : 'wrong');
  fb.querySelector('.feedback-icon').className = 'feedback-icon bi ' + (isCorrect ? 'bi-check-circle-fill' : 'bi-x-circle-fill');
  fb.querySelector('.feedback-text').textContent = isCorrect ? 'Rätt!' : 'Fel – det var ' + forum;
  void fb.offsetWidth;
  fb.classList.add('show');

  card.classList.remove('shake');
  if (!isCorrect) {
    void card.offsetWidth;
    card.classList.add('shake');
  }
  if (navigator.vibrate) navigator.vibrate(isCorrect ? 30 : [60, 40, 60]);
}

function guess(answer) {
  var isCorrect = quiz.current.f.toLowerCase().startsWith(answer);
  var forum = quiz.current.f.toLowerCase().startsWith('familjeliv') ? 'Familjeliv' : 'Flashback';
  showFeedback(isCorrect, forum);

  if (isCorrect) {
    correct++;
    flash('correct');
    ga('send', 'event', 'familjeliv-eller-flashback', 'guess', 'correct', 10);
  } else {
    wrong++;
    flash('wrong');
    ga('send', 'event', 'familjeliv-eller-flashback', 'guess', 'wrong', 20);
  }

  updateProgess();

  quiz.getNewSentence();
  document.getElementById('sentence').textContent = quiz.current.s;
  document.getElementById('load').textContent = '{f: "' + quiz.current.f + '", s: "' + quiz.current.s + '"},';
}

function startGame() {
  wrong = 0;
  correct = 0;
  updateProgess();
  quiz.getNewSentence();
  document.getElementById('sentence').textContent = quiz.current.s;
}

function updateProgess() {
  document.getElementById('correct').textContent = correct;
  document.getElementById('wrong').textContent = wrong;
  var percent = correct + wrong > 0 ? correct / (correct + wrong) * 100 : 100;
  document.getElementById('progress').style.width = percent + '%';
}

function reset() {
  window.localStorage.removeItem('quiz-sentences');
}
