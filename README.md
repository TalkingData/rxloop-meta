## The meta plugin

```javascript
import rxloop from '@rxloop/core';
import meta from '@rxloop/meta';

const store = rxloop({
  plugins: [ meta() ]
});

store.model({
  name: 'test',
  state: {},
  reducers: {
    info(state){
      return state;
    }
  },
  epics: {
    login() {}
  }
});

store.stream('user').subscribe((state) => {
  if(state.meta.current === 'login' && state.meta.login === 'success') {
    alert('login success!');
  }
});

const state = store.getState('user');

// state.meta.login === 'success' 
// state.meta.login === 'cancel' 
// state.meta.login === 'error' 
```
