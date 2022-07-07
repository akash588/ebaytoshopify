var axios = require("axios");

const fs = require("fs");
const { parseString } = require("xml2js");
const tokenUpdate = require("./ebayAccessTokenUpdate");
const AuthToken = require("./EbayToken.json");
const GetshopifyProducts = require('.././Shopify/getallproductShopify')

const _config = require("../../config");
// const book = require("../../books.json");
var pageNumber = 25;
var allproduct = [];
var SkuArray = [];
const EntryPerPage = 200

async function LoopProductpage() {

  // await delay(30000);
  // console.log(book[0].length)
  await tokenUpdate();
  for (let i = 1; i <= pageNumber; i++) {
    // console.log(i, pageNumber);
    console.log("i",i);
    if (i == pageNumber) {
    // if (allproduct.length == 1) {
      fs.writeFile("getallEbayproduct.json", JSON.stringify(allproduct), (err) => {
        if (err) console.log(err);
        else {
          console.log("File written successfully\n");
        }
      });
     
      

 
    }
   
    await getEbayproduct(i);
  }
}

async function getEbayproduct(page) {
  // console.log("page", page)
  await delay(2000)
  var data = `<?xml version="1.0" encoding="utf-8"?>
  <GetSellerListRequest xmlns="urn:ebay:apis:eBLBaseComponents">
  <RequesterCredentials>
  
  <eBayAuthToken>${AuthToken.EbayAccessToken}</eBayAuthToken>
  </RequesterCredentials>
  <Pagination ComplexType="PaginationType">
      <EntriesPerPage>${EntryPerPage}</EntriesPerPage>
  <PageNumber>${page}</PageNumber>
  </Pagination>
  <EndTimeFrom>2022-06-14T23:13:56.000Z</EndTimeFrom>
  <EndTimeTo>2022-09-15T23:13:56.000Z</EndTimeTo>
  <DetailLevel>ItemReturnDescription</DetailLevel>
  <OutputSelector>Quantity</OutputSelector>
  <OutputSelector>Variation</OutputSelector> 
  <OutputSelector>ItemID</OutputSelector>
  <UserID>${_config.Ebay.EbayUsername}</UserID>
  </GetSellerListRequest>
`;

  var config = {
    method: "post",
    url: _config.Ebay.EbaygetProductUrl,
    maxContentLength: Infinity,
    maxBodyLength: Infinity,
    headers: {
      "Content-Type": "text/xml",
      "X-EBAY-API-COMPATIBILITY-LEVEL": "1201",
      "X-EBAY-API-DEV-NAME": "a3be20a6-b742-4c43-853e-6faf2bafe039",
      "X-EBAY-API-APP-NAME": "LondonTo-OnlineSt-PRD-92ccbdeee-51a36a62",
      "X-EBAY-API-CERT-NAME": "PRD-2ccbdeee03b5-09eb-43ec-999d-35a7",
      "X-EBAY-API-SITEID": "3",
      "X-EBAY-API-CALL-NAME": "GetSellerList",
      Cookie:
        "__deba=bmuj9a9XTf7umY8wIOD18QYQORtAcPO17iZT_9d0Nk7KiK6GHh8rsO3fg-ziHuwFmzg73R5azxcKBRkLFnIwwaxUvKaqy7r1EqDmN9nEJjAYBNTHFqhf4Lx0HlozhXOr95hvhNnjwdasOPoFOicW_w==; __uzma=011be894-c421-4827-953a-84017d78e150; __uzmb=1654867500; __uzmc=875661342785; __uzmd=1654935546; __uzme=1646; __uzmf=7f6000013eb61a-a22b-418d-a873-3bd31c90d846165486750078568046160-f110829aab42f50513; cid=D6SUx4xMtFvvpRCc%231286842201; dp1=bpbf/%2320000000000000000000000000004648bd128^u1p/QEBfX0BAX19AQA**666d04a8^bl/IN666d04a8^; ebay=%5Esbf%3D%23%5E; nonsession=CgADKACBmbQSoNDJjNDY0NjMxODEwYTdiMTMzYjM5MTBiZmZmZTljZmUD2rtr",
    },
    data: data,
  };

  try {
    const response = await axios(config);

    let xmldata = response.data;

    parseString(xmldata, async function (err, results) {
      // console.log(results.GetSellerListResponse.ItemArray[0].Item[0].ItemID[0])
      // parsing to json
      // console.log(results.GetSellerListResponse.ItemArray[0].Item)

      // await delay(2000);
      if( results.GetSellerListResponse.ItemArray){
      if (allproduct == []) {
        // allproduct.push(results.GetSellerListResponse.ItemArray[0].Item);
        allproduct.push(
          results.GetSellerListResponse.ItemArray[0].Item
        );
      } else {
        // for (
        //   let k = 0;
        //   k < results.GetSellerListResponse.ItemArray[0].Item.length;
        //   k++
        // ) {
        //   allproduct = [
        //     ...allproduct,
        //     // ...results.GetSellerListResponse.ItemArray[0].Item,
        //     results.GetSellerListResponse.ItemArray[0].Item[k].ItemID[0],
        //   ];
        // }
          allproduct = [
            ...allproduct,
            // ...results.GetSellerListResponse.ItemArray[0].Item,
            ...results.GetSellerListResponse.ItemArray[0].Item
          ];
      }
    }
      // pageNumber = parseInt(
      //   results.GetSellerListResponse.PaginationResult[0].TotalNumberOfPages[0]
      // );
      // console.log(allproduct)
      // display the json data
      // console.log("results",data);
    });
  } catch (ex) {
    console.log(ex);
  }
}



const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

module.exports = LoopProductpage;
