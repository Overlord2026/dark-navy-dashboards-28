export type AnalyticsProps = Record<string, any>;

const A = {
  track: (event: string, props?: AnalyticsProps) => {
    try {
      // central analytics sink; feel free to map to Segment/Amplitude
      console.info('[analytics]', event, props ?? {});
    } catch {}
  }
};

export default A;
export { A as analytics };