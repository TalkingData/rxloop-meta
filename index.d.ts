import { Observable } from 'rxjs';

export interface API {
  onModel$: Observable<any>,
  onEpicStart$: Observable<any>,
  onEpicEnd$: Observable<any>,
  onEpicCancel$: Observable<any>,
  onEpicError$: Observable<any>,
}

export type Plugin = (api: API) => void;

export default function meta(): Plugin;
