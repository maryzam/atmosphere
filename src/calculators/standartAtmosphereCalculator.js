import atmosphereSampleData from "./atmosphereSampleData";

import { airMolWeight, gasConstant, gravity, gamma, specificGasConstant } from "./physicalConstants";

const seaLevelAtmosphere = atmosphereSampleData.find(data => data.altitude === 0);

const gMR = gravity * airMolWeight / gasConstant

const calculate = ({ altitude = 0, temperatureOffset = 0 }) => {

    checkAltitude(altitude);
    checkTemperatureOffset(temperatureOffset);

    const atmosphereSection = getAtmosphereSection(altitude);

    return calculateAirParameters(atmosphereSection, temperatureOffset);
}

const calculateAirParameters = (baseData, temperatureOffset, altitude) => {

  const baseTemperature = calcBaseTemperature(baseData);
  const relativePressure = calcRelativePressure(baseData, baseTemperature, altitude);

  const temperature = baseTemperature + temperatureOffset;

  const speedOfSound = Math.sqrt(gamma * specificGasConstant * temperature);
  const pressure = relativePressure * seaLevelAtmosphere.pressure;
  const density = seaLevelAtmosphere.density * pressureRelative * (seaLevelAtmosphere.temperature / temperature);

  return {
    temperature,
    speedOfSound,
    pressure,
    density
  };
}

const calcBaseTemperature = () => {

  const deltaAltitude = altitude - baseData.altitude;
  const temperatureAltitudeOffset = baseData.temperatureLapseRate * deltaAltitude;

  return baseData.temperature + temperatureAltitudeOffset;
}

const calcRelativePressure = (baseData, baseTemperature, altitude) => {

  const deltaAltitude = altitude - baseData.altitude;

  let pressureCoeff = (Math.abs(tempGrad) < 1e-10)  
    ? Math.exp(-gMR * deltaAltitude / 1000 / baseData.temperature);
    : Math.pow(baseData.temperature / temperature, gMR / tempGrad / 1000);

  return pressureRelBase * pressureCoeff;
}

const getAtmosphereSection = (altitude) => {

    let sectionId = 0;

    while (sectionId < atmosphereSampleData.length) {
      const currSection = atmosphereSampleData[sectionId];
      if (altitude <= currSection.altitude) {
        return currSection;
      }
      sectionId++;
    }

    return atmosphereSampleData[sectionId];
}

const checkAltitude = (altitude) => {
  if (isNaN(altitude)) {
    throw new Error("Altitude should be a number.");
  }
  if (altitude < -5000 || altitude > 86000) {
    throw new Error("Altitude value should be in a range between -5000 and 86000 meters.")
  }
}

const checkTemperatureOffset = (offset) => {
  if (isNaN(offset)) {
    throw new Error("Temperature offset should be a number.");
  }
}

export default calculate;