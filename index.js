var path = require('path');
var fs = require('fs');

var backlightPath = '/sys/class/backlight/rpi_backlight';

var isHardwareSupported = fs.existsSync(backlightPath);

if (!isHardwareSupported) {
    console.warn('Backlight control not supported (' + backlightPath + ' does not exist)');
}

function writeValue(fileName, value) {
    return new Promise((resolve, reject) => {
        if (isHardwareSupported) {
            var fullPath = path.join(backlightPath, fileName);
            fs.writeFile(fullPath, value, (err) => {
                if (err !== null) reject(err);
                else resolve();
            });
        } else {
            reject('Backlight control not supported (' + backlightPath + ' does not exist)');
        }
    });
}

function readValue(fileName, value) {
    return new Promise((resolve, reject) => {
        if (isHardwareSupported) {
            var fullPath = path.join(backlightPath, fileName);
            fs.readFile(fullPath, 'utf8', (err, data) => {
                if (err !== null) reject(err);
                else resolve(data);
            });
        } else {
            reject('Backlight control not supported (' + backlightPath + ' does not exist)');
        }
    });
}

/** Power managment */
exports.powerOn = () => {
    return writeValue('bl_power', '0');
};

exports.powerOff = () => {
    return writeValue('bl_power', '1');
};

exports.isPoweredOn = () => {
    return readValue('bl_power').then((powerValue) => parseInt(powerValue, 10) === 0);
};

/** Brightness managment */
exports.getBrightness = () => {
    return readValue('actual_brightness').then((brightnessValue) => parseInt(brightnessValue, 10));
};

exports.setBrightness = (value) => {
    return this.getMaxBrightness().then((maxBrightnessValue) => writeValue('brightness', value));
};

exports.getMaxBrightness = () => {
    return readValue('max_brightness').then((maxBrightnessValue) => parseInt(maxBrightnessValue, 10));
};
