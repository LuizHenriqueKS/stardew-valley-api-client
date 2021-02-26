import Settings from '../model/Settings';
import readJSON from './readJSON';
import path from 'path';

interface Global {
  settings?: Settings;
}

const settingsContainer: Global = {};

function getSettings(refresh = false): Settings {
  if (settingsContainer.settings && !refresh) {
    return settingsContainer.settings;
  } else {
    settingsContainer.settings = readJSON(path.resolve('./settings.json'));
    return settingsContainer.settings!;
  }
}

export default getSettings;