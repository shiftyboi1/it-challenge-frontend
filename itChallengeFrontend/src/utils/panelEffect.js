import React from "react";

export function usePanelOpenEffect(open) {
  React.useEffect(() => {
    if (open) document.documentElement.classList.add("panel-open");
    else document.documentElement.classList.remove("panel-open");
    return () => document.documentElement.classList.remove("panel-open");
  }, [open]);
}
