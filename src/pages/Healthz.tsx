import { BUILD_ID } from "@/config/flags";

export default function Healthz() {
  return <pre>ok {BUILD_ID}</pre>;
}
