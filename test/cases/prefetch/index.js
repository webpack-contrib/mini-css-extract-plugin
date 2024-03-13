// eslint-disable-next-line import/no-unresolved
import "./with-nested";

import(/* webpackPrefetch: 1, webpackChunkName: "prefetched" */ "./prefetched");
setTimeout(() => {
  import(/* webpackChunkName: "normal" */ "./normal");
}, 500);
