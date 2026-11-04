(function(){try{
var ua=navigator.userAgent||'';
if(/bot|crawl|spider|slurp|lighthouse|facebookexternalhit|preview|headless/i.test(ua))return;
var keuze=null;try{keuze=localStorage.getItem('ai-taal')}catch(e){}
var T=['en','de','fr','es','it','no','sv','da','pl','fi','pt','cs','sk','hu','ro','hr','sr','sl','bg','el','et','lv','lt','uk'];
var doel=keuze;
if(!doel){
 var tz='';try{tz=Intl.DateTimeFormat().resolvedOptions().timeZone||''}catch(e){}
 var nav=(navigator.languages&&navigator.languages.length?navigator.languages:[navigator.language||'']).map(function(l){return String(l).toLowerCase().split('-')[0]});
 var heeft=function(c){return nav.indexOf(c)>-1};
 var Z={
  'Europe/Amsterdam':'nl',
  'Europe/Berlin':'de','Europe/Busingen':'de','Europe/Vienna':'de','Europe/Vaduz':'de',
  'Europe/Paris':'fr','Europe/Monaco':'fr',
  'Europe/Madrid':'es','Atlantic/Canary':'es','Africa/Ceuta':'es','Europe/Andorra':'es',
  'Europe/Rome':'it','Europe/Vatican':'it','Europe/San_Marino':'it',
  'Europe/London':'en','Europe/Dublin':'en','Europe/Guernsey':'en','Europe/Jersey':'en','Europe/Isle_of_Man':'en','Europe/Gibraltar':'en','Europe/Malta':'en',
  'Europe/Oslo':'no','Arctic/Longyearbyen':'no',
  'Europe/Stockholm':'sv','Europe/Mariehamn':'sv',
  'Europe/Copenhagen':'da','Atlantic/Faroe':'da',
  'Europe/Warsaw':'pl','Europe/Helsinki':'fi',
  'Europe/Lisbon':'pt','Atlantic/Madeira':'pt','Atlantic/Azores':'pt',
  'Europe/Prague':'cs','Europe/Bratislava':'sk','Europe/Budapest':'hu',
  'Europe/Bucharest':'ro','Europe/Chisinau':'ro',
  'Europe/Zagreb':'hr','Europe/Sarajevo':'hr',
  'Europe/Belgrade':'sr','Europe/Podgorica':'sr',
  'Europe/Ljubljana':'sl','Europe/Sofia':'bg',
  'Europe/Athens':'el','Asia/Nicosia':'el','Europe/Nicosia':'el','Asia/Famagusta':'el',
  'Europe/Tallinn':'et','Europe/Riga':'lv','Europe/Vilnius':'lt',
  'Europe/Kyiv':'uk','Europe/Kiev':'uk','Europe/Uzhgorod':'uk','Europe/Zaporozhye':'uk'
 };
 var t=Z[tz];
 // Landen met meerdere talen: de taal van de browser beslist
 if(tz==='Europe/Brussels')t=heeft('fr')&&!heeft('nl')?'fr':heeft('de')&&!heeft('nl')?'de':'nl';
 else if(tz==='Europe/Zurich')t=heeft('fr')?'fr':heeft('it')?'it':'de';
 else if(tz==='Europe/Luxembourg')t=heeft('de')&&!heeft('fr')?'de':'fr';
 else if(tz==='Europe/Helsinki'&&heeft('sv')&&!heeft('fi'))t='sv';
 // Minderheidstalen in een land: Engels in plaats van de landstaal
 else if((tz==='Europe/Belgrade'&&heeft('sq'))||((tz==='Asia/Nicosia'||tz==='Asia/Famagusta')&&heeft('tr'))||(tz==='Europe/Chisinau'&&heeft('ru')&&!heeft('ro')))t='en';
 // Spaanstalige en Portugeestalige landen buiten Europa
 if(!t&&/^America\/(Argentina\/.*|Buenos_Aires|Mexico_City|Cancun|Merida|Monterrey|Matamoros|Chihuahua|Ciudad_Juarez|Ojinaga|Mazatlan|Bahia_Banderas|Hermosillo|Tijuana|Guatemala|El_Salvador|Tegucigalpa|Managua|Costa_Rica|Panama|Havana|Santo_Domingo|Puerto_Rico|Bogota|Caracas|Lima|Guayaquil|La_Paz|Santiago|Punta_Arenas|Asuncion|Montevideo)$|^Pacific\/(Galapagos|Easter)$|^Africa\/Malabo$/.test(tz))t='es';
 if(!t&&/^America\/(Sao_Paulo|Bahia|Fortaleza|Recife|Belem|Manaus|Cuiaba|Campo_Grande|Porto_Velho|Boa_Vista|Rio_Branco|Eirunepe|Araguaina|Maceio|Santarem|Noronha)$|^Africa\/Luanda$/.test(tz))t='pt';
 // Onbekend land en geen tijdzone van Nederland: Engels
 doel=t||'en';
}
if(doel!=='nl'&&T.indexOf(doel)>-1)location.replace(doel+'/'+location.search+location.hash);
}catch(e){}})();
