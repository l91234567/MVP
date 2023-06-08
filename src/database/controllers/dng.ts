const dng = require('../models/dng.js');
const conn = require('../index.js');

module.exports = {

  getTopic: (req:any, res:any) => {
    const topic = req.params

    dng.find(topic)
    .then((result:any) =>{

      res.send(result[0])
    })
  },

  getTopics: (req:any, res:any) => {
    dng.find().select('topic')
    .then((result:any) =>{

      res.send(result);
    })
    .catch((err:any) => console.log(err))
  },
  postTopic: (req:any, res:any) => {

    dng.create(req.body)
    .then((result:any) => {
      res.send(result);
    })
    .catch((err:any) => console.log(err))
  }
}