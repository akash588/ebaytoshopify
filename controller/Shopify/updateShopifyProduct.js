


var axios = require('axios');
const shopifyData =  require('../../shopifyAllProduct.json')
const itemsku = require('../../item.json')
const ebayData =  require('../../getallEbayproduct.json')
const _config = require('../../config')

// const fs = require("fs");

 


let json= []


async function MappEbayToShopify () {

console.log(ebayData[0].ItemID[0])
console.log(itemsku[0].itemID)

for(let a = 0; a <= ebayData.length - 1 ; a++){


  for(let b = 0; b <= itemsku.length - 1; b++){

if(itemsku[b].itemID == ebayData[a].ItemID[0]){
  ebayData[a].sku = itemsku[b].sku
  console.log(ebayData[a])
}


}

}



  // await delay(20000)
  // console.log(shopifyData[0].variants[0].sku)
  // console.log(ebayData[0].sku)
// return;
  for(let i = 0; i <=shopifyData.length - 1 ; i++){

    // console.log(shopifyData[i].variants[0].sku, i )
    for(let j = 0; j <=ebayData.length - 1; j++){
  //  console.log( ebayData[j].sku )
  for(let k = 0; k < shopifyData[i].variants.length; k++) {
if( ebayData[j].sku == shopifyData[i].variants[k].sku ){
console.log(shopifyData[i].variants[0].inventory_quantity,  ebayData[j].quantity)
      
let quantityAdjust =  ebayData[j].quantity - shopifyData[i].variants[k].inventory_quantity 
console.log("adjust",quantityAdjust)

if(quantityAdjust == 0) {
  continue;
}
else{
  await updateProduct(shopifyData[i].variants[k].inventory_item_id, quantityAdjust)
}


}
    }


    }


  }



}


// console.log(shopifyData[i].id)

// console.log(">>>>>>>>>")

// console.log(ebayData[0])


// }




async function updateProduct(itemid, adjustquantity) {


await delay(2000)
  var data = JSON.stringify({
  "location_id": 66460221660,
  "inventory_item_id": itemid,
  "available_adjustment": adjustquantity
});

var config = {
  method: 'post',
  url: `https://${_config.Shopify.shopName}/admin/api/2022-04/inventory_levels/adjust.json`,
  headers: { 
    'Authorization': 'Basic ODY5MDM0NjMyMmJmZDczYjFhYjZmMjE4Y2U3ZGE1MzU6c2hwYXRfZGEzYzkzNWQ5NTQ3MGQ4MWEyZWNlODQyNDUwZmM3MGM=', 
    'Content-Type': 'application/json'
  },
  data : data
};

try{
  
 const response =  await axios(config)
 console.log(response.data)

}
catch(err){

  console.log(err)
}
}

const delay = ms => new Promise(res => setTimeout(res, ms));


module.exports = MappEbayToShopify;