const mongoose = require('mongoose');
const Device = require('./models/device');

mongoose.connect(
    "mongodb+srv://abood:jzPPHhrMLOQelSWo@cluster0.cfgen.mongodb.net/sit311?retryWrites=true&w=majority"
);

const sick_device = 1;
const high_risk_device = [];

Device.findOne({deakin_id: sick_device}).then((doc, err) => {
    if(doc) {
        doc.gps_data.forEach(({ lat, long }) => {
            const kmInLongitudeDegree = 111.320 * Math.cos( lat / 180.0 * Math.PI)
            const deltaLat = 0.0015 / 111.1;
            const deltaLong = 0.0015 / kmInLongitudeDegree;

            const minLat = lat - deltaLat;
            const maxLat = lat + deltaLat;
            const minLong = long - deltaLong;
            const maxLong = long + deltaLong;
            console.log(minLat, maxLat, minLong, maxLong);
            Device.find({ gps_data: {$elemMatch: { lat: { $gt: minLat, $lt: maxLat }, long: { $gt: minLong, $lt: maxLong } }}, _id: { $nin: [doc._id] } }).then((docs, err) => {
                docs.forEach(el => {
                    if(!high_risk_device.find(elem => elem._id == el._id)) high_risk_device.push(el);
                });
                console.log(high_risk_device);
            });
        })
    }
});