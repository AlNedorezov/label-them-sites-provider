
# Task generation
  
Before read further, make sure that you are familiar with the process of deploying label-them app to Yandex.Toloka ([https://github.com/AlNedorezov/label-them/blob/master/docs/Getting-started-YandexToloka.md](https://github.com/AlNedorezov/label-them/blob/master/docs/Getting-started-YandexToloka.md))  
  
## Configuration  
1. Download and install project  
```  
   git clone https://github.com/madeofsun/label-them-sites-provider  
   npm install  
```  

3. Get latest selenium version for your platform - [https://docs.seleniumhq.org/download/](https://docs.seleniumhq.org/download/)  
Place it in the project's root directory  

4. Get ChromeDriver for your chrome version [https://sites.google.com/a/chromium.org/chromedriver/downloads](https://sites.google.com/a/chromium.org/chromedriver/downloads)  
Place it in the project's root directory.  

5. Create  `input.conf.json` file in the project's root directory  
   This file should contain following fields  
```  
{  
  "urls": ['https://yandex.ru'], // list of sites urls  
  "pullName": "test2342", // name of toloka's pull  
  "proxyName": "lt-data", // unique name (not folder name!) of the proxy to Yandex.Disk  
  "inputParameters": {...} // parameters for label-them app  
}  
```  

  
## File generation  
1. Run Selenium server  
```  
java -jar -Dwebdriver.chrome.driver=./chromedriver selenium-server-standalone-3.141.59.jar  
```  
You should specify proper version of selenium server - the one that is downloaded by you.  

2. Run file generation script  
```  
npm run start  
```  
File are placed in `output-${pullName}` directory with the following content :
```  
output-${pullName}  
 - tasks.tsv   // .tsv file to add tasks to the pull  
 - shots   // screenshots of sites content  
   - aHR0cHM6Ly95b3V0dWJlLmNvbQ==.png   // one file per site, name is base64 encoded url  
   - ...  
 - metadata   // elements data of sites content  
   - aHR0cHM6Ly95b3V0dWJlLmNvbQ==.json   // one file per site, name is base64 encoded url  
   - ...  
 - fileMap.json   // url - filename map  
```

## Upload task

1. Copy `output-${pullName}/shots` directory to the application folder on Yandex.Disk.
2. Upload `output-${pullName}/tasks.tsv` to the pull.
3. Use preview button to make sure that everything works.