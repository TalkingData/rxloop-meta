import rxloop from '@rxloop/core';
import meta from '../src';
import { mapTo, tap } from "rxjs/operators";

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
    expect(store.getState('user')).toEqual({
      name: 'wxnet',
      meta: {
        current: '',
        a: 'pending',
        b: 'pending',
        c: 'pending',
      },
    });
  });

  test('The a epic status is success', () => {
    store.dispatch({
      type: 'user/a',
    });
    expect(store.getState('user')).toEqual({
      name: 'wxnet',
      meta: {
        current: 'a',
        a: 'success',
        b: 'pending',
        c: 'pending',
      },
    }); 
  });

  test('The b epic status is cancel', () => {
    store.dispatch({
      type: 'user/b/cancel',
    });
    expect(store.getState('user')).toEqual({
      name: 'wxnet',
      meta: {
        current: 'b',
        a: 'success',
        b: 'cancel',
        c: 'pending',
      },
    }); 
  });

  test('The c epic status is error', () => {
    store.dispatch({
      type: 'user/c',
    });
    expect(store.getState('user')).toEqual({
      name: 'wxnet',
      meta: {
        current: 'c',
        a: 'success',
        b: 'cancel',
        c: 'error',
      },
    }); 
  });
});
