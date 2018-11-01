export default function metaPlugin() {
  return function init({
    onModelBeforeCreate$,
    onEpicEnd$,
    onEpicError$,
    onEpicCancel$,
   }) {
    if ( this._meta !== void 0 ) return;

    this._meta = {};

    this.getMeta = getMeta;
    
    function getMeta(model) {
      return model !== void 0 ? this._meta[model] : this._meta;
    }

    onModelBeforeCreate$.subscribe(({ model }) => {
      if ( !model.epics ) return;

      const meta = {
        epic: {
          current: '',
        }
      };

      Object.keys(model.epics).forEach(epic => {
        meta.epic[epic] = 'pending';
      });
      this._meta[model.name] = meta;
    });
  
    // hooks  
    onEpicEnd$.subscribe(({ model, epic }) => {
      const meta = this._meta[model];
      meta.epic.current = epic;
      meta.epic[epic] = 'success';
    });

    onEpicError$.subscribe(({ model, epic }) => {
      const meta = this._meta[model];
      meta.epic.current = epic;
      meta.epic[epic] = 'error';
    });

    onEpicCancel$.subscribe(({ model, epic }) => {
      const meta = this._meta[model];
      meta.epic.current = epic;
      meta.epic[epic] = 'cancel';
    });
  };
};
