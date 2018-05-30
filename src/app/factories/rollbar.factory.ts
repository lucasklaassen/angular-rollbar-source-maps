import * as Rollbar from 'rollbar';
import { environment } from '../../environments/environment';
import { versions } from '../../environments/versions';

const rollbarConfig = {
  accessToken: environment.rollbar.accessToken,
  captureUncaught: true,
  captureUnhandledRejections: true,
  payload: {
    environment: environment.environment,
    client: {
      javascript: {
        // The version number cannot contain any whitespace or it will break
        code_version: versions.revision.trim(),
        source_map_enabled: true,
        guess_uncaught_frames: true
      }
    }
  }
};

export function RollbarFactory() {
  return new Rollbar(rollbarConfig);
}
