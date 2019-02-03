const automl = require('@google-cloud/automl').v1beta1;
const {Storage} = require('@google-cloud/storage');
const admin = require('firebase-admin');

admin.initializeApp();
let db = admin.firestore();
const storage = new Storage();
const myBucket = storage.bucket('slo-hacks-vcm');

const client = new automl.PredictionServiceClient(); // gcloud auth application-default login

const projectId = 'slo-hacks'
const computeRegion = 'us-central1'
const modelId = 'ICN287417307825518261';
const scoreThreshold = '0.5'

const modelFullId = client.modelPath(projectId, computeRegion, modelId);

exports.predictSkills = (data, context) =>  {
  console.log(`Processing file: ${data.name}`);
  const name = data.name;
  const content = `gs://slo-hacks-vcm/${data.name}`;
  const file = myBucket.file(data.name);
  
  const params = {};

  if (scoreThreshold) {
    params.score_threshold = scoreThreshold;
  }

  file.download().then(imageData => {
    const image = imageData[0];
    const buffer = image.toString('base64');
    const payload = {};
    payload.image = {
      imageBytes: buffer
    };
    
    let displayName, score;
  
    async function Predict() {
      const [response] = await client.predict({
        name: modelFullId,
        payload: payload,
        params: params,
      });

      console.log(`Prediction results:`);
      response.payload.forEach(result => {
        console.log(`Predicted class name: ${result.displayName}`);
        displayName = result.displayName;
        console.log(`Predicted class score: ${result.classification.score}`);
        score = result.classification.score;
      });
      
      let docRef = db.collection('predictions').doc(name);
      let setPrediction = docRef.set({
        date: new Date(),
        displayName: displayName,
        file: content,
        score: score
      });
      
    }
    
    Predict();
  });
};

