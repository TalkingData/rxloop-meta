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
  const { current, login } = store.getMeta('user').epic;
  if(current === 'login' && login === 'success') {
    alert('login success!');
  }
});
```
