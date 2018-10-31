export default function metaPlugin() {
  return function init({
    onModelBeforeCreate$,
    onEpicEnd$,
    onEpicError$,
    onEpicCancel$,
   }) {
    onModelBeforeCreate$.subscribe(({ model }) => {
      if (
        typeof model.state !== 'object' ||
        !model.epics ||
        model.state.epic !== void 0
      ) return;

      const meta = {};
      Object.keys(model.epics).forEach(epic => {
        meta[epic] = 'pending';
      });

      model.state.meta = meta;
      model.reducers.epicStatus = epicStatus;

      function epicStatus(state, { payload: { epic, status } }) {
        state.meta[epic] = status;
        return state;
      }
    });
  
    // hooks  
    onEpicEnd$.subscribe(({ model, epic }) => {
      this.dispatch({
        type: `${model}/epicStatus`,
        payload: {
          epic,
          status: 'success'
        },
      });
    });

    onEpicError$.subscribe(({ model, epic }) => {
      this.dispatch({
        type: `${model}/epicStatus`,
        payload: {
          epic,
          status: 'error'
        },
      });
    });

    onEpicCancel$.subscribe(({ model, epic }) => {
      this.dispatch({
        type: `${model}/epicStatus`,
        payload: {
          epic,
          status: 'cancel'
        },
      });
    });
  };
};
