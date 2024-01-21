import { HashedKeyAsyncStore, IAsyncStore } from '@lirx/async-store';
import { Abortable, AsyncTask, IAbortableOptions, IAsyncTaskConstraint, IAsyncTaskFactory, IAsyncTaskInput } from '@lirx/async-task';

const tasks = new Map<string, AsyncTask<any>>();

/**
 * @experimental
 * @deprecated
 */
export interface IMerossApiCacheOptions<GData extends IAsyncTaskConstraint<GData>> extends IAbortableOptions {
  readonly factory: IAsyncTaskFactory<GData>;
  readonly key: any;
  readonly store: IAsyncStore<[string, GData]>;
}

/**
 * @experimental
 * @deprecated
 */
export function merossApiCache<GData extends IAsyncTaskConstraint<GData>>(
  {
    factory,
    key,
    store,
    abortable,
  }: IMerossApiCacheOptions<GData>,
): AsyncTask<GData> {
  return HashedKeyAsyncStore.hash(
    key,
    abortable,
  )
    .successful((key: string, abortable: Abortable): AsyncTask<GData> => {
      let task: AsyncTask<GData> | undefined = tasks.get(key);

      if (task === void 0) {
        task = store.get(key, abortable)
          .successful((data: GData | undefined, abortable: Abortable): IAsyncTaskInput<GData> => {
            if (data === void 0) {
              return AsyncTask.fromFactory<GData>(factory, abortable)
                .successful((data: GData, abortable: Abortable): AsyncTask<GData> => {
                  return store.set(key, data, abortable)
                    .successful((): GData => {
                      return data;
                    });
                });
            } else {
              return data;
            }
          });

        tasks.set(key, task);
      }

      return AsyncTask.switchAbortable(task, abortable);
    });
}
