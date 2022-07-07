


const ebaydata = require('../../getallEbayproduct.json')
const AuthToken = require("./EbayToken.json");
const _config = require("../../config");
var axios = require("axios");
const { parseString } = require("xml2js");
const tokenUpdate = require("./ebayAccessTokenUpdate");
const fs = require("fs");

let SkuArray = []
async function loopsku(){
   await tokenUpdate()
    for (let j = 0; j <= ebaydata.length - 1; j++) {
        console.log("j", j, ebaydata.length )
        if( j == ebaydata.length - 1){
          fs.writeFile("item.json", JSON.stringify(SkuArray), (err) => {
            if (err) console.log(err);
            else {
              console.log("File written successfully\n");
            }
          });

        }
       
        await getSKUbyItemID(ebaydata[j].ItemID[0]);
      }
}


async function getSKUbyItemID(itemID) {
    // console.log("itemID", itemID)
    // await delay(1000);
    var data = `<?xml version="1.0" encoding="utf-8"?>'+
  '<GetItemRequest xmlns="urn:ebay:apis:eBLBaseComponents">'+
  '<RequesterCredentials>'+
  '<eBayAuthToken>${AuthToken.EbayAccessToken}</eBayAuthToken>'+
  '</RequesterCredentials>'+
  '<DetailLevel>ReturnAll</DetailLevel>'+
  '<ItemID>${parseInt(itemID)}</ItemID>'+
  '</GetItemRequest>`;
  
    var options = {
      method: "post",
      url: _config.Ebay.EbaygetProductUrl,
      maxContentLength: "infinity",
      headers: {
        "X-EBAY-API-COMPATIBILITY-LEVEL": "901",
        "X-EBAY-API-CALL-NAME": "GetItem",
        "X-EBAY-API-IS-INTERNAL-CLIENT": "true",
        "X-EBAY-API-SITEID": "0",
        "Content-Type": "text/xml",
        "Content-Length": data.length,
      },
      data: data,
    };
  
    var res = await axios(options);
  
    // console.log(res.data)
  
    var xml = res.data;
  
    parseString(xml, async function (err, results) {
  
    //   console.log(ebaydata.length)
    //   console.log(results.GetItemResponse.Errors)
  
      //  fs.writeFile(
      //     "item.json",
      //     JSON.stringify(results.GetItemResponse.Item[0].Variations[0].Variation[0].SKU[0]),
      //     (err) => {
      //       if (err) console.log(err);
      //       else {
      //         console.log("File written successfully\n of page", page);
      //       }
      //     }
      //   );
  
      let my_object = {};
  
      // load data into object
      // console.log(results.GetItemResponse.Item[0].Variations);
      my_object.itemID = itemID
      my_object.sku = results.GetItemResponse.Item[0].Variations
        ? results.GetItemResponse.Item[0].Variations[0].Variation[0].SKU[0]
        : results.GetItemResponse.Item[0].SKU[0];
      my_object.quantity = results.GetItemResponse.Item[0].Variations
        ? results.GetItemResponse.Item[0].Variations[0].Variation[0].Quantity[0]
        : results.GetItemResponse.Item[0].Quantity[0];
  
      SkuArray.push(my_object);
      // console.log(SkuArray);
    });
  }

  module.exports = loopsku;