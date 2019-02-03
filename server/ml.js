const automl = require('@google-cloud/automl').v1beta1;
const fs = require('fs');

const client = new automl.PredictionServiceClient();

const projectId = 'motorskills'
const computeRegion = 'us-west1'
const modelId = 'ICN7961539503330524376'
const filePath = '/Volumes/X/GitHub/motorskills/server/images/Outputs/output-1549127390163.png'
const scoreThreshold = '0.5'

const modelFullId = client.modelPath(projectId, computeRegion, modelId);
const content = fs.readFileSync(filePath, 'base64');

const params = {};


if (scoreThreshold) {
    params.scoreThreshold = scoreThreshold;
}

const payload = {};
payload.image = { imageBytes: content };

async function predict() {
    const [response] = await client.predict({
        name: modelFullId,
        payload: payload,
        params: params,
    });
    console.log(`Prediction results:`);
    response.payload.forEach(result => {
        console.log(`Predicted class name: ${result.displayName}`);
        console.log(`Predicted class score: ${result.classification.score}`);
    });
}