var correct = 0;
var wrong = 0;

$(window).keypress(function(e){
  var code = e.which || e.keyCode;
  switch ( code )
  {
    case 97:
      guess('familjeliv');
      break;
    case 98:
      guess('flashback');
      break;
  }
});

function setState(state){
	$('.game-state').hide();
	$('.game-state-'+state).show();

	if($( 'div[class^="mdl-layout__obfuscator"]' ).hasClass('is-visible')){
		$( 'div[class^="mdl-layout__obfuscator"]' ).trigger( "click" );
	}
	
	switch(state){
		case 'game':
			startGame();
			break;
	}
}

function guess(answer){	
	if(quiz.current.f.toLowerCase().startsWith(answer)){
		correct++;
		$("#correct").fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100);
		ga('send', 'familjeliv-eller-flashback', 'guess', 'answer', 'correct');
	}else{
		wrong++;
		$("#wrong").fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100);
		ga('send', 'familjeliv-eller-flashback', 'guess', 'answer', 'wrong');
	}

	updateProgess();
	
	quiz.getNewSentence();
	$('#sentence').text(quiz.current.s);	
	
	$('#load').text('{f: "'+quiz.current.f+'", s: "'+quiz.current.s+'"},');
}

function startGame(){
	wrong = 0;
	correct = 0;
	updateProgess();
	quiz.getNewSentence();
	$('#sentence').text(quiz.current.s);
}

function updateProgess(){
	$('#correct').html(correct);
	$('#wrong').html(wrong);
	var percent = 100;
	if((correct+wrong) > 0){
	  percent = correct/(correct+wrong)*100;
	}
	document.querySelector('#progress').MaterialProgress.setProgress(percent);
}

function reset(){
	window.localStorage.removeItem("quiz-sentences");
}

String.prototype.startsWith = function(needle){
    return(this.indexOf(needle) == 0);
};