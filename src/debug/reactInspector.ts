import * as React from "react";

export function logReactIdentity(tag = "react-inspector") {
  // eslint-disable-next-line no-console
  console.log(`[${tag}] version=${React.version} useState.id=${(React as any).useState?.toString().slice(0,30)}`);
}
