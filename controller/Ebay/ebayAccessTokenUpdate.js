var axios = require("axios");
var qs = require("qs");

const fs = require("fs");

const fileName = "./controller/EbayToken.json";

let Tokenjson = require("./EbayToken.json");

async function EbayToken() {
  var data = qs.stringify({
    grant_type: "refresh_token",
    refresh_token: Tokenjson.EbayrefreshToken,
    scope:
      "https://api.ebay.com/oauth/api_scope/sell.inventory.readonly https://api.ebay.com/oauth/api_scope/sell.inventory",
  });
  var config = {
    method: "post",
    url: "https://api.ebay.com/identity/v1/oauth2/token",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic TG9uZG9uVG8tT25saW5lU3QtUFJELTkyY2NiZGVlZS01MWEzNmE2MjpQUkQtMmNjYmRlZWUwM2I1LTA5ZWItNDNlYy05OTlkLTM1YTc=",
      Cookie:
        "__deba=bmuj9a9XTf7umY8wIOD18QYQORtAcPO17iZT_9d0Nk7KiK6GHh8rsO3fg-ziHuwFmzg73R5azxcKBRkLFnIwwaxUvKaqy7r1EqDmN9nEJjAYBNTHFqhf4Lx0HlozhXOr95hvhNnjwdasOPoFOicW_w==; __uzma=011be894-c421-4827-953a-84017d78e150; __uzmb=1654867500; __uzmc=875661342785; __uzmd=1654935546; __uzme=1646; __uzmf=7f6000013eb61a-a22b-418d-a873-3bd31c90d846165486750078568046160-f110829aab42f50513; cid=D6SUx4xMtFvvpRCc%231286842201; dp1=bpbf/%2320000000000000000000000000004648bd128^u1p/QEBfX0BAX19AQA**666d04a8^bl/IN666d04a8^; ebay=%5Esbf%3D%23%5E; nonsession=CgADKACBmbQSoNDJjNDY0NjMxODEwYTdiMTMzYjM5MTBiZmZmZTljZmUD2rtr",
    },
    data: data,
  };

  try {
    const response = await axios(config);

    Tokenjson.EbayAccessToken = response.data.access_token;

    fs.writeFileSync(fileName, JSON.stringify(Tokenjson));
    console.log("Ebay Access token updated");
  } catch (err) {
    console.log(err);
  }
}

module.exports = EbayToken;
