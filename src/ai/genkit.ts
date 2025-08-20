import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import {inMemoryCache} from '@genkit-ai/dev-local';

export const ai = genkit({
  plugins: [googleAI(), inMemoryCache()],
  model: 'googleai/gemini-2.0-flash',
  flowStateStore: 'firebase',
  traceStore: 'firebase',
});