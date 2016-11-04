import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';

import { HisseVeri} from './../api/hisseveri';

Meteor.startup(() => {

  extractDataFromInvesting();
  Meteor.setInterval(extractDataFromInvesting,1000*60*5);

});


function runRegexAndSet(regex, data, objectToBeSet){
  var resArray;
  while( (resArray = regex.exec(data)) != null){
    if(resArray[1].length>1) ind = resArray[1];
    console.log(ind , ': ' , resArray[2], ': ', resArray[3]);
    objectToBeSet[ind] = resArray[2];
    objectToBeSet[ind+'_'] = resArray[3];
  }
}


function extractDataFromInvesting(){

  HTTP.call("GET", "http://tr.investing.com/equities/turk-hava-yollari-technical?period=300",
      {headers: {'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/29.0.1547.62 Safari/537.36'}},
      function (error, result) {
        if (!error) {

          var object ={};
          //console.log(result.content);

          let data = result.content.split('\n').join('');
          data = data.split('\t').join('');

          var hareketli_ortalamalar  = />([A-Z0-9]*)<\/td><td>([0-9,]*)<br\/><span[=A-z "]*>([A-z]*)/g;
          var teknik_indikatorler = /symbol">(.*?)<\/td><td class="right">(.*?)<.*?"><span.*?>(.*?)<\/span>/g;
          var degisim_degerleri =  /id="last_last" dir="ltr">(.*?)<.*?dir="ltr">(.*?)<.*?dir="ltr">(.*?)<.*?-time">(.*?)</g;


          var resArray;

          console.log('___ hareketli_ortalamalar ____');

          runRegexAndSet(hareketli_ortalamalar,data,object);

          console.log('___ teknik_indikatorler ____');

          runRegexAndSet(teknik_indikatorler, data, object);


          console.log('___ degisim_degerleri ____');


          resArray = degisim_degerleri.exec(data);
          console.log('hisse degeri:', resArray[1], 'degisim(kurus): ' , resArray[2], 'degisim(yuzde): ', resArray[3], 'saat: ', resArray[4]);

          object["fiyat"] = resArray[1];
          object["degisim_fiyat"] = resArray[2];
          object["degisim_yuzde"] = resArray[3];
          object["saat"] = resArray[4];


          //console.log(JSON.stringify(object));
          object['createdAt'] = new Date();

          if (HisseVeri.find({'saat': object['saat']}).count()<=0) {
            HisseVeri.insert(object);
          }else{
            console.log(object['saat'] + ' zaten vardı eklemedim..');
          }

        }else {
          console.log(error);
        }
      });
}

