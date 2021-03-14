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
    
    let allMsg=[];
    for(let i=5;i<=40;i++)
    {
        let msg=await page.evaluate(()=>{
            let message=document.querySelector(`#main > div._2wjK5 > div > div > div._11liR > div:nth-child(${i}) > div > div > div > div.copyable-text > div > span._3-8er.selectable-text.copyable-text > span`).innerText;
            let timeDate=document.querySelector(`#main > div._2wjK5 > div > div > div._11liR > div:nth-child(${i}) > div > div > div > div.copyable-text`).dataset.prePlainText;
            let arr=timeDate.split(" ");
    
            return{
                time:arr[0].slice(1)+" "+arr[1].slice(0,-1),
                date:arr[2].slice(0,-1),
                sender:arr[3]+" "+arr[4].slice(0,-1),
                message,
                
            }
    
        });
        allMsg.push(msg);

    }
    fs.writeFile(
        '/message.json',
        JSON.stringify(allMsg)
    )
    

    
    
    
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

