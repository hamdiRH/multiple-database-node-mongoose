import app from'./server'
import config from'./config'
import logger from'./utils/logger'
import axios from 'axios'

//** Set Port
const port = config.port || "5000";


// ! TODO: Remove axios befor production 
if (config.env !== 'production') 
axios.get('http://hamdi.localhost.com.tn:5000/load-session')
// var Pusher = require('pusher');

// var pusher = new Pusher({
//   appId: '1080549',
//   key: '492c42cd9cf98fa3b65e',
//   secret: '73b3974bcede6522832e',
//   cluster: 'eu',
//   encrypted: true
// });

// pusher.trigger('my-channel', 'my-event', {
//   'message': 'hello world'
// });

app.listen(port, () => logger.info(`Running on port:${port}`.magenta));