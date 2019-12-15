import atmosphereSampleData from "./atmosphereSampleData.json"


const calculate = ({ altitude = 0, temperatureOffset = 0 }) => {

    checkAltitude(altitude);
    checkTemperatureOffset(temperatureOffset);

    const atmosphereSection = getAtmosphereSection(altitude);

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