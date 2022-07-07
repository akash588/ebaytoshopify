


const Shopify = require('shopify-api-node');
const fs = require('fs')
const all = require('../../shopifyAllProduct.json')
const _config =  require('../../config')

const updateProduct = require('../Shopify/updateShopifyProduct')

let allproduct = []
async function shopifyProduct() {
  // console.log(all.length)
const shopify = new Shopify({
    shopName: `${_config.Shopify.shopName}`,
    apiKey:`${_config.Shopify.apiKey}`,
    password: `${_config.Shopify.password}`,
    autoLimit: true
});

(async () => {
  let params = { limit: 250 };

  do {
    const products = await shopify.product.list(params);
    if(allproduct == []){
      allproduct.push(
        products
      )
    }else{
    allproduct = [...allproduct, ...products]
    }
    // allproduct.push(products)
    params = products.nextPageParameters;
    if(params == undefined) {
      fs.writeFile("shopifyAllProduct.json", JSON.stringify(allproduct), (err) => {
        if (err) console.log(err);
        else {
          console.log("File written successfully\n of page");
        }


        
      });
      await delay(5000)
      await updateProduct()
    }
   

    
  } while (params !== undefined);
})().catch(console.error);


  }

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  module.exports = shopifyProduct;
