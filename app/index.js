const { chromium } = require('playwright');

exports.handler = async (event, context) => {
  console.log('Handler started');

  console.log(event);

  const url = event.url;
  
  let browser = null;
  
  try {
    console.log('Launching browser...');
    
    browser = await chromium.launch({
      headless: true,
      args: [
        '--disable-dev-shm-usage',
        '--disable-setuid-sandbox',
        '--no-sandbox',
        '--single-process',
        '--disable-gpu',
        '--no-zygote'
      ]
    });
    
    console.log('Browser launched successfully');
    
    const page = await browser.newPage();
    console.log('New page created');
    
    await page.goto(url, { waitUntil: 'networkidle' });
    console.log('Page loaded');
    
    const title = await page.title();
    console.log('Page title:', title);
    
    await browser.close();
    console.log('Browser closed');
    
    return {
      statusCode: 200,
      body: JSON.stringify({ 
        message: 'Success',
        title: title
      })
    };
    
  } catch (error) {
    console.error('Error:', error);
    
    if (browser) {
      try {
        await browser.close();
      } catch (closeError) {
        console.error('Error closing browser:', closeError);
      }
    }
    
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: error.message,
        stack: error.stack 
      })
    };
  }
};
