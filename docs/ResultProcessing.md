
# Result processing

Before read further, make sure that you are familiar with the format of Yandex.Toloka results response for label-them app
(https://github.com/AlNedorezov/label-them/blob/master/docs/Yandex.Toloka-JSON-response.md).

1. Find the `output-${pullName}` directory for your pull that was created during generation process.
2. Download user answers from Yandex.Toloka and save them to  `output-${pullName}` directory:
```
curl -H "Authorization: OAuth <YOUR_OUATH_KEY>" https://sandbox.toloka.yandex.ru/api/v1/assignments?pool_id="166519" > output-test2342/toloka.response.json
```

2. Run script to process results:
```
node process_results.js <output-${pullName}>
```
The results are saved in `output-${pullName}/results.json` file.