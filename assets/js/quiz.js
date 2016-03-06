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

		var random = Math.floor(Math.random()*sentences.length);

		quiz.current = sentences[random];
		sentences.splice(random, 1);
		window.localStorage['quiz-sentences'] = JSON.stringify(sentences);

		if(sentences.length < preloaded.length){
			this.loadNewSentences();
		}         
		return quiz.current;
    },
    loadNewSentences : function(callback){
         jQuery.ajaxSettings.traditional = true;

         jQuery.ajax({
				url:this.backend, 
				dataType:'jsonp', data: {
					'command':'info',
					'corpus': this.getRandomCorpora().join(',')
				}
			}).done(function(data){
				console.log(data);
				$.each(data.corpora, function(index, corpus){
					
					var start = Math.floor(Math.random()*corpus.info.Sentences);
					
					jQuery.ajax({
						url:quiz.backend, 
						dataType:'jsonp', data: {
							'command':'query_sample',
							'corpus': index,
							'start': start,
							'end': (start+3),
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
				})
			}
		);
    },
	getRandomCorpora: function(){
		var corpuslist = new Array();
		
		while(corpuslist.length < 5){
			var corpus = this.familjeliv[Math.floor(Math.random()*this.familjeliv.length)];
			if($.inArray(corpus, corpuslist) < 0){
				corpuslist.push(corpus);
			}
		}
		
		while(corpuslist.length < 10){
			var corpus = this.flashback[Math.floor(Math.random()*this.flashback.length)];
			if($.inArray(corpus, corpuslist) < 0){
				corpuslist.push(corpus);
			}
		}		
		
		return corpuslist;
	}
}