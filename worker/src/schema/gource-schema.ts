/**
 * Right now, only gource is supported which simplifies the schema.
 * If there were multiple render engines, then we should use
 * schema merging to valid base/generic properties then validate
 * the render engine specific properties.
 */

import Ajv, {JSONSchemaType} from 'ajv';
const ajv = new Ajv();

export interface RenderRequest {
  renderType: string;
  repoURL: string;
  videoId: string;
}

const gourceSchema: JSONSchemaType<RenderRequest> = {
  type: 'object',
  properties: {
    renderType: {type: 'string'},
    repoURL: {type: 'string'},
    videoId: {type: 'string'},
    // gource: {
    //     type: "object",
    //     properties: {
    //         resolution: {type: "string"},
    //         "x": {type: "string"} // TODO: finish this
    //     }
    // }
  },
  required: ['renderType', 'repoURL', 'videoId'],
  additionalProperties: false,
};

export const validateGourceSchema = ajv.compile(gourceSchema);

// {
//     "type": "gource", // Required (enum: gource)
//     "repoURL": "https://github.com/Raieen/Raieen.git", // Required, URL -- USER
//     "videoId": "random-uuid-representing-video", // Required, unique string -- SYSTEM
//     "gource": {
//         // All fields are optional.
//         // "-f": true, // -f // Not necessary
//         "resolution": "-1280x720", // -1280x720 -- USER
//         "--start-date": "'YYYY-MM-DD hh:mm:ss +tz", // --start-date 'YYYY-MM-DD hh:mm:ss +tz' --- USER
//         "--stop-date":  "'YYYY-MM-DD hh:mm:ss +tz",  // Stop at a date and optional time -- USER
//         "--stop-at-time": 1, // seconds... stop after 30 seconds? -- SYSTEM
//         "--seconds-per-day": 1, //seconds -- SYSTEM
//         "--key": true, // bool, -- USER
//         "--time-scale": 1.0, // float -- ???
//         "--elasticity": 1.0, // float -- USER
//         "--output-framerate": 25, // Required Int Enum (25, 30, 60) -- SYSTEM
//         "--output-ppm-stream": "-", // Should always be STDIN? -- SYSTEM,
//         "--bloom-multiplier": 2.0, // float -- USER
//         "--bloom-intensity": 1.5, // float -- USER
//         "--title": "Title Here" // String -- USER
//     },
//     // No FFMPEG customizations here, it gets hard coded.
//     // "ffmpeg": {
//         // No customizability here. We hard code things.
//     // }
// }
