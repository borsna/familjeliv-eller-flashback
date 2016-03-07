var quiz = {	
    backend : "http://spraakbanken.gu.se/ws/korp?",
	familjeliv : [
		"FAMILJELIV-ADOPTION",
		"FAMILJELIV-ALLMANNA-EKONOMI",
		"FAMILJELIV-ALLMANNA-FAMILJELIV",
		"FAMILJELIV-ALLMANNA-FRITID",
		"FAMILJELIV-ALLMANNA-HUSHEM",
		"FAMILJELIV-ALLMANNA-HUSDJUR",
		"FAMILJELIV-ALLMANNA-KROPP",
		"FAMILJELIV-ALLMANNA-NOJE",
		"FAMILJELIV-ALLMANNA-SAMHALLE",
		"FAMILJELIV-ALLMANNA-SANDLADAN",
		"FAMILJELIV-EXPERT",
		"FAMILJELIV-FORALDER",
		"FAMILJELIV-GRAVID",
		"FAMILJELIV-KANSLIGA",
		"FAMILJELIV-MEDLEM-ALLMANNA",
		"FAMILJELIV-MEDLEM-FORALDRAR",
		"FAMILJELIV-MEDLEM-PLANERARBARN",
		"FAMILJELIV-MEDLEM-VANTARBARN",
		"FAMILJELIV-PAPPAGRUPP",
		"FAMILJELIV-PLANERARBARN",
		"FAMILJELIV-SEXSAMLEVNAD",
		"FAMILJELIV-SVARTATTFABARN",
		"FAMILJELIV-ANGLARUM"],
	flashback: [
		"FLASHBACK-DATOR",
		"FLASHBACK-DROGER",
		"FLASHBACK-FORDON",
		"FLASHBACK-HEM",
		"FLASHBACK-KULTUR",
		"FLASHBACK-LIVSSTIL",
		"FLASHBACK-MAT",
		"FLASHBACK-POLITIK",
		"FLASHBACK-RESOR",
		"FLASHBACK-SAMHALLE",
		"FLASHBACK-SEX",
		"FLASHBACK-SPORT",
		"FLASHBACK-VETENSKAP",
		"FLASHBACK-OVRIGT",
		"FLASHBACK-FLASHBACK"	
	],
    punct : ['.', ',', '!', '?', ';', '-', '"', '\'', '(', ')'],
    current : {},
    getNewSentence : function(){
		if(window.localStorage['quiz-sentences'] == undefined){
			window.localStorage['quiz-sentences'] = JSON.stringify(preloaded);
		}

		var sentences = JSON.parse(window.localStorage['quiz-sentences']);

		if(sentences.length == 0){
			sentences = preloaded;
			window.localStorage['quiz-sentences'] = JSON.stringify(preloaded);
			this.loadNewSentences();
		}
		
		var random = Math.floor(Math.random()*sentences.length);

		quiz.current = sentences[random];
		sentences.splice(random, 1);
		window.localStorage['quiz-sentences'] = JSON.stringify(sentences);

		if(sentences.length == 20){
			this.loadNewSentences();
		}         
		return quiz.current;
    },
    loadNewSentences : function(callback){
         jQuery.ajaxSettings.traditional = true;
		 
		 var corpora = this.getRandomCorpora();
		 

		$.each(corpora, function(index, corpus){
			
			console.log('load from: '+corpus);
			jQuery.ajax({
				url:quiz.backend, 
				dataType:'jsonp', data: {
					'command':'query_sample',
					'corpus': corpus,
					'start': 0,
					'end': 5,
					'cqp': '[]',
					'defaultcontext':'1 sentence',
					'show_struct':['text_username', 'text_date', 'thread_title']							
				}
			}).done(function(data){
				console.log(data);
				if(data.hasOwnProperty('ERROR') == false){
					jQuery.each(data.kwic, function(i, kwic) {
						var sentence = "";
						jQuery.each(kwic.tokens, function(key, val) {
							if (jQuery.inArray(val.word, quiz.punct) > -1){ 
								sentence = sentence.trim() + val.word;
							}
							else{
								sentence += ' ' + val.word;
							}
						});
						var sentences = JSON.parse(window.localStorage['quiz-sentences']);
						sentences.push({f : kwic.corpus, s : sentence.trim()});						
						
						window.localStorage['quiz-sentences'] = JSON.stringify(sentences);
					});
				}
			});
		});
    },
	getRandomCorpora: function(){
		var corpuslist = new Array();
		
		var corpus_familjeliv = this.familjeliv[Math.floor(Math.random()*this.familjeliv.length)];
		corpuslist.push(corpus_familjeliv);

		var corpus_flashback = this.flashback[Math.floor(Math.random()*this.flashback.length)];
		corpuslist.push(corpus_flashback);
	
		return corpuslist;
	}
}