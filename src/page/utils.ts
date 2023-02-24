import type { PartialContext } from '../state/utils';

export type PartialContextEx = PartialContext & { ns: string, standalone: boolean };
