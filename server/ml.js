const automl = require('@google-cloud/automl').v1beta1;
const fs = require('fs');

const client = new automl.PredictionServiceClient(); // gcloud auth application-default login

const projectId = 'slo-hacks'
const computeRegion = 'us-central1'
const modelId = 'ICN5975517313197165750';
const scoreThreshold = '0.5'

const modelFullId = client.modelPath(projectId, computeRegion, modelId);

function ml() {
const data = require('./motor.json');
for (let i = 0; i < data.length; i++) {
  const filePath = data[i].image;
  const content = fs.readFileSync(filePath, 'base64');

  const params = {};

  if (scoreThreshold) {
    params.score_threshold = scoreThreshold;
  }

  const payload = {};
  payload.image = { imageBytes: content };

  async function Predict() {
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

  Predict();
}
}

setInterval(ml, 1000);


// curl -X POST -H "Content-Type: application/json" \
//   -H "Authorization: Bearer $(gcloud auth application-default print-access-token)" \
//   https://automl.googleapis.com/v1beta1/projects/slo-hacks/locations/us-central1/models/ICN5975517313197165750:predict -d @request.json