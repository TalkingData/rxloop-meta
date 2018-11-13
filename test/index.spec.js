import rxloop from '@rxloop/core';
import meta from '../src';
import { mapTo, tap, delay } from "rxjs/operators";

describe('Epic success', () => {
  const store = rxloop({
    plugins: [ meta() ]
  });

  store.model({
    name: 'user',
    state: {
      name: 'wxnet',
    },
    reducers: {
      info(state){
        return state;
      }
    },
    epics: {
      a(action$) {
        return action$.pipe(
          mapTo({ type: 'info' }),
        );
      },
      b(action$) {
        return action$.pipe(
          delay(300),
          mapTo({ type: 'info' }),
        );
      },
      c(action$) {
        return action$.pipe(
          tap(() => {
            throw 'error';
          }),
          mapTo({ type: 'info' }),
        );
      },
    },
  });

  test('Default state', () => {
    expect(store.context.user).toEqual({
      source: '',
      shared: {},
      epic: {
        current: '',
        a: 'pending',
        b: 'pending',
        c: 'pending',
      }
    });
  });

  test('The a epic status is success', (done) => {
    store.dispatch({
      type: 'user/a',
    });
    store.stream('user').subscribe(() => {
      expect(store.context.user).toEqual({
        source: 'a',
        shared: {},
        epic: {
          current: 'a',
          a: 'success',
          b: 'pending',
          c: 'pending',
        }
      });
      done();
    });
  });

  test('The b epic status is canceled', () => {
    store.dispatch({
      type: 'user/b/cancel',
    });
    expect(store.context.user).toEqual({
      source: 'b',
      shared: {},
      epic: {
        current: 'b',
        a: 'success',
        b: 'cancel',
        c: 'pending',
      }
    });
  });

  test('The c epic status is error', () => {
    store.dispatch({
      type: 'user/c',
    });
    expect(store.context.user).toEqual({
      source: 'c',
      shared: {},
      epic: {
        current: 'c',
        a: 'success',
        b: 'cancel',
        c: 'error',
      }
    }); 
  });
});
