const puppeteer = require("puppeteer");
const fs=require('fs');

(async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto("https://web.whatsapp.com");
    
    await page.waitForSelector("#side > div.SgIJV > div > label > div > div._2_1wd.copyable-text.selectable-text");
    const searchBar = await page.$(
        "#side > div.SgIJV > div > label > div > div._2_1wd.copyable-text.selectable-text"
    );
    await searchBar.type("Test group")
    await page.keyboard.press("Enter");
    
    await autoScroll(page);

    const allMsg=await page.evaluate(()=>{
        let msgArray=[];
        let msgSelectors=document.querySelectorAll('._1bR5a')
        for(let i=0;i<msgSelectors.length;i++){
            let timeDate=msgSelectors[i].firstChild.dataset.prePlainText;
            let message=msgSelectors[i].firstChild.firstElementChild.firstElementChild.firstElementChild.innerText;
            let arr=timeDate.split(" ");
            let msg={
                time:arr[0].slice(1)+" "+arr[1].slice(0,-1),
                date:arr[2].slice(0,-1),
                sender:arr[3]+" "+arr[4].slice(0,-1),
                message,

            }
            msgArray.push(msg);
        }
        return msgArray;
    })    

    fs.writeFile('message.json',JSON.stringify(allMsg),function(err){
        if(err)
        throw err;
        console.log("saved!!");
    });

    await browser.close();

})();

async function autoScroll(page){
    await page.evaluate(() => new Promise((resolve) => {
        var scrollTop = -1;
        const interval = setInterval(() => {
            document.querySelector("._1gL0z").scrollBy(0, -100);
            scrollTop++;
          if(scrollTop>100) {
            clearInterval(interval);
            resolve();
          }
          
        }, 100);
      }));
}

