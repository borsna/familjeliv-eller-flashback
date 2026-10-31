var quiz = {	
    backend : "https://ws.spraakbanken.gu.se/ws/korp/v8/",
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
		"FLASHBACK-EKONOMI",
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
    loadNewSentences : function(){
		this.getRandomCorpora().forEach(function(corpus){
			quiz.fetchSentences(corpus, Math.floor(Math.random() * 100000))
				.then(function(kwic){
					// the random offset can exceed a small corpus; retry from the start
					return kwic.length ? kwic : quiz.fetchSentences(corpus, 0);
				})
				.then(function(kwic){
					var sentences = JSON.parse(window.localStorage['quiz-sentences']);
					kwic.forEach(function(k){
						var sentence = k.tokens.reduce(function(text, token){
							return quiz.punct.indexOf(token.word) > -1 ? text.trim() + token.word : text + ' ' + token.word;
						}, '');
						sentences.push({f : k.corpus, s : sentence.trim()});
					});
					window.localStorage['quiz-sentences'] = JSON.stringify(sentences);
				})
				.catch(function(error){
					console.error('Could not load sentences from ' + corpus, error);
				});
		});
    },
	fetchSentences : function(corpus, start){
		// every sentence start is a match, which gives distinct sentences
		var params = new URLSearchParams({
			corpus: corpus,
			start: start,
			end: start + 4,
			cqp: '<sentence> []',
			default_context: '1 sentence',
			show: 'word'
		});
		return fetch(quiz.backend + 'query?' + params)
			.then(function(response){
				if(!response.ok) throw new Error('HTTP ' + response.status);
				return response.json();
			})
			.then(function(data){
				if(data.ERROR) throw new Error(data.ERROR.value || 'Korp error');
				return data.kwic || [];
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