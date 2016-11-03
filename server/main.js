import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';



Meteor.startup(() => {

HTTP.call("GET", "http://tr.investing.com/equities/turk-hava-yollari-technical?period=300", {headers: {'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/29.0.1547.62 Safari/537.36'}},
      function (error, result) {
        if (!error) {

          var object ={};
          //console.log(result.content);

          let data = result.content.split('\n').join('');
          data = data.split('\t').join('');
          var hareketli_ortalamalar  = />([A-Z0-9]*)<\/td><td>([0-9,]*)<br\/><span[=A-z "]*>([A-z]*)/g;
          var teknik_indikatorler = /symbol">(.*?)<\/td><td class="right">(.*?)<.*?"><span.*?>(.*?)<\/span>/g;
          var degisim_degerleri =  /id="last_last" dir="ltr">(.*?)<.*?dir="ltr">(.*?)<.*?dir="ltr">(.*?)<.*?-time">(.*?)</g;

/*
var hareketli_ortalamalar  = />([A-Z0-9]*)<\/td><td>([0-9,]*)<br\/><span[=A-z "]*>([A-z]*)/g;
var teknik_indikatorler = /symbol">(.*?)<.*?">(.*?)<.*?"><span.*?>(.*?)<\/span>/g;
*/

          var resArray;

          var ind;

          console.log('___ hareketli_ortalamalar ____');

          while( (resArray = hareketli_ortalamalar.exec(data)) != null){
            if(resArray[1].length>1) ind = resArray[1];
          	console.log(ind , ': ' , resArray[2], ': ', resArray[3]);
          }

          console.log('___ teknik_indikatorler ____');

          while( (resArray = teknik_indikatorler.exec(data)) != null){
            //console.log(resArray[0]);
            if(resArray[1].length>1) ind = resArray[1];
            console.log(ind , ': ' , resArray[2], ': ', resArray[3]);
          }


          console.log('___ degisim_degerleri ____');

          while( (resArray = degisim_degerleri.exec(data)) != null){
            //console.log(resArray[0]);
            console.log('hisse degeri:', resArray[1], 'degisim(kurus): ' , resArray[2], 'degisim(yuzde): ', resArray[3], 'saat: ', resArray[4]);
          }

        }else {
      console.log(error);
    }
});

});
