const mongoose = require('mongoose');
const Device = require('./models/device');

mongoose.connect(
    "mongodb+srv://abood:jzPPHhrMLOQelSWo@cluster0.cfgen.mongodb.net/sit311?retryWrites=true&w=majority"
);

const lat = Math.random() * 180 - 90; //Random number from -90 to +90;
const long = Math.random() * 360 - 180 // Random number from -180 to +180

const kmInLongitudeDegree = 111.320 * Math.cos(lat / 180.0 * Math.PI)
const deltaLat = 0.0015 / 111.1;
const deltaLong = 0.0015 / kmInLongitudeDegree;

const minLat = lat - deltaLat;
const maxLat = lat + deltaLat;
const minLong = long - deltaLong;
const maxLong = long + deltaLong;

const device1_data = [
    { lat: lat, long: long, time: Date.now() }
];

const device2_data = [
    { lat: minLat + 1, long: minLong + 1, time: Date.now() },
    { lat: minLat, long: minLong, time: Date.now() - 1000 * 60 * 60 * 24 * 11 },
];

const device3_data = [
    { lat: maxLat + 1, long: maxLong + 1, time: Date.now() },
    { lat: minLat, long: minLong, time: Date.now() - 1000 * 60 * 60 * 24 * 15 },
];

function createDevice1() {
    const device1 = new Device({ deakin_id: 1, email: '1@deakin.edu.au' });
    return device1.save();
}

function createDevice2() {
    const device2 = new Device({ deakin_id: 2, email: '2@deakin.edu.au' });
    return device2.save();
}

function createDevice3() {
    const device3 = new Device({ deakin_id: 3, email: '3@deakin.edu.au' });
    return device3.save();
}

function addGpsDataToDevice(device, gps_data) {
    return device.update(
        { $push: { gps_data: {$each: gps_data} } },
        function (err, res) {
        }
    );
};

Device.deleteMany({}, async () => {
    console.info('deleted exisintg records');
    Promise.all([createDevice1(), createDevice2(), createDevice3()]).then(([device1, device2, device3]) => {
        Promise.all([
            addGpsDataToDevice(device1, device1_data),
            addGpsDataToDevice(device2, device2_data),
            addGpsDataToDevice(device3, device3_data)
        ]).then(() => {
            console.info('The high risk device is 2. Device 3 should not be classified as high risk');
        })
    });
});