/*
 * Data Util
 * Aceita uma data, uma mascara, ou os dois.
 * @return Date Retorna uma string a partir do objeto data
 * e da mascara
 */
var dateFormat = function () {
	var	token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
		timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
		timezoneClip = /[^-+\dA-Z]/g,
		pad = function (val, len) {
			val = String(val);
			len = len || 2;
			while (val.length < len) val = "0" + val;
			return val;
		};

	return function (date, mask, utc) {
		var dF = dateFormat;

		if (arguments.length == 1 && (typeof date == "string" || date instanceof String) && !/\d/.test(date)) {
			mask = date;
			date = undefined;
		}
		
		date = date ? new Date(date) : new Date();
		if (isNaN(date)) throw new SyntaxError("invalid date");

		mask = String(dF.masks[mask] || mask || dF.masks["default"]);

		if (mask.slice(0, 4) == "UTC:") {
			mask = mask.slice(4);
			utc = true;
		}

		var	_ = utc ? "getUTC" : "get",
				d = date[_ + "Date"](),
				D = date[_ + "Day"](),
				m = date[_ + "Month"](),
				y = date[_ + "FullYear"](),
				H = date[_ + "Hours"](),
				M = date[_ + "Minutes"](),
				s = date[_ + "Seconds"](),
				L = date[_ + "Milliseconds"](),
				o = utc ? 0 : date.getTimezoneOffset(),
			flags = {
				d:    d,
				dd:   pad(d),
				ddd:  dF.i18n.dayNames[D],
				dddd: dF.i18n.dayNames[D + 7],
				m:    m + 1,
				mm:   pad(m + 1),
				mmm:  dF.i18n.monthNames[m],
				mmmm: dF.i18n.monthNames[m + 12],
				yy:   String(y).slice(2),
				yyyy: y,
				h:    H % 12 || 12,
				hh:   pad(H % 12 || 12),
				H:    H,
				HH:   pad(H),
				M:    M,
				MM:   pad(M),
				s:    s,
				ss:   pad(s),
				l:    pad(L, 3),
				L:    pad(L > 99 ? Math.round(L / 10) : L),
				t:    H < 12 ? "a"  : "p",
				tt:   H < 12 ? "am" : "pm",
				T:    H < 12 ? "A"  : "P",
				TT:   H < 12 ? "AM" : "PM",
				Z:    utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
				o:    (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
				S:    ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
			};

		return mask.replace(token, function ($0) {
			return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
		});
	};
}();

//Algumas mascaras comuns
dateFormat.masks = {
	"default":      "ddd mmm dd yyyy HH:MM:ss",
	shortDate:      "m/d/yy",
	mediumDate:     "mmm d, yyyy",
	longDate:       "mmmm d, yyyy",
	fullDate:       "dddd, mmmm d, yyyy",
	shortTime:      "h:MM TT",
	mediumTime:     "h:MM:ss TT",
	longTime:       "h:MM:ss TT Z",
	isoDate:        "yyyy-mm-dd",
	isoTime:        "HH:MM:ss",
	isoDateTime:    "yyyy-mm-dd'T'HH:MM:ss",
	isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'",
	brasilDateTime: "dd/mm/yyyy HH:MM:ss",
	brasilDate:     "dd/mm/yyyy"
};

// Internationalização de strings
dateFormat.i18n = {
	dayNames: [
		"Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab",
		"Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sabado"
	],
	monthNames: [
		"Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez",
		"Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
	]
};

/**
 * Recebe uma mascara e retorna uma string
 * <pre>
 * 	Exemplo:
 *   var hoje = new Date();
 *   
 *   //Forma padrão de visualização
 *   alert( hoje );
 *   //Usando o metodo format com mascara atribuida
 *   alert( hoje.format("dd/mm/yyyy") );
 *   //Agora usando a mascara atrávez da propriedade "brasilDate"
 *   alert( hoje.format( dateFormat.masks.brasilDate ) );
 *   //Usando outra mascara da propriedade
 *   alert( hoje.format( dateFormat.masks.brasilDateTime ) );   
 * </pre>
 * @param mask Mascara de formato.
 * @param utc Padrão UTC (opcional)
 * @return String com a data formatada
 * @author Luca Martins
 * */
Date.prototype.format = function (mask, utc) {
	return dateFormat(this, mask, utc);
};


//------------------------------------------------------------------
//Funções de conveniencia
//------------------------------------------------------------------
function _isInteger(val) {
	var digits="1234567890";
	for (var i=0; i < val.length; i++) {
		if (digits.indexOf(val.charAt(i))==-1) { return false; }
		}
	return true;
	}

function _getInt(str,i,minlength,maxlength) {
	for (var x=maxlength; x>=minlength; x--) {
		var token=str.substring(i,i+x);
		if (token.length < minlength) { return null; }
		if (_isInteger(token)) { return token; }
		}
	return null;
}
//------------------------------------------------------------------

//------------------------------------------------------------------
//Funçao que calcula a diferença em anos
//------------------------------------------------------------------
Date.prototype.dateDiff = function(date){
    return (new Date(this - date).format("yyyy")-1970);
};
//------------------------------------------------------------------

/**
 * Faz um parser em cima da data em formato string
 * retornando um objeto Date.
 * 
 *    Exemplo:
 *    var data = new Date();
 *    data = data.parseDate( '01/12/1986', 'dd/mm/yyyy' );
 *    alert( data );
 * 
 * @param val Data em formato String
 * @param format Mascara que deve ser aplicada em cima da Data
 * @return Date Objeto javascript
 * @author Luca Martins
 * */
Date.prototype.parseDate = function( val, format ){
	val=val+"";
	format=format+"";
	var i_val=0;
	var i_format=0;
	var c="";
	var token="";
	var token2="";
	var x,y;
	var now=new Date();
	var year=0;//now.getYear();
	var month=0;//now.getMonth()+1;
	var date=1;
	var hh=0; //now.getHours();
	var mm=0; //now.getMinutes();
	var ss=0; //now.getSeconds();
	var ampm="";
	
	while (i_format < format.length) {
		// Get next token from format string
		c=format.charAt(i_format);
		token="";
		while ((format.charAt(i_format)==c) && (i_format < format.length)) {
			token += format.charAt(i_format++);
			}
		// Extract contents of value based on format token
		if (token=="yyyy" || token=="yy" || token=="y") {
			if (token=="yyyy") { x=4;y=4; }
			if (token=="yy")   { x=2;y=2; }
			if (token=="y")    { x=2;y=4; }
			year=_getInt(val,i_val,x,y);
			if (year==null) { return 0; }
			i_val += year.length;
			if (year.length==2) {
				if (year > 70) { year=1900+(year-0); }
				else { year=2000+(year-0); }
				}
			}
		else if (token=="mmm"||token=="NNN"){
			month=0;
			for (var i=0; i<MONTH_NAMES.length; i++) {
				var month_name=MONTH_NAMES[i];
				if (val.substring(i_val,i_val+month_name.length).toLowerCase()==month_name.toLowerCase()) {
					if (token=="mmm"||(token=="NNN"&&i>11)) {
						month=i+1;
						if (month>12) { month -= 12; }
						i_val += month_name.length;
						break;
						}
					}
				}
			if ((month < 1)||(month>12)){return 0;}
			}
		else if (token=="EE"||token=="E"){
			for (var i=0; i<DAY_NAMES.length; i++) {
				var day_name=DAY_NAMES[i];
				if (val.substring(i_val,i_val+day_name.length).toLowerCase()==day_name.toLowerCase()) {
					i_val += day_name.length;
					break;
					}
				}
			}
		else if (token=="mm"||token=="m") {
			month=_getInt(val,i_val,token.length,2);
			if(month==null||(month<1)||(month>12)){return 0;}
			i_val+=month.length;}
		else if (token=="dd"||token=="d") {
			date=_getInt(val,i_val,token.length,2);
			if(date==null||(date<1)||(date>31)){return 0;}
			i_val+=date.length;}
		else if (token=="hh"||token=="h") {
			hh=_getInt(val,i_val,token.length,2);
			if(hh==null||(hh<1)||(hh>12)){return 0;}
			i_val+=hh.length;}
		else if (token=="HH"||token=="H") {
			hh=_getInt(val,i_val,token.length,2);
			if(hh==null||(hh<0)||(hh>23)){return 0;}
			i_val+=hh.length;}
		else if (token=="KK"||token=="K") {
			hh=_getInt(val,i_val,token.length,2);
			if(hh==null||(hh<0)||(hh>11)){return 0;}
			i_val+=hh.length;}
		else if (token=="kk"||token=="k") {
			hh=_getInt(val,i_val,token.length,2);
			if(hh==null||(hh<1)||(hh>24)){return 0;}
			i_val+=hh.length;hh--;}
		else if (token=="MM"||token=="M") {
			mm=_getInt(val,i_val,token.length,2);
			if(mm==null||(mm<0)||(mm>59)){return 0;}
			i_val+=mm.length;}
		else if (token=="ss"||token=="s") {
			ss=_getInt(val,i_val,token.length,2);
			if(ss==null||(ss<0)||(ss>59)){return 0;}
			i_val+=ss.length;}
		else if (token=="a") {
			if (val.substring(i_val,i_val+2).toLowerCase()=="am") {ampm="AM";}
			else if (val.substring(i_val,i_val+2).toLowerCase()=="pm") {ampm="PM";}
			else {return 0;}
			i_val+=2;}
		else {
			if (val.substring(i_val,i_val+token.length)!=token) {return 0;}
			else {i_val+=token.length;}
			}
		}
	// If there are any trailing characters left in the value, it doesn't match
	if (i_val != val.length) { return 0; }
	// Is date valid for month?
	if (month==2) {
		// Check for leap year
		if ( ( (year%4==0)&&(year%100 != 0) ) || (year%400==0) ) { // leap year
			if (date > 29){ return 0; }
			}
		else { if (date > 28) { return 0; } }
		}
	if ((month==4)||(month==6)||(month==9)||(month==11)) {
		if (date > 30) { return 0; }
		}
	// Correct hours value
	if (hh<12 && ampm=="PM") { hh=hh-0+12; }
	else if (hh>11 && ampm=="AM") { hh-=12; }
	
	var newdate=new Date(year,month-1,date,hh,mm,ss);
//	var newdate= [year,month-1,date,hh,mm,ss];
	return newdate;
};

/**
 * Funcção que compara duas datas 
 *  mascara dos valores 'dd/mm/yyyy'  
 *   retorna > 0 para dtFinal < dtInicial  
 *   retorna = 0 para dtFinal = dtInicial  
 *   retorna < 0 para dtFinal < dtInicial  
 * 
 * @param mixed dtInicial
 * @param mixed dtFinal
 * @return integer 
 */
function compareDate(dtInicial,dtFinal){
    var dataInicial = (typeof(dtInicial)=='object')?dtInicial.val():dtInicial;
    var dataFinal   = (typeof(dtFinal)=='object')?dtFinal.val():dtFinal;

    dataInicial = dataInicial.replace(/[\_]/g,'');
    dataFinal   = dataFinal.replace(/[\_]/g,'');

    if( dataFinal == '' || dataInicial == '' 
     || dataFinal == '//' || dataInicial == '//' ){
        return false;
    }

    var intInicial  = parseInt( dataInicial.split( "/" )[2].toString() + dataInicial.split( "/" )[1].toString() + dataInicial.split( "/" )[0].toString() ); 
    var intFinal    = parseInt( dataFinal.split( "/" )[2].toString() + dataFinal.split( "/" )[1].toString() + dataFinal.split( "/" )[0].toString() );
    
    return ( intFinal - intInicial );
}